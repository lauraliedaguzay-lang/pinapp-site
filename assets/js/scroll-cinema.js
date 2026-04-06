/* PINAPP — scroll-cinema.js — Nav scroll, section reveal, counters, sticky CTA */

/* ── NAV : classe "scrolled" au scroll ── */
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── BARRE DE PROGRESSION ── */
const progressBar = document.getElementById('scrollProgress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? window.scrollY / h : 0;
    progressBar.style.transform = `scaleX(${p})`;
  }, { passive: true });
}

/* ── SECTION ENTER — révélation au scroll ── */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        sectionObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.section-enter')
    .forEach(el => sectionObs.observe(el));

  /* IMAGES REVEAL */
  const imgObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        imgObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.img-reveal')
    .forEach(img => imgObs.observe(img));
}

/* ── HERO LINES — délai de révélation échelonné ── */
document.querySelectorAll('.hero-line span').forEach((span, i) => {
  span.style.animationDelay = `${120 + i * 180}ms`;
});

/* ── COUNTERS — animation nombre au scroll ── */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const start    = Date.now();
    const duration = 1200;
    const tick = () => {
      const p    = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease);
      if (p < 1) requestAnimationFrame(tick);
    };
    tick();
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]')
  .forEach(el => countObs.observe(el));

/* ── STICKY CTA — apparaît après 30s ou 30% de scroll ── */
if (!location.pathname.includes('diagnostic')) {
  const stickyCTA = document.createElement('a');
  stickyCTA.href = '/diagnostic/';
  stickyCTA.setAttribute('aria-label', 'Diagnostic offert — 30 min');
  stickyCTA.textContent = 'Diagnostic offert — 30 min →';
  stickyCTA.style.cssText = [
    'position:fixed',
    'bottom:24px',
    'right:24px',
    'z-index:var(--z-sticky,10)',
    'padding:14px 28px',
    'background:var(--violet,#7B4FE8)',
    'color:#fff',
    'border-radius:100px',
    'text-decoration:none',
    'font-size:14px',
    'font-weight:500',
    'letter-spacing:-0.01em',
    'box-shadow:0 0 32px rgba(123,79,232,0.4)',
    'opacity:0',
    'transform:translateY(20px)',
    'transition:opacity 400ms ease,transform 400ms ease',
    'pointer-events:none',
  ].join(';');

  document.body.appendChild(stickyCTA);

  const showCTA = () => {
    stickyCTA.style.opacity = '1';
    stickyCTA.style.transform = 'translateY(0)';
    stickyCTA.style.pointerEvents = 'auto';
  };

  /* Apparaît après 30 secondes sur la page */
  const timer = setTimeout(showCTA, 30000);

  /* Ou dès que l'utilisateur a scrollé 30% */
  window.addEventListener('scroll', () => {
    if (window.scrollY / document.body.scrollHeight > 0.3) {
      clearTimeout(timer);
      showCTA();
    }
  }, { passive: true, once: true });
}
