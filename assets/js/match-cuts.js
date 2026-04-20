/**
 * Pinapp V3.0 Phase 2 — match-cut shape on programmatic chapter jumps (click nav).
 * No scroll-driven animation; GSAP timeline only.
 */
(function () {
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function sober() {
    return document.documentElement.classList.contains('voyage-sober');
  }

  function ensureSvg() {
    var existing = document.getElementById('cinema-shape');
    if (existing) return existing;
    var wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wrap.setAttribute('id', 'cinema-shape');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('viewBox', '0 0 100 100');
    wrap.setAttribute('preserveAspectRatio', 'none');
    wrap.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100052;opacity:0';
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('id', 'shape-circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '0');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'var(--cyan-glow)');
    circle.setAttribute('stroke-width', '0.15');
    wrap.appendChild(circle);
    document.body.appendChild(wrap);
    return wrap;
  }

  function sectionCenter(id) {
    var el = document.getElementById(id);
    if (!el) return { x: 50, y: 50, r: 8 };
    var r = el.getBoundingClientRect();
    var w = window.innerWidth || 1;
    var h = window.innerHeight || 1;
    var cx = ((r.left + r.width / 2) / w) * 100;
    var cy = ((r.top + r.height / 2) / h) * 100;
    var rad = (Math.min(r.width, r.height) / Math.min(w, h)) * 50 * 0.35;
    return { x: cx, y: cy, r: Math.max(2, Math.min(rad, 22)) };
  }

  /** Scene-specific anchor hints (percent of viewport). */
  function anchorFor(id) {
    var map = {
      s1: '#holo-presentation-trigger',
      s2: '#s2 .pilote:first-of-type',
      s3: '#s3 .voyage-scene__inner',
      s4: '#s4 .voyage-constel',
      s5: '#s5 .voyage-split',
      s5b: '#automation-demo',
      s6: '#voyage-s6-manifest',
      s7: '#s7 .voyage-spiral',
      s8: '#form-diagnostic',
    };
    var sel = map[id];
    if (sel) {
      try {
        var n = document.querySelector(sel);
        if (n) {
          var b = n.getBoundingClientRect();
          var w = window.innerWidth || 1;
          var h = window.innerHeight || 1;
          var cx = ((b.left + b.width / 2) / w) * 100;
          var cy = ((b.top + b.height / 2) / h) * 100;
          var rad =
            id === 's6'
              ? 1.2
              : id === 's8'
                ? 3
                : Math.max(4, (Math.min(b.width, b.height) / Math.min(w, h)) * 45);
          return { x: cx, y: cy, r: rad };
        }
      } catch (e) {}
    }
    return sectionCenter(id);
  }

  function setViewBox(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
  }

  function run(fromId, toId, onMid, onDone) {
    if (reduced || sober()) {
      if (onMid) onMid();
      if (onDone) onDone();
      return;
    }
    var svg = ensureSvg();
    setViewBox(svg);
    var circle = svg.querySelector('#shape-circle');
    if (!circle || typeof gsap === 'undefined') {
      if (onMid) onMid();
      if (onDone) onDone();
      return;
    }

    var a0 = anchorFor(fromId);
    var a1 = anchorFor(toId);
    circle.setAttribute('stroke', 'var(--cyan-glow)');
    if (fromId === 's6' || toId === 's6') {
      circle.setAttribute('stroke', 'var(--gold-primary)');
    }

    gsap.set(svg, { opacity: 1 });
    gsap.set(circle, { attr: { cx: a0.x, cy: a0.y, r: a0.r * 0.2 } });

    var tl = gsap.timeline({
      onComplete: function () {
        gsap.to(svg, {
          opacity: 0,
          duration: 0.25,
          onComplete: function () {
            if (onDone) onDone();
          },
        });
      },
    });
    tl.to(circle, { attr: { cx: 50, cy: 50, r: Math.max(a0.r, a1.r, 12) }, duration: 0.2, ease: 'power2.inOut' }, 0);
    tl.add(
      function () {
        if (onMid) onMid();
      },
      0.6
    );
    tl.to(circle, { attr: { cx: a1.x, cy: a1.y, r: a1.r }, duration: 0.28, ease: 'power2.inOut' }, 0.62);
    tl.to(circle, { attr: { r: 0 }, duration: 0.2, ease: 'power2.in' }, '+=0.02');
  }

  window.__PINAPP_MATCHCUT__ = { run: run };
})();
