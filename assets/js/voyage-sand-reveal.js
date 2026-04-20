/**
 * P3 — Sand reveal on chapter H2 (canvas 2D, IntersectionObserver).
 * Text in DOM unchanged; temporary canvas overlay. Max 3 concurrent runs.
 */
(function () {
  var GOLD = { r: 230, g: 185, b: 115 };
  var CYAN = { r: 62, g: 245, b: 224 };
  var MAX_ACTIVE = 3;
  var MAX_PARTICLES = 480;
  var PER_CHAR = 56;
  var activeCount = 0;

  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function disabled() {
    return (
      document.documentElement.classList.contains('voyage-sober') ||
      document.documentElement.classList.contains('low-perf')
    );
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function mixColor(t) {
    return {
      r: lerp(GOLD.r, CYAN.r, t),
      g: lerp(GOLD.g, CYAN.g, t),
      b: lerp(GOLD.b, CYAN.b, t),
    };
  }

  /** Build logical lines from h2 (handles <br>) */
  function linesFromH2(h2) {
    var lines = [''];
    var ch;
    for (ch = h2.firstChild; ch; ch = ch.nextSibling) {
      if (ch.nodeType === 3) {
        lines[lines.length - 1] += ch.textContent || '';
      } else if (ch.nodeType === 1 && String(ch.tagName || '').toLowerCase() === 'br') {
        lines.push('');
      }
    }
    return lines.map(function (ln) {
      return ln.replace(/\s+/g, ' ').trim();
    });
  }

  /** @returns {{rects:Array,width:number,height:number}|null} */
  function measureHeading(h2) {
    var cs = window.getComputedStyle(h2);
    var fz = parseFloat(cs.fontSize) || 32;
    var ff = cs.fontFamily || 'Geist, system-ui, sans-serif';
    var fw = cs.fontWeight || '600';
    var fs = cs.fontStyle || 'normal';
    var lines = linesFromH2(h2);
    if (!lines.length || (lines.length === 1 && !lines[0])) return null;
    var rects = [];
    var maxW = 0;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.font = fs + ' ' + fw + ' ' + fz + 'px ' + ff;
    var li;
    for (li = 0; li < lines.length; li++) {
      var line = lines[li];
      if (!line) continue;
      var x = 0;
      var y = li * fz * 1.18;
      var chars = Array.from(line);
      var ci;
      for (ci = 0; ci < chars.length; ci++) {
        var c = chars[ci];
        if (c === ' ') {
          x += ctx.measureText(' ').width;
          continue;
        }
        var gw = ctx.measureText(c).width;
        rects.push({ x: x, y: y, w: gw, h: fz * 0.92, phase: (li + ci) * 0.07 });
        x += gw;
      }
      maxW = Math.max(maxW, x);
    }
    if (!rects.length) return null;
    return {
      rects: rects,
      width: Math.ceil(maxW + 12),
      height: Math.ceil(lines.length * fz * 1.25 + 8),
    };
  }

  function buildParticles(rects) {
    var parts = [];
    var budget = MAX_PARTICLES;
    var ri;
    for (ri = 0; ri < rects.length && budget > 0; ri++) {
      var rect = rects[ri];
      var cx = rect.x + rect.w * 0.5;
      var cy = rect.y + rect.h * 0.5;
      var n = Math.min(PER_CHAR, budget);
      var i;
      for (i = 0; i < n; i++) {
        var ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        var dist = 24 + Math.random() * 36;
        parts.push({
          hx: cx,
          hy: cy,
          ex: cx + Math.cos(ang) * dist,
          ey: cy + Math.sin(ang) * dist,
          ph: rect.phase + i * 0.02,
        });
        budget--;
      }
    }
    return parts;
  }

  function runCanvas(h2, layout) {
    if (activeCount >= MAX_ACTIVE) return;
    activeCount++;
    h2.classList.add('sand-text', 'sand-text--ready');

    var wrap = document.createElement('span');
    wrap.className = 'sand-text__wrap';
    wrap.setAttribute('aria-hidden', 'true');
    var canvas = document.createElement('canvas');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(layout.width * dpr));
    canvas.height = Math.max(1, Math.floor(layout.height * dpr));
    canvas.style.width = layout.width + 'px';
    canvas.style.height = layout.height + 'px';
    wrap.appendChild(canvas);
    h2.insertBefore(wrap, h2.firstChild);

    var ctx = canvas.getContext('2d');
    if (!ctx) {
      activeCount--;
      wrap.remove();
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var particles = buildParticles(layout.rects);
    var start = performance.now();
    var DURATION = 1500;

    function frame(now) {
      var t = Math.min(1, (now - start) / DURATION);
      var pInspire = Math.min(1, t / 0.133);
      var pDisp = t <= 0.133 ? 0 : Math.min(1, (t - 0.133) / 0.467);
      var pReun = t <= 0.4 ? 0 : Math.min(1, (t - 0.4) / 0.533);
      var pSettle = t <= 0.933 ? 0 : Math.min(1, (t - 0.933) / 0.067);

      ctx.clearRect(0, 0, layout.width, layout.height);

      var colBase = mixColor(Math.min(1, pInspire + pReun * 0.85));
      var j;
      for (j = 0; j < particles.length; j++) {
        var pt = particles[j];
        var x;
        var y;
        var al;

        if (t < 0.133) {
          var e0 = easeOutQuart(pInspire);
          x = lerp(pt.hx, pt.ex, e0 * 0.45);
          y = lerp(pt.hy, pt.ey, e0 * 0.45);
          al = pInspire * 0.92;
        } else if (t < 0.4) {
          x = lerp(pt.hx + (pt.ex - pt.hx) * 0.45, pt.ex, easeOutQuart(pDisp) * 0.55);
          y = lerp(pt.hy + (pt.ey - pt.hy) * 0.45, pt.ey, easeOutQuart(pDisp) * 0.55);
          x += Math.sin(pt.ph * 11 + t * 6) * 7 * (1 - pDisp * 0.6);
          y += Math.cos(pt.ph * 9 + t * 5) * 6 * (1 - pDisp * 0.6);
          al = 0.88;
        } else if (t < 0.933) {
          var e3 = easeOutQuart(pReun);
          x = lerp(pt.ex, pt.hx, e3);
          y = lerp(pt.ey, pt.hy, e3);
          al = 0.9;
        } else {
          x = pt.hx;
          y = pt.hy;
          al = 0.9 * (1 - pSettle);
        }

        ctx.fillStyle =
          'rgba(' +
          Math.round(colBase.r) +
          ',' +
          Math.round(colBase.g) +
          ',' +
          Math.round(colBase.b) +
          ',' +
          al +
          ')';
        ctx.beginPath();
        ctx.arc(x, y, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        wrap.remove();
        h2.classList.remove('sand-text--ready');
        h2.classList.add('sand-text--settled');
        activeCount--;
      }
    }
    requestAnimationFrame(frame);
  }

  function runFade(h2) {
    h2.classList.add('sand-text', 'sand-text--ready');
    h2.style.opacity = '0';
    window.requestAnimationFrame(function () {
      h2.style.transition = 'opacity 0.4s cubic-bezier(0.55, 0, 1, 0.45)';
      window.requestAnimationFrame(function () {
        h2.style.opacity = '1';
        window.setTimeout(function () {
          h2.classList.add('sand-text--settled');
          h2.style.transition = '';
          h2.style.opacity = '';
        }, 420);
      });
    });
  }

  function onHeading(h2) {
    if (h2.dataset.sandRevealDone) return;
    h2.dataset.sandRevealDone = '1';
    if (reducedMotion() || disabled()) {
      runFade(h2);
      return;
    }
    var layout = measureHeading(h2);
    if (!layout || !layout.rects.length) {
      runFade(h2);
      return;
    }
    runCanvas(h2, layout);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (disabled() && !reducedMotion()) return;
    var headings = document.querySelectorAll(
      '#voyage-main section.voyage-scene[data-chapter] > .chapter__content h2.h-1'
    );
    if (!headings.length) return;
    if (!('IntersectionObserver' in window)) {
      headings.forEach(function (h) {
        onHeading(h);
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) onHeading(en.target);
        });
      },
      { root: null, rootMargin: '0px 0px -35% 0px', threshold: 0 }
    );
    headings.forEach(function (h) {
      io.observe(h);
    });
  });
})();
