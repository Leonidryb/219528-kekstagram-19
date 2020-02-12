'use strict';

window.data = (function () {
  var NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];

  var MESSAGE_TEXTS = ['Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

  var createCommentsArray = function (countComments) {
    var array = [];

    for (var i = 0; i < countComments; i += 1) {
      array.push(
          {
            avatar: 'img/avatar-' + window.util.getRandomNumber(1, 6) + '.svg',
            message: window.util.getRandomElement(MESSAGE_TEXTS),
            name: window.util.getRandomElement(NAMES)
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
            likes: window.util.getRandomNumber(15, 200),
            comments: createCommentsArray(window.util.getRandomNumber(1, 3))
          }
      );
    }
    return array;
  };

  var photos = createPhotosArray(25);

  return {
    photos: photos
  };

})();
