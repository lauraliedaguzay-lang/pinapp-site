/* Appliquer le thème avant le premier rendu (évite un flash). */
(function () {
  try {
    if (localStorage.getItem('pinapp-neuro-calm') === '1') {
      document.documentElement.setAttribute('data-pinapp-calm', '1');
    }
    var t = localStorage.getItem('pinapp-theme');
    var pm = localStorage.getItem('pinapp-mode');
    var mode;
    if (t === 'light' || pm === 'jour') mode = 'light';
    else if (t === 'dark' || pm === 'nuit') mode = 'dark';
    else mode = 'dark';
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-mode', mode === 'light' ? 'jour' : 'nuit');
    var m = document.getElementById('pinapp-theme-color');
    if (m) m.setAttribute('content', mode === 'light' ? '#0a2a2e' : '#080d18');
  } catch (e) {}

  /* Retrait du loader si main.js ne charge pas (404, CSP, erreur) — idempotent avec main.js */
  function dismissLoaderEarly() {
    var loader = document.getElementById('loader');
    if (!loader || loader.dataset.dismissed === '1') return;
    loader.dataset.dismissed = '1';
    var v = loader.querySelector('video');
    if (v) {
      try {
        v.pause();
      } catch (e) {}
    }
    loader.classList.add('hidden');
    window.setTimeout(function () {
      if (loader && loader.parentNode) loader.remove();
    }, 300);
  }
  window.addEventListener('load', dismissLoaderEarly);
  function armFailsafe() {
    window.setTimeout(dismissLoaderEarly, 4500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', armFailsafe);
  } else {
    armFailsafe();
  }
})();

/* Vagues fond jour — même répertoire que theme-init.js (chemins relatifs / file://) */
(function loadPinappJourWaves() {
  var scripts = document.getElementsByTagName('script');
  var url = '';
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || '';
    if (src.indexOf('theme-init.js') !== -1) {
      url = src.replace(/theme-init\.js(\?[^#]*)?/i, 'pinapp-jour-waves.js$1');
      break;
    }
  }
  if (!url) return;
  var s = document.createElement('script');
  s.src = url;
  s.defer = true;
  document.head.appendChild(s);
})();

/* Mode concentration — même répertoire que theme-init.js */
(function loadPinappNeuroCalmUi() {
  if (document.querySelector('script[data-pinapp-neuro-calm-ui]')) return;
  var scripts = document.getElementsByTagName('script');
  var url = '';
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || '';
    if (src.indexOf('theme-init.js') !== -1) {
      url = src.replace(/theme-init\.js(\?[^#]*)?/i, 'pinapp-neuro-calm-ui.js$1');
      break;
    }
  }
  if (!url) return;
  var s = document.createElement('script');
  s.src = url;
  s.defer = true;
  s.setAttribute('data-pinapp-neuro-calm-ui', '1');
  document.head.appendChild(s);
})();

/* Futur cinéma — calque grille / halos */
(function loadPinappFuturAmbient() {
  if (document.querySelector('script[data-pinapp-futur-ambient]')) return;
  var scripts = document.getElementsByTagName('script');
  var url = '';
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || '';
    if (src.indexOf('theme-init.js') !== -1) {
      url = src.replace(/theme-init\.js(\?[^#]*)?/i, 'pinapp-futur-ambient.js$1');
      break;
    }
  }
  if (!url) return;
  var s = document.createElement('script');
  s.src = url;
  s.defer = true;
  s.setAttribute('data-pinapp-futur-ambient', '1');
  document.head.appendChild(s);
})();

(function loadPinappPpThemeToggleInit() {
  if (document.querySelector('script[data-pinapp-pp-theme-toggle]')) return;
  if (document.querySelector('script[src*="pp-theme-toggle.js"]')) return;
  var scripts = document.getElementsByTagName('script');
  var url = '/assets/js/pp-theme-toggle.js?v=1';
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || '';
    if (src.indexOf('theme-init.js') !== -1) {
      url = src.replace(/theme-init\.js(\?[^#]*)?/i, 'pp-theme-toggle.js$1');
      break;
    }
  }
  var s2 = document.createElement('script');
  s2.src = url;
  s2.defer = true;
  s2.setAttribute('data-pinapp-pp-theme-toggle', '1');
  document.head.appendChild(s2);
})();
