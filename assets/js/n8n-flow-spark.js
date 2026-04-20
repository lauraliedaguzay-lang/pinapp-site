/**
 * V4.0 — SVG spark along curved paths (vanilla rAF).
 * Polish: ease-out cubic motion, position trail, node pulse, activation delay.
 */
(function () {
  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function sober() {
    return document.documentElement.classList.contains('voyage-sober');
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var flow = document.querySelector('.n8n-flow');
    if (!flow || reducedMotion() || sober()) return;

    var paths = Array.prototype.slice.call(flow.querySelectorAll('.n8n-path'));
    var spark = flow.querySelector('.n8n-spark');
    var trails = Array.prototype.slice.call(flow.querySelectorAll('.n8n-spark-trail'));
    var nodes = flow.querySelectorAll('.n8n-node');
    var trigger = flow.querySelector('.n8n-trigger');
    if (!spark || !paths.length) return;

    var pathIdx = 0;
    var raf = 0;
    var playedOnce = false;
    var posHistory = [];

    function setNodeActive(i) {
      nodes.forEach(function (n, idx) {
        n.classList.toggle('is-active', i >= 0 && idx === i);
      });
    }

    function animatePath(path, onDone) {
      var length = 0;
      try {
        length = path.getTotalLength();
      } catch (e) {
        length = 400;
      }
      var duration = 920;
      var start = performance.now();
      posHistory = [];

      function step(now) {
        var raw = Math.min(1, (now - start) / duration);
        var t = easeOutCubic(raw);
        var pt;
        try {
          pt = path.getPointAtLength(length * t);
        } catch (e2) {
          if (onDone) onDone();
          return;
        }
        spark.setAttribute('cx', String(pt.x));
        spark.setAttribute('cy', String(pt.y));
        posHistory.unshift({ x: pt.x, y: pt.y });
        if (posHistory.length > trails.length + 4) {
          posHistory.length = trails.length + 4;
        }
        trails.forEach(function (el, idx) {
          var h = posHistory[idx + 1];
          if (h) {
            el.setAttribute('cx', String(h.x));
            el.setAttribute('cy', String(h.y));
          }
        });
        if (raw >= 1) {
          if (onDone) onDone();
          return;
        }
        raf = requestAnimationFrame(step);
      }

      spark.classList.add('is-running');
      trails.forEach(function (el) {
        el.classList.add('is-running');
      });
      window.setTimeout(function () {
        raf = requestAnimationFrame(step);
      }, 100);
    }

    function next() {
      if (pathIdx >= paths.length) {
        spark.classList.remove('is-running');
        trails.forEach(function (el) {
          el.classList.remove('is-running');
        });
        setNodeActive(-1);
        pathIdx = 0;
        return;
      }
      var p = paths[pathIdx];
      setNodeActive(pathIdx);
      animatePath(p, function () {
        if (nodes[pathIdx + 1]) setNodeActive(pathIdx + 1);
        pathIdx += 1;
        next();
      });
    }

    function runFlow() {
      if (raf) cancelAnimationFrame(raf);
      pathIdx = 0;
      posHistory = [];
      nodes.forEach(function (n) {
        n.classList.remove('is-active');
      });
      next();
    }

    if (trigger) {
      trigger.addEventListener('click', runFlow);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (ents) {
          ents.forEach(function (en) {
            if (!en.isIntersecting || playedOnce) return;
            playedOnce = true;
            window.setTimeout(runFlow, 600);
            io.disconnect();
          });
        },
        { threshold: 0.55 }
      );
      io.observe(flow);
    }
  });
})();
