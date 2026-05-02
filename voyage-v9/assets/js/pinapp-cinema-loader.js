/**
 * PR-H · lazy vidéo contact + compteurs comparatif + donut + reveal-up fallback
 */
(function () {
  'use strict';

  function prefersReduced() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  /* Lazy vidéo #contact */
  if (!prefersReduced()) {
    var v = document.querySelector('[data-lazy-video]');
    if (v && 'IntersectionObserver' in window) {
      var ioV = new IntersectionObserver(
        function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              try {
                v.load();
              } catch (e1) {}
              var p = v.play();
              if (p && typeof p.catch === 'function') p.catch(function () {});
              ioV.disconnect();
              break;
            }
          }
        },
        { rootMargin: '200px', threshold: 0.01 },
      );
      ioV.observe(v);
    }
  }

  /* Compteurs [data-counter] */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    function animateCounter(el) {
      var raw = el.getAttribute('data-counter') || '0';
      var target = parseInt(raw, 10);
      if (isNaN(target)) return;
      var start = performance.now();
      var dur = 1200;
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.floor(target * eased));
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = String(target);
      }
      requestAnimationFrame(tick);
    }
    var ioC = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            animateCounter(en.target);
            ioC.unobserve(en.target);
          }
        });
      },
      { threshold: 0.45 },
    );
    counters.forEach(function (c) {
      ioC.observe(c);
    });
  }

  /* Donut draw (opacity) */
  var donut = document.querySelector('.comparatif-donut');
  if (donut && 'IntersectionObserver' in window) {
    var ioD = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            donut.classList.add('is-drawn');
            ioD.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    ioD.observe(donut);
  } else if (donut) {
    donut.classList.add('is-drawn');
  }

  /* reveal-up : Safari / sans animation-timeline: view() */
  try {
    if (!CSS.supports('(animation-timeline: view())')) {
      var els = document.querySelectorAll('.reveal-up');
      if (els.length && 'IntersectionObserver' in window) {
        var ioR = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) {
                en.target.classList.add('reveal-up--in');
                ioR.unobserve(en.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
        );
        els.forEach(function (el) {
          ioR.observe(el);
        });
      }
    }
  } catch (e2) {}
})();
