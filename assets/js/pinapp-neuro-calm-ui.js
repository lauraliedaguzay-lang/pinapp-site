/* Pinapp — Mode concentration (TDAH, neuroatypie) · chargé par theme-init / theme.js */
(function () {
  'use strict';
  if (window.__pinappNeuroCalmUiLoaded) return;
  window.__pinappNeuroCalmUiLoaded = 1;

  var KEY = 'pinapp-neuro-calm';
  var BTN_ID = 'pinapp-neuro-calm-toggle';

  function dispatch() {
    try {
      window.dispatchEvent(new CustomEvent('pinapp-neuro-calm-changed'));
    } catch (e) {}
  }

  function isCalmOn() {
    return document.documentElement.getAttribute('data-pinapp-calm') === '1';
  }

  window.pinappSetNeuroCalm = function (on) {
    var h = document.documentElement;
    if (on) h.setAttribute('data-pinapp-calm', '1');
    else h.removeAttribute('data-pinapp-calm');
    try {
      localStorage.setItem(KEY, on ? '1' : '0');
    } catch (e) {}
    var btn = document.getElementById(BTN_ID);
    if (btn) {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        on
          ? 'Désactiver le mode concentration'
          : 'Activer le mode concentration (moins d’animations)',
      );
    }
    dispatch();
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById(BTN_ID)) return;
    var btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.type = 'button';
    btn.className = 'pinapp-neuro-calm-btn';
    btn.setAttribute('aria-pressed', isCalmOn() ? 'true' : 'false');
    btn.setAttribute(
      'aria-label',
      isCalmOn()
        ? 'Désactiver le mode concentration'
        : 'Activer le mode concentration (moins d’animations)',
    );
    btn.textContent = 'Concentration';
    btn.title =
      'Réduit animations, particules et décorations pour faciliter la lecture. Préférence mémorisée sur cet appareil.';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      window.pinappSetNeuroCalm(!isCalmOn());
    });
  });
})();
