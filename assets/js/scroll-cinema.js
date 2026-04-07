/* PINAPP — scroll-cinema.js — v5
   Animations au scroll — tempo The Light Always Returns — 3.5s
   ================================================================= */

/* =====================================================
   NAV — glassmorphism au scroll
   ===================================================== */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

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
   IMAGES REVEAL
   ===================================================== */
const imgObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      imgObs.unobserve(e.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.img-reveal')
  .forEach(img => imgObs.observe(img));

/* =====================================================
   COMPTEURS — data-count
   ===================================================== */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    el.classList.add('counting');
    const start = Date.now();
    const dur   = 1400;
    const tick  = () => {
      const p    = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.remove('counting');
        el.classList.add('done');
      }
    };
    tick();
    countObs.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('[data-count]')
  .forEach(el => countObs.observe(el));

/* =====================================================
   SCROLL INDICATOR — disparaît au premier scroll
   ===================================================== */
const indicator = document.querySelector('.scroll-indicator');
if (indicator) {
  window.addEventListener('scroll', () => {
    indicator.style.opacity    = '0';
    indicator.style.transition = 'opacity 400ms ease';
  }, { passive: true, once: true });
}

/* =====================================================
   STICKY CTA — après 30s ou 30% de scroll
   (pas sur /diagnostic/ ni /offres/)
   ===================================================== */
const path = location.pathname;
if (!path.includes('diagnostic') && !path.includes('votre-projet')) {
  const stickyCTA       = document.createElement('a');
  // Détecter la profondeur pour le bon lien relatif
  const depth = (path.match(/\//g) || []).length - 1;
  const prefix = '../'.repeat(Math.max(0, depth));
  stickyCTA.href        = prefix + 'diagnostic/index.html';
  stickyCTA.className   = 'sticky-cta';
  stickyCTA.textContent = 'Démarrer ma demande →';
  document.body.appendChild(stickyCTA);

  const showCTA = () => stickyCTA.classList.add('visible');
  setTimeout(showCTA, 30000);
  window.addEventListener('scroll', () => {
    if (window.scrollY / document.body.scrollHeight > 0.30) showCTA();
  }, { passive: true, once: true });
}

/* =====================================================
   PARALLAXE 3 COUCHES — desktop + prefers-reduced-motion
   ===================================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.innerWidth >= 1024 && !prefersReducedMotion) {
  const canvas    = document.querySelector('#pandora-canvas');
  const orbs      = document.querySelectorAll('.aurora-orb');
  const shapes    = document.querySelectorAll('.pandora-shape');
  let   ticking   = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (canvas)
        canvas.style.transform = `translateY(${y * 0.06}px)`;
      orbs.forEach(o =>
        o.style.transform = `translateY(${y * -0.03}px)`);
      shapes.forEach(s =>
        s.style.transform = `translateY(${y * -0.05}px) rotate(${y * 0.01}deg)`);
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* =====================================================
   FLASH AURORA — transition entre pages
   ===================================================== */
document.querySelectorAll('a[href]').forEach(link => {
  const url = link.getAttribute('href');
  if (!url || url.startsWith('http') ||
      url.startsWith('#') || url.startsWith('mailto'))
    return;
  link.addEventListener('click', () => {
    if (prefersReducedMotion) return;  /* respecter accessibilité */
    const canvas = document.querySelector('#pandora-canvas');
    if (!canvas) return;
    const jour = document.body.classList.contains('mode-jour');
    canvas.style.transition = 'opacity 180ms ease';
    canvas.style.opacity    = jour ? '0.55' : '0.45';
    setTimeout(() => {
      canvas.style.opacity = jour ? '0.32' : '0.22';
    }, 200);
  });
});
