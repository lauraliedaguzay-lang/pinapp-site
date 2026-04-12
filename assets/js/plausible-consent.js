/**
 * Plausible — chargement conditionnel au consentement (RGPD).
 * Inclure ce fichier sans defer, avant les scripts qui appellent plausible().
 */
(function () {
  'use strict';

  var DOMAIN = 'pinapp.fr';
  var SRC = 'https://plausible.io/js/script.js';
  var STORAGE_KEY = 'cookie-consent';

  function stub() {
    return function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  }

  window.pinappLoadPlausibleIfConsented = function () {
    if (document.querySelector('script[data-pinapp-plausible]')) return;
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', DOMAIN);
    s.src = SRC;
    s.setAttribute('data-pinapp-plausible', '1');
    document.head.appendChild(s);
  };

  var c = null;
  try {
    c = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* navigation privée stricte */
  }

  if (c === 'refused') {
    window.plausible = function () {};
    return;
  }

  window.plausible = window.plausible || stub();

  if (c === 'accepted') {
    window.pinappLoadPlausibleIfConsented();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-primary').forEach(function (b) {
      b.addEventListener('click', function () {
        if (typeof window.plausible !== 'function') return;
        window.plausible('CTA Click', {
          props: { page: location.pathname, text: b.textContent.trim() },
        });
      });
    });
  });
})();
