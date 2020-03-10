'use strict';

window.filter = (function () {
  var picturesContainer = document.querySelector('.pictures');
  var filtersContainerElement = document.querySelector('.img-filters');
  var filterDefaultButton = filtersContainerElement.querySelector('#filter-default');
  var filterRandomButton = filtersContainerElement.querySelector('#filter-random');
  var filterDiscussedButton = filtersContainerElement.querySelector('#filter-discussed');
  var COUNT_RANDOM_PICTURES = 10;

  var showFiltersContainer = function () {
    filtersContainerElement.classList.remove('img-filters--inactive');
  };

  var filterDefault = function () {
    picturesContainer.querySelectorAll('.picture').forEach(function (it) {
      it.remove();
    });
    window.gallery.createPhotosList(window.backend.dataPictures);
    window.preview.addListenerForAllsmallPictures();

    filterDefaultButton.classList.add('img-filters__button--active');
    filterRandomButton.classList.remove('img-filters__button--active');
    filterDiscussedButton.classList.remove('img-filters__button--active');
  };

  var filterRandom = function () {
    picturesContainer.querySelectorAll('.picture').forEach(function (it) {
      it.remove();
    });
    var dataPicturesCopy = window.backend.dataPictures.slice();
    var randomPicturesArray = [];
    for (var i = 0; i < COUNT_RANDOM_PICTURES; i += 1) {
      var randomNumber = window.util.getRandomNumber(0, dataPicturesCopy.length - 1);
      randomPicturesArray.push(dataPicturesCopy[randomNumber]);
      dataPicturesCopy.splice(randomNumber, 1);
    }

    window.gallery.createPhotosList(randomPicturesArray);
    window.preview.addListenerForAllsmallPictures();

    filterRandomButton.classList.add('img-filters__button--active');
    filterDefaultButton.classList.remove('img-filters__button--active');
    filterDiscussedButton.classList.remove('img-filters__button--active');
  };

  var filterDiscussed = function () {
    picturesContainer.querySelectorAll('.picture').forEach(function (it) {
      it.remove();
    });

    var dataPicturesCopy = window.backend.dataPictures.slice();
    dataPicturesCopy.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });

    window.gallery.createPhotosList(dataPicturesCopy);
    window.preview.addListenerForAllsmallPictures();

    filterDiscussedButton.classList.add('img-filters__button--active');
    filterDefaultButton.classList.remove('img-filters__button--active');
    filterRandomButton.classList.remove('img-filters__button--active');
  };

  filterDefaultButton.addEventListener('click', function () {
    window.debounce(filterDefault);
  });
  filterRandomButton.addEventListener('click', function () {
    window.debounce(filterRandom);
  });
  filterDiscussedButton.addEventListener('click', function () {
    window.debounce(filterDiscussed);
  });
  return {
    show: showFiltersContainer
  };
})();
