'use strict';

(function () {

  var picturesContainer = document.querySelector('.pictures');

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  var renderPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').setAttribute('src', picture.url);
    pictureElement.querySelector('.picture__likes').textContent = picture.likes + '';
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length + '';

    return pictureElement;
  };

  var createPhotosList = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.photos.length; i++) {
      fragment.appendChild(renderPicture(window.data.photos[i]));
    }
    picturesContainer.appendChild(fragment);
  };

  createPhotosList();

})();
