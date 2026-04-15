/* Pinapp — calque futur cinéma (grille + halos). Respecte mode concentration et reduced-motion. */
(function () {
  'use strict';

  function motionBlocked() {
    if (document.documentElement.getAttribute('data-pinapp-calm') === '1') return true;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return true;
    return false;
  }

  function removeLayer() {
    var el = document.querySelector('.pinapp-futur-layer');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function injectLayer() {
    if (document.querySelector('.pinapp-futur-layer')) return;
    if (motionBlocked()) return;
    var el = document.createElement('div');
    el.className = 'pinapp-futur-layer';
    el.setAttribute('aria-hidden', 'true');
    var body = document.body;
    if (!body) return;
    var canvas = document.getElementById('canvas-pandora');
    if (canvas && canvas.parentNode === body) {
      body.insertBefore(el, canvas);
    } else {
      var skip = body.querySelector('.skip-link');
      if (skip && skip.parentNode === body) body.insertBefore(el, skip.nextSibling);
      else body.insertBefore(el, body.firstChild);
    }
  }

  function sync() {
    if (motionBlocked()) removeLayer();
    else injectLayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }

  window.addEventListener('pinapp-neuro-calm-changed', sync);
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', sync);
    } catch (e) {
      window.matchMedia('(prefers-reduced-motion: reduce)').addListener(sync);
    }
  }
})();
