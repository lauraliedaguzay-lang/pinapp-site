/**
 * V5.0 — scroll cue from opening scene to hero (no smooth scroll per repo rules).
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.ouverture-scroll-cue');
    var hero = document.getElementById('s1');
    if (!btn || !hero) return;
    btn.addEventListener('click', function () {
      try {
        hero.scrollIntoView({ behavior: 'instant', block: 'start' });
      } catch (e) {
        try {
          hero.scrollIntoView(true);
        } catch (e2) {}
      }
      try {
        hero.focus({ preventScroll: true });
      } catch (e3) {}
    });
  });
})();
