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

  function initTheme() {
    var stored = localStorage.getItem('pinapp-vitrine-theme');
    var scheme = stored === 'light' ? 'light' : 'dark';
    html.setAttribute('data-theme', scheme);
    document.body.classList.toggle('day', scheme === 'light');
    var btn = document.getElementById('themeToggle');
    setThemeAria(btn, scheme === 'light');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      document.body.classList.toggle('day', next === 'light');
      localStorage.setItem('pinapp-vitrine-theme', next);
      setThemeAria(btn, next === 'light');
    });
  }

  function initNav() {
    var nav = document.getElementById('siteNav');
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');
    if (!nav || !toggle || !drawer) return;

    var focusableSel =
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        var first = drawer.querySelector(focusableSel);
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (toggle.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        setOpen(false);
      }
    });

    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 50) nav.classList.add('nav--scrolled');
        else nav.classList.remove('nav--scrolled');
      },
      { passive: true },
    );
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
      particles.length = 0;
      nebulae.length = 0;
      var i;
      for (i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() < 0.5 ? -1 : 1) * (0.2 + Math.random() * 0.3),
          vy: (Math.random() < 0.5 ? -1 : 1) * (0.2 + Math.random() * 0.3),
          r: 1 + Math.random() * 2,
          base: 0.06 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2,
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
          ? 'rgba(123,94,167,' + n.opacity * (light ? 1.2 : 1) + ')'
          : 'rgba(0,201,177,' + n.opacity + ')';
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

    function drawRays(w, h, now) {
      var light = isLight();
      var alpha = light ? 0.015 : 0.02;
      var col = light ? '123,94,167' : '0,201,177';
      ctx.save();
      ctx.strokeStyle = 'rgba(' + col + ',' + alpha + ')';
      ctx.lineWidth = 1;
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

      drawRays(w, h, now);

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
        var a = Math.min(0.22, base * pulse);
        ctx.fillStyle = light ? 'rgba(123,94,167,' + a + ')' : 'rgba(0,201,177,' + a + ')';
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
      for (var j = 0; j < nebulae.length; j++) drawNebula(nebulae[j], w, h, once);
      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];
        ctx.fillStyle = isLight() ? 'rgba(123,94,167,0.04)' : 'rgba(0,201,177,0.1)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function initHeroWords() {
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
        var core = isLight() ? 'rgba(123,94,167,0.08)' : 'rgba(0,201,177,0.08)';
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

    function buildBody(panel) {
      var lines = [];
      lines.push('— Demande Pinapp (vitrine) —');
      lines.push('Onglet : ' + (panel.dataset.label || ''));
      panel.querySelectorAll('input, textarea, select').forEach(function (field) {
        if (field.type === 'button') return;
        if ((field.type === 'radio' || field.type === 'checkbox') && !field.checked) return;
        var label = field.name || field.id || 'champ';
        var val = field.value;
        if (field.type === 'radio' || field.type === 'checkbox')
          val = field.checked ? field.value : '';
        if (val) lines.push(label + ' : ' + val);
      });
      lines.push('');
      lines.push('Contact : contact@pinapp.fr');
      return lines.join('\n');
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
  initChatDemo();
  initCarousel('carouselLaura');
  initCarousel('carouselMicha');
  initContact();
  initContactGlowChoices();
})();
