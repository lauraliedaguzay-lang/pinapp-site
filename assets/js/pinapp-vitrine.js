(function () {
  'use strict';

  var html = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function syncHeroBg() {
    var img = document.getElementById('heroBgImg');
    if (!img) return;
    var night = img.getAttribute('data-bg-night');
    var day = img.getAttribute('data-bg-day');
    var isLight = html.getAttribute('data-theme') === 'light';
    var next = isLight ? day : night;
    if (next && img.getAttribute('src') !== next) img.setAttribute('src', next);
  }

  function setThemeLabel(btn, isLight) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    btn.textContent = isLight ? 'Jour' : 'Nuit';
  }

  function initTheme() {
    var stored = localStorage.getItem('pinapp-vitrine-theme');
    var scheme = stored || 'dark';
    html.setAttribute('data-theme', scheme);
    syncHeroBg();
    var heroImg = document.getElementById('heroBgImg');
    if (heroImg) {
      heroImg.addEventListener('error', function () {
        heroImg.removeAttribute('src');
        heroImg.style.display = 'none';
      });
    }
    var btn = document.getElementById('themeToggle');
    setThemeLabel(btn, scheme === 'light');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('pinapp-vitrine-theme', next);
      setThemeLabel(btn, next === 'light');
      syncHeroBg();
    });
  }


  function initNav() {
    var nav = document.getElementById('siteNav');
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');
    if (!nav || !toggle || !drawer) return;

    var focusableSel = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
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
      var open = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!open);
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
        if (window.scrollY > 12) nav.classList.add('nav--scrolled');
        else nav.classList.remove('nav--scrolled');
      },
      { passive: true }
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initParticles() {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var count = 60;
    var running = true;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function color() {
      var c = getComputedStyle(html).getPropertyValue('--particle').trim() || '#00c9b1';
      return c;
    }

    function spawn() {
      particles.length = 0;
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.5 + Math.random() * 1.5,
          a: 0.08 + Math.random() * 0.07,
        });
      }
    }

    function step() {
      if (!running) return;
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color();
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += (Math.random() - 0.5) * 0.6;
        p.y += (Math.random() - 0.5) * 0.6;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(step);
    }

    resize();
    spawn();
    window.addEventListener('resize', resize, { passive: true });
    if (!prefersReduced.matches) requestAnimationFrame(step);
    else {
      ctx.fillStyle = color();
      particles.forEach(function (p) {
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    document.addEventListener('visibilitychange', function () {
      running = document.visibilityState === 'visible' && !prefersReduced.matches;
      if (running) requestAnimationFrame(step);
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
        layer.style.background =
          'radial-gradient(circle 12.5rem at ' +
          x +
          'px ' +
          y +
          'px, rgba(0,201,177,0.06), transparent 55%)';
      },
      { passive: true }
    );
  }

  function initChatDemo() {
    var root = document.getElementById('chatDemo');
    if (!root) return;
    var bubbles = root.querySelectorAll('.bubble');
    if (!bubbles.length) return;
    var i = 0;
    function next() {
      if (i >= bubbles.length) return;
      bubbles[i].classList.add('is-on');
      i++;
      window.setTimeout(next, 900);
    }
    if (!prefersReduced.matches) window.setTimeout(next, 400);
    else bubbles.forEach(function (b) {
      b.classList.add('is-on');
    });
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

    function go(n) {
      index = (n + slides.length) % slides.length;
      var pct = (-100 * index) / slides.length;
      track.style.transform = 'translateX(' + pct + '%)';
      dots.forEach(function (d, i) {
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        go(i);
      });
    });

    track.addEventListener(
      'touchstart',
      function (e) {
        startX = e.changedTouches[0].screenX;
      },
      { passive: true }
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
      },
      { passive: true }
    );

    go(0);
  }

  function bumpEllipses() {
    if (prefersReduced.matches) return;
    var ell = document.querySelectorAll('.ellipses__b');
    ell.forEach(function (el) {
      var cur = parseFloat(el.style.opacity || '') || null;
      var base =
        el.classList.contains('ellipses__b--1') ? 0.05 : el.classList.contains('ellipses__b--2') ? 0.04 : 0.03;
      var v = Math.min(0.12, base + 0.02);
      el.style.opacity = String(v);
      window.setTimeout(function () {
        el.style.opacity = '';
      }, 450);
    });
  }

  function initContact() {
    var tablist = document.querySelector('#contact [role="tablist"]');
    if (!tablist) return;
    var tabs = tablist.querySelectorAll('[role="tab"]');
    var panels = document.querySelectorAll('[role="tabpanel"]');

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
          bumpEllipses();
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
          window.location.href = mail + '?subject=' + encodeURIComponent(panel.dataset.subject || 'Demande Pinapp') + '&body=' + encodeURIComponent(body);
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
        if (field.type === 'radio' || field.type === 'checkbox') val = field.checked ? field.value : '';
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
  initParticles();
  initCursorHalo();
  initChatDemo();
  initCarousel('carouselLaura');
  initCarousel('carouselMicha');
  initContact();
})();
