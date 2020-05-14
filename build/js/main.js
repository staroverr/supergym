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
