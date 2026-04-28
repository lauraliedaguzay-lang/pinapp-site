/* ================================================================
   ATELIER RIVAGE · scene.js · v7 stable
   Couloir 3D simple : 10 photos en zigzag, scroll vertical natif,
   pas de Lenis, pas de color extract, render garanti.
   ================================================================ */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const PALETTE = { bg: 0x141210, ivory: 0xF4EBD9, gold: 0xC9A96E };

const VILLAS = [
  { id:'villa-lumiere',   t:'Villa Lumière',   l:'Cap Ferret · 480m²',     d:"Piscine à débordement face à l'Atlantique.", year: 2024 },
  { id:'jardins',         t:'Les Jardins',     l:'Biarritz · 350m²',        d:"Terrasses végétalisées surplombant la côte.", year: 2024 },
  { id:'maison-pierre',   t:'Maison Pierre',   l:'Saint-Émilion · 420m²',   d:"Pierre blonde, acier noir et chêne brut.", year: 2023 },
  { id:'villa-eclipse',   t:'Villa Éclipse',   l:'Arcachon · 290m²',        d:"Infinity pool sur le Bassin.", year: 2023 },
  { id:'interieur',       t:"L'Intérieur",     l:'Bordeaux · 260m²',        d:"Double hauteur et verrière zénithale.", year: 2022 },
  { id:'horizon-bleu',    t:'Horizon Bleu',    l:'Hossegor · 310m²',        d:"Bois flotté et pierre face à l'océan.", year: 2022 },
  { id:'villa-littoral',  t:'Villa Littoral',  l:'Capbreton · 380m²',       d:"Lignes basses, baies vitrées plein sud.", year: 2021 },
  { id:'residence-verre', t:'Résidence Verre', l:'Biarritz · 220m²',        d:"Façade vitrée et patios intérieurs.", year: 2021 },
  { id:'maison-ligne',    t:'Maison Ligne',    l:'Bordeaux · 195m²',        d:"Béton ciré et chêne massif.", year: 2020 },
  { id:'atelier-beton',   t:'Atelier Béton',   l:'Arcachon · 275m²',        d:"Structure apparente, terrasse rooftop.", year: 2020 },
];

window.ATELIER_VILLAS = VILLAS;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch(e){ return false; }
}

if (!hasWebGL()) {
  document.body.classList.add('no-webgl-mode');
  buildMobileFallback();
  window.dispatchEvent(new CustomEvent('atelier:loaded'));
} else if (matchMedia('(max-width: 768px)').matches) {
  document.body.classList.add('is-mobile');
  buildMobileFallback();
  window.dispatchEvent(new CustomEvent('atelier:loaded'));
} else {
  buildMinimap();
  init();
}

function buildMobileFallback() {
  const root = document.querySelector('.mobile');
  if (!root) return;
  const hero = `<section class="mobile__hero"><div>
    <span style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E">Architecture résidentielle</span>
    <h1>Atelier <em>Rivage</em>.</h1>
    <p>Dix villas d'exception. Faites défiler.</p>
  </div></section>`;
  const villas = VILLAS.map((v, i) => `
    <section class="mobile__villa">
      <img src="assets/photos/${v.id}.jpg" alt="${v.t}" loading="${i === 0 ? 'eager' : 'lazy'}">
      <div class="mobile__villa-cap">
        <span class="num">${String(i+1).padStart(2,'0')} · ${v.year}</span>
        <h3>${v.t}</h3>
        <div class="loc">${v.l}</div>
        <p class="desc">${v.d}</p>
      </div>
    </section>`).join('');
  const cta = `<section class="mobile__cta">
    <h2 style="font-family:'Cormorant Garamond',serif;font-weight:300;font-size:64px;line-height:0.95;margin-bottom:24px;color:#1E2A3A">Concevez<br/><em style="font-style:italic;color:#C9A96E">la vôtre.</em></h2>
    <a class="btn btn--primary" href="mailto:studio@atelier-rivage.fr">Démarrer<span class="arrow">→</span></a>
  </section>`;
  root.innerHTML = hero + villas + cta;
}

