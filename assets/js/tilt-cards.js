/**
 * WOW PR #183 — tilt 3D + reflet radial (cartes ciblées)
 */
(function () {
  "use strict";
  try {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("sober")) return;
  } catch (e) {
    return;
  }

  var selectors = ".stat, .offre-card, .demo-card, .pack-card, .testimonial-card";
  var cards = document.querySelectorAll(selectors);

  cards.forEach(function (card) {
    if (card.classList.contains("v10-tilt")) return;

    card.classList.add("tilt-card");
    var pos = window.getComputedStyle(card).position;
    if (pos === "static") {
      card.style.position = "relative";
    }

    var shine = document.createElement("div");
    shine.className = "tilt-card-shine";
    card.appendChild(shine);

    card.addEventListener(
      "mousemove",
      function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateY = x * 8;
        var rotateX = -y * 8;
        card.style.transform =
          "perspective(1000px) rotateX(" +
          rotateX +
          "deg) rotateY(" +
          rotateY +
          "deg) scale(1.02)";
        var shineX = ((e.clientX - rect.left) / rect.width) * 100;
        var shineY = ((e.clientY - rect.top) / rect.height) * 100;
        shine.style.background =
          "radial-gradient(circle at " +
          shineX +
          "% " +
          shineY +
          "%, rgba(244,236,217,0.14), transparent 52%)";
      },
      { passive: true }
    );

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
      shine.style.background = "";
    });
  });
})();
