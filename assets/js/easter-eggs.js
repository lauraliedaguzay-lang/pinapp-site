/* PINAPP — EASTER EGGS POUR DEVS CURIEUX */
(function () {
  var css = {
    title:
      'background: linear-gradient(135deg, #00E5B0, #9B6DFF); color: #08090e; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 8px;',
    subtitle: 'color: #00E5B0; font-size: 13px; font-weight: 500;',
    text: 'color: #f0f8ff; font-size: 12px;',
    link: 'color: #FF6B9D; font-size: 12px; text-decoration: underline;',
  };

  console.log('%c Pinapp ', css.title);
  console.log('%cSalut, dev curieux.', css.subtitle);
  console.log('%cTu inspectes notre code ? On adore ça.', css.text);
  console.log('%cPinapp est un duo basé à Bordeaux.', css.text);
  console.log(
    "%cLauralie code, Michaël filme. On fait des sites, des automations n8n, de l'IA et de la vidéo.",
    css.text,
  );
  console.log('%cSi tu cherches un partenaire dev / studio à Bordeaux : contact@pinapp.fr', css.subtitle);
  console.log('%cOu réserve un appel : https://cal.com/lauralie-daguzay-hdglzw/diagnostic', css.link);
  console.log(
    '%cAstuce : code Konami ou tape pinapp.duo() dans la console.',
    css.text,
  );

  var konami = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
  ];
  var pos = 0;
  document.addEventListener(
    'keydown',
    function (e) {
      var expected = konami[pos];
      if (e.code === expected) {
        pos++;
        if (pos === konami.length) {
          triggerKonami();
          pos = 0;
        }
      } else {
        pos = 0;
      }
    },
    { passive: true },
  );

  function triggerKonami() {
    var overlay = document.createElement('div');
    overlay.setAttribute('role', 'presentation');
    overlay.style.cssText =
      'position:fixed;inset:0;background:radial-gradient(ellipse at center, rgba(0,229,176,0.95), rgba(155,109,255,0.95));z-index:99999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,sans-serif;color:#08090e;text-align:center;animation:konamiFade 4s ease-out forwards;';
    overlay.innerHTML =
      '<div><h1 style="font-size:clamp(32px,8vw,64px);margin:0 0 16px;letter-spacing:-0.04em;">KONAMI CODE</h1><p style="font-size:clamp(14px,3vw,20px);margin:0;font-weight:500;">Tu connais les classiques. Respect.<br><span style="font-size:14px;opacity:0.7">— Lauralie &amp; Michaël (Pinapp)</span></p></div>';
    if (!document.getElementById('konami-style')) {
      var style = document.createElement('style');
      style.id = 'konami-style';
      style.textContent =
        '@keyframes konamiFade { 0% { opacity: 0 } 20% { opacity: 1 } 80% { opacity: 1 } 100% { opacity: 0 } }';
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);
    setTimeout(function () {
      overlay.remove();
    }, 4000);
  }

  window.pinapp = {
    duo: function () {
      console.log('%c LAURALIE DAGUZAY ', 'background:#00E5B0;color:#08090e;font-weight:bold;padding:6px 12px;border-radius:4px;');
      console.log('%cCofondatrice — Systèmes, IA, web', 'color:#00E5B0;');
      console.log('%cBordeaux · code-first · obsessive sur les détails', css.text);
      console.log(' ');
      console.log('%c MICHAËL BOUILHAC ', 'background:#9B6DFF;color:#08090e;font-weight:bold;padding:6px 12px;border-radius:4px;');
      console.log('%cCofondateur — Vidéo, image, IA créative', 'color:#9B6DFF;');
      console.log('%cBordeaux · visual-first · expert sur la post-prod', css.text);
      console.log(' ');
      console.log('%cContact : contact@pinapp.fr', 'color:#FF6B9D;font-weight:500;');
      console.log('%cRDV : https://cal.com/lauralie-daguzay-hdglzw/diagnostic', 'color:#FF6B9D;font-weight:500;');
      return 'Pinapp · Bordeaux';
    },
    version: '7.0',
    foundedAt: '2010',
  };
})();
