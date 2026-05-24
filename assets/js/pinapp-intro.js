/* Intro 3D Pinapp — le logo surgit en relief puis laisse place au hero.
   Sûr par défaut : ne tourne que si WebGL dispo. Sinon le fallback CSS (.pnp-fallback)
   joue et __pnpDefaultKill nettoie. reduced-motion / Mode sobre / déjà-vu = pas d'intro
   (gérés par le garde-fou inline dans la page). */
(function () {
  var el = document.getElementById('pnp-intro');
  var canvas = document.getElementById('pnp-intro-canvas');
  if (!el || !canvas || !window.__pnpIntro) return;

  var webglOk = false;
  try {
    var probe = document.createElement('canvas');
    webglOk = !!(window.WebGLRenderingContext && (probe.getContext('webgl') || probe.getContext('experimental-webgl')));
  } catch (e) { webglOk = false; }
  if (!webglOk || window.__pnpLite) return; // fallback CSS (fondu) + __pnpDefaultKill s'en chargent

  function killed() { return el.getAttribute('data-killed') === '1'; }

  // On s'engage sur le WebGL : annuler le retrait court (2,3 s) pour laisser three.js (1,3 Mo)
  // charger sur une vraie connexion. Pendant le chargement, le logo (fallback CSS) reste visible.
  try { clearTimeout(window.__pnpDefaultKill); } catch (e) {}

  import('/assets/vendor/three-0.170.module.js').then(function (THREE) {
    if (killed()) return;
    var lowPerf = (navigator.hardwareConcurrency || 4) < 4;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) { return; }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var W = window.innerWidth, H = window.innerHeight;
    renderer.setSize(W, H, false);

    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(48, W / H, 0.1, 100);
    cam.position.z = 6;
    var group = new THREE.Group();
    scene.add(group);

    // Champ de particules (ambiance)
    var N = lowPerf ? 110 : 420;
    var posArr = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      posArr[i * 3]     = (Math.random() - 0.5) * 18;
      posArr[i * 3 + 1] = (Math.random() - 0.5) * 11;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 9 - 2;
    }
    var pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    var pmat = new THREE.PointsMaterial({ color: 0x8a6bf2, size: 0.035, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    var pts = new THREE.Points(pgeo, pmat);
    scene.add(pts);

    new THREE.TextureLoader().load('/assets/images/pinapp-logo-trans.png', function (tex) {
      if (killed()) { try { renderer.dispose(); } catch (e) {} return; }
      try { tex.colorSpace = THREE.SRGBColorSpace; } catch (e) {}
      try { tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); } catch (e) {}
      var iw = (tex.image && tex.image.width) || 676;
      var ih = (tex.image && tex.image.height) || 292;
      var ph = 2.0, pw = ph * (iw / ih);
      var mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false });
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), mat);
      group.add(plane);

      // Ajuste l'échelle pour que le logo tienne dans la largeur visible (mobile/portrait inclus)
      function visibleWidth() { var d = Math.max(0.1, cam.position.z); var vh = 2 * d * Math.tan(cam.fov * Math.PI / 360); return vh * cam.aspect; }
      var fit = 1;
      function recomputeFit() { fit = Math.min(1, (visibleWidth() * 0.84) / pw); }
      recomputeFit();

      el.classList.add('pnp-webgl');
      clearTimeout(window.__pnpDefaultKill);

      var t0 = performance.now();
      var IN = 1500, HOLD = 600, OUT = 850, total = IN + HOLD + OUT;
      var raf;
      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
      function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

      function onResize() {
        W = window.innerWidth; H = window.innerHeight;
        cam.aspect = W / H; cam.updateProjectionMatrix();
        renderer.setSize(W, H, false);
        recomputeFit();
      }
      window.addEventListener('resize', onResize);

      function done() {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        try { tex.dispose(); mat.dispose(); plane.geometry.dispose(); pgeo.dispose(); pmat.dispose(); renderer.dispose(); } catch (e) {}
        if (window.__pnpIntroKill) window.__pnpIntroKill();
      }

      function frame(now) {
        if (killed()) { done(); return; }
        var e = now - t0, t, s;
        if (e < IN) {
          t = easeOut(e / IN);
          mat.opacity = t; pmat.opacity = 0.55 * t;
          group.position.z = -4 + 4 * t;
          group.rotation.y = -0.65 * (1 - t);
          group.rotation.x = 0.10 * (1 - t);
          s = (0.72 + 0.28 * t) * fit; group.scale.set(s, s, s);
        } else if (e < IN + HOLD) {
          group.position.y = Math.sin((e - IN) / HOLD * Math.PI) * 0.05;
          group.rotation.y = Math.sin(now * 0.0009) * 0.05;
        } else if (e < total) {
          t = easeInOut((e - IN - HOLD) / OUT);
          group.position.z = t * 2.4;
          s = (1 + 0.28 * t) * fit; group.scale.set(s, s, s);
          mat.opacity = 1 - t; pmat.opacity = 0.55 * (1 - t);
          if (t > 0.12) el.classList.add('pnp-hide');
        } else { done(); return; }
        pts.rotation.y += 0.0012; pts.rotation.x += 0.0004;
        renderer.render(scene, cam);
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
    }, undefined, function () {
      try { renderer.dispose(); } catch (e) {} // erreur texture → fallback + kill par défaut
    });
  }).catch(function () {
    // import three échoué (réseau) : laisser le logo fallback un instant puis retirer
    setTimeout(function () { if (window.__pnpIntroKill) window.__pnpIntroKill(); }, 1500);
  });
})();
