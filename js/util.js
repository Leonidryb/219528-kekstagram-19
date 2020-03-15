'use strict';

window.util = (function () {
  var ESC_KEY = 'Escape';

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var isEscEvent = function (evt, action) {
    if (evt.key === ESC_KEY) {
      action();
    }
  };

  return {
    getRandomNumber: getRandomNumber,
    isEscEvent: isEscEvent
  };
})();
