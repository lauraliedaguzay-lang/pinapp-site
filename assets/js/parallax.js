/* PINAPP — parallax.js — Parallaxe 3 couches + flash aurora (desktop ≥1024px) */

/* Pinapp : règle « zéro scroll » — pas de décor lié au scroll.
   On garde ce fichier pour compat, mais il est neutralisé. */
/* eslint-disable no-useless-return */
if (true) {
  // Désactivé volontairement
  // (conserver le fichier évite de devoir repatcher toutes les pages immédiatement)
  return;
}

/* ── Parallaxe scroll ── */
if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = window.scrollY;

        /* Couche 1 — canvas aurora : bouge doucement */
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.style.transform = `translateY(${y * 0.08}px)`;

        /* Couche 2 — particules bioluminescentes : remontent légèrement */
        document.querySelectorAll('.pinapp-particle').forEach((p) => {
          p.style.transform = `translateY(${y * -0.04}px)`;
        });

        /* Couche 3 — grille holographique : glisse très lentement */
        const grid = document.querySelector('.holo-grid');
        if (grid) grid.style.transform = `translateY(${y * 0.02}px)`;

        ticking = false;
      });
      ticking = true;
    },
    { passive: true },
  );
}

/* ── Flash aurora au changement de page (desktop) ── */
document.querySelectorAll('a[href]').forEach((link) => {
  const url = link.getAttribute('href');
  if (!url) return;
  if (url.startsWith('http') || url.startsWith('#') || url.startsWith('mailto')) return;

  link.addEventListener('click', () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const jour = document.body.classList.contains('mode-jour');
    const peak = jour ? '0.55' : '0.45';
    const base = jour ? '0.32' : '0.22';
    canvas.style.transition = 'opacity 180ms ease';
    canvas.style.opacity = peak;
    setTimeout(() => {
      canvas.style.opacity = base;
    }, 200);
  });
});
