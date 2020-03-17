'use strict';

window.gallery = (function () {

  var bodyElement = document.querySelector('body');
  var mainElement = bodyElement.querySelector('main');
  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var errorMessageTemplate = document.querySelector('#gallery-error').content.querySelector('.error');

  var renderPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes + '';
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length + '';

    return pictureElement;
  };

  var createPhotosList = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPicture(photos[i]));
    }
    picturesContainer.appendChild(fragment);
  };

  var onErrorMessageEscPress = function (evt) {
    window.util.isEscEvent(evt, onCloseErrorMessage);
  };

  var onCloseErrorMessage = function () {
    mainElement.querySelector('.error').remove();
    document.removeEventListener('click', onCloseErrorMessage);
    document.removeEventListener('keydown', onErrorMessageEscPress);
    bodyElement.classList.remove('modal-open');
  };

  var onErrorLoadGallery = function () {
    var errorMessageElement = errorMessageTemplate.cloneNode(true);
    mainElement.appendChild(errorMessageElement);
    bodyElement.classList.add('modal-open');
    document.addEventListener('click', onCloseErrorMessage);
    document.addEventListener('keydown', onErrorMessageEscPress);
    mainElement.querySelector('.error').querySelector('.error__button').addEventListener('click', onCloseErrorMessage);
  };

  window.backend.load(function (data) {
    window.backend.dataPictures = data;
    createPhotosList(window.backend.dataPictures);
    window.preview.addListenerForAllsmallPictures();
    window.filter.show();
  }, onErrorLoadGallery);

  return {
    createPhotosList: createPhotosList
  };

})();
