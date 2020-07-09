'use strict';

//constantes que vamos a utilizar
const input = document.querySelector('.js-input');
const btn = document.querySelector('.js-button');
const resultsectionp = document.querySelector('.js-resultSection-p');
const resultsection = document.querySelector('.js-ul-result');
console.log(input);

let seriesresult = [];
let favoriteseries = [];

function getSeries() {
  //esta función trae datos de la API
  let searchinput = input.value;
  console.log(searchinput);
  fetch(`http://api.tvmaze.com/singlesearch/shows?q=${searchinput}`)
    .then((response) => response.json())
    .then((result) => {
      seriesresult = result; //ya no es un array vacío
      //primero consoleamos para ver si hemos encontrado el dato
      renderSearch();
      //ejecutamos la funcion que pinta dentro de la funcion que se ejecuta al hacer click
    });
}

function renderSearch() {
  //función que pinta los datos en el HTML

  let name = seriesresult.name;
  let img = seriesresult.image.medium;
  const imgTemporary = 'https://via.placeholder.com/210x295/ffffff/666666/';
  if (img === null) {
    //revisar esta parte
    img = imgTemporary;
  }
  let seriescard;
  seriescard = `<li class="serie"><img src="${img}">`;
  seriescard += `<h3>${seriesresult.name}</h3></li>`;
  resultsection.innerHTML = seriescard;
}

btn.addEventListener('click', getSeries);
