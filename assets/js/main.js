document.addEventListener('DOMContentLoaded', function () {
  // Progress
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

  // Nav hide
  var nav = document.querySelector('.nav');
  if (nav && snap) {
    var lastY = 0;
    snap.addEventListener(
      'scroll',
      function () {
        var y = snap.scrollTop;
        nav.classList.toggle('hidden', y > lastY && y > 80);
        lastY = y;
      },
      { passive: true },
    );
  }

  // Curseur
  var cur = document.getElementById('cursor');
  if (cur && window.matchMedia('(hover:hover)').matches) {
    document.addEventListener('mousemove', function (e) {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a,button,[role="button"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cur.classList.add('active');
      });
      el.addEventListener('mouseleave', function () {
        cur.classList.remove('active');
      });
    });
  }

  // IntersectionObserver animations
  var anims = document.querySelectorAll('.anim-fade,.anim-up,.anim-scale');
  if (anims.length) {
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

  // Count-up
  document.querySelectorAll('.count-up').forEach(function (el) {
    var target = parseInt(el.dataset.target, 10),
      dur = 1600;
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

  // Nav dots
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
        sects[i] && sects[i].scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // Burger
  var burger = document.querySelector('.nav__burger'),
    drawer = document.querySelector('.nav__drawer');
  if (burger && drawer)
    burger.addEventListener('click', function () {
      var o = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', o);
    });

  // Sélecteur secteur
  var sbtns = document.querySelectorAll('.sector-btn'),
    ocards = document.querySelectorAll('.offre-card[data-sectors]');
  sbtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sbtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      var sel = btn.dataset.sector;
      ocards.forEach(function (card) {
        var ss = card.dataset.sectors.split(',');
        card.closest('.offre-wrap').style.display =
          sel === 'tous' || ss.includes(sel) ? '' : 'none';
      });
    });
  });

  // Barres graphique
  var bars = document.querySelectorAll('.bar[data-h]');
  if (bars.length) {
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

  // Donut SVG
  var donut = document.getElementById('donut-svg');
  if (donut) {
    var r = 44,
      circ = 2 * Math.PI * r,
      data = [
        { p: 45, c: '#00e5b0' },
        { p: 30, c: '#b388ff' },
        { p: 15, c: '#7fffea' },
        { p: 10, c: '#e040fb' },
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
});
