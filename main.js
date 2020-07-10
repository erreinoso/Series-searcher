'use strict';

//👉constantes que vamos a utilizar
const input = document.querySelector('.js-input');
const btn = document.querySelector('.js-button');
const resultsectionp = document.querySelector('.js-resultSection-p');
const resultsection = document.querySelector('.js-ul-result');
const favsection = document.querySelector('.js-ul-fav');

const imgTemporary = 'https://via.placeholder.com/210x295/ffffff/666666/';
let seriesresult = [];
let favouriteSeries = [];

//👉************************ TRAIGO INFORMACIÓN DE LA API *************
function getSeries() {
  let searchinput = input.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${searchinput}`)
    .then((response) => response.json())
    .then((data) => {
      seriesresult = data;
      renderSearch();
      addListeners();
    });
}

//👉*************************  PINTO RESULTADO DE LA BUSQUEDA *************
function renderSearch() {
  resultsectionp.classList.add('hidden');
  //seriesalreadysearched.push(seriesresult); // añado a la lista de buscados
  let seriescard;
  resultsection.innerHTML = '';
  let i;
  let imagecard;

  for (i = 0; i < seriesresult.length; i++) {
    if (seriesresult[i].show.image === null) {
      imagecard = imgTemporary; //revisar esta parte
    } else {
      imagecard = seriesresult[i].show.image.medium;
    }
    seriescard = `<li class="seriecard" id="${seriesresult[i].show.id}">`;
    seriescard += `<img src="${imagecard}" alt="Foto de ${seriesresult[i].show.name}">`;
    seriescard += `<h3>${seriesresult[i].show.name}</h3></li>`;
    resultsection.innerHTML += seriescard;
  }
}

//👉*************************  AÑADIR SERIES A SU ARRAY *************

//👉 cuando hago clic sobre la tarjeta,
// // -añadir a array favouriteSeries         addToFavouritesArray
// // -pintar dicho array en la sección     addToFavouritesSection
// // - intercambiar color fuente y fondo          changeColor
// // - guardar en local

function favouritesHandler(ev) {
  const clickedcard = ev.currentTarget;
  console.log('elemento clicado', ev.currentTarget);
  addToFavouritesArray(ev);
  addToFavouritesSection(ev);
  saveIntoLocal();
}

function addToFavouritesArray(ev) {
  //console.log('series result', seriesresult);
  const clickedcard = ev.currentTarget;
  const clickedcardname = clickedcard.querySelector('h3').innerHTML;
  console.log('array de favoritos', favouriteSeries);
  //console.log('ev.currentTarget', clickedcard);
  console.log('el id del clickedcard', clickedcard.id);

  //si hay algun elemento cuyo id sea igual que el del elemento clickado, devuelveme su index
  const favElemIndex = favouriteSeries.findIndex(
    (elem) => elem.show.name === clickedcardname
  );
  console.log(favElemIndex);

  //los que tengan index -1, buscame en el resultado de la busqueda el que coincida el id y me lo subes a favourites
  if (favElemIndex === -1) {
    clickedcard.classList.add('favelement');
    const favElemnt = seriesresult.find(
      (serie) => serie.show.name === clickedcardname
    );
    favouriteSeries.push(favElemnt);
    console.log('elemento favorito', favElemnt);
  } else {
    clickedcard.classList.remove('favelement');
    favouriteSeries.splice(favElemIndex, 1);
  }
}

//👉*************************  AÑADIR FAVORITOS A SU SECCIÓN. PINTAR **************************
function addToFavouritesSection() {
  let seriesfav;
  let i;
  let imagecard;

  for (i = 0; i < favouriteSeries.length; i++) {
    if (favouriteSeries[i].show.image === null) {
      imagecard = imgTemporary; //revisar esta parte
    } else {
      imagecard = favouriteSeries[i].show.image.medium;
    }
    seriesfav += `<li class="seriefavcard" id="${favouriteSeries[i].show.id}"><img src="${imagecard}" alt="Foto de ${favouriteSeries[i].show.name}">`;
    seriesfav += `<h3>${favouriteSeries[i].show.name}</h3>`;
    seriesfav += `<button type="input" class="js-reset"> 🗑️ </button></li>`;
  }
  favsection.innerHTML =
    seriesfav +
    `<button type="input" class="js-reset-all"> 🗑️Eliminar todos🗑️ </button></li>`;
}

// *************************  FUNCIONES PARA RESETEAR ********************************

function resetOneFav() {
  favouriteSeries.splice(favElemIndex, 1);
}

const resetAll = document.querySelector('.js-reset-all');

function resetFavourites() {
  favouriteSeries = [];
  addToFavouritesSection();
  saveIntoLocal();
  // favsection.innerHTML = '';
  console.log(favouriteSeries);
}

// *************************  GUARDAR EN LOCAL ********************************
function saveIntoLocal() {
  localStorage.setItem('favouriteSeries', JSON.stringify(favouriteSeries));
}
//FALTA TRAER DEL LOCAL

// *************************  LISTENERS ********************************

// 👉  Creamos una funcion para que me escuchen las tarjetas al hacer click

function addListeners() {
  let liElem = document.querySelectorAll('.seriecard');
  for (const li of liElem) {
    li.addEventListener('click', favouritesHandler);
  }
}

function addListenersReset() {
  let resetElem = document.querySelectorAll('.js-reset');
  for (const reset of resetElem) {
    reset.addEventListener('click', resetOneFav);
  }
}

btn.addEventListener('click', getSeries);

resetAll.addEventListener('click', resetFavourites);
