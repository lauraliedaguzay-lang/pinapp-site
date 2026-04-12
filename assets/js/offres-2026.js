/**
 * Pinapp Studio — page Offres 2026 (vanilla)
 */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  function isDarkScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function initParticles() {
    var canvas = doc.getElementById('particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var COLORS = ['#00E5B0', '#00E5B0', '#B388FF', '#B388FF', '#7FFFEA', '#E040FB'];
    var particles = [];
    var animId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initParts() {
      particles = Array.from({ length: 72 }, function () {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 1,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          base: Math.random() * 0.15 + 0.05,
          offset: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.2,
        };
      });
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p, i) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        var op = p.base + Math.sin(t * 0.001 * p.speed + p.offset) * 0.08;
        ctx.globalAlpha = Math.min(1, op);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.globalAlpha = (1 - dist / 100) * 0.06;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1;
    }

    function loop(t) {
      draw(t);
      animId = requestAnimationFrame(loop);
    }

    function start() {
      if (!isDarkScheme()) {
        canvas.classList.remove('is-on');
        if (animId) cancelAnimationFrame(animId);
        animId = null;
        return;
      }
      canvas.classList.add('is-on');
      resize();
      initParts();
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(loop);
    }

    function stop() {
      canvas.classList.remove('is-on');
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    }

    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
      } else if (isDarkScheme()) {
        requestAnimationFrame(loop);
      }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (isDarkScheme()) start();
      else stop();
    });

    window.addEventListener(
      'resize',
      function () {
        if (!isDarkScheme()) return;
        resize();
        initParts();
      },
      { passive: true },
    );

    if (isDarkScheme()) start();
  }

  function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var cur = doc.getElementById('cursor');
    if (!cur) return;
    body.classList.add('has-custom-cursor');
    doc.addEventListener(
      'mousemove',
      function (e) {
        cur.style.left = e.clientX - 6 + 'px';
        cur.style.top = e.clientY - 6 + 'px';
      },
      { passive: true },
    );
    doc
      .querySelectorAll(
        'a, button, .card-2026, .btn-2026, .offre-card-2026, .stack-card-2026, .pack-2026, .offres-2026__tab',
      )
      .forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          cur.classList.add('hover');
        });
        el.addEventListener('mouseleave', function () {
          cur.classList.remove('hover');
        });
      });
  }

  function initNavAndProgress() {
    var nav = doc.getElementById('nav');
    var progress = doc.getElementById('progress');
    var lastY = 0;
    window.addEventListener(
      'scroll',
      function () {
        var y = window.scrollY;
        if (nav) {
          if (y > lastY && y > 80) nav.classList.add('nav-2026--hidden');
          else nav.classList.remove('nav-2026--hidden');
          lastY = y;
        }
        if (progress) {
          var max = doc.body.scrollHeight - window.innerHeight;
          var pct = max > 0 ? (y / max) * 100 : 0;
          progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
        }
      },
      { passive: true },
    );

    var burger = doc.querySelector('.nav-2026__burger');
    var drawer = doc.querySelector('.nav-2026__drawer');
    if (burger && drawer) {
      burger.addEventListener('click', function () {
        var open = drawer.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      });
    }
  }

  function initHeroParallax() {
    var imgs = doc.querySelectorAll('.hero-2026__bg-img');
    if (!imgs.length) return;
    window.addEventListener(
      'scroll',
      function () {
        var y = window.scrollY * 0.15;
        imgs.forEach(function (img) {
          img.style.setProperty('--parallax', y + 'px');
        });
      },
      { passive: true },
    );
  }

  function initScrollReveal() {
    var els = doc.querySelectorAll(
      '.section-2026 .anim-up, .section-2026 .anim-fade, .section-2026 .anim-scale',
    );
    if (!els.length) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var target = entry.target;
          var delayStr = target.style.getPropertyValue('--delay').trim() || '0ms';
          var ms = parseInt(delayStr, 10);
          if (isNaN(ms)) ms = 0;
          window.setTimeout(function () {
            target.classList.add('visible');
          }, ms);
          obs.unobserve(target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
    );
    els.forEach(function (el) {
      obs.observe(el);
    });
  }

  function initOffresTabs() {
    var tabs = doc.querySelectorAll('.offres-2026__tab');
    var ids = ['lauralie', 'micha', 'stacks'];
    var sections = ids.map(function (id) {
      return doc.getElementById(id);
    });
    if (!tabs.length) return;

    var offset = 120;

    function sectionTop(el) {
      if (!el) return 0;
      var r = el.getBoundingClientRect();
      return r.top + window.scrollY;
    }

    function setActiveByScroll() {
      var y = window.scrollY + offset;
      var active = 0;
      for (var i = 0; i < sections.length; i++) {
        var sec = sections[i];
        if (!sec) continue;
        if (y >= sectionTop(sec)) active = i;
      }
      tabs.forEach(function (tab, j) {
        tab.classList.toggle('active', j === active);
      });
    }

    window.addEventListener('scroll', setActiveByScroll, { passive: true });
    setActiveByScroll();

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        var href = tab.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        e.preventDefault();
        var target = doc.querySelector(href);
        if (!target) return;
        var top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    });
  }

  function boot() {
    initParticles();
    initCursor();
    initNavAndProgress();
    initHeroParallax();
    initScrollReveal();
    initOffresTabs();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