function buildMinimap() {
  const root = document.querySelector('.minimap');
  if (!root) return;
  root.innerHTML = VILLAS.map((v, i) =>
    `<button class="minimap__dot" data-idx="${i}" data-label="${String(i+1).padStart(2,'0')} · ${v.t}" aria-label="Aller à ${v.t}"></button>`
  ).join('');
}

function init() {
  const stage = document.getElementById('stage');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.bg);
  scene.fog = new THREE.Fog(PALETTE.bg, 8, 50);

  const camera = new THREE.PerspectiveCamera(46, innerWidth/innerHeight, 0.1, 200);
  camera.position.set(0, 1.7, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xfff1d4, 0.9);
  key.position.set(4, 8, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xC9A96E, 0.5);
  rim.position.set(-4, 3, -10);
  scene.add(rim);

  // Sol miroir
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 280),
    new THREE.MeshStandardMaterial({ color: 0x0c0a08, roughness: 0.35, metalness: 0.55 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -110);
  scene.add(floor);

  // Bandes de sol or
  for (let i = 0; i < 18; i++) {
    const g = new THREE.Mesh(
      new THREE.PlaneGeometry(0.04, 1.8),
      new THREE.MeshBasicMaterial({ color: PALETTE.gold, transparent: true, opacity: 0.55, toneMapped: false })
    );
    g.rotation.x = -Math.PI / 2;
    g.position.set(-3.7, 0.005, -i * 7 - 3);
    scene.add(g);
    const g2 = g.clone(); g2.position.x = 3.7; scene.add(g2);
  }

  // Particules dorées
  const partCount = 360;
  const partGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(partCount * 3);
  const seeds = new Float32Array(partCount);
  for (let i = 0; i < partCount; i++) {
    positions[i*3]     = (Math.random() - 0.5) * 22;
    positions[i*3 + 1] = Math.random() * 6 + 0.3;
    positions[i*3 + 2] = -Math.random() * 90 - 4;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const partMat = new THREE.PointsMaterial({
    color: PALETTE.gold, size: 0.04, transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  });
  scene.add(new THREE.Points(partGeo, partMat));

  // ── Photo panels ──
  const SPACING = 8;
  const FIRST_Z = -7;
  const SIDE_X = 2.7;
  const PANEL_W = 4.6, PANEL_H = 3.05;
  const panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
  const frameMat = new THREE.MeshStandardMaterial({
    color: PALETTE.gold, metalness: 0.92, roughness: 0.18,
  });

  const panels = [];
  let texturesLoaded = 0;
  const totalTex = VILLAS.length;

  const texLoader = new THREE.TextureLoader();
  texLoader.crossOrigin = 'anonymous';

  VILLAS.forEach((v, i) => {
    const side = (i % 2 === 0) ? -1 : 1;
    const z = FIRST_Z - i * SPACING;
    const x = side * SIDE_X;
    const y = 1.85;

    // Placeholder material visible immédiatement (gris foncé, sera remplacé)
    const mat = new THREE.MeshBasicMaterial({ color: 0x2a2520 });
    const mesh = new THREE.Mesh(panelGeo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = -side * 0.36;
    mesh.userData = { idx: i, baseY: y, baseRotY: mesh.rotation.y, baseX: x, side };

    // Charge la texture en async
    texLoader.load(
      `assets/photos/${v.id}.jpg`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        mat.map = tex;
        mat.color.set(0xffffff);
        mat.needsUpdate = true;
        texturesLoaded++;
        const pct = Math.round(texturesLoaded / totalTex * 100);
        window.dispatchEvent(new CustomEvent('atelier:progress', { detail: { pct }}));
        if (texturesLoaded === totalTex) {
          window.dispatchEvent(new CustomEvent('atelier:loaded'));
        }
      },
      undefined,
      (err) => {
        console.warn('[atelier] tex fail:', v.id, err);
        texturesLoaded++;
        if (texturesLoaded === totalTex) window.dispatchEvent(new CustomEvent('atelier:loaded'));
      }
    );

    // Cadre or
    const FT = 0.05;
    const frame = new THREE.Group();
    const tBar = new THREE.Mesh(new THREE.BoxGeometry(PANEL_W + FT*2, FT, FT), frameMat);
    const bBar = new THREE.Mesh(new THREE.BoxGeometry(PANEL_W + FT*2, FT, FT), frameMat);
    const lBar = new THREE.Mesh(new THREE.BoxGeometry(FT, PANEL_H, FT), frameMat);
    const rBar = new THREE.Mesh(new THREE.BoxGeometry(FT, PANEL_H, FT), frameMat);
    tBar.position.y = PANEL_H/2; bBar.position.y = -PANEL_H/2;
    lBar.position.x = -PANEL_W/2; rBar.position.x = PANEL_W/2;
    frame.add(tBar, bBar, lBar, rBar);
    mesh.add(frame);

    // Spot lumineux par photo
    const spot = new THREE.PointLight(0xfff0d8, 1.0, 11, 1.5);
    spot.position.set(x * 0.5, 5.0, z + 1.4);
    scene.add(spot);
    mesh.userData.spot = spot;

    // God ray
    const ray = new THREE.Mesh(
      new THREE.ConeGeometry(2.0, 5.0, 24, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xfff0d8, transparent: true, opacity: 0.10,
        blending: THREE.AdditiveBlending, depthWrite: false,
        side: THREE.DoubleSide, toneMapped: false,
      })
    );
    ray.position.set(x * 0.5, 3.4, z + 1.0);
    ray.rotation.x = Math.PI;
    scene.add(ray);
    mesh.userData.ray = ray;

    scene.add(mesh);
    panels.push(mesh);
  });

  // Failsafe : si textures jamais loaded en 6s, on déclenche
  setTimeout(() => {
    if (texturesLoaded < totalTex) {
      window.dispatchEvent(new CustomEvent('atelier:loaded'));
    }
  }, 6000);

  const TOTAL_Z = SPACING * (VILLAS.length - 1);

  // HUD
  const hudVilla = document.querySelector('.hud-villa');
  const hudCounter = document.querySelector('.hud-counter');
  const hudTitle = document.querySelector('[data-hud="title"]');
  const hudLoc = document.querySelector('[data-hud="loc"]');
  const hudDesc = document.querySelector('[data-hud="desc"]');
  const hudEyebrow = document.querySelector('[data-hud="eyebrow"]');
  const hudProgress = document.querySelector('.hud-bottom__progress');
  const minimapDots = document.querySelectorAll('.minimap__dot');

  let activeIdx = -1;
  function setActive(i) {
    if (i === activeIdx) return;
    activeIdx = i;
    if (hudCounter) hudCounter.textContent = String(i + 1).padStart(2, '0');
    if (hudTitle && VILLAS[i]) hudTitle.innerHTML = VILLAS[i].t.replace(/(\w+)$/, '<em>$1</em>');
    if (hudLoc && VILLAS[i])   hudLoc.textContent = VILLAS[i].l;
    if (hudDesc && VILLAS[i])  hudDesc.textContent = VILLAS[i].d;
    if (hudEyebrow && VILLAS[i]) hudEyebrow.textContent = `Villa ${String(i+1).padStart(2,'0')} · ${VILLAS[i].year}`;
    if (hudVilla) {
      hudVilla.dataset.visible = 'false';
      requestAnimationFrame(() => requestAnimationFrame(() => { hudVilla.dataset.visible = 'true'; }));
    }
    minimapDots.forEach((d, j) => d.dataset.active = (j === i ? 'true' : 'false'));
  }

  // Scroll natif (pas de Lenis)
  let scrollProg = 0, camZTarget = 0, camZCurrent = 0, scrollVel = 0, prevS = 0;
  function updateScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollProg = Math.max(0, Math.min(1, scrollY / max));
    scrollVel = (scrollY - prevS) * 0.06;
    prevS = scrollY;
  }
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Minimap click
  minimapDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.idx, 10);
      const max = document.documentElement.scrollHeight - innerHeight;
      const target = (0.05 + (i / (VILLAS.length - 1)) * 0.85) * max;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  // Hero entry
  let entryDone = false;
  const enterAfter = () => {
    if (entryDone) return;
    const hero = document.querySelector('.hero');
    if (hero) hero.dataset.hidden = 'true';
    document.body.dataset.galerie = 'active';
    entryDone = true;
    setActive(0);
  };
  addEventListener('atelier:loader-done', () => setTimeout(enterAfter, 1200));
  setTimeout(enterAfter, 6000);

  // Mouse parallax
  let mx = 0, my = 0;
  addEventListener('mousemove', (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  const clock = new THREE.Clock();
  function tick() {
    try {
      const t = clock.getElapsedTime();
      const dt = Math.min(0.04, clock.getDelta());

      const p = (scrollProg - 0.04) / 0.92;
      camZTarget = -Math.max(0, Math.min(1, p)) * TOTAL_Z;
      camZCurrent += (camZTarget - camZCurrent) * 0.085;

      const targetX = mx * 0.22;
      const targetY = 1.7 + my * -0.1;
      camera.position.x += (targetX - camera.position.x) * 0.06;
      camera.position.y += (targetY - camera.position.y) * 0.06;
      camera.position.z = camZCurrent;
      camera.lookAt(mx * 0.4, 1.55, camZCurrent - 10);

      // Trouver panel le plus proche
      let closest = 0, minD = Infinity;
      panels.forEach((pl, i) => {
        const d = Math.abs(pl.position.z - camZCurrent + 4);
        if (d < minD) { minD = d; closest = i; }
      });
      if (entryDone && closest !== activeIdx) setActive(closest);

      // Particules
      const pos = partGeo.attributes.position.array;
      for (let i = 0; i < partCount; i++) {
        pos[i*3 + 1] += dt * (0.08 + Math.sin(t + seeds[i]) * 0.04);
        pos[i*3]     += Math.sin(t * 0.5 + seeds[i]) * dt * 0.04;
        if (pos[i*3 + 1] > 6) pos[i*3 + 1] = 0.3;
      }
      partGeo.attributes.position.needsUpdate = true;
      partMat.opacity = 0.6 + Math.sin(t * 0.7) * 0.2;

      // Animation panneaux
      const wind = Math.max(-1.5, Math.min(1.5, scrollVel));
      panels.forEach((pl, i) => {
        const u = pl.userData;
        const sign = u.side;
        pl.position.y = u.baseY + Math.sin(t * 0.5 + i * 0.7) * 0.06;
        pl.position.x = u.baseX + Math.sin(t * 0.3 + i) * 0.04 + wind * 0.08 * sign;
        pl.rotation.y = u.baseRotY + Math.sin(t * 0.4 + i * 0.5) * 0.025 + wind * 0.04;
        const dist = Math.abs(pl.position.z - camZCurrent);
        const closeBoost = Math.max(0, 1 - dist / 14);
        if (u.ray) {
          u.ray.material.opacity = (0.08 + Math.sin(t * 1.2 + i) * 0.03) * (0.5 + closeBoost * 0.8);
        }
        if (u.spot) {
          u.spot.intensity = 0.8 + Math.sin(t * 0.8 + i * 0.5) * 0.2 + closeBoost * 0.7;
        }
      });

      if (hudProgress) hudProgress.style.setProperty('--p', scrollProg.toFixed(3));

      renderer.render(scene, camera);
    } catch (e) {
      console.error('[Atelier] tick error:', e);
    }
    requestAnimationFrame(tick);
  }

  // Premier render synchrone
  renderer.render(scene, camera);
  requestAnimationFrame(tick);

  console.log('%cAtelier Rivage · v7 stable', 'color:#C9A96E;font:italic 16px Cormorant Garamond,serif;');
  window.__atelierReady = true;
}
