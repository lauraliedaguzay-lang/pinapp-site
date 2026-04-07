(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Spotlight — suit le pointeur sur la zone portfolio */
  var zone = document.getElementById('tatPortfolioZone');
  if (zone && !reduced) {
    zone.addEventListener(
      'pointermove',
      function (e) {
        var r = zone.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        zone.style.setProperty('--tz-x', x + '%');
        zone.style.setProperty('--tz-y', y + '%');
      },
      { passive: true }
    );
  }

  /* Variables globales spotlight plein écran */
  if (!reduced) {
    document.addEventListener(
      'pointermove',
      function (e) {
        document.documentElement.style.setProperty('--spot-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--spot-y', e.clientY + 'px');
      },
      { passive: true }
    );
  }

  /* Parallax léger hero */
  var heroInner = document.querySelector('.tat-hero-inner');
  var hero = document.querySelector('.tat-hero');
  if (heroInner && hero && !reduced) {
    hero.addEventListener(
      'pointermove',
      function (e) {
        var r = hero.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        heroInner.style.transform =
          'perspective(1200px) rotateY(' + px * 8 + 'deg) rotateX(' + -py * 6 + 'deg) translateZ(0)';
      },
      { passive: true }
    );
    hero.addEventListener('pointerleave', function () {
      heroInner.style.transform = '';
    });
  }

  /* Tilt cartes portfolio */
  document.querySelectorAll('[data-tat-tilt]').forEach(function (card) {
    if (reduced) return;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        'perspective(800px) rotateY(' +
        px * 14 +
        'deg) rotateX(' +
        -py * 14 +
        'deg) translateZ(8px)';
    });
    card.addEventListener('pointerleave', function () {
      card.style.transform = '';
    });
  });

  /* ZÉRO-SCROLL : pas de reveal au défilement.
     État final appliqué au chargement. */
  function applyFinalReveal() {
    document.querySelectorAll('.tat-reveal').forEach(function (el) {
      el.classList.add('tat-in');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFinalReveal);
  } else {
    applyFinalReveal();
  }
})();
