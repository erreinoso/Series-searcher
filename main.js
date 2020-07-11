'use strict';

//👉constantes que vamos a utilizar
const input = document.querySelector('.js-input');
const btn = document.querySelector('.js-button');
const resultSectionP = document.querySelector('.js-resultSection-p');
const resultSection = document.querySelector('.js-ul-result');
const favSection = document.querySelector('.js-ul-fav');
const btnReset = document.querySelector('.js-reset-all');
let resetElem = document.querySelectorAll('.js-delete');
const imgTemporary = 'https://via.placeholder.com/210x295/ffffff/666666/';
let seriesResult = [];
let favouriteSeries = [];

//👉************************ TRAIGO INFORMACIÓN DE LA API *************
function getSeries() {
  let searchinput = input.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${searchinput}`)
    .then((response) => response.json())
    .then((data) => {
      seriesResult = data;
      renderSearch();
      addListeners();
    });
}

//👉*************************  PINTO RESULTADO DE LA BUSQUEDA *************
function renderSearch() {
  resultSectionP.classList.add('hidden');
  let seriesCard;
  resultSection.innerHTML = '';
  let i;
  let imageCard;

  for (i = 0; i < seriesResult.length; i++) {
    if (seriesResult[i].show.image === null) {
      imageCard = imgTemporary;
    } else {
      imageCard = seriesResult[i].show.image.medium;
    }
    seriesCard = `<li class="js-serieCard" id="${seriesResult[i].show.id}">`;
    seriesCard += `<img src="${imageCard}" alt="Foto de ${seriesResult[i].show.name}">`;
    seriesCard += `<h3>${seriesResult[i].show.name}</h3></li>`;
    resultSection.innerHTML += seriesCard;
  }
}
//👉*************************  FAVOURITE HANDLER *******
// // -añadir a array favouriteSeries         addToFavouritesArray
// // -pintar dicho array en la sección     renderFavouritesSection
// // - intercambiar color fuente y fondo          changeColor
// // - guardar en local
function favouritesHandler(ev) {
  const clickedCard = ev.currentTarget;
  console.log('elemento clicado', ev.currentTarget);
  addToFavouritesArray(ev);
  renderFavouritesSection(ev);
  // updateLocalStorage();
}

function addToFavouritesArray(ev) {
  const clickedCard = ev.currentTarget;
  const clickedCardName = clickedCard.querySelector('h3').innerHTML;
  console.log(clickedCardName);
  //si hay algun elemento cuyo id sea igual que el del elemento clickado, devuelveme su index
  const favElemIndex = favouriteSeries.findIndex(
    (elem) => elem.show.name === clickedCardName
  );
  console.log(clickedCard);
  //los que tengan index -1, buscame en el resultado de la busqueda el que coincida el name? y me lo subes a favourites
  if (favElemIndex === -1) {
    const favElemnt = seriesResult.find(
      (serie) => serie.show.name === clickedCardName
    );
    clickedCard.classList.add('favelement');
    favouriteSeries.push(favElemnt);
    console.log('elemento favorito recien añadido', favElemnt);
  } else {
    clickedCard.classList.remove('favelement');
    favouriteSeries.splice(favElemIndex, 1);
  }
  console.log('array de favoritos', favouriteSeries);
  // console.log('el id del clickedCard elemento clickado es ', clickedCard.id);
  updateLocalStorage();
}

//👉*************************  PINTAR FAVORITOS EN SU SECCIÓN.  **************************
function renderFavouritesSection() {
  let seriesFav = ''; //hay que ponerlo ='' para que no salga undefined siempre
  let i;
  let favCard;
  favSection.innerHTML = ''; //hay que dejarlo para poder borrar el array entero clickando
  if (favouriteSeries !== []) {
    btnReset.classList.remove('hidden');
  } //ESTA CONDICIONAL NO ESTA FUNCIONANDO
  for (i = 0; i < favouriteSeries.length; i++) {
    if (favouriteSeries[i].show.image === null) {
      favCard = imgTemporary;
    } else {
      favCard = favouriteSeries[i].show.image.medium;
    }
    seriesFav += `<li class="js-serieFavCard" id="${favouriteSeries[i].show.id}">`;
    seriesFav += `<img src="${favCard}" alt="Foto de ${favouriteSeries[i].show.name}">`;
    seriesFav += `<h3>${favouriteSeries[i].show.name}</h3>`;
    seriesFav += `<button type="button" class="js-delete resetButton"> ❌ </button></li>`;
    favSection.innerHTML = seriesFav;
  }
  listenResetBtn();
}

// *************************  FUNCIONES DE RESETEO **********************

//ELIMINA TOODS
const resetAll = () => {
  localStorage.removeItem('favouriteSeries');
  favouriteSeries = [];
  updateLocalStorage();
  renderFavouritesSection();
  const searchedElem = document.querySelectorAll('.js-serieCard'); // me quita el color de los favoritos cuando reseteo
  for (const shearched of searchedElem) {
    shearched.classList.remove('favelement');
  }
};

//ELIMINA UN ELEMENTO

const resetOneFav = (ev) => {
  console.log(ev.target);
  const buttonClickedId = parseInt(ev.currentTarget.id);
  const serieFavouriteIndex = favouriteSeries.findIndex(
    (favourite) => favourite.id === buttonClickedId
  );
  favouriteSeries.splice(serieFavouriteIndex, 1);
  updateLocalStorage();
  renderFavouritesSection();
  console.log('el clickado', ev.currentTarget);
  console.log('el padre del clickado', ev.currentTarget.parentNode);
  // const noMoreFav = favouriteSeries.findIndex(
  //   (favourite) => favourite.id === resultSection.show.id
  // );
  // ev.currentTarget.parentNode.classList.remove('favelement');
  //quiero hacer una funciona que diga que si el id del padre del elemnto clickado coincide con el id del elemento en el array de busquedas, entonces me quite la clase favelement del elemento del array de busqueda
};

// *************************  GUARDAR EN LOCAL  y TRAER DEL LOCAL    ********************************
function updateLocalStorage() {
  localStorage.setItem('favouriteSeries', JSON.stringify(favouriteSeries));
}
//TRAER DEL LOCAL

const getFromLocalStorage = () => {
  const data = JSON.parse(localStorage.getItem('favouriteSeries'));
  if (data !== null) {
    favouriteSeries = data;
  }
  renderFavouritesSection(); //vuelve a pintarlos al recargar
  //array de elemento escuchadores botones favoritos
};

// *************************  EVENTO ESCUCHADOR ********************************
//TARJETAS DE RESULTADO ESCUCHADORAS
function addListeners() {
  let liElem = document.querySelectorAll('.js-serieCard');
  for (const li of liElem) {
    li.addEventListener('click', favouritesHandler);
  }
}

//BOTON DE BUSQUEDA
btn.addEventListener('click', getSeries);

//BOTON ELIMINAR GENERAL

btnReset.addEventListener('click', resetAll);

//BOTON ELIMINAR INDIVIDUAL

const listenResetBtn = () => {
  const resetButtons = document.querySelectorAll('.js-delete');
  for (let resetButton of resetButtons) {
    resetButton.addEventListener('click', resetOneFav);
  }
};

// *************************  START APP ********************************

getSeries();
getFromLocalStorage();
