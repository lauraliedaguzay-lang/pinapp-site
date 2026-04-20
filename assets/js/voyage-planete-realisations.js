/**
 * Planète interactive — hubs réalisations / démos (#s3 et optionnellement ailleurs).
 * Panneau : titre au survol / focus · navigation au clic ou Entrée / Espace.
 */
(function () {
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function plausible(name, props) {
    if (typeof window.plausible !== 'function') return;
    try {
      window.plausible(name, { props: props || {} });
    } catch (e2) {}
  }

  function initHub(hub) {
    var panel = hub.querySelector('[data-planete-panel]');
    if (!panel) return;

    var defaultText = panel.getAttribute('data-planete-default') || 'Choisissez une région.';

    function setPanelTitle(title) {
      panel.textContent = title || defaultText;
    }

    function goHref(el) {
      var href = el.getAttribute('data-href');
      if (!href) return;
      plausible('realisation_clicked', { name: el.getAttribute('data-realisation') || el.getAttribute('data-title') || '' });
      if (href.indexOf('http') === 0) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    }

    hub.querySelectorAll('.region').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        setPanelTitle(el.getAttribute('data-title') || '');
      });
      el.addEventListener('mouseleave', function () {
        if (document.activeElement !== el) setPanelTitle('');
      });
      el.addEventListener('focus', function () {
        setPanelTitle(el.getAttribute('data-title') || '');
      });
      el.addEventListener('blur', function () {
        setPanelTitle('');
      });
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        goHref(el);
      });
      el.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          goHref(el);
        }
      });
    });

    if (reduced) {
      hub.querySelectorAll('.region').forEach(function (el) {
        el.style.transition = 'none';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.voyage-planet-hub').forEach(initHub);
  });
})();
