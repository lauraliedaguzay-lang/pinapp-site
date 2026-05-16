/**
 * Déplacement léger des CTA hero au survol (desktop pointeur fin).
 */
(function () {
  "use strict";
  if (document.documentElement.classList.contains("sober")) return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  } catch (e) {
    return;
  }
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var ctas = document.querySelectorAll(
    "#hero .hero-cta-primary, #hero .hero-cta-secondary, #hero .cta-magnetic"
  );
  if (!ctas.length) return;

  var radius = 8;

  function onMove(e) {
    var cta = e.currentTarget;
    var rect = cta.getBoundingClientRect();
    var x = e.clientX - rect.left - rect.width / 2;
    var y = e.clientY - rect.top - rect.height / 2;
    var dx = (x / rect.width) * radius * 2;
    var dy = (y / rect.height) * radius * 2;
    cta.style.transform = "translate(" + dx + "px," + dy + "px)";
  }

  function onLeave(e) {
    e.currentTarget.style.transform = "translate(0,0)";
  }

  for (var i = 0; i < ctas.length; i++) {
    var cta = ctas[i];
    cta.classList.add("cta-magnetic");
    cta.addEventListener("mousemove", onMove, { passive: true });
    cta.addEventListener("mouseleave", onLeave, { passive: true });
  }
})();
