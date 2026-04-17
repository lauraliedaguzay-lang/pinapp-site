/**
 * Menu mobile accueil (#navToggle + #navDrawer) — un seul gestionnaire,
 * aligné sur les classes CSS existantes (#pp-drawer-css).
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');
    if (!toggle || !drawer) return;

    var focusableSel =
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      toggle.classList.toggle('is-open', open);
      toggle.classList.toggle('open', open);
      drawer.classList.toggle('is-open', open);
      drawer.classList.toggle('open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) document.body.style.setProperty('overflow', 'hidden');
      else document.body.style.removeProperty('overflow');
      if (open) {
        var panel = drawer.querySelector('.drawer__panel');
        var first = panel ? panel.querySelector(focusableSel) : null;
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    var backdrop = drawer.querySelector('.nav-drawer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setOpen(false);
      });
    }

    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (toggle.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        setOpen(false);
      }
    });
  });
})();
