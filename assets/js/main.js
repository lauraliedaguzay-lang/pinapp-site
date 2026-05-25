/* Pinapp — Main JS V2 */
document.addEventListener('DOMContentLoaded', function () {
  function pinappNeuroCalm() {
    return (
      document.documentElement.getAttribute('data-pinapp-calm') === '1' ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    );
  }
  var calm = pinappNeuroCalm();

  // ── PROGRESS
  var prog = document.getElementById('progress'),
    snap = document.querySelector('.snap-container');
  if (prog && snap)
    snap.addEventListener(
      'scroll',
      function () {
        var t = snap.scrollHeight - snap.clientHeight;
        prog.style.width = t > 0 ? (snap.scrollTop / t) * 100 + '%' : '0%';
      },
      { passive: true },
    );

  // ── NAV HIDE
  var nav = document.querySelector('.nav'),
    lastY = 0;
  if (nav && snap)
    snap.addEventListener(
      'scroll',
      function () {
        var y = snap.scrollTop;
        nav.classList.toggle('hidden', y > lastY && y > 80);
        lastY = y;
      },
      { passive: true },
    );

  // ── CURSEUR + TRAÎNÉE
  var cur = document.getElementById('cursor'),
    trail = document.getElementById('cursor-trail');
  if (cur && window.matchMedia('(hover:hover)').matches && !calm) {
    var tx = 0,
      ty = 0;
    document.addEventListener('mousemove', function (e) {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
      setTimeout(function () {
        if (trail) {
          trail.style.left = e.clientX + 'px';
          trail.style.top = e.clientY + 'px';
        }
      }, 80);
    });
    document
      .querySelectorAll('a,button,[role="button"],.card,.carousel-item')
      .forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          cur.classList.add('active');
        });
        el.addEventListener('mouseleave', function () {
          cur.classList.remove('active');
        });
      });
  }

  // ── INTERSECTION OBSERVER
  var anims = document.querySelectorAll('.anim-fade,.anim-up,.anim-scale,.anim-left,.anim-right');
  if (anims.length) {
    if (calm) {
      anims.forEach(function (el) {
        el.classList.add('visible');
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              var d = parseInt(e.target.dataset.delay || 0);
              setTimeout(function () {
                e.target.classList.add('visible');
              }, d);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      anims.forEach(function (el) {
        io.observe(el);
      });
    }
  }

  // ── COUNT-UP
  document.querySelectorAll('.count-up').forEach(function (el) {
    var target = parseInt(el.dataset.target, 10),
      dur = 1800;
    if (calm) {
      if (target) el.textContent = target.toLocaleString('fr-FR');
      return;
    }
    var io2 = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io2.disconnect();
      var t0 = performance.now();
      function step(now) {
        var p = Math.min((now - t0) / dur, 1),
          e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(e * target).toLocaleString('fr-FR');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
    io2.observe(el);
  });

  // ── NAV DOTS
  var dots = document.querySelectorAll('.nav-dot'),
    sects = document.querySelectorAll('.snap-section');
  if (dots.length && snap) {
    snap.addEventListener(
      'scroll',
      function () {
        var mid = snap.scrollTop + snap.clientHeight / 2,
          active = 0;
        sects.forEach(function (s, i) {
          if (s.offsetTop <= mid) active = i;
        });
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === active);
        });
      },
      { passive: true },
    );
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        sects[i] && sects[i].scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
      });
    });
  }

  // ── BURGER + DRAWER
  // Refonte accueil : .nav__burger + .nav__drawer
  // Pages grille (grid.css) : #burger + #mobileDrawer
  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.nav__drawer');
  var burgerGrid = document.getElementById('burger');
  var drawerGrid = document.getElementById('mobileDrawer');
  var drawerCloseBtn = document.getElementById('drawerClose');

  if (burger && drawer) {
    function closeNavDrawer() {
      drawer.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNavDrawer);
    });
    document.addEventListener('click', function (e) {
      if (!drawer.classList.contains('open')) return;
      if (burger.contains(e.target) || drawer.contains(e.target)) return;
      closeNavDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNavDrawer();
    });
  } else if (burgerGrid && drawerGrid) {
    function setGridDrawerOpen(open) {
      drawerGrid.classList.toggle('open', open);
      drawerGrid.setAttribute('aria-hidden', open ? 'false' : 'true');
      burgerGrid.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burgerGrid.addEventListener('click', function (e) {
      e.stopPropagation();
      setGridDrawerOpen(!drawerGrid.classList.contains('open'));
    });
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', function () {
        setGridDrawerOpen(false);
      });
    }
    drawerGrid.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        setGridDrawerOpen(false);
      });
    });
    drawerGrid.addEventListener('click', function (e) {
      if (e.target === drawerGrid) setGridDrawerOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawerGrid.classList.contains('open')) setGridDrawerOpen(false);
    });
  }

  // ── SÉLECTEUR SECTEUR
  var sbtns = document.querySelectorAll('.sector-btn');
  sbtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sbtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      var sel = btn.dataset.sector;
      document.querySelectorAll('.offre-wrap').forEach(function (wrap) {
        var card = wrap.querySelector('[data-sectors]');
        if (!card) {
          return;
        }
        var ss = card.dataset.sectors.split(',');
        wrap.style.display = sel === 'tous' || ss.includes(sel) ? '' : 'none';
      });
    });
  });

  // ── GRAPHIQUES BARRES
  var bars = document.querySelectorAll('.bar[data-h]');
  if (bars.length) {
    if (calm) {
      bars.forEach(function (b) {
        b.style.height = b.dataset.h + 'px';
      });
    } else {
      var bioBar = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.style.height = e.target.dataset.h + 'px';
              bioBar.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 },
      );
      bars.forEach(function (b) {
        b.style.height = '0';
        bioBar.observe(b);
      });
    }
  }

  // ── DONUT SVG
  var donut = document.getElementById('donut-svg');
  if (donut) {
    var r = 44,
      circ = 2 * Math.PI * r,
      data = [
        { p: 45, c: '#8E6AD8' },
        { p: 30, c: '#b388ff' },
        { p: 15, c: '#A88BE0' },
        { p: 10, c: '#6D8FEA' },
      ],
      offset = 0;
    data.forEach(function (d) {
      var arc = (d.p / 100) * circ,
        circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '50');
      circle.setAttribute('cy', '50');
      circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', d.c);
      circle.setAttribute('stroke-width', '12');
      circle.setAttribute('stroke-dasharray', arc + ' ' + (circ - arc));
      circle.setAttribute('stroke-dashoffset', -offset);
      circle.setAttribute('transform', 'rotate(-90 50 50)');
      donut.appendChild(circle);
      offset += arc;
    });
  }

  // ── CAROUSEL MICHA
  document.querySelectorAll('.carousel-wrap').forEach(function (wrap) {
    var track = wrap.querySelector('.carousel-track');
    var btnPrev = wrap.querySelector('.carousel-prev');
    var btnNext = wrap.querySelector('.carousel-next');
    var cats = wrap.querySelectorAll('.carousel-cat');
    if (!track) return;
    var current = 0,
      itemW = 296; // 280 + 16gap

    function scrollTo(i) {
      current = Math.max(0, Math.min(i, track.children.length - 1));
      track.style.transform = 'translateX(-' + current * itemW + 'px)';
    }
    if (btnPrev)
      btnPrev.addEventListener('click', function () {
        scrollTo(current - 1);
      });
    if (btnNext)
      btnNext.addEventListener('click', function () {
        scrollTo(current + 1);
      });

    // Filtrage par catégorie
    cats.forEach(function (cat) {
      cat.addEventListener('click', function () {
        cats.forEach(function (c) {
          c.classList.remove('active');
        });
        cat.classList.add('active');
        var sel = cat.dataset.cat;
        Array.from(track.children).forEach(function (item) {
          item.style.display = sel === 'tous' || item.dataset.cat === sel ? '' : 'none';
        });
        current = 0;
        track.style.transform = 'translateX(0)';
      });
    });

    // Touch swipe
    var touchStartX = 0;
    track.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    track.addEventListener(
      'touchend',
      function (e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) scrollTo(diff > 0 ? current + 1 : current - 1);
      },
      { passive: true },
    );
  });

  // ── LIGHTBOX
  var lb = document.getElementById('lightbox');
  if (lb) {
    document.querySelectorAll('.carousel-item[data-src]').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = lb.querySelector('img');
        if (img) {
          img.src = item.dataset.src;
          img.alt = item.dataset.alt || '';
        }
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── URGENCE BANNER — compteur dynamique
  var urgenceCounts = document.querySelectorAll('.urgence-count');
  urgenceCounts.forEach(function (el) {
    // Nombre aléatoire de "personnes vues aujourd'hui"
    el.textContent = Math.floor(Math.random() * 40 + 20);
  });

  if (!document.querySelector('script[data-pinapp-cookies-banner]')) {
    var cbs = document.createElement('script');
    cbs.src = '/assets/js/pinapp-cookies-banner.js?v=1';
    cbs.defer = true;
    cbs.setAttribute('data-pinapp-cookies-banner', '1');
    document.body.appendChild(cbs);
  }

  var parHtml =
    '<p class="pinapp-footer-parrainage" style="font-size:0.75rem;color:rgba(232,244,248,0.4);margin-top:1rem;">' +
    '🍍 Parrainage — Recommandez un client, recevez 10% sur votre prochaine prestation. ' +
    '<a href="mailto:contact@pinapp.fr?subject=Parrainage" style="color:#A88BE0;">En savoir plus</a></p>';
  document.querySelectorAll('footer').forEach(function (foot) {
    if (foot.querySelector('.pinapp-footer-parrainage')) return;
    var w = document.createElement('div');
    w.className = 'pinapp-footer-parrainage-wrap';
    w.innerHTML = parHtml;
    foot.appendChild(w);
  });
});
