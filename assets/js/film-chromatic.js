/**
 * Pinapp V7 — Film Chromatic Aberration per Scene (signature awwards #2)
 * ──────────────────────────────────────────────────────────────────────
 * À chaque changement de scène, applique un léger hue-rotate sur le film
 * principal pour accentuer la transition chromatique sans coupure.
 *
 * Subtle. Jamais spectaculaire. Respecte la règle AVATAR :
 * si l'user le remarque comme effet → trop fort. Si le site semble
 * "vivant sans qu'on sache pourquoi" → réussi.
 *
 * Dépendances :
 *  - CSS : #pinapp-film doit avoir filter: hue-rotate(var(--film-hue-shift))
 *    (ajouté dans pinapp-film-v6.css)
 *  - Event : écoute voyage:scene-active émis par voyage.js
 *  - OU : MutationObserver sur data-active-section (fallback)
 */
(function () {
  'use strict';

  // Mapping scène → hue-shift en degrés (subtil, ±14°)
  // Basé sur la palette naturelle de chaque segment film V6 :
  //  01 main hologramme (cockpit warm)  → neutre
  //  02 couloir passengers (galaxie or) → +4° (plus cosmique)
  //  04 constellation (hublot cosmos)   → +8° (violets boostés)
  //  05 cristaux M&P (colored gems)     → +10° (palette diverse accentuée)
  //  03/06 spirale dorée                → -4° (or renforcé)
  //  07 lune                            → -12° (chaleur amberisée)
  //  08 atterrissage sable              → -6° (chaleur désertique)
  var HUE_MAP = {
    s0: 0,      // hero main hologramme
    s1: -2,     // prologue (continue main)
    s2: 4,      // rencontre pilotes (couloir)
    s3: 8,      // métiers (hublot)
    s4: 10,     // constellation M&P
    s5: -4,     // preuves
    s5b: -6,    // n8n mécanisme (spirale énergie)
    s6: -12,    // manifeste (lune)
    s7: 6,      // œuvre (tourbillon)
    s8: -6      // atterrissage (sable chaud)
  };

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var film = null;
  var currentHue = 0;

  function applyHue(targetHue) {
    if (!film) return;
    if (targetHue === currentHue) return;
    film.style.setProperty('--film-hue-shift', targetHue + 'deg');
    currentHue = targetHue;
  }

  function setScene(sectionId) {
    if (reduced) return;
    var shift = HUE_MAP[sectionId];
    if (typeof shift !== 'number') return;
    applyHue(shift);
  }

  function boot() {
    film = document.getElementById('pinapp-film');
    if (!film) return;
    if (document.documentElement.classList.contains('voyage-sober')) return;

    // Écoute voyage:scene-active (émis par voyage.js)
    document.addEventListener('voyage:scene-active', function (e) {
      if (e && e.detail && e.detail.sectionId) setScene(e.detail.sectionId);
    });

    // Fallback : MutationObserver sur <html data-active-section>
    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].type === 'attributes' && muts[i].attributeName === 'data-active-section') {
            var val = document.documentElement.getAttribute('data-active-section');
            if (val) setScene(val);
          }
        }
      });
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-active-section']
      });
    }

    // Init avec la scène actuelle
    var current = document.documentElement.getAttribute('data-active-section');
    if (current) setScene(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
