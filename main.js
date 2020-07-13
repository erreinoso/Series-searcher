'use strict';

//👉constantes que vamos a utilizar
const input = document.querySelector('.js-input');
const btn = document.querySelector('.js-button');
const resultSectionP = document.querySelector('.js-resultSection-p');
const favSection = document.querySelector('.js-ul-fav');
const btnReset = document.querySelector('.js-reset-all');
let resetElem = document.querySelectorAll('.js-delete');
const imgTemporary = 'https://via.placeholder.com/210x295/ffffff/666666/';
const resultsWrapper = document.querySelector('.js-ul-result');
let seriesResult = [];
let favouriteSeries = [];

//Bring data from API
function getSeries() {
  let searchinput = input.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${searchinput}`)
    .then((response) => response.json())
    .then((data) => {
      seriesResult = data;
      renderSearch();
      addListeners();
      checkFavorites();
    });
}

//Update class style to element searched - not working
function checkFavorites() {
  const liResult = resultsWrapper.querySelectorAll('li');
  for (const li of liResult) {
    const favObject = favouriteSeries.find(
      (show) => parseInt(li.id) === show.show.id
    );
    if (favObject.show.id === parseInt(li.id)) {
      li.classList.add('favelement');
    }
  }
}

// Paint what user has searched
function renderSearch() {
  let seriesCard;
  resultsWrapper.innerHTML = '';
  let i;
  let imageCard;
  const liResult = resultsWrapper.querySelectorAll('li');

  if (seriesResult.length === 0) {
    resultSectionP.classList.remove('hidden');
  } else {
    resultSectionP.classList.add('hidden');
  }
  for (i = 0; i < seriesResult.length; i++) {
    if (seriesResult[i].show.image === null) {
      imageCard = imgTemporary;
    } else {
      imageCard = seriesResult[i].show.image.medium;
    }
    seriesCard = `<li class="js-serieCard serieCard" id="${seriesResult[i].show.id}">`;
    seriesCard += `<img src="${imageCard}" alt="Foto de ${seriesResult[i].show.name}">`;
    seriesCard += `<h3>${seriesResult[i].show.name}</h3></li>`;
    resultsWrapper.innerHTML += seriesCard;
  }
}

//Function handle with all different utilities

function favouritesHandler(ev) {
  const clickedCard = ev.currentTarget;
  addToFavouritesArray(ev);
  renderFavouriteSection(ev);
}

//Add elements to favourite array
function addToFavouritesArray(ev) {
  const clickedCard = ev.currentTarget;
  const clickedCardName = clickedCard.querySelector('h3').innerHTML;
  const favElemIndex = favouriteSeries.findIndex(
    (elem) => elem.show.name === clickedCardName
  );

  if (favElemIndex === -1) {
    const favElemnt = seriesResult.find(
      (serie) => serie.show.name === clickedCardName
    );
    clickedCard.classList.add('favelement');
    favouriteSeries.push(favElemnt);
  } else {
    clickedCard.classList.remove('favelement');
    favouriteSeries.splice(favElemIndex, 1);
  }
  updateLocalStorage();
}

//Paint user's favourite
function renderFavouriteSection() {
  let seriesFav = '';
  let i;
  let favCard;
  favSection.innerHTML = '';
  if (favouriteSeries.length === 0) {
    btnReset.classList.add('hidden');
  } else {
    btnReset.classList.remove('hidden');
    for (i = 0; i < favouriteSeries.length; i++) {
      if (favouriteSeries[i].show.image === null) {
        favCard = imgTemporary;
      } else {
        favCard = favouriteSeries[i].show.image.medium;
      }
      seriesFav += `<li class="js-serieFavCard serieFavCard" id="${favouriteSeries[i].show.id}">`;
      seriesFav += `<img src="${favCard}" alt="Foto de ${favouriteSeries[i].show.name}">`;
      seriesFav += `<h3>${favouriteSeries[i].show.name}</h3>`;
      seriesFav += `<button type="button" class="js-delete resetButton"> ❌ </button></li>`;
      favSection.innerHTML = seriesFav;
    }
    listenResetBtn();
  }
}

// Reset function

// Reset all favourite elements
const resetAll = () => {
  localStorage.removeItem('favouriteSeries');
  favouriteSeries = [];
  updateLocalStorage();
  renderFavouriteSection();
  const searchedElem = document.querySelectorAll('.js-serieCard'); // me quita el color de los favoritos cuando reseteo
  for (const shearched of searchedElem) {
    shearched.classList.remove('favelement');
  }
};

// Reset one favourite elements

const resetOneFav = (ev) => {
  const buttonClickedId = parseInt(ev.currentTarget.id);
  const serieFavouriteIndex = favouriteSeries.findIndex(
    (favourite) => favourite.id === buttonClickedId
  );
  const parentOfSelectedId = ev.currentTarget.parentNode.id;
  favouriteSeries.splice(serieFavouriteIndex, 1);
  updateLocalStorage();
  renderFavouriteSection();
  const resultList = resultsWrapper.querySelectorAll('li');
  for (const li of resultList) {
    if (li.id === parentOfSelectedId) {
      li.classList.remove('favelement');
    }
  }
};

// Save in Local Storage
function updateLocalStorage() {
  localStorage.setItem('favouriteSeries', JSON.stringify(favouriteSeries));
}

// Bring data from Local Storage
const getFromLocalStorage = () => {
  const data = JSON.parse(localStorage.getItem('favouriteSeries'));
  if (data !== null) {
    favouriteSeries = data;
  }
  renderFavouriteSection();
};

// Listener functions
//Searched elements' listeners
function addListeners() {
  let liElem = document.querySelectorAll('.js-serieCard');
  for (const li of liElem) {
    li.addEventListener('click', favouritesHandler);
  }
}

//Search button's listener
btn.addEventListener('click', getSeries);

//Reset all button's listener
btnReset.addEventListener('click', resetAll);

//Reset one button's listener
const listenResetBtn = () => {
  const resetButtons = document.querySelectorAll('.js-delete');
  for (let resetButton of resetButtons) {
    resetButton.addEventListener('click', resetOneFav);
  }
};

// Start app
getSeries();
getFromLocalStorage();
