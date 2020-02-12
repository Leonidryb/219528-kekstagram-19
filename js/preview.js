'use strict';

(function () {
  var bigPictureContainer = document.querySelector('.big-picture');

  var showBigPicture = function (photo) {
    var bigPictureImgElement = bigPictureContainer.querySelector('.big-picture__img');
    bigPictureImgElement.querySelector('img').src = photo.url;

    var bigPictureSocialElement = bigPictureContainer.querySelector('.big-picture__social');
    bigPictureSocialElement.querySelector('.likes-count').textContent = photo.likes + '';
    bigPictureSocialElement.querySelector('.comments-count').textContent = photo.comments.length + '';
    bigPictureSocialElement.querySelector('.social__caption').textContent = photo.description;
    bigPictureSocialElement.querySelector('.social__comment-count').classList.add('hidden');
    bigPictureSocialElement.querySelector('.comments-loader').classList.add('hidden');
  };


  var commentsList = bigPictureContainer.querySelector('.social__comments');

  var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');

  var renderComment = function (comment) {
    var commentElement = commentTemplate.cloneNode(true);

    commentElement.querySelector('.social__picture').src = comment.avatar;
    commentElement.querySelector('.social__picture').alt = comment.name;
    commentElement.querySelector('.social__text').textContent = comment.message;

    return commentElement;
  };

  var createCommentsList = function (arrayComments) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayComments.comments.length; i++) {
      fragment.appendChild(renderComment(arrayComments.comments[i]));
    }
    commentsList.appendChild(fragment);
  };


  var bodyElement = document.querySelector('body');

  var picturesContainer = document.querySelector('.pictures');

  var allRefersPictureSmallElement = picturesContainer.querySelectorAll('.picture');
  var bigPictureCloseElement = bigPictureContainer.querySelector('.big-picture__cancel');

  var onBigPictureEscPress = function (evt) {
    window.util.isEscEvent(evt, closeBigPicture);
  };

  var clearCommentList = function () {
    commentsList.innerHTML = '';
  };

  var openBigPicture = function (index) {
    bigPictureContainer.classList.remove('hidden');
    bodyElement.classList.add('modal-open');
    document.addEventListener('keydown', onBigPictureEscPress);
    showBigPicture(window.data.photos[index]);
    createCommentsList(window.data.photos[index]);
  };

  var closeBigPicture = function () {
    bigPictureContainer.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    document.removeEventListener('keydown', onBigPictureEscPress);
    clearCommentList();
  };

  var addClickListener = function (photo, index) {
    photo.addEventListener('click', function () {
      openBigPicture(index);
    });
  };

  var addListenerForAllsmallPictures = function () {
    for (var i = 0; i < allRefersPictureSmallElement.length; i += 1) {
      var photo = allRefersPictureSmallElement[i];
      addClickListener(photo, i);
    }
  };

  addListenerForAllsmallPictures();

  bigPictureCloseElement.addEventListener('click', closeBigPicture);

})();
