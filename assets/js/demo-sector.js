/**
 * PINAPP — démos sectorielles (prompt sites démo)
 * Attend window.PINAPP_DEMO_SITE défini avant ce script.
 * Scroll section : instantané (pas de smooth) — règle site Pinapp.
 */
(function () {
  'use strict';

  var S = window.PINAPP_DEMO_SITE;
  if (!S || !S.services || !S.q1) {
    console.error('PINAPP_DEMO_SITE manquant ou incomplet');
    return;
  }

  var root = document.documentElement;

  function setVars(map) {
    Object.keys(map).forEach(function (k) {
      root.style.setProperty(k, map[k]);
    });
  }

  function applyTheme() {
    var style = S.style || 'light-minimal';
    var base = {
      '--demo-accent': S.accent,
      '--demo-accent-dark': S.accentDark || S.accent,
      '--demo-texte': S.texte,
      '--demo-fond': S.fond,
      '--demo-accent-hero': S.accent
    };

    if (style === 'light-minimal') {
      Object.assign(base, {
        '--demo-typo-titre': 'Georgia, "Times New Roman", serif',
        '--demo-typo-body': 'Inter, system-ui, sans-serif',
        '--demo-overlay-hero': 'rgba(253, 253, 253, 0.42)',
        '--demo-texte-hero': S.texte,
        '--demo-texte-btn': '#f4f4f4',
        '--demo-fond-services': 'rgba(255, 255, 255, 0.5)',
        '--demo-fond-card': 'rgba(255, 255, 255, 0.82)',
        '--demo-border-card': 'rgba(13, 27, 62, 0.1)',
        '--demo-fond-preuve': 'rgba(245, 245, 247, 0.95)',
        '--demo-fond-booking': 'rgba(255, 255, 255, 0.88)',
        '--demo-fond-footer': 'rgba(255, 255, 255, 0.92)'
      });
    } else if (style === 'dark-luxury') {
      Object.assign(base, {
        '--demo-typo-titre': 'Georgia, "Times New Roman", serif',
        '--demo-typo-body': 'Inter, system-ui, sans-serif',
        '--demo-overlay-hero': 'rgba(8, 8, 10, 0.62)',
        '--demo-texte-hero': '#f4f0ec',
        '--demo-texte-btn': '#f4f0ec',
        '--demo-fond-services': 'rgba(255, 255, 255, 0.04)',
        '--demo-fond-card': 'rgba(255, 255, 255, 0.07)',
        '--demo-border-card': 'rgba(255, 255, 255, 0.1)',
        '--demo-fond-preuve': 'rgba(255, 255, 255, 0.03)',
        '--demo-fond-booking': 'rgba(255, 255, 255, 0.05)',
        '--demo-fond-footer': 'rgba(5, 5, 8, 0.88)'
      });
    } else {
      /* bold-tech */
      Object.assign(base, {
        '--demo-typo-titre': 'Inter, system-ui, sans-serif',
        '--demo-typo-body': 'Inter, system-ui, sans-serif',
        '--demo-overlay-hero': 'rgba(5, 5, 8, 0.72)',
        '--demo-texte-hero': '#f4f4f4',
        '--demo-texte-btn': '#f4f4f4',
        '--demo-fond-services': 'rgba(255, 255, 255, 0.04)',
        '--demo-fond-card': 'rgba(255, 255, 255, 0.07)',
        '--demo-border-card': 'rgba(255, 255, 255, 0.12)',
        '--demo-fond-preuve': 'rgba(255, 255, 255, 0.03)',
        '--demo-fond-booking': 'rgba(255, 255, 255, 0.05)',
        '--demo-fond-footer': 'rgba(5, 5, 8, 0.9)'
      });
    }

    setVars(base);

    var hero = document.querySelector('.hero');
    if (hero) {
      if (S.photoHero) {
        var imgBase = '/assets/images/';
        try {
          var sc = document.querySelector('script[src*="demo-sector.js"]');
          if (sc && sc.src) {
            imgBase = new URL('../images/', sc.src).href;
          }
        } catch (e) {}
        hero.style.backgroundImage =
          "url('" + imgBase + S.photoHero + "'), linear-gradient(135deg, " +
          (S.accentDark || S.accent) +
          ', ' +
          S.accent +
          ')';
      } else {
        hero.style.backgroundImage =
          'linear-gradient(135deg,' + (S.accentDark || S.accent) + ',' + S.accent + ')';
      }
    }

    if (style === 'bold-tech') {
      var ht = document.querySelector('.hero-title');
      if (ht) ht.style.fontWeight = '800';
    }
  }

  function scrollToSection(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  window.scrollToBooking = function () {
    scrollToSection(document.getElementById('booking'));
  };

  applyTheme();

  function fillCopy() {
    function setText(id, text) {
      var el = document.getElementById(id);
      if (el) el.textContent = text;
    }
    setText('heroSecteur', S.secteur);
    setText('heroZone', S.zone);
    setText('heroSlogan', S.slogan);
    setText('heroSous', S.sousSlogan);
    var btn = document.getElementById('btnBooking');
    if (btn) {
      btn.textContent = S.cta;
      btn.addEventListener('click', function () {
        window.scrollToBooking();
      });
    }
    setText('preuveAvis', '"' + S.avis + '"');
    setText('preuveAuteur', '— ' + S.avisAuteur);
    setText('l1', S.q1.label);
    setText('l2', S.q2.label);
    setText('l3', S.q3.label);
    setText('confirmText', S.confirmation);
    setText('footNom', S.nom);
    setText('footZone', S.zone);
    if (S.bookingTitle) setText('bookingTitle', S.bookingTitle);
  }

  fillCopy();

  /* --- Services swipe --- */
  var swipeContainer = document.getElementById('servicesSwipe');
  var dotsContainer = document.getElementById('servicesDots');
  var currentService = 0;

  S.services.forEach(function (service, i) {
    var item = document.createElement('div');
    item.className = 'swipe-item' + (i === 0 ? ' active' : '');
    item.innerHTML =
      '<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
      '<p class="service-name"></p><p class="service-desc"></p><p class="service-prix"></p>';
    item.querySelector('.service-name').textContent = service.nom;
    item.querySelector('.service-desc').textContent = service.description;
    item.querySelector('.service-prix').textContent = service.prix;
    swipeContainer.appendChild(item);

    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'swipe-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Prestation ' + (i + 1));
    dot.addEventListener('click', function () {
      showService(i);
    });
    dotsContainer.appendChild(dot);
  });

  function showService(index) {
    var items = document.querySelectorAll('.swipe-item');
    var dots = document.querySelectorAll('.swipe-dot');
    items.forEach(function (el, i) {
      el.classList.toggle('active', i === index);
    });
    dots.forEach(function (el, i) {
      el.classList.toggle('active', i === index);
    });
    currentService = index;
  }

  var touchStartX = 0;
  swipeContainer.addEventListener(
    'touchstart',
    function (e) {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  swipeContainer.addEventListener(
    'touchend',
    function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        var n = S.services.length;
        var next =
          diff > 0
            ? (currentService + 1) % n
            : (currentService - 1 + n) % n;
        showService(next);
      }
    },
    { passive: true }
  );

  /* Badges */
  var badgesContainer = document.querySelector('.badges');
  S.confiance.forEach(function (badge) {
    var el = document.createElement('span');
    el.className = 'badge';
    el.textContent = badge;
    badgesContainer.appendChild(el);
  });

  /* Pills */
  var questions = [S.q1, S.q2, S.q3];
  questions.forEach(function (q, qi) {
    var container = document.getElementById('pills' + (qi + 1));
    q.options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
        selectPill(qi + 1, btn);
      });
      container.appendChild(btn);
    });
  });

  var answers = {};
  var progress = [33, 66, 100];
  var progressEl = document.getElementById('progressFill');

  function selectPill(qNum, btn) {
    answers[qNum] = btn.textContent;
    btn.classList.add('selected');
    btn.parentElement.querySelectorAll('.pill').forEach(function (p) {
      if (p !== btn) p.disabled = true;
    });

    window.setTimeout(function () {
      if (qNum < 3) {
        document.getElementById('q' + qNum).classList.remove('active');
        document.getElementById('q' + (qNum + 1)).classList.add('active');
        progressEl.style.width = progress[qNum - 1] + '%';
      } else {
        document.getElementById('q3').classList.remove('active');
        progressEl.style.width = '100%';
        var fin = document.getElementById('qfin');
        fin.classList.add('active');
        var circle = document.getElementById('checkCircle');
        window.setTimeout(function () {
          circle.classList.add('animate');
        }, 100);
        console.log('[DÉMO Pinapp] Réponses :', answers);
      }
    }, 400);
  }

  /* Sections plein écran — molette / tactile, sans smooth */
  var sections = document.querySelectorAll('.demo-sector-page main section');
  var currentSection = 0;
  var isScrolling = false;
  var scrollCooldown = 480;

  window.addEventListener(
    'wheel',
    function (e) {
      if (isScrolling) return;
      var next = currentSection;
      if (e.deltaY > 0 && currentSection < sections.length - 1) next++;
      else if (e.deltaY < 0 && currentSection > 0) next--;
      if (next === currentSection) return;
      isScrolling = true;
      currentSection = next;
      scrollToSection(sections[currentSection]);
      window.setTimeout(function () {
        isScrolling = false;
      }, scrollCooldown);
    },
    { passive: true }
  );

  var touchStartY = 0;
  window.addEventListener(
    'touchstart',
    function (e) {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );
  window.addEventListener(
    'touchend',
    function (e) {
      if (isScrolling) return;
      var diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      var next = currentSection;
      if (diff > 0 && currentSection < sections.length - 1) next++;
      else if (diff < 0 && currentSection > 0) next--;
      if (next === currentSection) return;
      isScrolling = true;
      currentSection = next;
      scrollToSection(sections[currentSection]);
      window.setTimeout(function () {
        isScrolling = false;
      }, scrollCooldown);
    },
    { passive: true }
  );

  /* ── Section reveal au scroll (IntersectionObserver) ── */
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.demo-sector-page section:not(.hero)').forEach(function (sec) {
      sectionObserver.observe(sec);
    });
    /* Hero : toujours visible */
    var heroEl = document.querySelector('.hero');
    if (heroEl) heroEl.classList.add('visible');
  } else {
    /* Fallback */
    document.querySelectorAll('.demo-sector-page section').forEach(function (sec) {
      sec.classList.add('visible');
      sec.style.opacity = '1';
      sec.style.transform = 'none';
    });
  }
})();
