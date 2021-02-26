const persons = document.querySelector('.persons');
const starships = document.querySelector('.starships');
const planets = document.querySelector('.planets');

fillCounters(); //para renderizar

//Função que coloca em tela as informções do star wars
function fillCounters() {
    Promise.all([
        getData('people/'),
        getData('starships/'),
        getData('planets')
    ])
    .then(data => {
        persons.style.fontSize = "5em";
        starships.style.fontSize = "5em";
        planets.style.fontSize = "5em";

        persons.innerHTML = data[0].count;
        starships.innerHTML = data[1].count;
        planets.innerHTML = data[2].count;
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          })
    });

};

//Função que consome os dados da api de informações do star wars
function getData(param) {
    return fetch(`https://swapi.dev/api/${param}`)
            .then(response => response.json());
};

//Função que consome os dados da api de frases do star wars
function makeFetch() {
    return fetch('https://swquotesapi.digitaljedi.dk/api/SWQuote/RandomStarWarsQuote');
}

//Função que coloca em tela as frases e os demais recursos desse componente
async function loadPhraseAndFeatures() {
    const phrase = document.querySelector('#phrase');
    phrase.style.display = "none";
    document.querySelector('.phrases-container .loading').style.display = "block";

    const response = await makeFetch();
    const data = await response.json();

    phrase.style.display = "block";
    phrase.innerHTML = `"${data.content}"`;
    button.innerHTML = "Ler mais uma frase"
    document.querySelector('.save-icon').style.display = "block";
    document.querySelector('.phrases-container .loading').style.display = "none";
}

let button = document.querySelector('#btn-phrases');
button.addEventListener('click', () => {
    loadPhraseAndFeatures();
});

//Função qu salva as frases favoritas
function savePhrase(phrase) {
    fetch('http://localhost:3000/phrases', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({phrase: phrase})
    })
}

let buttonSave = document.querySelector('.save-icon');
buttonSave.addEventListener('click', () => {
    document.querySelector('.save-icon span').style.display = "block";
    let phrase = document.querySelector('#phrase').innerHTML;
    phrase = phrase.replace('"', '').replace('"', '');
    savePhrase(phrase);
});

//Função que consome as frases salvas na fake API
async function getPhrases() {
    const response = await fetch('http://localhost:3000/phrases', {method: 'GET'});
    const phrases = await response.json();

    if(phrases.length === 0) {
        document.querySelector('.phrases-wrapper h3').innerHTML = "Você não possui nenhuma frase em favoritos!"
    }
    
    phrases.map(phrase => {
        let phraseContent = document.querySelector('.phrases-wrapper h3').cloneNode(true);
        phraseContent.innerHTML = `[${phrase['id']}] "${phrase['phrase']}"`;
        let phrasesWrapper =  document.querySelector('.phrases-wrapper');
        phrasesWrapper.append(phraseContent)
        document.querySelector('.modal-phrases').append(phrasesWrapper);
    });
}

function openModal() {
    document.querySelector('.modal-phrases').style.left = "60vw";
}

function closeModal() {
    document.querySelector('.modal-phrases').style.left = "100vw";
}

let status = false;
let buttonOpenFavorite = document.querySelector('.button-favorite');
buttonOpenFavorite.addEventListener('click', () => {
    if(!status) {
        getPhrases();
        status = true;
    }
    openModal();
    document.querySelector('body').style.overflowY = "hidden";
});

let buttonCloseFavorite = document.querySelector('.modal-phrases .close');
buttonCloseFavorite.addEventListener('click', () => {
    closeModal();
    document.querySelector('body').style.overflowY = "auto";
});

//Função para deletar as frases favoritas
function deletePhrase(id) {
    fetch(`http://localhost:3000/phrases/${id}`, {method: 'DELETE'});
}

let buttonDelete = document.querySelector('.button-delete');
buttonDelete.addEventListener('click', () => {
    let inputID = document.querySelector('.input-id');
    if(inputID.value !== "") {
        document.querySelector('.input-button-area span').style.display = "none";
        document.querySelector('.input-button-area .text-loading').style.display = "block"
        deletePhrase(inputID.value);
    }else {
        document.querySelector('.input-button-area span').style.display = "block"
    }
});