/**
 * Pinapp Studio — homepage 2026 (vanilla)
 */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Particules canvas : assets/js/pinapp-particles.js (chargé dans index.html) */

  /* —— Curseur custom (desktop) —— */
  function initCursor() {
    if (prefersReducedMotion()) return;
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
        'a, button, .card-2026, .btn-2026, .onboarding5-2026__choice, .formations-2026__card, .formations-2026__cta',
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

  /* —— Nav scroll + barre progression —— */
  function initNavAndProgress() {
    var nav = doc.getElementById('nav');
    var progress = doc.getElementById('progress');
    var scrollProgress = doc.getElementById('scrollProgress');
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
        if (scrollProgress) {
          var max2 = doc.body.scrollHeight - window.innerHeight;
          var p = max2 > 0 ? y / max2 : 0;
          var clamped = Math.min(1, Math.max(0, p));
          scrollProgress.style.transform = 'scaleX(' + clamped + ')';
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

  /* —— Parallax hero —— */
  function initHeroParallax() {
    if (prefersReducedMotion()) return;
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

  /* —— Scroll reveal —— */
  function initScrollReveal() {
    var els = doc.querySelectorAll(
      '.section-2026 .anim-up, .section-2026 .anim-fade, .section-2026 .anim-scale',
    );
    if (!els.length) return;
    if (prefersReducedMotion()) {
      els.forEach(function (el) {
        el.classList.add('visible');
      });
      doc
        .querySelectorAll('.hero-2026 .anim-fade-hero, .hero-2026 .anim-scale-hero')
        .forEach(function (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.animation = 'none';
        });
      return;
    }
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

  /* —— Count-up + glitch —— */
  function initCountUp() {
    var countEls = doc.querySelectorAll('.count-up');
    if (!countEls.length) return;
    var reduced = prefersReducedMotion();
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(target)) return;
          if (reduced) {
            el.textContent = target.toLocaleString('fr-FR');
            obs.unobserve(el);
            return;
          }
          el.style.filter = 'blur(4px)';
          window.setTimeout(function () {
            el.style.filter = 'blur(2px)';
          }, 100);
          window.setTimeout(function () {
            el.style.filter = 'blur(0)';
            var start = Date.now();
            var duration = 1500;
            function tick() {
              var elapsed = Date.now() - start;
              var progress = Math.min(elapsed / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }, 300);
          obs.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    countEls.forEach(function (el) {
      obs.observe(el);
    });
  }

  /* —— Carousel démos —— */
  function initDemosCarousel() {
    var track = doc.getElementById('demosTrack');
    var dotsEl = doc.getElementById('demosDots');
    var prev = doc.querySelector('.demos-2026__prev');
    var next = doc.querySelector('.demos-2026__next');
    var wrap = doc.querySelector('.demos-2026__carousel');
    if (!track || !dotsEl) return;
    var slides = track.children;
    var total = slides.length;
    var current = 0;
    var autoTimer = null;

    function goTo(n) {
      current = ((n % total) + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dotsEl.querySelectorAll('.demos-2026__dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
    }

    for (var i = 0; i < total; i++) {
      (function (idx) {
        var d = doc.createElement('button');
        d.type = 'button';
        d.className = 'demos-2026__dot' + (idx === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Démo ' + (idx + 1));
        if (idx === 0) d.setAttribute('aria-current', 'true');
        d.addEventListener('click', function () {
          goTo(idx);
          resetAuto();
        });
        dotsEl.appendChild(d);
      })(i);
    }

    function resetAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = window.setInterval(function () {
        goTo(current + 1);
      }, 5000);
    }

    if (prev)
      prev.addEventListener('click', function () {
        goTo(current - 1);
        resetAuto();
      });
    if (next)
      next.addEventListener('click', function () {
        goTo(current + 1);
        resetAuto();
      });

    var startX = 0;
    track.addEventListener(
      'touchstart',
      function (e) {
        startX = e.touches[0].clientX;
      },
      { passive: true },
    );
    track.addEventListener(
      'touchend',
      function (e) {
        var dx = startX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) {
          goTo(dx > 0 ? current + 1 : current - 1);
          resetAuto();
        }
      },
      { passive: true },
    );

    if (wrap) {
      wrap.addEventListener('mouseenter', function () {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
      });
      wrap.addEventListener('mouseleave', function () {
        if (!prefersReducedMotion()) resetAuto();
      });
    }
    if (!prefersReducedMotion()) resetAuto();
  }

  /* —— Onboarding (section 5, 4 questions + résultat) —— */
  function initOnboarding5() {
    var form = doc.getElementById('obForm');
    if (!form) return;

    var contactSection = doc.getElementById('onboarding');
    if (contactSection && 'IntersectionObserver' in window) {
      var navObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            body.classList.toggle('ob5-hide-nav-cta', entry.isIntersecting);
          });
        },
        { threshold: 0.12, rootMargin: '0px' },
      );
      navObs.observe(contactSection);
    }

    var cfg = window.__PINAPP__ || {};
    var webhook = (form.getAttribute('data-webhook') || '').trim();
    if (webhook === 'VOTRE_WEBHOOK_N8N' || webhook === 'WEBHOOK_N8N') webhook = '';
    if (!webhook && typeof cfg.WEBHOOK_N8N === 'string') webhook = cfg.WEBHOOK_N8N.trim();
    var panels = {
      q1: doc.getElementById('ob5-q1'),
      q2site: doc.getElementById('ob5-q2-site'),
      q2auto: doc.getElementById('ob5-q2-auto'),
      q2ia: doc.getElementById('ob5-q2-ia'),
      q2formation: doc.getElementById('ob5-q2-formation'),
      q2unsure: doc.getElementById('ob5-q2-unsure'),
      q3: doc.getElementById('ob5-q3'),
      q4: doc.getElementById('ob5-q4'),
      result: doc.getElementById('ob5-result'),
      done: doc.getElementById('ob5-done'),
    };
    var progressItems = form.querySelectorAll('.onboarding5-2026__prog-item');
    var state = { besoin: '', precision: '', budget: '', delai: '' };

    var MESSAGES = {
      'site-premium|refonte|500-1500|ce-mois':
        "Parfait. Une refonte premium en moins d'un mois,\nc'est exactement ce que je fais.",
      'automatisation|email|moins-500|pas-presse':
        "Vos relances en automatique pour moins de 500€.\nC'est faisable et je peux vous montrer comment.",
      'ia|support-client|1500-plus|urgent':
        'Un chatbot métier opérationnel en 48h.\nOn peut commencer cette semaine.',
      'formation|debutant|moins-500|pas-presse':
        "La formation 'Récupère 5h par semaine' est faite pour vous.\n47€. Disponible immédiatement.",
      'site-premium|zero|500-1500|ce-mois':
        'Un site premium neuf pour ce mois-ci : on peut cadrer un socle élégant puis faire grandir les pages clés.',
      'site-premium|refonte|1500-plus|urgent':
        'Refonte premium sous deux semaines avec budget confortable : on verrouille le périmètre et on enchaîne en sprint.',
      'automatisation|devis|discuter|pas-presse':
        'Devis et facturation sans urgence : on audite le flux, puis on automatise ce qui vous fait vraiment perdre du temps.',
      'automatisation|agenda|500-1500|ce-mois':
        'Agenda et réservations dans cette enveloppe : c’est un classique — on peut le poser proprement ce mois-ci.',
      'ia|contenu|500-1500|pas-presse':
        'Génération de contenu avec garde-fous : prompts, validation humaine et un workflow qui colle à votre voix.',
      'ia|process|1500-plus|ce-mois':
        'IA sur vos process internes, budget large : on peut viser un premier cas d’usage opérationnel d’ici la fin du mois.',
      'formation|intermediaire|500-1500|ce-mois':
        'Niveau intermédiaire, rythme ce mois-ci : on monte en puissance sur automatisations concrètes et IA utile au quotidien.',
      'formation|avance|1500-plus|pas-presse':
        'Profil avancé et marge de manœuvre : accompagnement sur-mesure ou audit profond — on choisit ce qui maximise l’impact.',
      'incertain|temps|moins-500|pas-presse':
        'Gagner du temps sans gros budget : souvent un petit levier d’automatisation suffit — je vous le détaille en réponse.',
      'incertain|visibilite|500-1500|ce-mois':
        'Visibilité et crédibilité dans la fourchette 500–1 500 € : on clarifie l’offre et la page qui doit convertir.',
      'incertain|envie-ia|discuter|pas-presse':
        'Intégrer l’IA sans précipitation : données, risques, puis un pilote réaliste — on en parle calmement.',
      'site-premium|refonte|moins-500|urgent':
        'Refonte express, budget serré : on peut viser une évolution ciblée (page pivot, tunnel) pour débloquer vite.',
      'automatisation|email|500-1500|urgent':
        'Relances e-mail urgentes : séquences + connecteur bien choisi peuvent déjà soulager la boîte cette semaine.',
      'site-premium|zero|1500-plus|pas-presse':
        'Site premium neuf, sans deadline serrée : on prend le temps de la structure, du contenu et du détail qui fait la différence.',
      'ia|ia-hesite|discuter|ce-mois':
        'Usage IA encore flou : on fait un court atelier pour prioriser un cas d’usage rentable avant la fin du mois.',
    };

    var GENERIC =
      'Votre projet est clair. Laissez-moi votre email,\nje vous réponds sous 24h avec une proposition concrète.';

    function getMessage() {
      var k = [state.besoin, state.precision, state.budget, state.delai].join('|');
      return MESSAGES[k] || GENERIC;
    }

    function besoinToQ2(b) {
      if (b === 'site-premium') return panels.q2site;
      if (b === 'automatisation') return panels.q2auto;
      if (b === 'ia') return panels.q2ia;
      if (b === 'formation') return panels.q2formation;
      return panels.q2unsure;
    }

    function updateProgress(stepIdx) {
      progressItems.forEach(function (li, i) {
        li.classList.remove('is-current', 'is-done');
        if (stepIdx >= 4) {
          li.classList.add('is-done');
        } else {
          if (i < stepIdx) li.classList.add('is-done');
          if (i === stepIdx) li.classList.add('is-current');
        }
      });
    }

    function clearSelected(panel) {
      if (!panel) return;
      panel.querySelectorAll('.onboarding5-2026__choice').forEach(function (btn) {
        btn.classList.remove('is-selected');
      });
    }

    var ob5ReduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ob5FadeOutMs = ob5ReduceMotion ? 0 : 200;

    function switchPanel(from, to, progStep) {
      function applyProg() {
        if (typeof progStep === 'number') updateProgress(progStep);
      }
      if (from) {
        from.classList.remove('is-active');
        window.setTimeout(function () {
          from.classList.remove('is-open');
          from.setAttribute('aria-hidden', 'true');
          if (to) {
            to.classList.add('is-open');
            to.setAttribute('aria-hidden', 'false');
            void to.offsetWidth;
            to.classList.add('is-active');
          }
          applyProg();
        }, ob5FadeOutMs);
      } else if (to) {
        to.classList.add('is-open');
        to.setAttribute('aria-hidden', 'false');
        void to.offsetWidth;
        to.classList.add('is-active');
        applyProg();
      }
    }

    function bindChoices(panel, onPick) {
      if (!panel) return;
      panel.querySelectorAll('.onboarding5-2026__choice').forEach(function (btn) {
        btn.addEventListener('click', function () {
          clearSelected(panel);
          btn.classList.add('is-selected');
          onPick(btn);
        });
      });
    }

    bindChoices(panels.q1, function (btn) {
      state.besoin = btn.getAttribute('data-besoin') || '';
      switchPanel(panels.q1, besoinToQ2(state.besoin), 1);
    });

    ['q2site', 'q2auto', 'q2ia', 'q2formation', 'q2unsure'].forEach(function (key) {
      var q2p = panels[key];
      bindChoices(q2p, function (btn) {
        state.precision = btn.getAttribute('data-precision') || '';
        switchPanel(q2p, panels.q3, 2);
      });
    });

    bindChoices(panels.q3, function (btn) {
      state.budget = btn.getAttribute('data-budget') || '';
      switchPanel(panels.q3, panels.q4, 3);
    });

    bindChoices(panels.q4, function (btn) {
      state.delai = btn.getAttribute('data-delai') || '';
      var msgEl = doc.getElementById('ob5ResultText');
      if (msgEl) msgEl.textContent = getMessage();
      switchPanel(panels.q4, panels.result, 4);
    });

    var submitBtn = doc.getElementById('ob5Submit');
    var emailInput = doc.getElementById('obEmail');
    if (submitBtn && emailInput) {
      submitBtn.addEventListener('click', function () {
        if (submitBtn.disabled) return;
        var email = emailInput.value.trim();
        if (!email || !emailInput.checkValidity()) {
          emailInput.reportValidity();
          emailInput.focus();
          return;
        }

        var payload = {
          besoin: state.besoin,
          precision: state.precision,
          budget: state.budget,
          delai: state.delai,
          email: email,
        };

        function goDone() {
          switchPanel(panels.result, panels.done, 4);
        }

        if (!webhook) {
          goDone();
          return;
        }

        submitBtn.disabled = true;
        fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then(function (res) {
            if (res.ok) goDone();
            else submitBtn.disabled = false;
          })
          .catch(function () {
            submitBtn.disabled = false;
          });
      });
    }

    updateProgress(0);
  }

  /* —— Formations : reveal scroll uniquement (fade-up) —— */
  function initFormationsReveal() {
    var els = doc.querySelectorAll('.formations-2026__reveal');
    if (!els.length) return;
    if (prefersReducedMotion()) {
      els.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    );
    els.forEach(function (el) {
      obs.observe(el);
    });
  }

  function initEncartsPanel() {
    var el = doc.getElementById('pinapp-encarts');
    if (!el) return;
    var params = new URLSearchParams(location.search);
    var show = params.get('encarts') === '1' || localStorage.getItem('pinappEncarts') === '1';
    if (!show) return;
    el.removeAttribute('hidden');
  }

  function boot() {
    initEncartsPanel();
    initCursor();
    initNavAndProgress();
    initHeroParallax();
    initScrollReveal();
    initFormationsReveal();
    initCountUp();
    initDemosCarousel();
    initOnboarding5();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
