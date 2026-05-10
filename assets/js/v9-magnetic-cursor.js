/**
 * Pinapp V11 — curseur custom (≥1024px, pointer fine) + RM soft
 */
(function () {
  'use strict';
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.innerWidth < 1024) return;

  var RM = false;
  try {
    RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  document.documentElement.classList.add('mag-cursor-on');

  var cursor = document.createElement('div');
  cursor.id = 'magnetic-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor-label"></span>';
  document.body.appendChild(cursor);

  var labelEl = cursor.querySelector('.cursor-label');
  var mouseX = 0;
  var mouseY = 0;
  var cursorX = 0;
  var cursorY = 0;
  var lerp = RM ? 0.5 : 0.18;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function tick() {
    cursorX += (mouseX - cursorX) * lerp;
    cursorY += (mouseY - cursorY) * lerp;
    cursor.style.transform =
      'translate3d(' + cursorX + 'px,' + cursorY + 'px,0) translate(-50%,-50%)';
    window.requestAnimationFrame(tick);
  }
  tick();

  function setState(state, label) {
    cursor.dataset.state = state || 'default';
    labelEl.textContent = label || '';
  }

  function bindList(sel, state, text) {
    var nodes = document.querySelectorAll(sel);
    var i;
    for (i = 0; i < nodes.length; i++) {
      (function (el) {
        el.addEventListener('mouseenter', function () {
          setState(state, text);
        });
        el.addEventListener('mouseleave', function () {
          setState('default', '');
        });
      })(nodes[i]);
    }
  }

  bindList('.btn--primary', 'cta', '\u2192');
  bindList('.nav__cta', 'cta', '\u2192');
  bindList('.orientation-card', 'card', 'VOIR');
  bindList('.demo-tile', 'card', 'VOIR');
  bindList('.vimeo-tile', 'card', 'VOIR');
  bindList('.hook-video-wrap', 'card', 'VOIR');
  bindList('img.team-portrait[alt*="Lauralie"]', 'lauralie', 'Lauralie');
  bindList('img.team-portrait[alt*="Micha"]', 'micha', 'Micha\u00EBl');

  var inputs = document.querySelectorAll('input, textarea, select');
  for (var j = 0; j < inputs.length; j++) {
    (function (inp) {
      inp.addEventListener('mouseenter', function () {
        setState('input', '');
      });
      inp.addEventListener('mouseleave', function () {
        setState('default', '');
      });
    })(inputs[j]);
  }

  document.addEventListener('mousedown', function () {
    cursor.classList.add('clicking');
  });
  document.addEventListener('mouseup', function () {
    cursor.classList.remove('clicking');
  });

  setState('default', '');
})();
