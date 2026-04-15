/* Pinapp — vagues animées bas de page · visible uniquement en mode jour */
(function () {
  var ID = 'pinapp-jour-waves';

  function isJour() {
    if (document.documentElement.getAttribute('data-theme') === 'light') return true;
    var b = document.body;
    return !!(b && b.classList.contains('mode-jour'));
  }

  function removeWaves() {
    var el = document.getElementById(ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function ensureWaves() {
    if (!isJour()) {
      removeWaves();
      return;
    }
    var b = document.body;
    if (!b) return;
    if (document.getElementById(ID)) return;

    var wrap = document.createElement('div');
    wrap.id = ID;
    wrap.className = 'pinapp-jour-waves';
    wrap.setAttribute('aria-hidden', 'true');
    for (var i = 1; i <= 3; i++) {
      var layer = document.createElement('div');
      layer.className = 'pinapp-jour-waves__layer pinapp-jour-waves__layer--' + i;
      wrap.appendChild(layer);
    }

    var main = document.querySelector('main#main, main#contenu-principal');
    if (main && main.parentNode === b) {
      b.insertBefore(wrap, main);
      return;
    }
    var ca = document.querySelector('.caustics');
    if (ca && ca.parentNode) {
      ca.parentNode.insertBefore(wrap, ca.nextSibling);
      return;
    }
    var hg = document.querySelector('.holo-grid');
    if (hg && hg.parentNode) {
      hg.parentNode.insertBefore(wrap, hg.nextSibling);
      return;
    }
    b.appendChild(wrap);
  }

  function wire() {
    ensureWaves();
    document.addEventListener('themeChanged', ensureWaves);
    if (document.body) document.body.addEventListener('modeChange', ensureWaves);
    try {
      var obs = new MutationObserver(ensureWaves);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
