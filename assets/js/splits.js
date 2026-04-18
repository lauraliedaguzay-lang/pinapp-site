/**
 * Découpage mots pour titres .pp-split — animations pilotées par GSAP ailleurs si présent.
 */
(function () {
  function splitEl(el) {
    if (!el || el.querySelector('.pp-word')) return;
    var text = el.textContent;
    if (!text || !text.trim()) return;
    el.textContent = '';
    var parts = text.trim().split(/\s+/);
    for (var i = 0; i < parts.length; i++) {
      var span = document.createElement('span');
      span.className = 'pp-word';
      span.textContent = parts[i] + (i < parts.length - 1 ? '\u00a0' : '');
      el.appendChild(span);
    }
  }

  function run() {
    document.querySelectorAll('.pp-split').forEach(splitEl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
