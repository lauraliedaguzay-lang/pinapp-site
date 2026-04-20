/**
 * Démo workflow n8n — #s5b (pas de CDN). Respecte prefers-reduced-motion.
 */
(function () {
  var root = document.getElementById('automation-demo');
  if (!root) return;

  var btn = root.querySelector('[data-auto-simulate]');
  var statusEl = root.querySelector('[data-auto-status]');
  var timerEl = root.querySelector('[data-auto-timer]');
  var particle = root.querySelector('[data-auto-particle]');
  var nodes = root.querySelectorAll('[data-auto-node]');

  var steps = [
    { msg: 'Lead entrant…' },
    { msg: 'IA qualifie le score…' },
    { msg: 'CRM enrichi…' },
    { msg: "Slack notifie l'équipe…" },
    { msg: 'Cal.com propose un créneau…' },
    { msg: 'Terminé — prêt pour la suite.' },
  ];

  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function setLit(i) {
    for (var j = 0; j < nodes.length; j++) {
      nodes[j].classList.toggle('is-lit', j === i);
    }
  }

  function runReduced() {
    if (statusEl) statusEl.textContent = 'Mode sobre : animation désactivée.';
    if (timerEl) timerEl.textContent = '1,2 s';
    setLit(nodes.length - 1);
  }

  function animateTimer() {
    if (!timerEl) return;
    var start = null;
    var dur = 900;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var v = (p * 1.2).toFixed(1).replace('.', ',');
      timerEl.textContent = '0,0 s → ' + v + ' s';
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function runFull() {
    if (particle) {
      particle.classList.remove('is-run');
      void particle.offsetWidth;
      particle.classList.add('is-run');
    }
    animateTimer();
    var i = 0;
    function step() {
      if (i < nodes.length) setLit(i);
      if (statusEl && steps[i]) statusEl.textContent = steps[i].msg;
      i++;
      if (i <= nodes.length) {
        window.setTimeout(step, i === 0 ? 200 : 260);
      } else {
        window.setTimeout(function () {
          setLit(-1);
        }, 400);
      }
    }
    step();
  }

  if (btn) {
    btn.addEventListener('click', function () {
      if (reducedMotion()) {
        runReduced();
        return;
      }
      runFull();
    });
  }
})();
