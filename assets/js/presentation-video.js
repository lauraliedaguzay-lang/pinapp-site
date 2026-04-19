/* ═══════════════════════════════════════════════════════════════
   PRESENTATION VIDEO — Controller ~46s · 9 scènes
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var SCRIPT = [
    { t: 0, duration: 3000, scene: 1 },
    { t: 3000, duration: 3000, scene: 2 },
    { t: 6000, duration: 5000, scene: 3 },
    { t: 11000, duration: 6000, scene: 4 },
    { t: 17000, duration: 5000, scene: 5 },
    { t: 22000, duration: 6000, scene: 6 },
    { t: 28000, duration: 6000, scene: 7 },
    { t: 34000, duration: 7000, scene: 8 },
    { t: 41000, duration: 5000, scene: 9 },
  ];
  var TOTAL_DURATION = 46000;

  function init(stageEl) {
    if (!stageEl || stageEl.__pvInit) return;
    stageEl.__pvInit = true;

    var scenes = stageEl.querySelectorAll("[data-scene]");
    var playBtn = stageEl.querySelector("[data-pv-play]");
    var restartBtn = stageEl.querySelector("[data-pv-restart]");
    var timelineFill = stageEl.querySelector("[data-pv-fill]");
    var timelineBar = stageEl.querySelector("[data-pv-timeline]");
    var timeLabel = stageEl.querySelector("[data-pv-time]");
    var overlay = stageEl.querySelector("[data-pv-overlay]");
    var audio = stageEl.querySelector("[data-pv-audio]");

    var startTs = null;
    var elapsed = 0;
    var rafId = null;
    var isPlaying = false;
    var currentScene = 0;

    function format(ms) {
      var s = Math.floor(ms / 1000);
      return "0:" + String(s).padStart(2, "0") + " / 0:46";
    }

    function setScene(idx) {
      if (idx === currentScene) return;
      scenes.forEach(function (s) {
        s.classList.remove("is-active");
      });
      var target = stageEl.querySelector('[data-scene="' + idx + '"]');
      if (target) target.classList.add("is-active");
      currentScene = idx;
    }

    function tick(ts) {
      if (!startTs) startTs = ts - elapsed;
      elapsed = ts - startTs;

      if (elapsed >= TOTAL_DURATION) {
        elapsed = TOTAL_DURATION;
        stop();
        return;
      }

      var i;
      for (i = SCRIPT.length - 1; i >= 0; i--) {
        if (elapsed >= SCRIPT[i].t) {
          setScene(SCRIPT[i].scene);
          break;
        }
      }

      var pct = (elapsed / TOTAL_DURATION) * 100;
      if (timelineFill) timelineFill.style.width = pct + "%";
      if (timeLabel) timeLabel.textContent = format(elapsed);

      rafId = requestAnimationFrame(tick);
    }

    function play() {
      if (isPlaying) return;
      isPlaying = true;
      stageEl.classList.add("is-playing");
      stageEl.classList.remove("is-paused");
      if (playBtn) playBtn.textContent = "\u23F8";

      if (audio && audio.getAttribute("src")) {
        audio.currentTime = elapsed / 1000;
        audio.play().catch(function () {});
      }

      startTs = null;
      rafId = requestAnimationFrame(tick);
    }

    function pause() {
      if (!isPlaying) return;
      isPlaying = false;
      stageEl.classList.remove("is-playing");
      stageEl.classList.add("is-paused");
      if (playBtn) playBtn.textContent = "\u25B6";
      if (audio) audio.pause();
      cancelAnimationFrame(rafId);
      startTs = null;
    }

    function stop() {
      isPlaying = false;
      stageEl.classList.remove("is-playing");
      stageEl.classList.add("is-paused");
      if (playBtn) playBtn.textContent = "\u25B6";
      cancelAnimationFrame(rafId);
      startTs = null;
    }

    function resetToStart() {
      pause();
      elapsed = 0;
      startTs = null;
      currentScene = 0;
      scenes.forEach(function (s) {
        s.classList.remove("is-active");
      });
      var first = stageEl.querySelector('[data-scene="1"]');
      if (first) first.classList.add("is-active");
      currentScene = 1;
      if (timelineFill) timelineFill.style.width = "0%";
      if (timeLabel) timeLabel.textContent = format(0);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      stageEl.classList.remove("is-playing");
      stageEl.classList.remove("is-paused");
    }

    function restart() {
      resetToStart();
      play();
    }

    function toggle() {
      if (elapsed >= TOTAL_DURATION) restart();
      else if (isPlaying) pause();
      else play();
    }

    stageEl.__pvReset = resetToStart;

    if (playBtn) playBtn.addEventListener("click", toggle);
    if (restartBtn) restartBtn.addEventListener("click", restart);
    if (overlay) overlay.addEventListener("click", toggle);

    if (timelineBar) {
      timelineBar.addEventListener("click", function (e) {
        var rect = timelineBar.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        elapsed = Math.max(0, Math.min(TOTAL_DURATION, pct * TOTAL_DURATION));
        startTs = null;
        if (audio && audio.getAttribute("src")) audio.currentTime = elapsed / 1000;
        if (timelineFill) timelineFill.style.width = pct * 100 + "%";
        if (timeLabel) timeLabel.textContent = format(elapsed);
      });
    }

    var particlesHost = stageEl.querySelector("[data-pv-particles]");
    if (particlesHost) {
      var colors = ["#4DD0E1", "#4DD0E1", "#E94695", "#9A7BD6"];
      var n;
      for (n = 0; n < 60; n++) {
        var p = document.createElement("span");
        p.className = "pv-particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * 100 + "%";
        p.style.color = colors[Math.floor(Math.random() * colors.length)];
        p.style.setProperty("--tx", Math.random() * 120 - 60 + "px");
        p.style.setProperty("--ty", Math.random() * 120 - 60 + "px");
        p.style.animationDuration = 4 + Math.random() * 6 + "s";
        p.style.animationDelay = Math.random() * -8 + "s";
        particlesHost.appendChild(p);
      }
    }

    stageEl.setAttribute("tabindex", "0");
    stageEl.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    });

    resetToStart();
  }

  function boot() {
    document.querySelectorAll("[data-pv-stage]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
