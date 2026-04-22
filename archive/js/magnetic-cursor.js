/**
 * Pinapp V3.0 Phase 2 — subtle magnetic pull on CTAs (desktop + motion ok).
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
  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  function bind(el) {
    var bounds;
    function onEnter() {
      bounds = el.getBoundingClientRect();
    }
    function onMove(e) {
      if (!bounds) bounds = el.getBoundingClientRect();
      var cx = bounds.left + bounds.width / 2;
      var cy = bounds.top + bounds.height / 2;
      var dx = (e.clientX - cx) * 0.25;
      var dy = (e.clientY - cy) * 0.25;
      var maxOffset = 8;
      gsap.to(el, {
        x: clamp(dx, -maxOffset, maxOffset),
        y: clamp(dy, -maxOffset, maxOffset),
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    }
    function onLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
    }
    el.addEventListener('mouseenter', onEnter, { passive: true });
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
  }

  function boot() {
    if (!mqHover.matches || mqReduce.matches) return;
    if (typeof gsap === 'undefined') return;
    if (document.documentElement.classList.contains('voyage-sober')) return;
    var SELECTOR = '.btn, .voyage-site-header__nav a, #chapter-skip-nav a, [data-magnetic]';
    document.querySelectorAll(SELECTOR).forEach(bind);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }
})();
