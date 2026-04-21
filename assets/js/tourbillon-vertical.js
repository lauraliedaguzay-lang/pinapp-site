/**
 * Pinapp V7 — Tourbillon Vertical Ascendant (signature Aladdin)
 * ────────────────────────────────────────────────────────────────
 * Référence : scène "A Whole New World" d'Aladdin 2019 — les lanternes
 * qui montent du bas vers le haut quand le tapis survole Agrabah.
 *
 * Chez Pinapp : particules dorées qui montent verticalement à l'entrée
 * de la section s6 Manifeste. Remplace les lanternes par des étoiles
 * poussière qui jaillissent du bas et se dissolvent en haut.
 *
 * Déclenchement : IntersectionObserver sur #s6, une seule fois au scroll-in
 * (puis optionnellement re-déclenchable si user remonte).
 *
 * Respect AVATAR : particules fines, 60 max, zéro lourdeur GPU.
 */
(function () {
  'use strict';

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function disabled() {
    return (
      reduced ||
      document.documentElement.classList.contains('voyage-sober') ||
      document.documentElement.classList.contains('low-perf')
    );
  }

  var canvas = null;
  var ctx = null;
  var particles = [];
  var rafId = null;
  var running = false;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(DPR, DPR);
  }

  function createParticle(offset) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    return {
      // Position initiale : bas du viewport avec dispersion horizontale
      x: w * 0.15 + Math.random() * w * 0.7,
      y: h + Math.random() * 200,
      // Vitesse verticale ascendante, légère drift horizontale
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.6 + Math.random() * 1.4),
      // Radius et glow
      r: 1 + Math.random() * 2.5,
      glow: 0.6 + Math.random() * 0.4,
      // Vie : 3-6 secondes
      life: 0,
      maxLife: 3000 + Math.random() * 3000,
      // Teinte or avec variation (biolumi subtle)
      hue: 42 + Math.random() * 12, // 42-54° = doré chaud
      birth: performance.now() + offset * 30
    };
  }

  function seedParticles() {
    particles = [];
    // 60 particules spawned avec stagger 30ms chacune
    for (var i = 0; i < 60; i++) {
      particles.push(createParticle(i));
    }
  }

  function render(ts) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
    var alive = 0;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (ts < p.birth) { alive++; continue; }
      p.life = ts - p.birth;
      if (p.life > p.maxLife) continue;
      alive++;

      // Position update
      p.x += p.vx;
      p.y += p.vy;
      p.vy *= 0.998; // légère décélération = floating
      p.vx += (Math.random() - 0.5) * 0.05; // micro-drift turbulence

      // Alpha : fade-in 0-15%, stable 15-70%, fade-out 70-100%
      var t = p.life / p.maxLife;
      var alpha;
      if (t < 0.15) alpha = (t / 0.15) * p.glow;
      else if (t < 0.7) alpha = p.glow;
      else alpha = p.glow * (1 - (t - 0.7) / 0.3);

      // Dessin : cercle avec glow radial
      var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      gradient.addColorStop(0, 'hsla(' + p.hue + ', 70%, 70%, ' + alpha + ')');
      gradient.addColorStop(0.4, 'hsla(' + p.hue + ', 70%, 60%, ' + (alpha * 0.4) + ')');
      gradient.addColorStop(1, 'hsla(' + p.hue + ', 70%, 50%, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core point
      ctx.fillStyle = 'hsla(' + p.hue + ', 85%, 82%, ' + alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    if (alive > 0 && running) {
      rafId = requestAnimationFrame(render);
    } else {
      stop();
    }
  }

  function start() {
    if (running) return;
    if (disabled()) return;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'tourbillon-vertical';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d', { alpha: true });
      resize();
      window.addEventListener('resize', resize, { passive: true });
    }
    seedParticles();
    running = true;
    canvas.classList.add('is-active');
    rafId = requestAnimationFrame(render);
  }

  function stop() {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (canvas) canvas.classList.remove('is-active');
  }

  function boot() {
    if (disabled()) return;
    var s6 = document.getElementById('s6');
    if (!s6) return;

    // IntersectionObserver : déclenche à l'entrée de s6 (35% visible)
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            start();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(s6);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Cleanup au unload
  window.addEventListener('beforeunload', function () {
    stop();
  }, { passive: true });
})();
