/**
 * V5.0 — lazy-activate background videos (data-lazy-video) when near viewport.
 */
(function () {
  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function reducedData() {
    try {
      return window.matchMedia('(prefers-reduced-data: reduce)').matches;
    } catch (e2) {
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.querySelectorAll('video[data-lazy-video]');
    if (!list.length) return;

    if (reducedData()) {
      list.forEach(function (v) {
        try {
          v.removeAttribute('autoplay');
        } catch (e) {}
      });
      return;
    }

    if (!('IntersectionObserver' in window) || reducedMotion()) {
      list.forEach(function (v) {
        try {
          v.preload = 'auto';
          v.load();
          v.play().catch(function () {});
        } catch (e3) {}
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
          } catch (e4) {}
          io.unobserve(v);
        });
      },
      { rootMargin: '200% 0px 0px 0px', threshold: 0.01 }
    );

    list.forEach(function (v) {
      io.observe(v);
    });
  });
})();
