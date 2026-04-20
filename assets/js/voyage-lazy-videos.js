/**
 * V4.0 — lazy-activate background videos (s2–s8) when near viewport.
 */
(function () {
  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.querySelectorAll('video[data-lazy-video]');
    if (!list.length || !('IntersectionObserver' in window)) {
      list.forEach(function (v) {
        try {
          v.load();
          v.play().catch(function () {});
        } catch (e) {}
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var v = en.target;
          try {
            v.preload = 'auto';
            v.load();
            v.play().catch(function () {});
          } catch (e2) {}
          io.unobserve(v);
        });
      },
      { rootMargin: '200% 0px 0px 0px', threshold: 0.01 }
    );

    list.forEach(function (v) {
      if (reducedMotion()) {
        try {
          v.load();
          v.play().catch(function () {});
        } catch (e3) {}
        return;
      }
      io.observe(v);
    });
  });
})();
