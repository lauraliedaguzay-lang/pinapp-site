/* PINAPP — scroll-cinema.js — v5
   Animations au scroll — tempo The Light Always Returns — 3.5s
   ================================================================= */

/* =====================================================
   PINAPP — ZÉRO SCROLL (règles)
   - Pas de révélation de contenu au scroll (IntersectionObserver)
   - Pas de parallaxe décorative liée au scroll
   - Pas de sticky CTA déclenché au scroll
   On conserve uniquement des effets au chargement (si besoin) et
   les classes statiques.
   ===================================================== */

/* =====================================================
   NAV — glassmorphism au scroll
   ===================================================== */
const nav = document.querySelector('nav');
window.addEventListener(
  'scroll',
  () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
  },
  { passive: true },
);

/* =====================================================
   SECTION ENTER — pinapp-zero-scroll.mdc
   Pas d’IntersectionObserver : le contenu n’est pas « révélé au scroll ».
   .visible appliqué au chargement (animation une fois au load, pas liée au défilement).
   ===================================================== */
function revealSectionsOnLoad() {
  document.querySelectorAll('.section-enter').forEach(function (el) {
    el.classList.add('visible');
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealSectionsOnLoad);
} else {
  revealSectionsOnLoad();
}

/* Secours si classList bloquée / DOM partiel */
setTimeout(function () {
  document.querySelectorAll('.section-enter:not(.visible)').forEach(function (el) {
    el.classList.add('visible');
  });
}, 100);

/* =====================================================
   IMAGES REVEAL (désactivé: zéro reveal au scroll)
   ===================================================== */
document.querySelectorAll('.img-reveal').forEach((img) => img.classList.add('visible'));

/* =====================================================
   COMPTEURS — data-count
   ===================================================== */
function animateCountersOnLoad() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    if (el.classList.contains('done') || el.classList.contains('counting')) return;
    el.classList.add('counting');
    const start = Date.now();
    const dur = 900;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(tick);
      else {
        el.classList.remove('counting');
        el.classList.add('done');
      }
    };
    tick();
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', animateCountersOnLoad);
} else {
  animateCountersOnLoad();
}

/* =====================================================
   SCROLL INDICATOR — disparaît au premier scroll
   ===================================================== */
const indicator = document.querySelector('.scroll-indicator');
if (indicator) {
  window.addEventListener(
    'scroll',
    () => {
      indicator.style.opacity = '0';
      indicator.style.transition = 'opacity 400ms ease';
    },
    { passive: true, once: true },
  );
}

/* =====================================================
   Sticky CTA + parallaxe + flash aurora: désactivés (zéro scroll)
   ===================================================== */
