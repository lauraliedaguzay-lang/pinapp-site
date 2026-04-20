/**
 * V4.0 — sand particles from constellation planet labels on first viewport entry.
 * Uses IntersectionObserver for timing only (read-only visibility), not scroll reveal of main content.
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

  function splitLabels() {
    document.querySelectorAll('.constellation-label').forEach(function (el) {
      if (el.getAttribute('data-sand-split')) return;
      var text = (el.textContent || '').trim();
      if (!text) return;
      el.setAttribute('data-sand-split', '1');
      el.setAttribute('aria-label', text);
      var frag = document.createDocumentFragment();
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        var span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        span.setAttribute('class', 'sand-char');
        span.textContent = ch === ' ' ? '\u00a0' : ch;
        frag.appendChild(span);
      }
      el.textContent = '';
      el.appendChild(frag);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (reducedMotion() || sober()) return;

    splitLabels();

    var canvas = document.createElement('canvas');
    canvas.className = 'sand-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:9997;width:100%;height:100%';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var running = false;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener(
      'resize',
      function () {
        resize();
      },
      { passive: true }
    );

    function emitFromRect(rect, colorRgb) {
      var n = 4;
      var j;
      for (j = 0; j < n; j++) {
        particles.push({
          x: rect.left + Math.random() * rect.width,
          y: rect.top + Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 0.8 + Math.random() * 1.2,
          size: 1 + Math.random() * 1.4,
          life: 1,
          color: colorRgb,
        });
      }
    }

    function tick() {
      if (!particles.length) {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.life -= 0.012;
        if (p.life <= 0) return false;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.life * 0.85 + ')';
        ctx.fill();
        return true;
      });
      requestAnimationFrame(tick);
    }

    function ensureTick() {
      if (!running && particles.length) {
        running = true;
        tick();
      }
    }

    function fadeChars(el) {
      var chars = el.querySelectorAll('.sand-char');
      chars.forEach(function (c, i) {
        window.setTimeout(function () {
          var r = c.getBoundingClientRect();
          emitFromRect(r, Math.random() > 0.3 ? '230,185,115' : '244,228,193');
          var op = parseFloat(c.getAttribute('data-sand-op') || '1');
          op = Math.max(0.2, op - 0.12);
          c.setAttribute('data-sand-op', String(op));
          c.style.opacity = String(op);
          ensureTick();
        }, i * 70);
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting || e.target.getAttribute('data-sand-done')) return;
            e.target.setAttribute('data-sand-done', '1');
            fadeChars(e.target);
          });
        },
        { threshold: 0.45 }
      );
      document.querySelectorAll('.constellation-label').forEach(function (el) {
        io.observe(el);
      });
    }
  });
})();
