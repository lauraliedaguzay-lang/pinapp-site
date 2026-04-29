/* ═══════════════════════════════════════════════════════════════
   PINAPP STUDIO · main.js
   Vanilla JS · zero dépendance · ~2 Ko
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Header scroll state ────────────────────────────────────────
  const hdr = document.getElementById('hdr');
  let scrolled = false;
  function onScroll() {
    const y = window.scrollY;
    const should = y > 24;
    if (should !== scrolled) {
      hdr.classList.toggle('scrolled', should);
      scrolled = should;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Nav burger ─────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  const btnMenu = document.getElementById('btn-menu');
  const btnClose = document.getElementById('btn-close-nav');

  function openNav() {
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    btnMenu.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    btnMenu.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  btnMenu.addEventListener('click', openNav);
  btnClose.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // ── Reveal on scroll ──────────────────────────────────────────
  const reveal = document.querySelectorAll('.card, .appr-item, .real-head, .diag-inner');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveal.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .9s cubic-bezier(.22,1,.36,1) ${i * 0.06}s, transform .9s cubic-bezier(.22,1,.36,1) ${i * 0.06}s`;
      io.observe(el);
    });
  }

  // ── Vidéo modal (Vimeo lazy-load) ─────────────────────────────
  const btnVideo = document.getElementById('btn-video');
  const videoModal = document.getElementById('video-modal');
  const videoClose = document.getElementById('video-close');
  const videoWrap = document.getElementById('video-iframe-wrap');

  function openVideo() {
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Lazy-load iframe Vimeo seulement à la première ouverture
    if (videoWrap && !videoWrap.querySelector('iframe')) {
      const vimeoId = videoWrap.getAttribute('data-vimeo-id') || '1187533853'; // VIMEO_VIDEO_ID
      const iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1&title=0&byline=0&portrait=0&playsinline=1&dnt=1';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'Pinapp Studio · présentation 90 secondes');
      videoWrap.appendChild(iframe);
    }
  }
  function closeVideo() {
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Détruire l'iframe pour stopper la lecture immédiatement
    if (videoWrap) videoWrap.innerHTML = '';
  }
  if (btnVideo) btnVideo.addEventListener('click', openVideo);
  if (videoClose) videoClose.addEventListener('click', closeVideo);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideo();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) closeVideo();
  });

  // ── Smooth anchor (with header offset) ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        const target = document.querySelector(id);
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Glow-up · respect prefers-reduced-motion + no touch ────────
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;

  // ── Loader initial Apple-style ─────────────────────────────────
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 800);
      }, reduceMotion ? 100 : 600);
    });
    // Failsafe : si load déjà fired
    if (document.readyState === 'complete') {
      setTimeout(() => loader.classList.add('hidden'), 100);
    }
  }

  // ── Split-text reveal sur titre hero ───────────────────────────
  if (!reduceMotion) {
    document.querySelectorAll('.hero-title-line').forEach((line) => {
      const text = line.textContent;
      const words = text.split(' ');
      line.innerHTML = words.map((w, i) =>
        `<span class="word" style="animation-delay:${0.5 + i * 0.08}s">${w}</span>`
      ).join(' ');
    });
  }

  // ── Custom cursor (desktop only) ───────────────────────────────
  if (!isTouch && !reduceMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    document.body.classList.add('has-cursor');

    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
    });
    function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx - 4}px, ${cy - 4}px, 0)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Hover state sur éléments cliquables
    const hoverables = 'a, button, .card, [role="button"], summary';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Hide cursor quand on quitte la fenêtre
    document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
  }

  // ── Mouse parallax sur flares hero ─────────────────────────────
  if (!isTouch && !reduceMotion) {
    const flares = document.querySelectorAll('.flare');
    const heroBg = document.querySelector('.hero');
    if (flares.length && heroBg) {
      let tx = 0, ty = 0, cx = 0, cy = 0;
      heroBg.addEventListener('mousemove', (e) => {
        const r = heroBg.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
      });
      function tick() {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        flares.forEach((f, i) => {
          const factor = (i + 1) * 12;
          f.style.setProperty('--mx', (cx * factor) + 'px');
          f.style.setProperty('--my', (cy * factor) + 'px');
        });
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  // ── Magnetic CTAs ──────────────────────────────────────────────
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll('.btn-primary, .hdr-cta, .video-player, .pricing-card-cta--primary').forEach(btn => {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

})();
