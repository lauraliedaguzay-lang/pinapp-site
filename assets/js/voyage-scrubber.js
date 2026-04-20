/**
 * Pinapp V2.4 — scroll-scrub cinéma (double-buffer .cinema__track) + prélude 00.
 * Pas de CDN. Événement `pinapp:chapterchange` pour transitions (étape 5).
 */
(function () {
  var VIDEO_BASE = '/assets/video/voyage/';

  /**
   * Plages vh (spec §4) — duration = secondes indicatives pour metadata ;
   * start/end servent au debug / futures extensions.
   */
  var chapters = [
    { id: 1, src: '00-seedance-intro.mp4', start: 0, end: 80, duration: 10, label: 'Prélude' },
    { id: 2, src: '01-main-hologramme.mp4', start: 80, end: 180, duration: 10, label: 'Intro' },
    { id: 3, src: '02-couloir-passengers.mp4', start: 180, end: 300, duration: 10, label: 'Duo' },
    { id: 4, src: '03-hublot-cosmos.mp4', start: 300, end: 420, duration: 10, label: 'Métiers' },
    { id: 5, src: '04-constellation-mp.mp4', start: 420, end: 520, duration: 10, label: 'Constellation' },
    { id: 6, src: '05-sortie-vaisseau.mp4', start: 520, end: 600, duration: 10, label: 'Preuves' },
    { id: 7, src: '05-sortie-vaisseau.mp4', start: 600, end: 680, duration: 8, label: 'Automation n8n' },
    { id: 8, src: '06-balade-cosmos.mp4', start: 680, end: 800, duration: 10, label: 'Manifeste' },
    { id: 9, src: '07-tourbillon-etoiles.mp4', start: 800, end: 940, duration: 10, label: 'Réalisations' },
    {
      id: 10,
      src: '07-tourbillon-etoiles.mp4',
      start: 940,
      end: 1060,
      duration: 10,
      label: 'Contact',
    },
  ];

  try {
    window.__PINAPP_V24_CHAPTERS__ = chapters;
  } catch (e0) {}

  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function soberMode() {
    return document.documentElement.classList.contains('voyage-sober');
  }

  function sectionList() {
    return Array.prototype.slice.call(document.querySelectorAll('#voyage-main section.voyage-scene[data-chapter]')).sort(function (a, b) {
      return Number(a.getAttribute('data-chapter')) - Number(b.getAttribute('data-chapter'));
    });
  }

  function pickActiveSection(sections) {
    var y = window.innerHeight * 0.45;
    var bestI = 0;
    var bestScore = -1e9;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      var overlap = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (overlap > bestScore) {
        bestScore = overlap;
        bestI = i;
      }
      if (r.top <= y && r.bottom >= y) {
        return { index: i, el: sections[i] };
      }
    }
    return { index: bestI, el: sections[bestI] };
  }

  function progressInSection(sec) {
    var r = sec.getBoundingClientRect();
    var total = r.height || 1;
    var seen = Math.min(Math.max(-r.top, 0), total);
    return seen / total;
  }

  function safeTime(v, d) {
    if (!isFinite(d) || d <= 0) return 0;
    if (!isFinite(v) || v < 0) return 0;
    return Math.min(Math.max(v, 0), d - 0.04);
  }

  /** Fichier servi par le cinéma (08 pas encore généré → 07). */
  function resolveEffectiveVideoFile(sec, ch) {
    var raw = (sec && sec.getAttribute('data-video')) || '';
    raw = String(raw || '').trim();
    if (!raw && ch && ch.src) raw = String(ch.src).trim();
    if (raw === '08-lune-finale.mp4') return '07-tourbillon-etoiles.mp4';
    return raw;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (reducedMotion() || soberMode()) return;

    var cinema = document.getElementById('voyage-cinema');
    var trackA = document.getElementById('cinema-track-a');
    var trackB = document.getElementById('cinema-track-b');
    if (!cinema || !trackA || !trackB) return;

    var sections = sectionList();
    if (sections.length < 10) return;

    document.documentElement.classList.add('voyage-v24-cinema');
    cinema.hidden = false;
    cinema.removeAttribute('hidden');
    cinema.setAttribute('aria-hidden', 'true');

    trackA.muted = true;
    trackB.muted = true;
    trackA.playsInline = true;
    trackB.playsInline = true;
    trackA.setAttribute('playsinline', '');
    trackB.setAttribute('playsinline', '');
    trackA.removeAttribute('loop');
    trackB.removeAttribute('loop');
    trackA.preload = 'auto';
    trackB.preload = 'auto';

    var active = trackA;
    var standby = trackB;
    var currentChapter = -1;
    var activeFile = '';
    var raf = 0;
    var lastEmitted = -1;

    function setActiveVisual(which) {
      trackA.classList.toggle('is-active', which === trackA);
      trackB.classList.toggle('is-active', which === trackB);
    }

    /* Premier plan : src + lecture tout de suite (évite écran noir tant que le scroll n'a pas bougé). */
    (function bootstrapFirstClip() {
      var firstSec = sections[0];
      var firstCh = chapters[0];
      var firstFile = resolveEffectiveVideoFile(firstSec, firstCh);
      if (!firstFile) return;
      applySrc(active, firstFile);
      activeFile = firstFile;
      currentChapter = 0;
      setActiveVisual(active);
      function tryPlay() {
        try {
          active.play().catch(function () {});
        } catch (eP) {}
      }
      if (active.readyState >= 2) {
        tryPlay();
      } else {
        active.addEventListener(
          'loadeddata',
          function onFirstLoaded() {
            active.removeEventListener('loadeddata', onFirstLoaded);
            tryPlay();
          },
          { once: true }
        );
      }
    })();

    function applySrc(video, file) {
      var url = VIDEO_BASE + file;
      try {
        video.pause();
      } catch (e) {}
      video.src = url;
      try {
        video.load();
      } catch (e2) {}
    }

    function emitChapter(idx, sec, progress, previousIndex) {
      if (idx === lastEmitted) return;
      lastEmitted = idx;
      try {
        document.dispatchEvent(
          new CustomEvent('pinapp:chapterchange', {
            detail: {
              chapter: chapters[idx] ? chapters[idx].id : idx + 1,
              index: idx,
              previousIndex: typeof previousIndex === 'number' ? previousIndex : -1,
              section: sec,
              progress: progress,
            },
          })
        );
      } catch (e3) {}
    }

    function emitVideoSwapRequest(idx, previousIndex, incomingEl, outgoingEl, commit) {
      var detail = {
        chapter: chapters[idx] ? chapters[idx].id : idx + 1,
        index: idx,
        previousIndex: typeof previousIndex === 'number' ? previousIndex : -1,
        incomingEl: incomingEl,
        outgoingEl: outgoingEl,
        commit: typeof commit === 'function' ? commit : null,
        claimed: false,
      };
      try {
        document.dispatchEvent(
          new CustomEvent('pinapp:voyagechaptervideoswaprequest', {
            detail: detail,
          })
        );
      } catch (e3b) {}
      return detail;
    }

    function swapTracks() {
      var t = active;
      active = standby;
      standby = t;
      setActiveVisual(active);
    }

    function loadChapterFile(file, idx, prevChapter, onDone) {
      applySrc(standby, file);
      function onReady() {
        var incomingEl = standby;
        var outgoingEl = active;
        var committed = false;
        function commitSwap() {
          if (committed) return;
          committed = true;
          activeFile = file;
          swapTracks();
          if (onDone) onDone();
        }
        var swapDetail = emitVideoSwapRequest(idx, prevChapter, incomingEl, outgoingEl, commitSwap);
        if (!swapDetail.claimed) {
          commitSwap();
        }
      }
      function onErr() {
        activeFile = '';
        if (onDone) onDone();
      }
      standby.addEventListener('loadeddata', onReady, { once: true });
      standby.addEventListener('error', onErr, { once: true });
    }

    function tick() {
      raf = 0;
      if (reducedMotion() || soberMode()) return;
      var picked = pickActiveSection(sections);
      var idx = picked.index;
      var sec = picked.el;
      var ch = chapters[idx];
      var p = progressInSection(sec);
      if (!ch) return;

      var file = resolveEffectiveVideoFile(sec, ch);

      if (idx !== currentChapter) {
        var prevChapter = currentChapter;
        currentChapter = idx;
        emitChapter(idx, sec, p, prevChapter);
        if (file !== activeFile) {
          loadChapterFile(file, idx, prevChapter, function () {
            try {
              var d = active.duration;
              if (isFinite(d) && d > 0) active.currentTime = safeTime(p * d, d);
            } catch (e4) {}
            var nextCh = chapters[idx + 1];
            if (!nextCh) return;
            var nextSec = sections[idx + 1];
            var nextFile = nextSec ? resolveEffectiveVideoFile(nextSec, nextCh) : nextCh.src;
            if (!nextFile || nextFile === file) return;
            standby.removeAttribute('data-preload-src');
            standby.setAttribute('data-preload-src', nextFile);
            applySrc(standby, nextFile);
            try {
              standby.load();
            } catch (e5) {}
          });
          return;
        }
        var nextCh2 = chapters[idx + 1];
        if (nextCh2) {
          var nextSec2 = sections[idx + 1];
          var nextFile2 = nextSec2 ? resolveEffectiveVideoFile(nextSec2, nextCh2) : nextCh2.src;
          if (nextFile2 && nextFile2 !== file && standby.getAttribute('data-preload-src') !== nextFile2) {
            standby.setAttribute('data-preload-src', nextFile2);
            applySrc(standby, nextFile2);
            try {
              standby.load();
            } catch (e5b) {}
          }
        }
      }

      try {
        var d2 = active.duration;
        if (isFinite(d2) && d2 > 0) {
          active.currentTime = safeTime(p * d2, d2);
        }
      } catch (e6) {}
    }

    function onScroll() {
      if (raf) return;
      raf = window.requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    var io = new IntersectionObserver(
      function () {
        onScroll();
      },
      { root: null, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: '0px 0px -1px 0px' }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });

    tick();
  });
})();
