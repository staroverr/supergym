'use strict';

// tab switcher

(function () {
  var section = document.querySelector('.subscr');
  var tabList = section.querySelector('.subscr__tab-list');
  var tabs = section.querySelectorAll('.subscr__tab');
  var content = {
    '1 месяц': {
      trainer: 5000,
      day: 1700,
      fullday: 2700
    },
    '6 месяцев': {
      trainer: 25000,
      day: 9000,
      fullday: 15000
    },
    '12 месяцев': {
      trainer: 45000,
      day: 16000,
      fullday: 25000
    }
  };

  // функция деактивации всех вкладок
  function deactivateAllTabs(theseTabs) {
    theseTabs.forEach(function (t) {
      if (t.classList.contains('subscr__tab--active')) {
        t.classList.remove('subscr__tab--active');
      }
    });
  }

  function toggleTabs(evt) {
    tabs.forEach(function (t) {
      if (!evt.target.classList.contains('subscr__tab--active') && evt.target === t) {
        deactivateAllTabs(tabs);
        t.classList.add('subscr__tab--active');
        var tabName = t.textContent;
        Object.keys(content[tabName]).forEach(function (item) {
          var card = section.querySelector('.subscr__card--' + item);
          card.querySelector('.subscr__number').textContent = card.querySelector('.subscr__price-replica').textContent = content[tabName][item];
        });
      }
    });
  }
  tabList.addEventListener('click', toggleTabs);
})();

// slider

