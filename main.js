'use strict';

//constantes que vamos a utilizar
const input = document.querySelector('.js-input');
const btn = document.querySelector('.js-button');
const resultsectionp = document.querySelector('.js-resultSection-p');
const resultsection = document.querySelector('.js-ul-result');
const favsection = document.querySelector('.js-ul-fav');
const imgTemporary = 'https://via.placeholder.com/210x295/ffffff/666666/';
let seriesresult = [];
let seriesalreadysearched = [];
let favouriteseries = [];

//👉 traigo los datos del API
function getSeries() {
  //esta función trae datos de la API
  let searchinput = input.value;
  fetch(`http://api.tvmaze.com/singlesearch/shows?q=${searchinput}`)
    .then((response) => response.json())
    .then((data) => {
      seriesresult = data; //ya no es un array vacío
      //primero consoleamos para ver si hemos encontrado el dato
      console.log('resultado de la busqueda', seriesresult);
      renderSearch(seriesresult);
      addListeners();
    });
}

//👉 pinto los datos de la busqueda

function renderSearch(seriesresult) {
  resultsectionp.classList.add('hidden');
  seriesalreadysearched.push(seriesresult); // añado a la lista de buscados
  console.log('series buscadas', seriesalreadysearched);
  let seriescard;
  if (seriesresult.img === null) {
    seriesresult.img = imgTemporary; //revisar esta parte
  }
  seriescard = `<li class="seriecard" id="${seriesresult.id}">`;
  seriescard += `<img src="${seriesresult.image.medium}" alt="Foto de ${seriesresult.name}">`;
  seriescard += `<h3>${seriesresult.name}</h3></li>`;
  resultsection.innerHTML = seriescard;
  console.log('texto que voy a insertar', seriescard);
}

// 👉  Creamos una funcion para que me escuchen las tarjetas al hacer click
function addListeners() {
  let liElem = document.querySelectorAll('.seriecard');
  for (const li of liElem) {
    li.addEventListener('click', favouritesHandler);
  }
}

//👉 cuando hago clic sobre la tarjeta,
// // -añadir a array favouriteseries         addToFavouritesArray
// // -pintar dicho array en la sección     addToFavouritesSection
// // - intercambiar color fuente y fondo          changeColor
// // - guardar en local
function favouritesHandler(ev) {
  const clickedcard = ev.currentTarget;
  console.log('elemento clicado', ev.currentTarget);
  addToFavouritesArray(ev);
  addToFavouritesSection(ev);
  changeColor(ev);
  saveIntoLocal();
}

function addToFavouritesArray(ev) {
  const clickedcard = ev.currentTarget; //Esto funciona porque el resultado es solo 1
  favouriteseries.push(seriesresult);
  console.log('los favoritos son', favouriteseries);
}

function addToFavouritesSection() {
  let seriesfav;
  for (const serie of favouriteseries) {
    seriesfav += `<li class="seriefavcard" id="${serie.id}"><img src="${serie.image.medium}" alt="Foto de ${serie.name}">`;
    seriesfav += `<h3>${serie.name}</h3></li>`;
    favsection.innerHTML = seriesfav;
  }
}

function changeColor(ev) {
  ev.currentTarget.classList.add('favelement');
}

// Listeners
btn.addEventListener('click', getSeries);

//Local storage
function saveIntoLocal() {
  localStorage.setItem('favouriteSeries', JSON.stringify(favouriteseries));
}

// function addToFavouritesArray(ev) {
//   const clickedcard = ev.currentTarget;
//   favouriteseries.push(seriesresult);
//   console.log('elemento clickado', ev.currentTarget);
//   console.log('el array de favoritos', favouriteseries);
// } ESTO FUNCIONA PERO NO SERÍA LO MÁS LICITO?
