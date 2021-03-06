'use strict';

(function () {

  var MIN_SCALE_VALUE = 25;
  var MAX_SCALE_VALUE = 100;
  var CHANGE_SCALE_STEP = 25;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var HASHTAG_MAX_LENGHT = 19;
  var HASHTAG_MIN_LENGHT = 1;
  var MAX_COUNT_HASHTAGS = 5;

  var bodyElement = document.querySelector('body');
  var mainElement = bodyElement.querySelector('main');
  var imgUploadContainer = document.querySelector('.img-upload');
  var imgUploadFormElement = imgUploadContainer.querySelector('#upload-select-image');
  var imgUploadPopupElement = imgUploadContainer.querySelector('.img-upload__overlay');
  var imgUploadPopupCloseElement = imgUploadContainer.querySelector('.img-upload__cancel');
  var imgUploadInputElement = imgUploadContainer.querySelector('#upload-file');

  var onUploadPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, onCloseUploadPopup);
  };

  var onOpenUploadPopup = function () {
    imgUploadPopupElement.classList.remove('hidden');
    bodyElement.classList.add('modal-open');
    document.addEventListener('keydown', onUploadPopupEscPress);
    scaleControlValue.value = '100%';
    noneEffectInpitElement.focus();
    changePreviewImage();
  };

  var onCloseUploadPopup = function () {
    imgUploadPopupElement.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    imgUploadInputElement.value = '';
    hashtagsInputElement.value = '';
    descriptionTextareaElement.value = '';
    clearEffect();
    document.removeEventListener('keydown', onUploadPopupEscPress);
    uploadImagePreview.style.transform = 'scale(1)';
  };

  var changePreviewImage = function () {
    var file = imgUploadInputElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        uploadImagePreview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  imgUploadInputElement.addEventListener('change', onOpenUploadPopup);
  imgUploadPopupCloseElement.addEventListener('click', onCloseUploadPopup);

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

    var array = inputValue.split(' ').filter(function (tag) {
      return tag !== '';
    });

    for (var i = 0; i < array.length; i += 1) {
      if (array[i][0] !== '#') {
        return 'invalid first letter';
      }
      if (array[i].length > HASHTAG_MAX_LENGHT) {
        return 'tag langth too long';
      }
      if (array[i].length === HASHTAG_MIN_LENGHT) {
        return 'tag langth too small';
      }
      if (!getGoodCountSharps(array[i])) {
        return 'too much sharps in tag';
      }
      if (!array[i].match(/^#[0-9a-zа-я]+$/)) {
        return 'invalid tag';
      }
    }

    if (array.length !== deleteSimilarElements(array).length) {
      return 'invalid similar tags';
    }
    if (array.length > MAX_COUNT_HASHTAGS) {
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
    } else if (checkValueInputHashTags(target.value) === 'invalid tag') {
      target.setCustomValidity(
          'Хэш-тег может содержать только буквы и цифры'
      );
    } else {
      target.setCustomValidity('');
    }
  });

  var scaleControlSmaller = imgUploadContainer.querySelector('.scale__control--smaller');
  var scaleControlBigger = imgUploadContainer.querySelector('.scale__control--bigger');
  var scaleControlValue = imgUploadContainer.querySelector('.scale__control--value');
  var uploadImagePreview = imgUploadContainer.querySelector('.img-upload__preview img');
  var noneEffectInpitElement = imgUploadContainer.querySelector('#effect-none');


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

  var onAddEffect = function (evt) {
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

  effectsRadioSet.addEventListener('click', onAddEffect);

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

  var descriptionTextareaElement = imgUploadContainer.querySelector('.text__description');

  descriptionTextareaElement.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadPopupEscPress);
  });
  descriptionTextareaElement.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadPopupEscPress);
  });

  var onSubmitForm = function (evt) {
    window.backend.save(new FormData(imgUploadFormElement), onSuccessSaveForm, onErrorSaveForm);
    evt.preventDefault();
  };

  imgUploadFormElement.addEventListener('submit', onSubmitForm);

  var succesMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

  var onSuccessMessageEscPress = function (evt) {
    window.util.isEscEvent(evt, onCloseSuccessMessage);
  };

  var onSuccessSaveForm = function () {
    onCloseUploadPopup();
    var successMessageElement = succesMessageTemplate.cloneNode(true);
    mainElement.appendChild(successMessageElement);
    bodyElement.classList.add('modal-open');
    document.addEventListener('click', onCloseSuccessMessage);
    document.addEventListener('keydown', onSuccessMessageEscPress);
    mainElement.querySelector('.success').querySelector('.success__button').addEventListener('click', onCloseSuccessMessage);
  };

  var onCloseSuccessMessage = function () {
    mainElement.querySelector('.success').remove();
    document.removeEventListener('click', onCloseSuccessMessage);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
    bodyElement.classList.remove('modal-open');
  };

  var onErrorSaveForm = function () {
    onCloseUploadPopup();
    var errorMessageElement = errorMessageTemplate.cloneNode(true);
    mainElement.appendChild(errorMessageElement);
    bodyElement.classList.add('modal-open');
    document.addEventListener('click', onCloseErrorMessage);
    document.addEventListener('keydown', onErrorMessageEscPress);
    mainElement.querySelector('.error').querySelector('.error__button').addEventListener('click', onCloseErrorMessage);
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

})();
