/**
 * V2.4 prep — Fonds vidéo Runway (muets) : si <source src> est renseigné, la vidéo remplace l'image.
 * Lecture / pause via IntersectionObserver (50 % viewport), sans piste audio.
 */
(function () {
  function sourceUrl(video) {
    var s = video.querySelector('source');
    return s ? String(s.getAttribute('src') || '').trim() : '';
  }

  function setStackState(stack, hasUrl) {
    if (!stack) return;
    if (hasUrl) stack.classList.add('has-video');
    else stack.classList.remove('has-video');
  }

  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (reducedMotion()) return;

    document.querySelectorAll('.lieu-bg-video').forEach(function (video) {
      var stack = video.closest('.voyage-scene__media-stack');
      var url = sourceUrl(video);
      setStackState(stack, !!url);
      if (!url) return;

      try {
        video.load();
      } catch (e) {}

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (document.documentElement.classList.contains('voyage-sober')) {
              try {
                video.pause();
              } catch (e2) {}
              return;
            }
            if (en.intersectionRatio >= 0.5) {
              video.play().catch(function () {});
            } else {
              try {
                video.pause();
              } catch (e3) {}
            }
          });
        },
        { threshold: [0, 0.5, 1] }
      );
      io.observe(video);
    });
  });
})();
