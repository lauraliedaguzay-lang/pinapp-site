(function () {
  'use strict';

  var html = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isLight() {
    return html.getAttribute('data-theme') === 'light';
  }

  function setThemeAria(btn, light) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', light ? 'true' : 'false');
    btn.setAttribute(
      'aria-label',
      light ? 'Mode jour actif — passer en nuit' : 'Mode nuit actif — passer en jour',
    );
  }

  function readStoredTheme() {
    var s =
      localStorage.getItem('pinapp-theme') ||
      localStorage.getItem('theme') ||
      localStorage.getItem('pinapp-vitrine-theme');
    if (!s) return 'dark';
    var v = String(s).toLowerCase();
    if (v === 'light' || v === 'jour') return 'light';
    return 'dark';
  }

  function persistTheme(scheme) {
    try {
      localStorage.setItem('pinapp-theme', scheme);
      localStorage.setItem('theme', scheme);
      localStorage.removeItem('pinapp-vitrine-theme');
    } catch (e) {}
  }

  function initTheme() {
    var scheme = readStoredTheme();
    html.setAttribute('data-theme', scheme);
    document.body.classList.toggle('day', scheme === 'light');
    var legacy = document.getElementById('themeToggle') || document.getElementById('ppTheme');
    setThemeAria(legacy, scheme === 'light');

    function applyClick() {
      var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      document.body.classList.toggle('day', next === 'light');
      persistTheme(next);
      setThemeAria(legacy, next === 'light');
      document.querySelectorAll('.pp-theme-toggle').forEach(function (b) {
        b.textContent = next === 'dark' ? '☀️' : '🌙';
      });
      window.dispatchEvent(new Event('resize'));
      try {
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
      } catch (e) {}
    }

    if (!html.dataset.ppThemeScriptDeleg) {
      html.dataset.ppThemeScriptDeleg = '1';
      document.addEventListener(
        'click',
        function (e) {
          var t = e.target.closest && e.target.closest('.pp-theme-toggle');
          if (!t) return;
          if (window.PinappModeToggle) return;
          e.preventDefault();
          applyClick();
        },
        true,
      );
    }

    if (legacy) legacy.addEventListener('click', applyClick);

    document.querySelectorAll('.pp-theme-toggle').forEach(function (b) {
      b.textContent = scheme === 'dark' ? '☀️' : '🌙';
    });
  }

  function initNav() {
    var nav = document.getElementById('siteNav');
    /* Burger / tiroir : /assets/js/pinapp-burger-nuclear.js (évite les doubles listeners) */

    if (nav) {
      window.addEventListener(
        'scroll',
        function () {
          if (window.scrollY > 50) nav.classList.add('nav--scrolled');
          else nav.classList.remove('nav--scrolled');
        },
        { passive: true },
      );
    }
  }

  function initReveal() {
    if (prefersReduced.matches) {
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.1 },
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initSectionLightSweep() {
    if (prefersReduced.matches) return;
    var sections = document.querySelectorAll('main .section, main .story-block');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var sec = e.target;
          if (sec.dataset.sweepDone) return;
          sec.dataset.sweepDone = '1';
          sec.classList.add('section-light');
          window.setTimeout(function () {
            sec.classList.remove('section-light');
          }, 600);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  function initBgCanvas() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var stars = [];
    var flares = [];
    var nebulae = [];
    var rays = [
      { offset: 0, speed: 0.35, width: 1.2, len: 2.4 },
      { offset: 0.33, speed: 0.22, width: 1, len: 2.2 },
      { offset: 0.66, speed: 0.28, width: 1, len: 2.3 },
    ];
    var running = true;
    var t0 = performance.now();

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = window.innerWidth;
      var h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn(w, h);
    }

    function spawn(w, h) {
      var i;
      particles.length = 0;
      stars.length = 0;
      flares.length = 0;
      nebulae.length = 0;

      for (i = 0; i < 32; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() < 0.5 ? -1 : 1) * (0.12 + Math.random() * 0.22),
          vy: (Math.random() < 0.5 ? -1 : 1) * (0.12 + Math.random() * 0.22),
          r: 1.2 + Math.random() * 2.2,
          base: 0.05 + Math.random() * 0.09,
          phase: Math.random() * Math.PI * 2,
        });
      }

      var starCount = Math.min(220, Math.floor((w * h) / 9000) + 90);
      for (i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.36,
          r: 0.35 + Math.random() * 1.45,
          phase: Math.random() * Math.PI * 2,
          tw: 0.35 + Math.random() * 0.65,
          kind: Math.random() < 0.82 ? 0 : 1,
        });
      }
      if (isLight()) {
        var extra = Math.min(85, Math.floor((w * h) / 12000) + 40);
        for (i = 0; i < extra; i++) {
          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.26,
            r: 0.4 + Math.random() * 1.35,
            phase: Math.random() * Math.PI * 2,
            tw: 0.42 + Math.random() * 0.48,
            kind: Math.random() < 0.62 ? 1 : 0,
          });
        }
      }

      for (i = 0; i < 5; i++) {
        flares.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.min(w, h) * (0.28 + Math.random() * 0.22),
          phase: Math.random() * Math.PI * 2,
          spd: 0.14 + Math.random() * 0.12,
        });
      }

      for (i = 0; i < 5; i++) {
        nebulae.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 80 + Math.random() * 120,
          blur: 60 + Math.random() * 60,
          phase: Math.random() * Math.PI * 2,
          hue: i % 2 === 0 ? 'teal' : 'violet',
          opacity: 0.03 + Math.random() * 0.03,
        });
      }
    }

    function drawNebula(n, w, h, now) {
      var light = isLight();
      var col =
        n.hue === 'violet' || light
          ? 'rgba(196,181,253,' + n.opacity * (light ? 1.38 : 1) + ')'
          : 'rgba(0,229,176,' + n.opacity * (light ? 1.15 : 1) + ')';
      var driftX = Math.sin(now / 8000 + n.phase) * 0.8;
      var driftY = Math.cos(now / 9000 + n.phase) * 0.6;
      n.x += driftX * 0.1 + 0.02 * Math.sin(now / 4000 + n.phase);
      n.y += driftY * 0.1 + 0.02 * Math.cos(now / 5000 + n.phase);
      if (n.x < -n.r) n.x = w + n.r;
      if (n.x > w + n.r) n.x = -n.r;
      if (n.y < -n.r) n.y = h + n.r;
      if (n.y > h + n.r) n.y = -n.r;

      ctx.save();
      ctx.shadowBlur = n.blur;
      ctx.shadowColor = col;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawFlares(w, h, now, light, elapsed) {
      var i;
      var f;
      var t;
      var cx;
      var cy;
      ctx.save();
      ctx.globalCompositeOperation = light ? 'soft-light' : 'lighter';
      for (i = 0; i < flares.length; i++) {
        f = flares[i];
        t = (now / 1000) * f.spd + f.phase;
        cx = f.x + Math.sin(t) * w * 0.1;
        cy = f.y + Math.cos(t * 0.85) * h * 0.08;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, f.r);
        if (light) {
          g.addColorStop(0, 'rgba(200, 235, 255,' + (light ? 0.09 : 0.07) + ')');
          g.addColorStop(0.45, 'rgba(127,255,234,' + (light ? 0.05 : 0.04) + ')');
          g.addColorStop(1, 'rgba(0,0,0,0)');
        } else {
          g.addColorStop(
            0,
            'rgba(232,248,255,' + (0.05 + 0.02 * Math.sin(elapsed / 3500 + f.phase)) + ')',
          );
          g.addColorStop(
            0.42,
            'rgba(179,136,255,' + (0.045 + 0.015 * Math.sin(elapsed / 4200 + f.phase)) + ')',
          );
          g.addColorStop(1, 'rgba(0,0,0,0)');
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
    }

    function drawStars(w, h, elapsed, light, move) {
      var i;
      var s;
      var tw;
      var a;
      var col;
      for (i = 0; i < stars.length; i++) {
        s = stars[i];
        if (move) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < -3) s.x = w + 3;
          else if (s.x > w + 3) s.x = -3;
          if (s.y < -3) s.y = h + 3;
          else if (s.y > h + 3) s.y = -3;
        }
        tw = 0.52 + 0.48 * Math.sin(elapsed / (900 + s.phase * 120) + s.phase);
        a = s.tw * tw * (light ? 0.84 : 1);
        a = Math.min(light ? 0.7 : 0.95, a);
        col =
          s.kind === 1
            ? light
              ? 'rgba(160, 245, 255,'
              : 'rgba(0,229,176,'
            : light
              ? 'rgba(215, 248, 255,'
              : 'rgba(230,242,255,';
        ctx.fillStyle = col + a + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawRays(w, h, now) {
      var light = isLight();
      var alpha = light ? 0.038 : 0.026;
      var col = light ? '120,200,230' : '0,229,176';
      ctx.save();
      ctx.strokeStyle = 'rgba(' + col + ',' + alpha + ')';
      ctx.lineWidth = light ? 1.15 : 1;
      var i;
      for (i = 0; i < rays.length; i++) {
        var r = rays[i];
        var shift = ((now / 1000) * r.speed * 40 + r.offset * w) % (w * 2.5);
        var x0 = -w * 0.5 + shift;
        var y0 = -h * 0.2;
        var x1 = w * 1.5 + shift;
        var y1 = h * 1.2;
        ctx.beginPath();
        ctx.moveTo(x0, y0 + i * h * 0.25);
        ctx.lineTo(x1, y1 + i * h * 0.15);
        ctx.stroke();
      }
      ctx.restore();
    }

    function step(now) {
      if (!running) return;
      var w = window.innerWidth;
      var h = window.innerHeight;
      var elapsed = now - t0;
      var light = isLight();

      ctx.clearRect(0, 0, w, h);

      var i;
      for (i = 0; i < nebulae.length; i++) {
        drawNebula(nebulae[i], w, h, now);
      }

      drawFlares(w, h, now, light, elapsed);
      drawRays(w, h, now);

      drawStars(w, h, elapsed, light, true);

      for (i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > w) {
          p.x = w;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > h) {
          p.y = h;
          p.vy *= -1;
        }

        var pulse = 0.75 + 0.25 * Math.sin(elapsed / 2000 + p.phase);
        var base = p.base * (light ? 0.35 : 1);
        var a2 = Math.min(0.22, base * pulse);
        ctx.fillStyle = light ? 'rgba(196,181,253,' + a2 + ')' : 'rgba(0,229,176,' + a2 + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('visibilitychange', function () {
      running = document.visibilityState === 'visible' && !prefersReduced.matches;
      if (running) requestAnimationFrame(step);
    });

    if (!prefersReduced.matches) {
      requestAnimationFrame(step);
    } else {
      var w = window.innerWidth;
      var h = window.innerHeight;
      var once = performance.now();
      var light = isLight();
      var elapsed = once - t0;
      for (var j = 0; j < nebulae.length; j++) drawNebula(nebulae[j], w, h, once);
      drawFlares(w, h, once, light, elapsed);
      drawRays(w, h, once);
      drawStars(w, h, elapsed, light, false);
      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];
        ctx.fillStyle = light ? 'rgba(196,181,253,0.04)' : 'rgba(0,229,176,0.1)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function initHeroWords() {
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return;
    var words = document.querySelectorAll('.hero h1 .word');
    words.forEach(function (w, idx) {
      w.style.animationDelay = idx * 80 + 'ms';
    });
  }

  function initHeroTypewriter() {
    var el = document.querySelector('.hero__kicker--tw');
    if (!el || prefersReduced.matches) return;
    var text = el.textContent.trim();
    if (!text) return;
    var len = Math.max(1, text.length);
    el.style.setProperty('--tw-steps', String(len));
    el.style.setProperty('--tw-end', len + 'ch');
    el.setAttribute('aria-label', text);
  }

  function initHeroV6Fx() {
    if (prefersReduced.matches) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener(
        'mousemove',
        function (e) {
          var r = el.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2);
          var dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = 'translate(' + dx * 0.18 + 'px, ' + dy * 0.28 + 'px)';
        },
        { passive: true },
      );
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
    document.querySelectorAll('[data-bloom]').forEach(function (el) {
      el.addEventListener('click', function () {
        var bloom = document.createElement('div');
        bloom.className = 'pp-bloom';
        var r = el.getBoundingClientRect();
        bloom.style.left = r.left + r.width / 2 + 'px';
        bloom.style.top = r.top + r.height / 2 + 'px';
        document.body.appendChild(bloom);
        window.setTimeout(function () {
          bloom.remove();
        }, 2400);
      });
    });
    function setRadialGlowVars(el, e) {
      var r = el.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    }
    document.querySelectorAll('.hero-v6__cta-primary, .diag-v6__submit, .cta-magnetic').forEach(function (el) {
      el.addEventListener(
        'mousemove',
        function (e) {
          setRadialGlowVars(el, e);
        },
        { passive: true },
      );
      el.addEventListener('mouseleave', function () {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
    });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        var d = document.getElementById('diagnostic');
        if (d) {
          d.scrollIntoView({ behavior: 'auto', block: 'center' });
          var focusTarget = document.getElementById('diag-title') || d;
          try {
            focusTarget.focus({ preventScroll: true });
          } catch (err) {
            focusTarget.focus();
          }
        }
      }
    });
  }

  function initCursorHalo() {
    var layer = document.getElementById('heroCursor');
    var hero = document.querySelector('.hero');
    if (!layer || !hero) return;
    if (prefersReduced.matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    hero.addEventListener(
      'mousemove',
      function (e) {
        var rect = hero.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var core = isLight() ? 'rgba(196,181,253,0.08)' : 'rgba(0,229,176,0.08)';
        layer.style.background =
          'radial-gradient(circle 9.375rem at ' +
          x +
          'px ' +
          y +
          'px, ' +
          core +
          ', transparent 70%)';
      },
      { passive: true },
    );
  }

  function initChatDemo() {
    var root = document.getElementById('chatDemo');
    if (!root) return;
    var bubbles = root.querySelectorAll('.bubble');
    if (!bubbles.length) return;

    function play() {
      var delays = [500, 1500, 2800];
      bubbles.forEach(function (b, i) {
        window.setTimeout(
          function () {
            b.classList.add('is-on');
          },
          delays[i] != null ? delays[i] : 900 * i,
        );
      });
    }

    if (prefersReduced.matches) {
      bubbles.forEach(function (b) {
        b.classList.add('is-on');
      });
      return;
    }

    var demos = document.getElementById('demos');
    if (!demos || !('IntersectionObserver' in window)) {
      play();
      return;
    }
    var fired = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !fired) {
            fired = true;
            play();
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(demos);
  }

  function initCarousel(rootId) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var track = root.querySelector('.carousel__track');
    var slides = root.querySelectorAll('.carousel__slide');
    var dots = root.querySelectorAll('.carousel__dots button');
    if (!track || !slides.length) return;

    var index = 0;
    var startX = null;
    var timer = null;

    function go(n) {
      index = (n + slides.length) % slides.length;
      var pct = (-100 * index) / slides.length;
      track.style.transform = 'translateX(' + pct + '%)';
      dots.forEach(function (d, i) {
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
        d.tabIndex = i === index ? 0 : -1;
      });
    }

    function resetAutoplay() {
      if (timer) clearInterval(timer);
      if (prefersReduced.matches) return;
      timer = window.setInterval(function () {
        go(index + 1);
      }, 4000);
    }

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        go(i);
        resetAutoplay();
      });
    });

    track.addEventListener(
      'touchstart',
      function (e) {
        startX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );
    track.addEventListener(
      'touchend',
      function (e) {
        if (startX == null) return;
        var dx = e.changedTouches[0].screenX - startX;
        startX = null;
        if (Math.abs(dx) < 40) return;
        if (dx > 0) go(index - 1);
        else go(index + 1);
        resetAutoplay();
      },
      { passive: true },
    );

    go(0);
    resetAutoplay();

    root.addEventListener('mouseenter', function () {
      if (timer) clearInterval(timer);
      timer = null;
    });
    root.addEventListener('mouseleave', function () {
      resetAutoplay();
    });
  }

  function bumpGlows() {
    document.querySelectorAll('.ellipses__b').forEach(function (el) {
      var base = el.classList.contains('ellipses__b--1')
        ? 0.05
        : el.classList.contains('ellipses__b--2')
          ? 0.04
          : 0.03;
      var v = Math.min(0.12, base + 0.01);
      el.style.opacity = String(v);
      window.setTimeout(function () {
        el.style.opacity = '';
      }, 450);
    });
    var shell = document.querySelector('.contact-shell');
    if (shell) {
      var g = parseFloat(getComputedStyle(shell).getPropertyValue('--contact-glow')) || 0.02;
      shell.style.setProperty('--contact-glow', String(Math.min(0.12, g + 0.01)));
    }
  }

  function initContactGlowChoices() {
    var contact = document.getElementById('contact');
    if (!contact) return;
    contact.addEventListener('change', function (e) {
      var t = e.target;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.type === 'checkbox' || t.type === 'radio') bumpGlows();
    });
  }

  function initContact() {
    var tablist = document.querySelector('#contact [role="tablist"]');
    if (!tablist) return;
    var tabs = tablist.querySelectorAll('[role="tab"]');
    var panels = document.querySelectorAll('#contact [role="tabpanel"]');

    function activate(id) {
      tabs.forEach(function (t) {
        var sel = t.id === id;
        t.setAttribute('aria-selected', sel ? 'true' : 'false');
        t.tabIndex = sel ? 0 : -1;
      });
      panels.forEach(function (p) {
        var on = p.getAttribute('aria-labelledby') === id;
        p.hidden = !on;
        if (on) resetPanel(p);
      });
      var shell = document.querySelector('.contact-shell');
      if (shell) shell.style.setProperty('--contact-glow', '0.02');
    }

    function resetPanel(panel) {
      panel.querySelectorAll('.step').forEach(function (s, idx) {
        s.classList.toggle('is-active', idx === 0);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(tab.id);
      });
    });

    panels.forEach(function (panel) {
      bindWizard(panel);
    });

    function bindWizard(panel) {
      var steps = panel.querySelectorAll('.step');
      var mail = 'mailto:contact@pinapp.fr';

      function activeStep() {
        for (var i = 0; i < steps.length; i++) {
          if (steps[i].classList.contains('is-active')) return steps[i];
        }
        return steps[0];
      }

      function goTo(n) {
        steps.forEach(function (s, idx) {
          s.classList.toggle('is-active', idx === n);
        });
      }

      function validateStep(step) {
        var valid = true;
        step.querySelectorAll('input[required], textarea[required]').forEach(function (inp) {
          if (inp.type === 'radio' || inp.type === 'checkbox') return;
          if (!inp.checkValidity()) valid = false;
        });
        step.querySelectorAll('textarea[minlength], input[minlength]').forEach(function (inp) {
          if (inp.type === 'radio' || inp.type === 'checkbox') return;
          var m = parseInt(String(inp.getAttribute('minlength') || '0'), 10);
          if (m > 0 && (inp.value || '').trim().length < m) valid = false;
        });
        var radios = step.querySelectorAll('input[type="radio"][required]');
        var seen = {};
        radios.forEach(function (r) {
          seen[r.name] = true;
        });
        Object.keys(seen).forEach(function (name) {
          var ok = !!step.querySelector('input[type="radio"][name="' + name + '"]:checked');
          if (!ok) valid = false;
        });
        step.querySelectorAll('fieldset.js-require-one').forEach(function (fs) {
          var checks = fs.querySelectorAll('input[type="checkbox"]');
          if (!checks.length) return;
          var any = false;
          for (var i = 0; i < checks.length; i++) {
            if (checks[i].checked) any = true;
          }
          if (!any) valid = false;
        });
        return valid;
      }

      panel.addEventListener('click', function (e) {
        var t = e.target;
        if (!(t instanceof HTMLElement)) return;
        if (t.matches('[data-next]')) {
          var step = activeStep();
          if (!validateStep(step)) {
            var reqFs = step.querySelector('fieldset.js-require-one');
            if (reqFs) {
              var chks = reqFs.querySelectorAll('input[type="checkbox"]');
              var anyChk = false;
              for (var ci = 0; ci < chks.length; ci++) {
                if (chks[ci].checked) anyChk = true;
              }
              if (!anyChk && chks.length) {
                chks[0].setCustomValidity('Sélectionnez au moins une option.');
                chks[0].reportValidity();
                chks[0].setCustomValidity('');
                return;
              }
            }
            step.reportValidity();
            return;
          }
          bumpGlows();
          var idx = Array.prototype.indexOf.call(steps, step);
          if (idx < steps.length - 1) goTo(idx + 1);
        }
        if (t.matches('[data-back]')) {
          var step2 = activeStep();
          var idx2 = Array.prototype.indexOf.call(steps, step2);
          if (idx2 > 0) goTo(idx2 - 1);
        }
        if (t.matches('[data-submit]')) {
          e.preventDefault();
          var last = steps[steps.length - 1];
          if (!validateStep(last)) {
            last.reportValidity();
            return;
          }
          var body = buildBody(panel);
          window.location.href =
            mail +
            '?subject=' +
            encodeURIComponent(panel.dataset.subject || 'Demande Pinapp') +
            '&body=' +
            encodeURIComponent(body);
        }
      });
    }

    function labelForField(panel, field) {
      if (field.id) {
        var lb = panel.querySelector('label[for="' + field.id + '"]');
        if (lb && lb.textContent) return lb.textContent.replace(/\s+/g, ' ').trim();
      }
      if (field.type === 'radio' && field.checked) {
        var fs = field.closest('fieldset');
        if (fs) {
          var leg = fs.querySelector('legend');
          if (leg && leg.textContent) return leg.textContent.replace(/\s+/g, ' ').trim();
        }
      }
      return field.name || field.id || 'champ';
    }

    function buildBody(panel) {
      var lines = [];
      var label = panel.dataset.label || '';
      lines.push('=== DEMANDE PINAPP — BLOC POUR CLAUDE (copier-coller) ===');
      lines.push('Horodatage (navigateur) : ' + new Date().toISOString());
      lines.push('Canal : ' + label);
      lines.push('--- DONNEES ---');

      var byName = {};
      panel.querySelectorAll('input, textarea, select').forEach(function (field) {
        if (field.type === 'button' || field.type === 'submit') return;
        if (field.type === 'radio' && !field.checked) return;
        if (field.type === 'checkbox' && !field.checked) return;
        var nm = field.name || field.id || 'champ';
        var val = (field.value || '').trim();
        if (field.type === 'checkbox' && field.checked) val = field.value;
        if (!val) return;
        if (field.type === 'checkbox') {
          if (!byName[nm]) byName[nm] = [];
          byName[nm].push(val);
        } else {
          byName[nm] = val;
        }
      });

      Object.keys(byName).forEach(function (k) {
        var v = byName[k];
        var displayKey = k;
        if (Array.isArray(v)) {
          lines.push(displayKey + ' : ' + v.join(', '));
        } else {
          var sample = panel.querySelector(
            '[name="' + k.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"]',
          );
          if (!sample && k.indexOf(' ') === -1) sample = panel.querySelector('#' + k);
          if (sample && sample.id) {
            var lk = labelForField(panel, sample);
            if (lk && lk !== k) displayKey = lk;
          }
          lines.push(displayKey + ' : ' + v);
        }
      });

      lines.push('--- CONSIGNE POUR CLAUDE ---');
      lines.push(
        'À partir de DONNEES ci-dessus, produire : (1) résumé exécutif 5 phrases max ; (2) hypothèses et risques ; (3) questions de clarification numérotées ; (4) proposition de prochaine étape concrète (appel, audit, devis) avec priorité P0–P2.',
      );
      lines.push('');
      lines.push('Réponse à : contact@pinapp.fr');

      var body = lines.join('\n');
      var maxRaw = 1100;
      if (body.length > maxRaw) {
        body =
          body.slice(0, maxRaw) +
          '\n\n[Troncature : message trop long pour mailto — envoyer le reste dans un 2e mail ou via Tally.]';
      }
      return body;
    }

    activate('tab-laura');
  }

  initTheme();
  initNav();
  initReveal();
  initSectionLightSweep();
  initBgCanvas();
  initHeroWords();
  initHeroTypewriter();
  initCursorHalo();
  initHeroV6Fx();
  initChatDemo();
  initCarousel('carouselLaura');
  initCarousel('carouselMicha');
  initContact();
  initContactGlowChoices();

  if (!document.querySelector('script[data-pinapp-cookies-banner]')) {
    var cbs = document.createElement('script');
    cbs.src = '/assets/js/pinapp-cookies-banner.js?v=1';
    cbs.defer = true;
    cbs.setAttribute('data-pinapp-cookies-banner', '1');
    document.body.appendChild(cbs);
  }

  if (!document.querySelector('script[data-pinapp-chatbot]')) {
    var ch = document.createElement('script');
    ch.src = '/assets/js/pp-chatbot.js?v=20260460';
    ch.defer = true;
    ch.setAttribute('data-pinapp-chatbot', '1');
    document.body.appendChild(ch);
  }

  var parHtml =
    '<p class="pinapp-footer-parrainage" style="font-size:0.75rem;color:rgba(232,244,248,0.4);margin-top:1rem;">' +
    '🍍 Parrainage — Recommandez un client, recevez 10% sur votre prochaine prestation. ' +
    '<a href="mailto:contact@pinapp.fr?subject=Parrainage" style="color:#00E5B0;">En savoir plus</a></p>';
  document.querySelectorAll('footer').forEach(function (foot) {
    if (foot.querySelector('.pinapp-footer-parrainage')) return;
    var w = document.createElement('div');
    w.className = 'pinapp-footer-parrainage-wrap';
    w.innerHTML = parHtml;
    foot.appendChild(w);
  });
})();
