/**
 * Pinapp V2.5 — cinema scrub: GSAP ScrollTrigger scrub + global scroll % → time + crossfade.
 * Nine chapters, eight MP4 files (ch5 and ch5b share 05-sortie-vaisseau.mp4).
 */
(function () {
  var VIDEO_BASE = '/assets/video/voyage/';
  /** Frame-0 JPEG fallbacks (générés via tools/pinapp-poster-gen.ps1) — évite fond noir si decode lent */
  var CINEMA_POSTER = {
    '01-main-hologramme.mp4': '/assets/img/voyage/01-main-poster.jpg',
    '02-couloir-passengers.mp4': '/assets/img/voyage/02-couloir-poster.jpg',
    '03-hublot-cosmos.mp4': '/assets/img/voyage/03-hublot-poster.jpg',
    '04-constellation-mp.mp4': '/assets/img/voyage/04-constellation-poster.jpg',
    '05-sortie-vaisseau.mp4': '/assets/img/voyage/05-sortie-poster.jpg',
    '06-balade-cosmos.mp4': '/assets/img/voyage/06-balade-poster.jpg',
    '07-tourbillon-etoiles.mp4': '/assets/img/voyage/07-tourbillon-poster.jpg',
    '08-atterrissage-sable.mp4': '/assets/img/voyage/08-sable-poster.jpg',
  };

  /** Optional AV1 WebM (généré via tools/pinapp-perf-gen.ps1) — si absent, le navigateur prend le MP4. */
  var CINEMA_WEBM = {
    '01-main-hologramme.mp4': '01-main.webm',
    '02-couloir-passengers.mp4': '02-couloir.webm',
    '03-hublot-cosmos.mp4': '03-hublot.webm',
    '04-constellation-mp.mp4': '04-constellation.webm',
    '05-sortie-vaisseau.mp4': '05-sortie.webm',
    '06-balade-cosmos.mp4': '06-balade.webm',
    '07-tourbillon-etoiles.mp4': '07-tourbillon.webm',
    '08-atterrissage-sable.mp4': '08-sable.webm',
  };

  function cinemaPlay(video, label) {
    try {
      var p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function (err) {
          try {
            console.error('[cinema] play failed', label || '', video.currentSrc || video.src, err);
          } catch (e2) {}
        });
      }
    } catch (e) {
      try {
        console.error('[cinema] play threw', label || '', video.currentSrc || video.src, e);
      } catch (e2) {}
    }
  }

  /** Playback windows: scroll % [s0,s1) → video time [t0,t1] seconds */
  function timelineSegments() {
    return [
      { ch: 0, s0: 0, s1: 12, t0: 0, t1: 3, file: '01-main-hologramme.mp4' },
      { ch: 1, s0: 14, s1: 26, t0: 0, t1: 4, file: '02-couloir-passengers.mp4' },
      { ch: 2, s0: 28, s1: 40, t0: 0, t1: 6, file: '03-hublot-cosmos.mp4' },
      { ch: 3, s0: 42, s1: 54, t0: 0, t1: 3.5, file: '04-constellation-mp.mp4' },
      { ch: 4, s0: 56, s1: 66, t0: 0, t1: 4, file: '05-sortie-vaisseau.mp4' },
      { ch: 5, s0: 66, s1: 76, t0: 4, t1: 8, file: '05-sortie-vaisseau.mp4' },
      { ch: 6, s0: 78, s1: 88, t0: 0, t1: 5, file: '06-balade-cosmos.mp4' },
      { ch: 7, s0: 90, s1: 96, t0: 0, t1: 4, file: '07-tourbillon-etoiles.mp4' },
      { ch: 8, s0: 98, s1: 100, t0: 0, t1: 3, file: '08-atterrissage-sable.mp4' },
    ];
  }

  function transitions() {
    return [
      { from: 0, to: 1, s0: 12, s1: 14 },
      { from: 1, to: 2, s0: 26, s1: 28 },
      { from: 2, to: 3, s0: 40, s1: 42 },
      { from: 3, to: 4, s0: 54, s1: 56 },
      { from: 4, to: 5, s0: 66, s1: 66 },
      { from: 5, to: 6, s0: 76, s1: 78 },
      { from: 6, to: 7, s0: 88, s1: 90 },
      { from: 7, to: 8, s0: 96, s1: 98 },
    ];
  }

  function chaptersMeta() {
    var segs = timelineSegments();
    var list = [];
    var i;
    for (i = 0; i < segs.length; i++) {
      list.push({
        id: i + 1,
        src: segs[i].file,
        start: segs[i].s0 * 10,
        end: segs[i].s1 * 10,
        duration: 10,
        label: String(i + 1),
      });
    }
    return list;
  }

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

  function pinProgressPct() {
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var y = window.scrollY || window.pageYOffset || 0;
    return Math.min(100, Math.max(0, (y / max) * 100));
  }

  function safeTime(v, d) {
    if (!isFinite(d) || d <= 0) return 0;
    if (!isFinite(v) || v < 0) return 0;
    return Math.min(Math.max(v, 0), d - 0.04);
  }

  function findPlaySegment(pct, segs) {
    var i;
    for (i = 0; i < segs.length; i++) {
      if (pct >= segs[i].s0 && pct < segs[i].s1) return { seg: segs[i], index: i };
    }
    if (pct >= 100 && segs.length) {
      var last = segs[segs.length - 1];
      return { seg: last, index: segs.length - 1 };
    }
    return { seg: segs[0], index: 0 };
  }

  function findTransition(pct, trans) {
    var j;
    for (j = 0; j < trans.length; j++) {
      var tr = trans[j];
      if (tr.s1 > tr.s0) {
        if (pct >= tr.s0 && pct < tr.s1) return { tr: tr, index: j };
      } else if (pct === tr.s0) {
        return { tr: tr, index: j };
      }
    }
    return null;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /** Cinéma lecture continue, sans ScrollTrigger (prefers-reduced-motion / accessibilité). */
  function initScrubberReducedMotion(cinema, trackA, trackB, mainEl) {
    var segs = timelineSegments();
    var first = segs[0];
    document.documentElement.classList.add('voyage-v24-cinema');
    try {
      if (document.body) document.body.classList.add('voyage-v24-cinema');
    } catch (eB) {}
    cinema.hidden = false;
    cinema.removeAttribute('hidden');
    try {
      cinema.style.display = 'block';
    } catch (eD) {}
    trackA.muted = true;
    trackB.muted = true;
    trackA.playsInline = true;
    trackB.playsInline = true;
    trackA.loop = true;
    trackB.loop = true;
    trackA.classList.add('is-active');
    trackB.classList.remove('is-active');
    try {
      trackB.style.opacity = '0';
      trackA.style.opacity = '1';
    } catch (eO) {}
    try {
      trackA.removeAttribute('src');
      trackA.innerHTML = '';
      var w0 = CINEMA_WEBM[first.file];
      if (w0) {
        var sw0 = document.createElement('source');
        sw0.src = VIDEO_BASE + w0;
        sw0.type = 'video/webm';
        trackA.appendChild(sw0);
      }
      var sm0 = document.createElement('source');
      sm0.src = VIDEO_BASE + first.file;
      sm0.type = 'video/mp4';
      trackA.appendChild(sm0);
      trackA.poster = CINEMA_POSTER[first.file] || '';
      trackA.load();
    } catch (eL) {}
    trackA.addEventListener(
      'loadeddata',
      function onLd() {
        try {
          trackA.currentTime = 0;
        } catch (eT) {}
        cinemaPlay(trackA, 'reduced-motion-loop');
      },
      { once: true }
    );
    try {
      console.info('[cinema-scrub]', {
        reducedMotion: true,
        tracksFound: 2,
        scrubActive: false,
        mode: 'autoplay-loop',
      });
    } catch (eI) {}
  }

  function initScrubber() {
    var cinema = document.getElementById('voyage-cinema');
    var trackA = document.getElementById('cinema-track-a');
    var trackB = document.getElementById('cinema-track-b');
    var mainEl = document.getElementById('voyage-main');
    if (!cinema || !trackA || !trackB || !mainEl) {
      try {
        console.error('[voyage-scrubber] missing DOM nodes', {
          cinema: !!cinema,
          trackA: !!trackA,
          trackB: !!trackB,
          main: !!mainEl,
        });
      } catch (e0) {}
      return;
    }

    if (reducedMotion()) {
      initScrubberReducedMotion(cinema, trackA, trackB, mainEl);
      return;
    }

    var segs = timelineSegments();
    var trans = transitions();

    document.documentElement.classList.add('voyage-v24-cinema');
    try {
      if (document.body) document.body.classList.add('voyage-v24-cinema');
    } catch (eBody) {}
    cinema.hidden = false;
    cinema.removeAttribute('hidden');
    cinema.setAttribute('aria-hidden', 'true');
    try {
      cinema.style.display = 'block';
    } catch (eDisp) {}

    trackA.muted = true;
    trackB.muted = true;
    trackA.playsInline = true;
    trackB.playsInline = true;
    trackA.setAttribute('playsinline', '');
    trackB.setAttribute('playsinline', '');
    trackA.loop = true;
    trackB.loop = true;
    trackA.setAttribute('loop', '');
    trackB.setAttribute('loop', '');
    trackA.preload = 'auto';
    trackB.preload = 'auto';

    function logCinemaError(v, tag) {
      v.addEventListener(
        'error',
        function () {
          var err = v.error;
          try {
            console.error(
              '[cinema] media error',
              tag,
              v.currentSrc || v.src,
              err ? 'code ' + err.code + ' ' + (err.message || '') : 'unknown'
            );
          } catch (e0) {}
        },
        { passive: true }
      );
    }
    logCinemaError(trackA, 'cinema-track-a');
    logCinemaError(trackB, 'cinema-track-b');

    try {
      window.__PINAPP_V24_CHAPTERS__ = chaptersMeta();
    } catch (e0) {}

    var active = trackA;
    var standby = trackB;
    var currentChapter = -1;
    var activeFile = '';
    var lastEmitted = -1;
    var lastSwapPair = '';

    function setActiveVisual(which) {
      trackA.classList.toggle('is-active', which === trackA);
      trackB.classList.toggle('is-active', which === trackB);
    }

    function applySrc(video, file) {
      var url = VIDEO_BASE + file;
      try {
        video.pause();
      } catch (e) {}
      video.removeAttribute('src');
      video.innerHTML = '';
      var wv = CINEMA_WEBM[file];
      if (wv) {
        var sw = document.createElement('source');
        sw.src = VIDEO_BASE + wv;
        sw.type = 'video/webm';
        video.appendChild(sw);
      }
      var sm = document.createElement('source');
      sm.src = url;
      sm.type = 'video/mp4';
      video.appendChild(sm);
      try {
        video.poster = CINEMA_POSTER[file] || '';
      } catch (eP) {}
      try {
        video.load();
      } catch (e2) {}
      cinemaPlay(video, 'after applySrc ' + file);
    }

    function emitChapter(idx, progress, previousIndex) {
      if (idx === lastEmitted) return;
      lastEmitted = idx;
      var sec = document.querySelector('#voyage-main section.voyage-scene[data-chapter="' + (idx + 1) + '"]');
      try {
        document.dispatchEvent(
          new CustomEvent('pinapp:chapterchange', {
            detail: {
              chapter: idx + 1,
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
        chapter: idx + 1,
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

    function ensureFileForChapter(chIdx, file, prevIdx, cb) {
      if (file === activeFile) {
        if (cb) cb();
        return;
      }
      loadChapterFile(file, chIdx, prevIdx, cb);
    }

    function setCrossfade(u) {
      u = Math.min(1, Math.max(0, u));
      try {
        active.style.opacity = String(u);
        standby.style.opacity = String(1 - u);
      } catch (e) {}
    }

    function clearCrossfade() {
      try {
        active.style.opacity = '';
        standby.style.opacity = '';
      } catch (e2) {}
    }

    function preloadNext(fromCh) {
      var next = segs[fromCh + 1];
      if (!next) return;
      if (standby.getAttribute('data-preload-src') === next.file) return;
      standby.setAttribute('data-preload-src', next.file);
      applySrc(standby, next.file);
      try {
        standby.load();
      } catch (e4) {}
    }

    function tickFromProgress(pct) {
      var tr = findTransition(pct, trans);
      var prevCh = currentChapter;

      if (tr && tr.tr.s1 > tr.tr.s0) {
        var trLo = tr.tr;
        var u = (pct - trLo.s0) / (trLo.s1 - trLo.s0);
        var fromSeg = segs[trLo.from];
        var toSeg = segs[trLo.to];
        var pairKey = trLo.from + '-' + trLo.to;

        if (currentChapter !== trLo.to) {
          currentChapter = trLo.to;
          emitChapter(currentChapter, u, prevCh);
        }

        if (fromSeg.file !== toSeg.file) {
          if (lastSwapPair !== pairKey) {
            lastSwapPair = pairKey;
            ensureFileForChapter(trLo.to, toSeg.file, trLo.from, function () {
              var dA = active.duration;
              var dB = standby.duration;
              try {
                active.currentTime = safeTime(fromSeg.t1, isFinite(dA) ? dA : 10);
              } catch (e5) {}
              try {
                standby.currentTime = safeTime(toSeg.t0, isFinite(dB) ? dB : 10);
              } catch (e6) {}
            });
          }
          var dOut = active.duration;
          var dIn = standby.duration;
          try {
            active.currentTime = safeTime(lerp(fromSeg.t1, fromSeg.t0, u), isFinite(dOut) ? dOut : 10);
          } catch (e7) {}
          try {
            standby.currentTime = safeTime(lerp(toSeg.t0, toSeg.t1, u), isFinite(dIn) ? dIn : 10);
          } catch (e8) {}
          setCrossfade(u);
        } else {
          clearCrossfade();
          lastSwapPair = '';
          ensureFileForChapter(trLo.from, fromSeg.file, -1, function () {
            var d = active.duration;
            var tMid = lerp(fromSeg.t1, toSeg.t0, u);
            try {
              active.currentTime = safeTime(tMid, isFinite(d) ? d : 10);
            } catch (e9) {}
          });
        }
        return;
      }

      lastSwapPair = '';
      clearCrossfade();

      var play = findPlaySegment(pct, segs);
      var seg = play.seg;
      var chIdx = play.index;
      var span = Math.max(0.0001, seg.s1 - seg.s0);
      var local = (pct - seg.s0) / span;
      local = Math.min(1, Math.max(0, local));

      if (chIdx !== currentChapter) {
        var prev = currentChapter;
        currentChapter = chIdx;
        emitChapter(chIdx, local, prev);
        ensureFileForChapter(chIdx, seg.file, prev, function () {
          var d = active.duration;
          try {
            active.currentTime = safeTime(lerp(seg.t0, seg.t1, local), isFinite(d) ? d : 10);
          } catch (e10) {}
        });
      } else {
        ensureFileForChapter(chIdx, seg.file, -1, function () {
          var d2 = active.duration;
          try {
            active.currentTime = safeTime(lerp(seg.t0, seg.t1, local), isFinite(d2) ? d2 : 10);
          } catch (e11) {}
        });
      }

      if (segs[chIdx + 1]) {
        preloadNext(chIdx);
      }
    }

    (function bootstrap() {
      var first = segs[0];
      applySrc(active, first.file);
      activeFile = first.file;
      currentChapter = 0;
      setActiveVisual(active);
      function tryPlay() {
        cinemaPlay(active, 'bootstrap');
      }
      function onLoaded() {
        try {
          active.currentTime = safeTime(first.t0, active.duration || 10);
        } catch (eL) {}
        tryPlay();
      }
      if (active.readyState >= 2) {
        onLoaded();
      } else {
        active.addEventListener('loadeddata', onLoaded, { once: true });
      }
      preloadNext(0);
    })();

    function refresh() {
      tickFromProgress(pinProgressPct());
    }
    try {
      window.__PINAPP_V25_SCRUB_REFRESH__ = refresh;
    } catch (eW) {}

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: mainEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: refresh,
      });
      try {
        console.info('[cinema-scrub]', {
          reducedMotion: false,
          tracksFound: 2,
          scrubActive: true,
          mode: 'scroll-sync-segments',
        });
      } catch (eLog) {}
      window.addEventListener('scroll', refresh, { passive: true });
      window.addEventListener('resize', function () {
        try {
          ScrollTrigger.refresh();
        } catch (eR) {}
        refresh();
      });
    } else {
      try {
        console.info('[cinema-scrub]', {
          reducedMotion: false,
          tracksFound: 2,
          scrubActive: true,
          mode: 'scroll-sync-legacy-raf',
        });
      } catch (eLg) {}
      var raf = 0;
      function legacyTick() {
        raf = 0;
        tickFromProgress(pinProgressPct());
      }
      window.addEventListener(
        'scroll',
        function () {
          if (!raf) raf = window.requestAnimationFrame(legacyTick);
        },
        { passive: true }
      );
      window.addEventListener('resize', legacyTick, { passive: true });
      legacyTick();
    }

    refresh();
  }

  document.addEventListener('DOMContentLoaded', function () {
    // legacy listener (kept for safety)
  });

  function forceCinemaFallback() {
    try {
      document.documentElement.classList.add('voyage-v24-cinema');
    } catch (e0) {}
    try {
      var cinema = document.getElementById('voyage-cinema');
      var a = document.getElementById('cinema-track-a');
      if (cinema) {
        cinema.hidden = false;
        cinema.removeAttribute('hidden');
        cinema.setAttribute('aria-hidden', 'true');
      }
      if (a && !a.querySelector('source')) {
        a.muted = true;
        a.playsInline = true;
        a.setAttribute('playsinline', '');
        a.preload = 'auto';
        var ffb = '01-main-hologramme.mp4';
        a.removeAttribute('src');
        a.innerHTML = '';
        var wfb = CINEMA_WEBM[ffb];
        if (wfb) {
          var swfb = document.createElement('source');
          swfb.src = VIDEO_BASE + wfb;
          swfb.type = 'video/webm';
          a.appendChild(swfb);
        }
        var smfb = document.createElement('source');
        smfb.src = VIDEO_BASE + ffb;
        smfb.type = 'video/mp4';
        a.appendChild(smfb);
        try {
          a.poster = CINEMA_POSTER[ffb] || '';
        } catch (eP0) {}
        try {
          a.load();
        } catch (e1) {}
        cinemaPlay(a, 'forceCinemaFallback');
        a.classList.add('is-active');
      }
    } catch (e3) {}
  }

  function boot() {
    if (soberMode()) return;
    try {
      initScrubber();
      // If something external removed the class, keep the layer alive.
      if (!document.documentElement.classList.contains('voyage-v24-cinema')) {
        document.documentElement.classList.add('voyage-v24-cinema');
      }
    } catch (e) {
      try {
        console.error('[voyage-scrubber] initScrubber threw', e);
      } catch (e2) {}
      forceCinemaFallback();
    }
  }

  // Ensure boot runs even if this script loads after DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    window.setTimeout(boot, 0);
  }
})();
