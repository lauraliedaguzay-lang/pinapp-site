/**
 * Pinapp V7 — Glass Card 3D Tilt (awwards polish subtle)
 * ────────────────────────────────────────────────────────────────
 * Rotation 3D perspective ±3° sur mousemove au-dessus des .glass-card.
 * Subtile — crée l'impression de profondeur physique sans devenir cartoony.
 *
 * Référence : Stripe/Linear/Arc browser. Amplitude volontairement très basse.
 *
 * Respect AVATAR : l'effet n'est perceptible qu'en déplaçant le curseur
 * lentement sur la card. En scroll rapide, invisible.
 */
(function () {
  'use strict';

  var mqHover, mqReduce;
  try {
    mqHover = window.matchMedia('(hover: hover)');
    mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  } catch (e) { return; }

  if (!mqHover.matches || mqReduce.matches) return;
  if (document.documentElement.classList.contains('voyage-sober')) return;

  var MAX_TILT = 3;   // degrés max
  var DAMPING = 0.7;  // facteur d'amortissement des deltas

  function attach(card) {
    if (card.dataset.tiltAttached === 'true') return;
    card.dataset.tiltAttached = 'true';

    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      // Normalise -1 à +1
      var nx = (x / rect.width) * 2 - 1;
      var ny = (y / rect.height) * 2 - 1;
      var rotY = (nx * MAX_TILT * DAMPING).toFixed(2);
      var rotX = (-ny * MAX_TILT * DAMPING).toFixed(2);
      card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
      card.style.transition = 'transform 120ms linear';
    }, { passive: true });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    }, { passive: true });
  }

  function boot() {
    var cards = document.querySelectorAll('.glass-card');
    cards.forEach(attach);

    // Observer pour cards ajoutées dynamiquement (rare mais possible)
    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (!n.querySelectorAll) return;
            if (n.classList && n.classList.contains('glass-card')) attach(n);
            n.querySelectorAll('.glass-card').forEach(attach);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
