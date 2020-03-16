'use strict';

window.preview = (function () {
  var COUNT_COMMENTS_PER_CLICK = 5;

  var bigPictureContainer = document.querySelector('.big-picture');
  var commentsLoader = bigPictureContainer.querySelector('.comments-loader');
  var showedCommentsCountElement = bigPictureContainer.querySelector('.social__comment-showed');

  var showBigPicture = function (photo) {
    var bigPictureImgElement = bigPictureContainer.querySelector('.big-picture__img');
    bigPictureImgElement.querySelector('img').src = photo.url;

    var bigPictureSocialElement = bigPictureContainer.querySelector('.big-picture__social');
    bigPictureSocialElement.querySelector('.likes-count').textContent = photo.likes + '';
    bigPictureSocialElement.querySelector('.comments-count').textContent = photo.comments.length + '';
    bigPictureSocialElement.querySelector('.social__caption').textContent = photo.description;
  };


  var commentsList = bigPictureContainer.querySelector('.social__comments');

  var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');

  var renderComment = function (comment) {
    var commentElement = commentTemplate.cloneNode(true);

    commentElement.querySelector('.social__picture').src = comment.avatar;
    commentElement.querySelector('.social__picture').alt = comment.name;
    commentElement.querySelector('.social__text').textContent = comment.message;
    commentElement.style.display = 'none';

    return commentElement;
  };

  var clearCommentList = function () {
    commentsList.innerHTML = '';
  };

  var commentsAlreadyShown = 0;

  var loadComments = function (comments) {
    var total = comments.length;
    var limit = Math.min(commentsAlreadyShown + COUNT_COMMENTS_PER_CLICK, total);

    for (var i = commentsAlreadyShown; i < limit; i += 1) {
      comments[i].style.display = 'flex';
    }

    commentsAlreadyShown = limit;

    if (commentsAlreadyShown === total) {
      commentsLoader.classList.add('hidden');
    }

    showedCommentsCountElement.textContent = limit;
  };

  var createCommentsList = function (comments) {
    var fragment = document.createDocumentFragment();
    comments.forEach(function (comment) {
      fragment.appendChild(renderComment(comment));
    });
    commentsList.appendChild(fragment);
  };

  var resetComments = function () {
    commentsAlreadyShown = 0;
    clearCommentList();
    commentsLoader.classList.remove('hidden');
  };

  var bodyElement = document.querySelector('body');

  var picturesContainer = document.querySelector('.pictures');
  var bigPictureCloseElement = bigPictureContainer.querySelector('.big-picture__cancel');

  var onBigPictureEscPress = function (evt) {
    window.util.isEscEvent(evt, onCloseBigPicture);
  };

  var openBigPicture = function (picture) {
    bigPictureContainer.classList.remove('hidden');
    bodyElement.classList.add('modal-open');
    document.addEventListener('keydown', onBigPictureEscPress);
    showBigPicture(picture);
    createCommentsList(picture.comments);
    loadComments(commentsList.querySelectorAll('.social__comment'));
  };

  commentsLoader.addEventListener('click', function () {
    loadComments(commentsList.querySelectorAll('.social__comment'));
  });

  var onCloseBigPicture = function () {
    bigPictureContainer.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    document.removeEventListener('keydown', onBigPictureEscPress);
    resetComments();
  };

  var addClickListener = function (photo) {
    photo.addEventListener('click', function (evt) {

      var photoSrc;
      if (evt.target.tagName === 'IMG') {
        photoSrc = evt.target.src;
      } else {
        photoSrc = evt.target.firstElementChild.src;
      }

      window.backend.dataPictures.forEach(function (it) {
        if (photoSrc.indexOf(it.url) > 0) {
          openBigPicture(it);
        }
      });
    });
  };

  var addListenerForAllsmallPictures = function () {
    var allRefersPictureSmallElement = picturesContainer.querySelectorAll('.picture');

    allRefersPictureSmallElement.forEach(function (it) {
      addClickListener(it);
    });
  };

  bigPictureCloseElement.addEventListener('click', onCloseBigPicture);

  return {
    addListenerForAllsmallPictures: addListenerForAllsmallPictures
  };

})();
