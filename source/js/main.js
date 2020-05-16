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
    var sliderInner = sliderSection.querySelector('.slider__inner'); // обёртка для трансформации .slider-item
    var sliderItems = sliderSection.querySelectorAll('.slider__item'); // элементы (.slider-item)
    var sliderControls = sliderSection.querySelectorAll('.slider__control'); // элементы управления
    var wrapperWidth = parseFloat(getComputedStyle(sliderInner).width); // ширина обёртки
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
}());
