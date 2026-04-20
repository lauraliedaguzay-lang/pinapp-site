/**
 * P8 — n8n workflow cinéma (#automation-demo): SVG + canvas + GSAP.
 */
(function () {
  var root = document.getElementById('automation-demo');
  var path = root ? root.querySelector('[data-auto-path]') : null;
  var canvas = root ? root.querySelector('[data-auto-particle-canvas]') : null;
  var nodes = root ? root.querySelectorAll('[data-auto-node]') : [];
  var btn = document.querySelector('[data-auto-simulate]');
  var statusEl = document.querySelector('[data-auto-status]');
  var timerEl = document.querySelector('[data-auto-timer]');

  var steps = [
    { msg: 'Lead entrant…' },
    { msg: 'IA qualifie le score…' },
    { msg: 'CRM enrichi…' },
    { msg: "Slack notifie l'équipe…" },
    { msg: 'Devis PDF généré…' },
    { msg: 'Cal.com verrouillé — terminé.' },
  ];

  var pathLen = 0;
  var particles = [];
  var particleRaf = 0;
  var loopTimer = 0;
  var running = false;

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

  function lowPerf() {
    return document.documentElement.classList.contains('low-perf');
  }

  function noFx() {
    return reducedMotion() || sober() || lowPerf();
  }

  function resizeCanvas() {
    if (!root || !canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = root.getBoundingClientRect();
    var w = Math.max(1, Math.floor(r.width * dpr));
    var h = Math.max(1, Math.floor(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: r.width, h: r.height };
  }

  function initParticles() {
    if (!path || noFx()) return;
    try {
      pathLen = path.getTotalLength();
    } catch (e) {
      pathLen = 600;
    }
    particles = [];
    var i;
    for (i = 0; i < 12; i++) {
      particles.push({ offset: (i / 12) * pathLen, speed: pathLen / 2.8 });
    }
  }

  function drawParticles() {
    if (!root || noFx() || !particles.length || !path) return;
    var dim = resizeCanvas();
    if (!dim) return;
    var ctx = dim.ctx;
    ctx.clearRect(0, 0, dim.w, dim.h);
    var svg = root.querySelector('.auto-cine__svg');
    if (!svg) return;
    var sr = svg.getBoundingClientRect();
    var rr = root.getBoundingClientRect();
    var j;
    for (j = 0; j < particles.length; j++) {
      var p = particles[j];
      p.offset += p.speed / 60;
      if (p.offset > pathLen) p.offset -= pathLen;
      var pt;
      try {
        pt = path.getPointAtLength(p.offset);
      } catch (e2) {
        continue;
      }
      var px = sr.left - rr.left + (pt.x / 960) * sr.width;
      var py = sr.top - rr.top + (pt.y / 200) * sr.height;
      ctx.fillStyle = 'rgba(232,184,100,0.55)';
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    particleRaf = window.requestAnimationFrame(drawParticles);
  }

  function stopParticles() {
    if (particleRaf) {
      cancelAnimationFrame(particleRaf);
      particleRaf = 0;
    }
    if (canvas && canvas.getContext) {
      var d = resizeCanvas();
      if (d) d.ctx.clearRect(0, 0, d.w, d.h);
    }
  }

  function setLit(i) {
    nodes.forEach(function (n, idx) {
      n.classList.toggle('is-lit', idx === i);
    });
  }

  function setAllLit(on) {
    nodes.forEach(function (n) {
      n.classList.toggle('is-lit', !!on);
    });
  }

  function runReduced() {
    if (statusEl) statusEl.textContent = 'Mode sobre : séquence figée.';
    if (timerEl) timerEl.textContent = '1,2 s';
    setAllLit(true);
  }

  function animateTimer() {
    if (!timerEl) return;
    var start = null;
    var dur = 900;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var v = (p * 1.2).toFixed(1).replace('.', ',');
      timerEl.textContent = '0,0 s → ' + v + ' s';
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function runSequence(gsap, onDone) {
    if (running) return;
    running = true;
    if (statusEl) statusEl.textContent = '';
    animateTimer();

    if (path && pathLen > 0 && gsap) {
      try {
        path.style.strokeDasharray = String(pathLen);
        path.style.strokeDashoffset = String(pathLen);
        gsap.to(path, { strokeDashoffset: 0, duration: 1.8, ease: 'none' });
      } catch (e3) {}
    }

    var tl = gsap.timeline({
      onComplete: function () {
        running = false;
        setLit(-1);
        if (onDone) onDone();
      },
    });

    var k;
    for (k = 0; k < nodes.length; k++) {
      (function (idx) {
        tl.call(
          function () {
            setLit(idx);
            if (statusEl && steps[idx]) statusEl.textContent = steps[idx].msg;
          },
          null,
          idx * 0.2
        );
        tl.fromTo(
          nodes[idx].querySelector('.auto-cine__node-ring'),
          { transformOrigin: '50% 50%', scale: 0.88 },
          { scale: 1.06, duration: 0.55, ease: 'elastic.out(1, 0.45)' },
          idx * 0.2
        );
      })(k);
    }

    var iaFill = root.querySelector('[data-auto-ia-fill]');
    if (iaFill && gsap) {
      tl.fromTo(iaFill, { attr: { width: '0' } }, { attr: { width: '31' }, duration: 0.7, ease: 'power2.out' }, 0.25);
    }
    var crm = root.querySelector('[data-auto-crm-check]');
    if (crm && gsap) {
      tl.to(crm, { attr: { stroke: 'rgba(62,245,224,0.95)' }, duration: 0.35 }, 0.55);
    }
    var slack = root.querySelector('[data-auto-slack-bubble]');
    if (slack && gsap) {
      tl.fromTo(slack, { x: -10, opacity: 0.4 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.65);
    }
    var pdfFlash = root.querySelector('[data-auto-pdf-flash]');
    var pdfDrop = root.querySelector('[data-auto-pdf-drop]');
    if (pdfFlash && gsap) {
      tl.fromTo(pdfFlash, { fill: 'rgba(232,184,100,0)' }, { fill: 'rgba(232,184,100,0.45)', duration: 0.12, yoyo: true, repeat: 1 }, 0.85);
    }
    if (pdfDrop && gsap) {
      tl.to(pdfDrop, { attr: { opacity: 1 }, y: 4, duration: 0.4, ease: 'power2.out' }, 0.9);
    }
    var cal = root.querySelector('[data-auto-cal-lock]');
    if (cal && gsap) {
      tl.to(cal, { attr: { fill: 'rgba(62,245,224,0.35)' }, duration: 0.35 }, 1.05);
    }
  }

  function startLoop(gsap) {
    if (loopTimer) clearInterval(loopTimer);
    if (noFx()) return;
    loopTimer = window.setInterval(function () {
      if (typeof gsap !== 'undefined') runSequence(gsap, null);
    }, 12000);
  }

  function parseStat(card) {
    var strong = card.querySelector('strong');
    if (!strong) return null;
    var raw = (strong.textContent || '').trim();
    var mult = raw.indexOf('×') === 0;
    var body = mult ? raw.slice(1).trim() : raw;
    var n;
    var suffix = '';
    if (mult) {
      n = parseFloat(body.replace(/\s/g, ''));
    } else {
      var m = body.match(/^([\d.,]+)\s*(.*)$/);
      if (!m) return null;
      n = parseFloat(String(m[1]).replace(',', '.'));
      suffix = m[2] ? ' ' + m[2].trim() : '';
    }
    if (!isFinite(n)) return null;
    return { el: strong, target: n, suffix: suffix, mult: mult, original: raw };
  }

  function formatVal(v, mult) {
    if (mult) return '×' + Math.round(v);
    if (v < 10 && Math.abs(v - Math.round(v)) > 0.05) return String(v.toFixed(1)).replace('.', ',');
    return String(Math.round(v));
  }

  function runStatsCount() {
    var section = document.getElementById('s5b');
    if (!section || !('IntersectionObserver' in window)) return;
    var done = false;
    var io = new IntersectionObserver(
      function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting || done) return;
          done = true;
          var dur = 1400;
          var start = performance.now();
          var targets = [];
          document.querySelectorAll('.auto-stat-card').forEach(function (card, idx) {
            var p = parseStat(card);
            if (p) targets.push({ strong: p.el, target: p.target, suffix: p.suffix, mult: p.mult, original: p.original, idx: idx });
          });
          targets.forEach(function (t) {
            t.strong.textContent = t.mult ? '×0' : '0' + t.suffix;
            if (t.idx === 0) t.strong.style.color = 'rgba(220, 95, 110, 0.95)';
          });
          function tick(now) {
            var u = Math.min(1, (now - start) / dur);
            var ease = 1 - Math.pow(1 - u, 3);
            targets.forEach(function (t) {
              var cur = t.target * ease;
              t.strong.textContent = formatVal(cur, t.mult) + t.suffix;
              if (t.idx === 0) {
                var r = Math.round(220 - 220 * ease);
                var g = Math.round(95 + 130 * ease);
                var b = Math.round(110 + 100 * ease);
                t.strong.style.color = 'rgba(' + r + ',' + g + ',' + b + ',1)';
              }
              if (t.idx === 1) {
                var c2 = Math.round(100 + 120 * ease);
                t.strong.style.color = 'rgba(90,' + c2 + ',' + Math.round(200 + 40 * ease) + ',1)';
              }
            });
            if (u >= 1) {
              targets.forEach(function (t) {
                t.strong.textContent = t.original;
                t.strong.style.color = '';
              });
              return;
            }
            requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          io.disconnect();
        });
      },
      { threshold: 0.25 }
    );
    io.observe(section);
  }

  function boot() {
    if (!path) {
      runStatsCount();
      return;
    }
    if (path) {
      try {
        pathLen = path.getTotalLength();
        path.style.strokeDasharray = String(pathLen);
        path.style.strokeDashoffset = noFx() ? '0' : String(pathLen);
      } catch (e4) {}
    }

    if (noFx()) {
      runReduced();
      runStatsCount();
      return;
    }

    initParticles();
    drawParticles();

    var gsap = window.gsap;
    if (btn) {
      btn.addEventListener('click', function () {
        if (!gsap) return;
        runSequence(gsap, null);
      });
    }

    if (gsap) {
      runSequence(gsap, function () {
        startLoop(gsap);
      });
    }

    nodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        node.classList.add('is-hover');
      });
      node.addEventListener('mouseleave', function () {
        node.classList.remove('is-hover');
      });
      node.addEventListener('focusin', function () {
        node.classList.add('is-hover');
      });
      node.addEventListener('focusout', function () {
        node.classList.remove('is-hover');
      });
    });

    runStatsCount();
  }

  document.addEventListener('DOMContentLoaded', function () {
    boot();
  });

  window.addEventListener(
    'resize',
    function () {
      if (!noFx()) initParticles();
    },
    { passive: true }
  );
})();
