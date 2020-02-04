'use strict';

var NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];

var MESSAGE_TEXTS = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var ESC_KEY = 'Escape';

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomElement = function (elements) {
  var random = Math.floor(Math.random() * elements.length);
  return elements[random];
};

var createCommentsArray = function (countComments) {
  var array = [];

  for (var i = 0; i < countComments; i += 1) {
    array.push(
        {
          avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
          message: getRandomElement(MESSAGE_TEXTS),
          name: getRandomElement(NAMES)
        }
    );
  }
  return array;
};

var createPhotosArray = function (countPhotos) {
  var array = [];

  for (var i = 0; i < countPhotos; i += 1) {
    array.push(
        {
          url: 'photos/' + (i + 1) + '.jpg',
          description: '',
          likes: getRandomNumber(15, 200),
          comments: createCommentsArray(getRandomNumber(1, 3))
        }
    );
  }
  return array;
};

var photos = createPhotosArray(25);

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
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPicture(photos[i]));
  }
  picturesContainer.appendChild(fragment);
};

createPhotosList();

// ----------------------Module3-task3----------------------------//

var bigPictureContainer = document.querySelector('.big-picture');
// bigPictureContainer.classList.remove('hidden');

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

showBigPicture(photos[0]);

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

createCommentsList(photos[0]);

var bodyElement = document.querySelector('body');
// bodyElement.classList.add('modal-open');

// ------------------------Module4-task2-------------------------------- //
var imgUploadContainer = document.querySelector('.img-upload');
var imgUploadPopupElement = imgUploadContainer.querySelector('.img-upload__overlay');
var imgUploadPopupCloseElement = imgUploadContainer.querySelector('.img-upload__cancel');
var imgUploadInputElement = imgUploadContainer.querySelector('#upload-file');

var onUploadPopupEscPress = function (evt) {
  if (evt.key === ESC_KEY) {
    closeUploadPopup();
  }
};

var openUploadPopup = function () {
  imgUploadPopupElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', onUploadPopupEscPress);
};

var closeUploadPopup = function () {
  imgUploadPopupElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  imgUploadInputElement.value = '';
  document.removeEventListener('keydown', onUploadPopupEscPress);
};

imgUploadInputElement.addEventListener('change', openUploadPopup);
imgUploadPopupCloseElement.addEventListener('click', closeUploadPopup);

// Валидация хеш-тегов
var hashtagsInputElement = imgUploadContainer.querySelector('.text__hashtags');

hashtagsInputElement.addEventListener('focus', function () {
  document.removeEventListener('keydown', onUploadPopupEscPress);
});
hashtagsInputElement.addEventListener('blur', function () {
  document.addEventListener('keydown', onUploadPopupEscPress);
});

var deleteSimilarElements = function (array) {

  for (var i = 0; i < array.length - 1; i += 1) {
    array[i] = array[i].toLowerCase();
  }

  return array.filter(function (element, position, arr) {
    return arr.indexOf(element) === position;
  });
};


var checkValueInputHashTags = function (inputValue) {
  var array = inputValue.split(' ');

  for (var i = 0; i <= array.length - 1; i += 1) {
    if (array[i][0] !== '#') {
      return 'invalid first letter';
    }
    if (array[i].length > 19) {
      return 'tag langth too long';
    }
    if (array[i].length === 1) {
      return 'tag langth too small';
    }
  }

  if (array.length !== deleteSimilarElements(array).length) {
    return 'invalid similar tags';
  }
  if (array.length > 5) {
    return 'invalid count tags';
  }
  return '';
};

hashtagsInputElement.addEventListener('input', function (evt) {
  var target = evt.target;
  if (checkValueInputHashTags(target.value) === 'invalid first letter') {
    target.setCustomValidity(
        'Хэш-тег должен начинаться со знака # и отделяться пробелом'
    );
  } else if (checkValueInputHashTags(target.value) === 'tag langth too long') {
    target.setCustomValidity(
        'Хэш-тег не должен превышать 20 символов'
    );
  } else if (checkValueInputHashTags(target.value) === 'tag langth too small') {
    target.setCustomValidity(
        'Хэш-тег не быть меньше 2 символов'
    );
  } else if (checkValueInputHashTags(target.value) === 'invalid similar tags') {
    target.setCustomValidity(
        'Нельзя использовать один и тотже хэш-тег дважды'
    );
  } else if (checkValueInputHashTags(target.value) === 'invalid count tags') {
    target.setCustomValidity(
        'Нельзя указывать больше 5 хэш-тегов'
    );
  } else {
    target.setCustomValidity('');
  }
});
