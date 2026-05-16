/**
 * WOW PR #183 — scramble texte sur eyebrows au scroll
 */
(function () {
  "use strict";
  if (document.documentElement.classList.contains("sober")) return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  } catch (e) {
    return;
  }

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  function scramble(el) {
    var finalText = el.getAttribute("data-scramble-text") || el.textContent.trim();
    if (!el.getAttribute("data-scramble-text")) {
      el.setAttribute("data-scramble-text", finalText);
    }
    var duration = 800;
    var start = performance.now();

    function frame(now) {
      var progress = Math.min((now - start) / duration, 1);
      var revealed = Math.floor(progress * finalText.length);
      var result = "";
      var i;
      for (i = 0; i < finalText.length; i++) {
        if (i < revealed) {
          result += finalText.charAt(i);
        } else if (finalText.charAt(i) === " ") {
          result += " ";
        } else {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      el.textContent = result;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = finalText;
      }
    }
    requestAnimationFrame(frame);
  }

  var eyebrows = document.querySelectorAll(
    ".hero-eyebrow, .section-eyebrow, .eyebrow, .presentation-video-eyebrow"
  );
  if (!eyebrows.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.getAttribute("data-scrambled")) {
          entry.target.setAttribute("data-scrambled", "true");
          scramble(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  eyebrows.forEach(function (el) {
    observer.observe(el);
  });
})();