(function () {
  function initSlider(section) {
    var sliderSection = document.querySelector(section); // основный элемент блока
    var sliderWrapper = sliderSection.querySelector('.slider__wrapper'); // обертка для элементов слайдера
    var sliderInner = sliderSection.querySelector('.slider__inner'); // динамический блок слайдера
    var sliderItems = sliderSection.querySelectorAll('.slider__item'); // элементы (.slider-item)
    var sliderControls = sliderSection.querySelectorAll('.slider__control'); // элементы управления
    var wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width); // ширина обёртки
    var itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width); // ширина одного элемента
    var itemsGutter = parseFloat(getComputedStyle(sliderItems[0]).marginRight); // ширина отступа между элементами
    var itemsPerView = (wrapperWidth - itemWidth) / (itemWidth + itemsGutter) + 1; // количество видимых элементов
    var leftItemPosition = 0; // позиция левого активного элемента
    var transform = 0; // значение транфсформации .slider_wrapper
    var step = wrapperWidth + itemsGutter; // величина шага трансформации, равная ширине
    var items = []; // массив элементов

    // сброс слайдера в начальное состояние
    sliderInner.style.transform = 'translateX(0)';
    sliderItems.forEach(function (item) {
      item.removeAttribute('style');
    });

    // наполнение массива _items
    sliderItems.forEach(function (item, index) {
      items.push({
        item: item,
        position: index,
        transform: 0
      });
    });

    var position = {
      getMinItem: function () {
        var indexItem = 0;
        items.forEach(function (item, index) {
          if (item.position < items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getMaxItem: function () {
        var indexItem = 0;
        items.forEach(function (item, index) {
          if (item.position > items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getMin: function () {
        return items[position.getMinItem()].position;
      },
      getMax: function () {
        return items[position.getMaxItem()].position;
      }
    };

    var transformSlider = function (direction) {
      var nextItemPosition;
      var i;
      if (direction === 'right') {
        leftItemPosition = leftItemPosition + itemsPerView;
        if ((leftItemPosition + itemsPerView - 1) > position.getMax()) {
          var itemsToAdd = leftItemPosition + itemsPerView - position.getMax() - 1;
          for (i = 0; i < itemsToAdd; i++) {
            nextItemPosition = position.getMinItem();
            items[nextItemPosition].position = position.getMax() + 1;
            items[nextItemPosition].transform += items.length * (itemWidth + itemsGutter);
            items[nextItemPosition].item.style.transform = 'translateX(' + items[nextItemPosition].transform + 'px)';
          }
        }
        transform -= step;
      }
      if (direction === 'left') {
        leftItemPosition = leftItemPosition - itemsPerView;
        if (leftItemPosition < position.getMin()) {
          for (i = 0; i < itemsPerView; i++) {
            nextItemPosition = position.getMaxItem();
            items[nextItemPosition].position = position.getMin() - 1;
            items[nextItemPosition].transform -= items.length * (itemWidth + itemsGutter);
            items[nextItemPosition].item.style.transform = 'translateX(' + items[nextItemPosition].transform + 'px)';
          }
        }
        transform += step;
      }
      sliderInner.style.transform = 'translateX(' + transform + 'px)';
    };

    // обработчик события click для кнопок "назад" и "вперед"
    var controlClick = function (e) {
      if (e.target.classList.contains('slider__control') || e.target.parentNode.classList.contains('slider__control')) {
        e.preventDefault();
        var direction = (e.target.classList.contains('slider__control--right') || e.target.parentNode.classList.contains('slider__control--right')) ? 'right' : 'left';
        transformSlider(direction);
      }
    };

    var setUpListeners = function () {
      // добавление к кнопкам "назад" и "вперед" обрботчика controlClick для события click
      sliderControls.forEach(function (contr) {
        contr.addEventListener('click', controlClick);
      });
    };

    // инициализация
    setUpListeners();
  }

  initSlider('.trainers');
  initSlider('.reviews');
}());

// DOM манипуляция на мобильной версии в подвале

(function () {
  var footer = document.querySelector('.footer');
  var wrapper = document.querySelector('.footer__wrapper');
  var logo = footer.querySelector('.footer__logo');
  var menu = footer.querySelector('.footer__menu');
  var MOBILE_WIDTH = 767;
  var logoClone = logo.cloneNode(true);

  function resideLogo() {

    var addLogoToMenu = function () {
      var newLi = document.createElement('li');

      if (!logoClone.classList.contains('footer__logo--inlisted')) {
        logoClone.classList.add('footer__logo--inlisted');
      }
      newLi.insertAdjacentElement('afterbegin', logoClone);
      newLi = menu.insertBefore(newLi, menu.firstChild);
    };

    var removeLogoFromTopIfExists = function () {
      logo = footer.querySelector('.footer__logo');
      if (logo && logo.parentNode === wrapper) {
        wrapper.removeChild(logo);
      }
    };

    var removeLogoFromMenuIfExists = function () {
      var logoAtMenu = footer.querySelector('.footer__logo--inlisted');
      if (logoAtMenu) {
        menu.removeChild(logoAtMenu.parentNode);
      }
    };

    var addLogoAtTop = function () {
      logo = footer.querySelector('.footer__logo');

      if (logoClone.classList.contains('footer__logo--inlisted')) {
        logoClone.classList.remove('footer__logo--inlisted');
      }
      if (!logo || logo.parentNode.tagName !== 'DIV') {
        wrapper.insertBefore(logoClone, menu);
      }
    };

    if (document.documentElement.clientWidth <= MOBILE_WIDTH) {
      removeLogoFromMenuIfExists();
      addLogoToMenu();
      removeLogoFromTopIfExists();
    } else {
      removeLogoFromMenuIfExists();
      addLogoAtTop();
    }
  }

  resideLogo();

  window.addEventListener('resize', function () {
    resideLogo();
  });
})();

// input mask validation

(function () {
  var KeyCode = {
    BACKSPACE: 8,
    ESCAPE: 27,
    ENTER: 13
  };

  function setInputMask(section) {
    var cbForm = section.querySelector('form');
    var telInput = cbForm.querySelector('input[type="tel"]');
    var swap;


    telInput.addEventListener('focus', function () {
      telInput.value = swap || '+7(';
    });

    telInput.addEventListener('input', function () {
      if (telInput.value.match(/\+$|\+7$|\+7\([^\d]/)) {
        telInput.value = '+7('; // не допускает значений '+', '+7' и ввода после скобки нечисловых значений
      }
      if (!telInput.value.match(/\)/)) { // проверка на наличие закрывающей скобки
        if (telInput.value.match(/\+7\(\d+/)) {
          telInput.value = telInput.value.match(/\+7\(\d+/); // записывает в значение поля вводимые числа и блокирует ввод нечисловых значений
        }

        if (telInput.value.match(/\+7\(\d{3}/)) { // добавляет скобку после ввода 3 чисел
          telInput.value += ')';
        }
      } else {
        telInput.value = telInput.value.match(/\+7\(\d{3}\)\d{0,7}/);
      }

      telInput.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KeyCode.BACKSPACE && telInput.value.match(/\+7\(\d{3}\)$/)) { // добавляет возможность удалять закрывающую скобку и число перед ней
          telInput.value = telInput.value.slice(0, -1);
        }
      });

      telInput.addEventListener('change', function () {
        swap = telInput.value;
      });
    });

    telInput.addEventListener('invalid', function () {
      telInput.setCustomValidity('Значение поля должно быть в формате: +7(999)9999999');
    });

  }

  var formSection = document.querySelector('.form');

  setInputMask(formSection);
})();
