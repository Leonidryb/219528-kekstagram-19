'use strict';

(function () {

  var MIN_SCALE_VALUE = 25;
  var MAX_SCALE_VALUE = 100;
  var CHANGE_SCALE_STEP = 25;

  var bodyElement = document.querySelector('body');
  var imgUploadContainer = document.querySelector('.img-upload');
  var imgUploadPopupElement = imgUploadContainer.querySelector('.img-upload__overlay');
  var imgUploadPopupCloseElement = imgUploadContainer.querySelector('.img-upload__cancel');
  var imgUploadInputElement = imgUploadContainer.querySelector('#upload-file');

  var onUploadPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closeUploadPopup);
  };

  var openUploadPopup = function () {
    imgUploadPopupElement.classList.remove('hidden');
    bodyElement.classList.add('modal-open');
    document.addEventListener('keydown', onUploadPopupEscPress);
    scaleControlValue.value = '100%';
  };

  var closeUploadPopup = function () {
    imgUploadPopupElement.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    imgUploadInputElement.value = '';
    document.removeEventListener('keydown', onUploadPopupEscPress);
    uploadImagePreview.style.transform = 'scale(1)';
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

  var getGoodCountSharps = function (string) {
    var result = 0;
    for (var i = 0; i <= string.length - 1; i += 1) {
      if (string[i] === '#') {
        result += 1;
      }
    }
    return result === 1;
  };


  var checkValueInputHashTags = function (inputValue) {

    if (inputValue === '') {
      return '';
    }

    var array = inputValue.split(' ');

    for (var i = 0; i < array.length; i += 1) {
      if (array[i][0] !== '#') {
        return 'invalid first letter';
      }
      if (array[i].length > 19) {
        return 'tag langth too long';
      }
      if (array[i].length === 1) {
        return 'tag langth too small';
      }
      if (!getGoodCountSharps(array[i])) {
        return 'too much sharps in tag';
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
    } else if (checkValueInputHashTags(target.value) === 'too much sharps in tag') {
      target.setCustomValidity(
          'Нельзя использовать знак # в теле хэш-тега'
      );
    } else {
      target.setCustomValidity('');
    }
  });

  // Работа с эффектами
  var scaleControlSmaller = imgUploadContainer.querySelector('.scale__control--smaller');
  var scaleControlBigger = imgUploadContainer.querySelector('.scale__control--bigger');
  var scaleControlValue = imgUploadContainer.querySelector('.scale__control--value');
  var uploadImagePreview = imgUploadContainer.querySelector('.img-upload__preview img');


  var getScaleValue = function () {
    return parseInt(scaleControlValue.value, 10);
  };

  var setScaleValue = function (value) {
    if (value >= MIN_SCALE_VALUE && value <= MAX_SCALE_VALUE) {
      scaleControlValue.value = value + '%';

      uploadImagePreview.style.transform = 'scale(' + value / 100 + ')';
    }
  };

  var onScaleControlclick = function (evt) {
    if (evt.target === scaleControlSmaller) {
      setScaleValue(getScaleValue() - CHANGE_SCALE_STEP);
    } else if (evt.target === scaleControlBigger) {
      setScaleValue(getScaleValue() + CHANGE_SCALE_STEP);
    }
  };

  scaleControlValue.value = '100%';

  scaleControlSmaller.addEventListener('click', onScaleControlclick);
  scaleControlBigger.addEventListener('click', onScaleControlclick);

  var effectLevelPin = imgUploadContainer.querySelector('.effect-level__pin');
  var effectLevel = imgUploadContainer.querySelector('.effect-level');
  effectLevel.classList.add('hidden');
  var effectLevelDepth = imgUploadContainer.querySelector('.effect-level__depth');
  var effectLevelValue = imgUploadContainer.querySelector('.effect-level__value');
  var effectsRadioSet = imgUploadContainer.querySelector('.effects');

  var clearEffect = function () {
    uploadImagePreview.removeAttribute('class');
    uploadImagePreview.style = '';
    effectLevel.classList.add('hidden');
    effectLevelPin.style.left = '448px';
    effectLevelDepth.style.width = getEffectLevelDepth() + '%';
    effectLevelValue.value = getEffectLevelDepth();
    scaleControlValue.value = '100%';
  };

  var addEffect = function (evt) {
    var effectName = evt.target.value;
    clearEffect();

    if (effectName !== 'none') {
      uploadImagePreview.classList.add('effects__preview--' + effectName);
      effectLevel.classList.remove('hidden');
    }
    changeEffectLevelDepth();
  };

  var getEffectLevelDepth = function () {
    var levelDepth = Math.trunc(((parseInt(effectLevelPin.style.left, 10)) / maxWidthEffect) * 100);

    return levelDepth;
  };

  var changeEffectLevelDepth = function () {
    effectLevelDepth.style.width = getEffectLevelDepth() + '%';
    effectLevelValue.value = getEffectLevelDepth();
  };

  effectsRadioSet.addEventListener('click', addEffect);

  var maxWidthEffect = 448;
  var minWidthEffect = 0;

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoords - moveEvt.clientX;

      startCoords = moveEvt.clientX;

      effectLevelPin.style.left = (effectLevelPin.offsetLeft - shift) + 'px';
      effectLevelDepth.style.width = (effectLevelPin.offsetLeft - shift) + 'px';

      if (parseInt(effectLevelPin.style.left, 10) < minWidthEffect) {
        effectLevelPin.style.left = minWidthEffect + 'px';
      }
      if (parseInt(effectLevelPin.style.left, 10) >= maxWidthEffect) {
        effectLevelPin.style.left = maxWidthEffect + 'px';
      }

      if (uploadImagePreview.classList.contains('effects__preview--chrome')) {
        var filterEffectLevel = Math.trunc(((parseInt(effectLevelPin.style.left, 10)) / maxWidthEffect) * 10) / 10;
        uploadImagePreview.style.filter = 'grayscale(' + filterEffectLevel + ')';
        changeEffectLevelDepth();
      }
      if (uploadImagePreview.classList.contains('effects__preview--sepia')) {
        filterEffectLevel = Math.trunc(((parseInt(effectLevelPin.style.left, 10)) / maxWidthEffect) * 10) / 10;
        uploadImagePreview.style.filter = 'sepia(' + filterEffectLevel + ')';
        changeEffectLevelDepth();
      }
      if (uploadImagePreview.classList.contains('effects__preview--marvin')) {
        filterEffectLevel = Math.trunc(((parseInt(effectLevelPin.style.left, 10)) / maxWidthEffect) * 100);
        uploadImagePreview.style.filter = 'invert(' + filterEffectLevel + '%)';
        changeEffectLevelDepth();
      }
      if (uploadImagePreview.classList.contains('effects__preview--phobos')) {
        filterEffectLevel = Math.trunc(((parseInt(effectLevelPin.style.left, 10)) / maxWidthEffect) * (1 / 3) * 10);
        uploadImagePreview.style.filter = 'blur(' + filterEffectLevel + 'px)';
        changeEffectLevelDepth();
      }
      if (uploadImagePreview.classList.contains('effects__preview--heat')) {
        filterEffectLevel = Math.trunc(((parseInt(effectLevelPin.style.left, 10)) / maxWidthEffect) * (1 / 3) * 10);
        var heatFilterEffectLevel = filterEffectLevel < 1 ? filterEffectLevel = 1 : filterEffectLevel;
        uploadImagePreview.style.filter = 'brightness(' + heatFilterEffectLevel + ')';
        changeEffectLevelDepth();
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Работа с полем комментария
  var descriptionTextareaElement = imgUploadContainer.querySelector('.text__description');

  descriptionTextareaElement.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadPopupEscPress);
  });
  descriptionTextareaElement.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadPopupEscPress);
  });

})();
