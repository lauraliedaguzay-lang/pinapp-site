/**
 * Pinapp home refonte — BLOC 6 particules canvas, BLOC 8–11 interactions, BLOC 13 modales, IO BLOC 16
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Canvas particules (BLOC 6) ── */
  function initHeroParticles() {
    var canvas = document.getElementById('particles');
    if (!canvas || !canvas.classList.contains('refonte-hero-particles')) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var pts = [];
    var raf = null;

    function size() {
      if (window.innerWidth < 768) {
        canvas.style.display = 'none';
        return false;
      }
      canvas.style.display = '';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pts = Array.from({ length: 60 }, function () {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        };
      });
      return true;
    }

    function draw() {
      if (window.innerWidth < 768) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,204,0.4)';
        ctx.fill();
        pts.forEach(function (p2) {
          var d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(0,229,204,' + 0.04 * (1 - d / 120) + ')';
            ctx.stroke();
          }
        });
      });
      raf = window.requestAnimationFrame(draw);
    }

    if (reduced) return;

    window.addEventListener(
      'resize',
      function () {
        if (raf) window.cancelAnimationFrame(raf);
        if (size()) raf = window.requestAnimationFrame(draw);
      },
      { passive: true },
    );

    if (size()) raf = window.requestAnimationFrame(draw);
  }

  /* ── Scroll indicator hero : disparaît après 3 s ── */
  function initHeroScrollHide() {
    var ind = document.getElementById('heroScrollIndicator');
    if (!ind) return;
    window.setTimeout(function () {
      ind.style.transition = 'opacity 400ms cubic-bezier(0.25,0.1,0.25,1)';
      ind.style.opacity = '0';
      window.setTimeout(function () {
        ind.setAttribute('hidden', '');
      }, 400);
    }, 3000);
    window.addEventListener(
      'scroll',
      function () {
        ind.style.transition = 'opacity 400ms ease';
        ind.style.opacity = '0';
      },
      { once: true, passive: true },
    );
  }

  /* ── Onglets démos ── */
  function initDemoTabs() {
    var tablist = document.querySelector('[data-refonte-tabs]');
    if (!tablist) return;
    var tabs = tablist.querySelectorAll('[role="tab"]');
    var panels = document.querySelectorAll('[data-refonte-tabpanel]');

    function select(id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-tab') === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        var on = p.getAttribute('id') === 'panel-' + id;
        p.classList.toggle('is-active', on);
        p.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      if (id === 'chatbot') startChatDemo();
    }

    tablist.addEventListener('click', function (e) {
      var btn = e.target.closest('[role="tab"]');
      if (!btn || !tablist.contains(btn)) return;
      select(btn.getAttribute('data-tab'));
    });

    tablist.addEventListener('keydown', function (e) {
      var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (keys.indexOf(e.key) === -1) return;
      e.preventDefault();
      var ix = Array.prototype.indexOf.call(tabs, document.activeElement);
      if (ix < 0) ix = 0;
      var n = tabs.length;
      if (e.key === 'Home') ix = 0;
      else if (e.key === 'End') ix = n - 1;
      else if (e.key === 'ArrowRight') ix = (ix + 1) % n;
      else if (e.key === 'ArrowLeft') ix = (ix - 1 + n) % n;
      tabs[ix].focus();
      select(tabs[ix].getAttribute('data-tab'));
    });

    select('auto');
  }

  var chatDemoStarted = false;

  function startChatDemo() {
    if (chatDemoStarted || reduced) return;
    var root = document.getElementById('refonte-chat-demo');
    if (!root || root.dataset.started === '1') return;
    root.dataset.started = '1';
    chatDemoStarted = true;

    var steps = [
      { t: 0, html: '<div class="refonte-chat-bubble refonte-chat-bubble--bot">Bonjour, comment pouvons-nous vous aider ?</div>' },
      {
        t: 400,
        html: '<div class="refonte-chat-bubble refonte-chat-bubble--user">Je perds trop de temps à relancer mes clients</div>',
      },
      { t: 900, typing: true },
      {
        t: 1700,
        html:
          '<div class="refonte-chat-bubble refonte-chat-bubble--bot">Combien de relances faites-vous par semaine ?</div>',
      },
      {
        t: 2200,
        html: '<div class="refonte-chat-bubble refonte-chat-bubble--user">Une vingtaine</div>',
      },
      { t: 2700, typing: true },
      {
        t: 3500,
        html:
          '<div class="refonte-chat-bubble refonte-chat-bubble--bot">Avec une automatisation simple, ces 20 relances partent seules. Voulez-vous voir comment ?</div>',
      },
    ];

    var area = root.querySelector('.refonte-iphone-chat');
    if (!area) return;

    steps.forEach(function (step) {
      window.setTimeout(function () {
        if (step.typing) {
          var ty = document.createElement('div');
          ty.className = 'refonte-chat-typing refonte-chat-bubble--bot';
          ty.innerHTML = '<span></span><span></span><span></span>';
          ty.setAttribute('aria-hidden', 'true');
          area.appendChild(ty);
          window.setTimeout(function () {
            if (ty.parentNode) ty.remove();
          }, 750);
        } else if (step.html) {
          var wrap = document.createElement('div');
          wrap.innerHTML = step.html;
          area.appendChild(wrap.firstElementChild);
        }
      }, step.t);
    });
  }

  /* ── Pipeline automatisation ── */
  function initPipelineDemo() {
    var root = document.getElementById('refonte-pipeline-demo');
    if (!root) return;
    var nodes = root.querySelectorAll('.refonte-pipeline-node');
    var lines = root.querySelectorAll('.refonte-pipeline-connector');
    var replay = root.querySelector('[data-pipeline-replay]');

    function reset() {
      nodes.forEach(function (n) {
        n.classList.remove('refonte-done');
      });
      lines.forEach(function (l) {
        l.classList.remove('refonte-line-on');
      });
    }

    function run() {
      reset();
      var i = 0;
      function step() {
        if (i < nodes.length) {
          nodes[i].classList.add('refonte-done');
          if (i < lines.length) lines[i].classList.add('refonte-line-on');
          i++;
          window.setTimeout(step, 800);
        }
      }
      step();
    }

    nodes[0].addEventListener('click', function () {
      run();
    });
    nodes[0].addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        run();
      }
    });

    if (replay) replay.addEventListener('click', run);
  }

  /* ── Onboarding ── */
  function initOnboarding() {
    var root = document.getElementById('refonte-onboarding');
    if (!root) return;

    var bar = root.querySelector('.refonte-onboard-progress');
    var msg = root.querySelector('.refonte-onboard-msg');
    var steps = root.querySelectorAll('.refonte-onboard-step[data-step]');
    var done = root.querySelector('.refonte-onboard-done');

    function resolveOnboardingWebhook() {
      var attr = (root.getAttribute('data-webhook') || '').trim();
      if (attr && window.PinappConfig && window.PinappConfig._isRealUrl(attr)) return attr;
      var cfg = window.PinappConfig;
      if (cfg && cfg.features && cfg.features.onboardingWebhook && cfg._isRealUrl(cfg.webhooks.onboarding)) {
        return cfg.webhooks.onboarding;
      }
      return '';
    }

    var answers = {};
    var stepIndex = 0;

    var transitions = ['Bien noté.', 'Parfait.', 'On y est presque.', ''];

    function setProgress(pct) {
      if (bar) bar.style.width = pct + '%';
    }

    function showStep(i) {
      steps.forEach(function (s) {
        s.hidden = s.getAttribute('data-step') !== String(i);
      });
      setProgress([0, 25, 50, 75][i] || 0);
    }

    function nextStep(answerKey, value) {
      answers[answerKey] = value;
      if (msg) msg.textContent = transitions[stepIndex] || '';
      window.setTimeout(function () {
        if (msg) msg.textContent = '';
        stepIndex++;
        if (stepIndex >= 4) {
          showDone();
        } else {
          showStep(stepIndex);
        }
      }, 400);
    }

    function showDone() {
      steps.forEach(function (s) {
        s.hidden = true;
      });
      if (done) done.hidden = false;
      setProgress(100);
      if (!resolveOnboardingWebhook() && done) {
        var extra = done.querySelector('.refonte-onboard-redirect-note');
        if (!extra) {
          extra = document.createElement('p');
          extra.className = 'refonte-onboard-redirect-note';
          extra.style.cssText =
            'text-align:center;font-size:0.9375rem;margin:0.75rem 0 0;color:var(--text-muted)';
          done.appendChild(extra);
        }
        extra.textContent =
          'Redirection vers le diagnostic Pinapp (zone message + coordonnées) dans quelques secondes…';
      }
      submitAnswers();
    }

    function redirectToDiagnosticWithAnswers() {
      var q = new URLSearchParams();
      q.set('from', 'onboarding');
      ['besoin', 'structure', 'delai', 'budget'].forEach(function (k) {
        if (answers[k]) q.set(k, String(answers[k]));
      });
      window.setTimeout(function () {
        window.location.href = 'diagnostic/index.html?' + q.toString();
      }, 2200);
    }

    function submitAnswers() {
      var payload = {
        source: 'pinapp-home-onboarding',
        answers: answers,
        ts: new Date().toISOString(),
      };
      var wh = resolveOnboardingWebhook();
      if (!wh) {
        redirectToDiagnosticWithAnswers();
        return;
      }
      window
        .fetch(wh, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        .then(function (r) {
          if (!r.ok) throw new Error('webhook ' + r.status);
        })
        .catch(function () {
          redirectToDiagnosticWithAnswers();
        });
    }

    root.querySelectorAll('.refonte-pills').forEach(function (group) {
      group.addEventListener('click', function (e) {
        var btn = e.target.closest('button');
        if (!btn || !group.contains(btn)) return;
        var q = group.getAttribute('data-question');
        var val = btn.getAttribute('data-value');
        group.querySelectorAll('button').forEach(function (b) {
          b.classList.remove('refonte-pill-selected');
        });
        btn.classList.add('refonte-pill-selected');
        nextStep(q, val);
      });
    });

    showStep(0);
  }

  /* ── Modales démos ── */
  function initDemoModals() {
    var modal = document.getElementById('refonte-demo-modal');
    if (!modal) return;
    var inner = modal.querySelector('.refonte-demo-modal__inner');
    var closeBtn = modal.querySelector('.refonte-demo-modal__close');
    var titleEl = modal.querySelector('[data-modal-title]');
    var frameWrap = modal.querySelector('[data-modal-frame]');
    var external = modal.querySelector('[data-modal-external]');

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (frameWrap) {
        frameWrap.innerHTML = '';
      }
      if (external) {
        external.hidden = true;
        external.href = '#';
      }
    }

    function open(opts) {
      if (titleEl) titleEl.textContent = opts.title || '';
      if (opts.external) {
        if (frameWrap) frameWrap.innerHTML = '';
        if (external) {
          external.hidden = false;
          external.href = opts.href;
          external.textContent = 'Ouvrir le site →';
        }
      } else {
        if (external) external.hidden = true;
        if (frameWrap) {
          frameWrap.innerHTML =
            '<iframe title="' +
            (opts.title || 'Démo') +
            '" src="' +
            opts.href +
            '" loading="lazy"></iframe>';
        }
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    document.querySelectorAll('[data-refonte-demo-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var href = btn.getAttribute('data-href');
        var title = btn.getAttribute('data-title') || 'Démo';
        var ext = btn.getAttribute('data-external') === '1';
        open({ href: href, title: title, external: ext });
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  /* ── IntersectionObserver ── */
  function initIO() {
    if (reduced) return;
    document.documentElement.classList.add('refonte-io-ready');

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('refonte-io-in');
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    );

    document.querySelectorAll('.refonte-io-target, .refonte-io-title, .refonte-io-sub').forEach(function (el) {
      obs.observe(el);
    });

    /* Cartes services : stagger */
    document.querySelectorAll('[data-refonte-stagger]').forEach(function (group) {
      var cards = group.querySelectorAll('.refonte-io-target');
      cards.forEach(function (c, i) {
        c.style.transitionDelay = i * 120 + 'ms';
      });
    });
  }

  function initServiceDemoLinks() {
    document.querySelectorAll('[data-tab-jump]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('data-tab-jump');
        var tabs = document.querySelector('[data-refonte-tabs]');
        if (!id || !tabs) return;
        e.preventDefault();
        var btn = tabs.querySelector('[data-tab="' + id + '"]');
        if (btn) btn.click();
        var target = document.getElementById('refonte-demos');
        if (target) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  function initMichaFormationsFromCatalog() {
    var ul = document.getElementById('pinapp-micha-formations');
    if (!ul) return;
    fetch('assets/data/pinapp-catalog.json', { credentials: 'same-origin' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (!data || !data.michaHome || !Array.isArray(data.michaHome.formations)) return;
        var items = data.michaHome.formations;
        if (!items.length) return;
        ul.innerHTML = '';
        items.forEach(function (f) {
          var li = document.createElement('li');
          var strong = document.createElement('strong');
          strong.textContent = f.title || '';
          li.appendChild(strong);
          if (f.description) {
            li.appendChild(document.createTextNode(' — ' + f.description));
          }
          ul.appendChild(li);
        });
      })
      .catch(function () {});
  }

  function boot() {
    initHeroParticles();
    initHeroScrollHide();
    initDemoTabs();
    initServiceDemoLinks();
    initPipelineDemo();
    initOnboarding();
    initDemoModals();
    initIO();
    initMichaFormationsFromCatalog();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
