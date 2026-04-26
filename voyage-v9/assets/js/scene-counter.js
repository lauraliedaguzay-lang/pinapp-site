/**
 * Pinapp V9 — Scene counter (voyage-v5)
 * 14 scènes logiques ; sections DOM : s01…s13 + interstitiels s04b, s06b, s09b.
 */
(function () {
  'use strict';

  var SCENE_MAP = {
    s01: 1,
    s02: 2,
    s03: 3,
    s04: 4,
    s04b: 4,
    'pack-duo': 5,
    s06: 6,
    s06b: 6,
    s07: 7,
    s08: 8,
    s09: 9,
    s09b: 10,
    s10: 11,
    s11: 12,
    s12: 13,
    form: 14
  };

  var TOTAL = 14;

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
    counter = document.querySelector('.scene-counter');
    if (counter) {
      currentNumSpan = counter.querySelector('.scene-counter__num');
      var tot = counter.querySelector('.scene-counter__total');
      if (tot) tot.textContent = pad2(TOTAL);
      return;
    }

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
    var idx = SCENE_MAP[sectionId];
    if (typeof idx !== 'number') return;
    var newNum = pad2(idx);
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
