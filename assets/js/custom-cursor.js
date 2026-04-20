/**
 * Pinapp V3.0 Phase 2 — contextual ring + label (desktop).
 */
(function () {
  var mqHover;
  var mqReduce;
  try {
    mqHover = window.matchMedia('(hover: hover)');
    mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  } catch (e) {
    return;
  }
  function boot() {
    if (!mqHover.matches || mqReduce.matches) return;
    if (typeof gsap === 'undefined') return;
    if (document.documentElement.classList.contains('voyage-sober')) return;

  var ring = document.createElement('div');
  ring.id = 'cursor-ring';
  var label = document.createElement('div');
  label.id = 'cursor-label';
  document.body.appendChild(ring);
  document.body.appendChild(label);
  gsap.set(ring, { xPercent: -50, yPercent: -50 });

  var xTo = gsap.quickTo(ring, 'x', { duration: 0.15, ease: 'power3.out' });
  var yTo = gsap.quickTo(ring, 'y', { duration: 0.15, ease: 'power3.out' });
  var lxTo = gsap.quickTo(label, 'x', { duration: 0.12, ease: 'power3.out' });
  var lyTo = gsap.quickTo(label, 'y', { duration: 0.12, ease: 'power3.out' });

  function setLabel(text, on) {
    label.textContent = text || '';
    label.classList.toggle('is-on', !!on);
  }

  function pickZone(target) {
    if (!target || !target.closest) return { view: false, vimeo: false, discover: false };
    var t = target;
    if (t.closest('[data-cursor="view"]')) return { view: true, vimeo: false, discover: false };
    if (t.closest('iframe[src*="vimeo"]')) return { view: false, vimeo: true, discover: false };
    if (t.closest('.glass-card') && t.closest('img')) return { view: false, vimeo: false, discover: true };
    return { view: false, vimeo: false, discover: false };
  }

  document.addEventListener(
    'mousemove',
    function (e) {
      xTo(e.clientX);
      yTo(e.clientY);
      lxTo(e.clientX + 20);
      lyTo(e.clientY + 20);
      var z = pickZone(e.target);
      if (z.view) {
        ring.classList.add('hover-view');
        setLabel('Voir', true);
      } else if (z.vimeo) {
        ring.classList.add('hover-view');
        setLabel('Plein écran', true);
      } else if (z.discover) {
        ring.classList.add('hover-view');
        setLabel('Découvrir', true);
      } else {
        ring.classList.remove('hover-view');
        setLabel('', false);
      }
    },
    { passive: true }
  );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }
})();
