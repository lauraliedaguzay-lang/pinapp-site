/**
 * Lenis — smooth scroll ; ScrollTrigger.update si disponible ; désactivé si reduced motion.
 */
(function () {
  var LenisCtor = window.Lenis;
  if (!LenisCtor) return;

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}
  if (reduced) return;

  var lenis = new LenisCtor({ lerp: 0.1, smoothWheel: true });
  try {
    document.documentElement.classList.add('pp-lenis-smooth', 'lenis', 'lenis-smooth');
  } catch (e2) {}

  function raf(time) {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  }
  window.requestAnimationFrame(raf);

  lenis.on('scroll', function () {
    if (window.ScrollTrigger) {
      try {
        window.ScrollTrigger.update();
      } catch (e3) {}
    }
  });

  try {
    window.__PINAPP_LENIS__ = lenis;
  } catch (e4) {}
})();
