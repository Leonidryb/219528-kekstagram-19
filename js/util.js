'use strict';

window.util = (function () {
  var ESC_KEY = 'Escape';

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var getRandomElement = function (elements) {
    var random = Math.floor(Math.random() * elements.length);
    return elements[random];
  };

  var isEscEvent = function (evt, action) {
    if (evt.key === ESC_KEY) {
      action();
    }
  };

  return {
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    isEscEvent: isEscEvent
  };
})();
