/**
 * Pinapp V7 — Scene Counter (voyage-v9)
 * IDs voyage-v9 : s01, s02, … — mappés vers des alias pour le compteur.
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ALIAS = {
    s01: 's0',
    s02: 's1',
    s02b: 's2',
    s02c: 's2',
    s03: 's3',
    s03b: 's4',
    s04: 's5',
    s04b: 's5',
    s05a: 's5',
    s05: 's5',
    s05d: 's5',
    s05f: 's5',
    s05e: 's5',
    s06: 's5b',
    s07: 's6',
    s08: 's7',
    s08b: 's7',
    s09: 's8',
    s10: 's8',
    s11: 's8',
    s13: 's8',
    s13b: 's8',
    s14: 's8'
  };

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

  function resolveSectionId(raw) {
    if (!raw) return '';
    return ALIAS[raw] || raw;
  }

  function setScene(sectionId) {
    if (!counter || !currentNumSpan) return;
    var sid = resolveSectionId(sectionId);
    var idx = SCENES.indexOf(sid);
    if (idx === -1) return;
    var newNum = pad2(idx + 1);
    if (currentNumSpan.textContent === newNum) return;

    if (reduced) {
      currentNumSpan.textContent = newNum;
      return;
    }

    var nextSpan = document.createElement('span');
    nextSpan.className = 'scene-counter__num scene-counter__num--enter';
    nextSpan.textContent = newNum;
    currentNumSpan.classList.add('scene-counter__num--exit');
    currentNumSpan.parentNode.appendChild(nextSpan);

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

  document.addEventListener('voyage:scene-active', function (e) {
    if (e && e.detail && e.detail.sectionId) setScene(e.detail.sectionId);
  });

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
    var current = document.documentElement.getAttribute('data-active-section');
    if (current) setScene(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
