/**
 * Pinapp V7 — Scene Counter (signature awwards-worthy)
 * ────────────────────────────────────────────────────────────────
 * Compteur minimaliste "01 / 08" en position fixed top-right.
 * Change via slot-machine translate quand la scène active bouge.
 *
 * Dépend de :
 *  - l'attribut data-active-section sur <html> (posé par easter-eggs.js)
 *  - OU directement de l'event voyage:scene-active
 *
 * Inspiration : Merci-Michel, Readymag, Dept
 * Respect règle AVATAR : si user remarque le compteur, il est bien
 * intégré — ne doit jamais crier.
 */
(function () {
  'use strict';

  // Ordre des sections visibles (hors header/footer)
  var SCENES = ['s0', 's1', 's2', 's3', 's4', 's5', 's5b', 's6', 's7', 's8'];
  var TOTAL = SCENES.length;

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  var counter = null;
  var currentNumSpan = null;
  var currentDigit = null;

  function inject() {
    if (document.querySelector('.scene-counter')) return;
    counter = document.createElement('div');
    counter.className = 'scene-counter';
    counter.setAttribute('aria-hidden', 'true');

    var currentWrap = document.createElement('span');
    currentWrap.className = 'scene-counter__current';

    currentNumSpan = document.createElement('span');
    currentNumSpan.className = 'scene-counter__num';
    currentNumSpan.textContent = '01';
    currentWrap.appendChild(currentNumSpan);

    var sep = document.createElement('span');
    sep.className = 'scene-counter__sep';
    sep.textContent = '/';

    var total = document.createElement('span');
    total.className = 'scene-counter__total';
    total.textContent = pad2(TOTAL);

    counter.appendChild(currentWrap);
    counter.appendChild(sep);
    counter.appendChild(total);
    document.body.appendChild(counter);
  }

  function setScene(sectionId) {
    if (!counter || !currentNumSpan) return;
    var idx = SCENES.indexOf(sectionId);
    if (idx === -1) return;
    var newNum = pad2(idx + 1);
    if (currentNumSpan.textContent === newNum) return;

    if (reduced) {
      currentNumSpan.textContent = newNum;
      return;
    }

    // Slot-machine : crée un nouveau span qui monte depuis le bas
    // l'ancien disparaît vers le haut.
    var nextSpan = document.createElement('span');
    nextSpan.className = 'scene-counter__num scene-counter__num--enter';
    nextSpan.textContent = newNum;
    currentNumSpan.classList.add('scene-counter__num--exit');
    currentNumSpan.parentNode.appendChild(nextSpan);

    // Force reflow puis démarre transition
    void nextSpan.offsetHeight;
    requestAnimationFrame(function () {
      nextSpan.classList.remove('scene-counter__num--enter');
      nextSpan.classList.add('scene-counter__num--active');
    });

    var oldSpan = currentNumSpan;
    currentNumSpan = nextSpan;
    setTimeout(function () {
      if (oldSpan.parentNode) oldSpan.parentNode.removeChild(oldSpan);
    }, 700);
  }

  // Listen event (émis par voyage.js)
  document.addEventListener('voyage:scene-active', function (e) {
    if (e && e.detail && e.detail.sectionId) setScene(e.detail.sectionId);
  });

  // Fallback : écoute les mutations de data-active-section sur <html>
  // (posé par easter-eggs.js via IntersectionObserver si voyage.js absent)
  function observeHtmlAttr() {
    if (!('MutationObserver' in window)) return;
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].type === 'attributes' && muts[i].attributeName === 'data-active-section') {
          var val = document.documentElement.getAttribute('data-active-section');
          if (val) setScene(val);
        }
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-active-section'] });
  }

  function boot() {
    inject();
    observeHtmlAttr();
    // Init avec la section actuelle si elle existe
    var current = document.documentElement.getAttribute('data-active-section');
    if (current) setScene(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
