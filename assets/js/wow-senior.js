/* WOW SENIOR — interactions "dev senior" (Pinapp)
   - Desktop uniquement (pointer fine) + respects prefers-reduced-motion
   - Pas d'effet lié au scroll
   - Pilotage via CSS variables: --tilt-x/--tilt-y + --shine-x/--shine-y
*/

(function () {
  'use strict';

  try {
    const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mqFine.matches || mqReduce.matches) return;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const targets = Array.prototype.slice.call(
      document.querySelectorAll('.card, .wow-surface, nav.nav'),
    );
    if (!targets.length) return;

    targets.forEach((el) => {
      el.classList.add('wow-tilt');

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const px = clamp((e.clientX - r.left) / r.width, 0, 1);
        const py = clamp((e.clientY - r.top) / r.height, 0, 1);

        // Tilt discret: -6deg..+6deg, inversé en Y pour "pousser" la lumière
        const max = 6;
        const ty = (px - 0.5) * (max * 2);
        const tx = (0.5 - py) * (max * 2);

        el.style.setProperty('--tilt-x', tx.toFixed(2) + 'deg');
        el.style.setProperty('--tilt-y', ty.toFixed(2) + 'deg');
        el.style.setProperty('--shine-x', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--shine-y', (py * 100).toFixed(1) + '%');
      };

      const onLeave = () => {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
        el.style.removeProperty('--shine-x');
        el.style.removeProperty('--shine-y');
      };

      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave, { passive: true });
    });
  } catch (e) {}
})();
