'use strict';

//constantes que vamos a utilizar
const input = document.querySelector('.js-input');
const btn = document.querySelector('.js-button');
const resultsectionp = document.querySelector('.js-resultSection-p');
const resultsection = document.querySelector('.js-ul-result');
const favsection = document.querySelector('.js-ul-fav');
const imgTemporary = 'https://via.placeholder.com/210x295/ffffff/666666/';
let seriesresult = [];
let favouriteseries = [];

//👉 traigo los datos del API
function getSeries() {
  //esta función trae datos de la API
  let searchinput = input.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${searchinput}`)
    .then((response) => response.json())
    .then((data) => {
      seriesresult = data;
      renderSearch();
      addListeners();
    });
}

//👉 pinto los datos de la busqueda

function renderSearch() {
  resultsectionp.classList.add('hidden');
  //seriesalreadysearched.push(seriesresult); // añado a la lista de buscados
  let seriescard;
  resultsection.innerHTML = '';
  let i;
  let imagecard;
  console.log(seriesresult[0].show.image.medium);
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
  // addToFavouritesSection(ev);
  // changeColor(ev);
  // saveIntoLocal();
}

function addToFavouritesArray(ev) {
  //console.log('series result', seriesresult);
  const clickedcard = ev.currentTarget;
  const clickedcardname = clickedcard.querySelector('h3').innerHTML;
  console.log('array de favoritos', favouriteseries);
  //console.log('ev.currentTarget', clickedcard);
  console.log('el id del clickedcard', clickedcard.id);

  //si hay algun elemento cuyo id sea igual que el del elemento clickado, devuelveme su index
  const favElemIndex = favouriteseries.findIndex(
    (elem) => elem.show.name === clickedcardname
  );
  console.log(favElemIndex);

  //los que tengan index -1, buscame en el resultado de la busqueda el que coincida el id y me lo subes a favourites
  if (favElemIndex === -1) {
    clickedcard.classList.add('favelement');
    const favElemnt = seriesresult.find(
      (serie) => serie.show.name === clickedcardname
    );
    favouriteseries.push(favElemnt);
    console.log('elemento favorito', favElemnt);
  } else {
    clickedcard.classList.remove('favelement');
    favouriteseries.splice(favElemIndex, 1);
  }
}

/*
  for (const fav of favouriteseries) {
    if (clickedcard.id !== fav.show.id) {
      console.log('aun no está dentro');
    } else {
      console.log('hola?');
    }
  }*/
//   favouriteseries.push(seriesresult);
//   console.log('elemento clickado', ev.currentTarget);
//   console.log('el array de favoritos', favouriteseries);

// console.log('los favoritos son', favouriteseries);
// }

//👉 function addToFavouritesSection() {
//   let seriesfav;
//   // if (seriesresult[i].show.image === null) {
//   //   imagecard = imgTemporary; //revisar esta parte
//   // } else {
//   //   imagecard = seriesresult[i].show.image.medium;
//   // }
//   for (const serie of favouriteseries) {
//     seriesfav += `<li class="seriefavcard" id="${serie.show.id}"><img src="${imagecard}" alt="Foto de ${serie.show.name}">`;
//     seriesfav += `<h3>${serie.show.name}</h3></li>`;
//     favsection.innerHTML = seriesfav;
//   }
// }

//👉 function changeColor(ev) {
//   ev.currentTarget.classList.toggle('favelement');
// }

// Listeners
btn.addEventListener('click', getSeries);

//👉Local storage
// function saveIntoLocal() {
//   localStorage.setItem('favouriteSeries', JSON.stringify(favouriteseries));
// }

//👉 function addToFavouritesArray(ev) {
//   const clickedcard = ev.currentTarget;
//   favouriteseries.push(seriesresult);
//   console.log('elemento clickado', ev.currentTarget);
//   console.log('el array de favoritos', favouriteseries);
// } ESTO FUNCIONA PERO NO SERÍA LO MÁS LICITO?

// 👉function addToFavouritesArray(ev) {
//   const clickedcard = ev.currentTarget; //Esto funciona porque el resultado es solo 1
//   favouriteseries.push(seriesresult);
//   funcionaba
// if (favElemIndex === -1) {
//   ev.currentTarget.classList.add('favelement');
//   const favElemnt = seriesresult.find(
//     (serie) => serie.show.name === clickedcard.name
//   );
//   favouriteseries.push(favElemnt);
//   console.log('elemento favorito', favElemnt);
// } else {
//   console.log('ya estoy');
// }
// }
