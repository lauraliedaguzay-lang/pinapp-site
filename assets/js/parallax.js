/* PINAPP — parallax.js
   Conformité zero-scroll Pinapp : pas de parallaxe liée au scroll. */

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
