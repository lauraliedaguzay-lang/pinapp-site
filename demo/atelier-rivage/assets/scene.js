/* ================================================================
   ATELIER RIVAGE · scene.js · v8 IMMERSIVE
   Musée nocturne flottant · architecture procédurale ·
   colonnes + arches + brouillard volumétrique doré ·
   click villa → immersion plein-écran 360° avec orbit
   ================================================================ */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const PALETTE = {
  bg: 0x0c0a08,
  ivory: 0xF4EBD9,
  gold: 0xC9A96E,
  goldHot: 0xE8C68A,
  ocean: 0x1E2A3A,
};

const VILLAS = [
  { id:'villa-lumiere',   t:'Villa Lumière',   l:'Cap Ferret · 480m²',     d:"Piscine à débordement face à l'Atlantique. Famille G., 4 enfants. Livrée sept. 2024.", year: 2024, hue: 0xfff0d8 },
  { id:'jardins',         t:'Les Jardins',     l:'Biarritz · 350m²',        d:"Terrasses végétalisées surplombant la côte basque. Couple d'architectes.", year: 2024, hue: 0xc8e0c0 },
  { id:'maison-pierre',   t:'Maison Pierre',   l:'Saint-Émilion · 420m²',   d:"Pierre blonde, acier noir et chêne brut. Domaine viticole familial.", year: 2023, hue: 0xe8d4a8 },
  { id:'villa-eclipse',   t:'Villa Éclipse',   l:'Arcachon · 290m²',        d:"Infinity pool sur le Bassin. Toit végétalisé.", year: 2023, hue: 0xa8c8d8 },
  { id:'interieur',       t:"L'Intérieur",     l:'Bordeaux · 260m²',        d:"Double hauteur et verrière zénithale. Hôtel particulier 1890 réinventé.", year: 2022, hue: 0xfff5d8 },
  { id:'horizon-bleu',    t:'Horizon Bleu',    l:'Hossegor · 310m²',        d:"Bois flotté et pierre face à l'océan. Maison de surfeurs.", year: 2022, hue: 0xa0c8d0 },
  { id:'villa-littoral',  t:'Villa Littoral',  l:'Capbreton · 380m²',       d:"Lignes basses, baies vitrées plein sud. Patio et oliviers.", year: 2021, hue: 0xfff0c8 },
  { id:'residence-verre', t:'Résidence Verre', l:'Biarritz · 220m²',        d:"Façade vitrée et patios intérieurs. Vue panoramique 270°.", year: 2021, hue: 0xc8d8e0 },
  { id:'maison-ligne',    t:'Maison Ligne',    l:'Bordeaux · 195m²',        d:"Béton ciré et chêne massif. Atelier d'artiste.", year: 2020, hue: 0xd8c0a0 },
  { id:'atelier-beton',   t:'Atelier Béton',   l:'Arcachon · 275m²',        d:"Structure apparente, terrasse rooftop. Studio d'architecte.", year: 2020, hue: 0xb8b0a8 },
];
window.ATELIER_VILLAS = VILLAS;

function hasWebGL() {
  try { const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch(e){ return false; }
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
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.bg);
  const fog = new THREE.FogExp2(PALETTE.bg, 0.015);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(48, innerWidth/innerHeight, 0.1, 300);
  camera.position.set(0, 1.7, 0);

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ ARCHITECTURE PROCÉDURALE · musée nocturne                   ║
  // ╚══════════════════════════════════════════════════════════════╝

  // Sol miroir noir profond
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 320),
    new THREE.MeshStandardMaterial({
      color: 0x080705, roughness: 0.18, metalness: 0.9,
      envMapIntensity: 1.0,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -130);
  scene.add(floor);

  // Plafond voûté (suite de demi-cylindres pour faire des arches)
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x14110d, roughness: 0.95, metalness: 0.05, side: THREE.BackSide });
  const ceilingArch = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 280, 32, 1, true, 0, Math.PI),
    ceilingMat
  );
  ceilingArch.rotation.z = Math.PI / 2;
  ceilingArch.rotation.y = Math.PI / 2;
  ceilingArch.position.set(0, 7, -130);
  scene.add(ceilingArch);

  // Colonnes dorées (deux rangées)
  const colMat = new THREE.MeshStandardMaterial({
    color: 0x1a1612, roughness: 0.85, metalness: 0.2,
  });
  const colCount = 20;
  for (let i = 0; i < colCount; i++) {
    const z = -i * 8 + 2;
    [-5.2, 5.2].forEach((x) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 7, 12), colMat);
      c.position.set(x, 3.5, z);
      scene.add(c);
      // Capiteau or
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.18, 0.18, 12),
        new THREE.MeshStandardMaterial({ color: PALETTE.gold, metalness: 0.85, roughness: 0.25 })
      );
      cap.position.set(x, 6.95, z);
      scene.add(cap);
      // Base or
      const base = cap.clone();
      base.position.y = 0.1;
      scene.add(base);
    });
  }

  // Bandes lumineuses au sol (allée centrale)
  for (let i = 0; i < 30; i++) {
    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(0.025, 1.6),
      new THREE.MeshBasicMaterial({ color: PALETTE.gold, transparent: true, opacity: 0.5, toneMapped: false })
    );
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(-3.6, 0.005, -i * 5 - 2);
    scene.add(stripe);
    const s2 = stripe.clone(); s2.position.x = 3.6; scene.add(s2);
  }

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ LIGHTS                                                        ║
  // ╚══════════════════════════════════════════════════════════════╝
  scene.add(new THREE.AmbientLight(0xffffff, 0.32));
  const moonKey = new THREE.DirectionalLight(0xc8d8f0, 0.45);
  moonKey.position.set(8, 12, 4);
  scene.add(moonKey);
  const goldFill = new THREE.DirectionalLight(PALETTE.gold, 0.55);
  goldFill.position.set(-6, 4, -8);
  scene.add(goldFill);

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ PARTICULES (poussière dorée volumétrique)                    ║
  // ╚══════════════════════════════════════════════════════════════╝
  const partCount = 700;
  const partGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(partCount * 3);
  const seeds = new Float32Array(partCount);
  for (let i = 0; i < partCount; i++) {
    positions[i*3]     = (Math.random() - 0.5) * 24;
    positions[i*3 + 1] = Math.random() * 6.5 + 0.3;
    positions[i*3 + 2] = -Math.random() * 130 - 4;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const partMat = new THREE.PointsMaterial({
    color: PALETTE.gold, size: 0.05, transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ PHOTO PANELS (en lévitation, alternance gauche/droite)       ║
  // ╚══════════════════════════════════════════════════════════════╝
  const SPACING = 8;
  const FIRST_Z = -7;
  const SIDE_X = 2.9;
  const PANEL_W = 4.8, PANEL_H = 3.2;
  const panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
  const frameMat = new THREE.MeshStandardMaterial({
    color: PALETTE.gold, metalness: 0.95, roughness: 0.15,
  });

  const panels = [];
  let texturesLoaded = 0;
  const totalTex = VILLAS.length;
  const photoTextures = [];

  const texLoader = new THREE.TextureLoader();
  texLoader.crossOrigin = 'anonymous';

  VILLAS.forEach((v, i) => {
    const side = (i % 2 === 0) ? -1 : 1;
    const z = FIRST_Z - i * SPACING;
    const x = side * SIDE_X;
    const y = 1.95;

    // Material avec couleur initiale (la photo prend le relais une fois loadée)
    const mat = new THREE.MeshBasicMaterial({ color: 0x2a2520 });
    const mesh = new THREE.Mesh(panelGeo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = -side * 0.36;
    mesh.userData = { idx: i, baseY: y, baseRotY: mesh.rotation.y, baseX: x, side, villa: v };

    texLoader.load(
      `assets/photos/${v.id}.jpg`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        mat.map = tex;
        mat.color.set(0xffffff);
        mat.needsUpdate = true;
        photoTextures[i] = tex;
        // mettre à jour le reflet aussi
        if (mesh.userData.refl) {
          mesh.userData.refl.material.map = tex;
          mesh.userData.refl.material.color.set(0xffffff);
          mesh.userData.refl.material.needsUpdate = true;
        }
        texturesLoaded++;
        const pct = Math.round(texturesLoaded / totalTex * 100);
        window.dispatchEvent(new CustomEvent('atelier:progress', { detail: { pct }}));
        if (texturesLoaded === totalTex) window.dispatchEvent(new CustomEvent('atelier:loaded'));
      },
      undefined,
      () => {
        texturesLoaded++;
        if (texturesLoaded === totalTex) window.dispatchEvent(new CustomEvent('atelier:loaded'));
      }
    );

    // Cadre or épais
    const FT = 0.06;
    const frame = new THREE.Group();
    const tBar = new THREE.Mesh(new THREE.BoxGeometry(PANEL_W + FT*2, FT, FT*1.2), frameMat);
    const bBar = new THREE.Mesh(new THREE.BoxGeometry(PANEL_W + FT*2, FT, FT*1.2), frameMat);
    const lBar = new THREE.Mesh(new THREE.BoxGeometry(FT, PANEL_H, FT*1.2), frameMat);
    const rBar = new THREE.Mesh(new THREE.BoxGeometry(FT, PANEL_H, FT*1.2), frameMat);
    tBar.position.y = PANEL_H/2; bBar.position.y = -PANEL_H/2;
    lBar.position.x = -PANEL_W/2; rBar.position.x = PANEL_W/2;
    frame.add(tBar, bBar, lBar, rBar);
    mesh.add(frame);

    // Reflet sol (clone inversé)
    const reflMat = new THREE.MeshBasicMaterial({
      color: 0x2a2520, transparent: true, opacity: 0.32, depthWrite: false,
    });
    const refl = new THREE.Mesh(panelGeo, reflMat);
    refl.position.set(x, -y + 0.02, z);
    refl.rotation.y = mesh.rotation.y;
    refl.scale.y = -1;
    scene.add(refl);
    mesh.userData.refl = refl;

    // Spot lumineux (température adaptée à la villa)
    const spot = new THREE.PointLight(v.hue, 1.4, 12, 1.6);
    spot.position.set(x * 0.45, 5.2, z + 1.5);
    scene.add(spot);
    mesh.userData.spot = spot;

    // God ray (cône de lumière qui descend du plafond)
    const ray = new THREE.Mesh(
      new THREE.ConeGeometry(2.2, 5.5, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: v.hue, transparent: true, opacity: 0.10,
        blending: THREE.AdditiveBlending, depthWrite: false,
        side: THREE.DoubleSide, toneMapped: false,
      })
    );
    ray.position.set(x * 0.45, 3.6, z + 1.0);
    ray.rotation.x = Math.PI;
    scene.add(ray);
    mesh.userData.ray = ray;

    // Halo lumineux derrière la photo
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(PANEL_W * 1.6, PANEL_H * 1.6),
      new THREE.MeshBasicMaterial({
        color: PALETTE.gold, transparent: true, opacity: 0.0,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })
    );
    halo.position.set(x, y, z - 0.05);
    halo.rotation.y = mesh.rotation.y;
    scene.add(halo);
    mesh.userData.halo = halo;

    // Numéro romain en or 3D au-dessus de chaque photo
    const num = String(i + 1).padStart(2, '0');
    const numCanvas = document.createElement('canvas');
    numCanvas.width = 256; numCanvas.height = 128;
    const nctx = numCanvas.getContext('2d');
    nctx.fillStyle = 'rgba(0,0,0,0)';
    nctx.fillRect(0, 0, 256, 128);
    nctx.font = 'italic 300 96px "Cormorant Garamond", serif';
    nctx.fillStyle = '#C9A96E';
    nctx.textAlign = 'center';
    nctx.textBaseline = 'middle';
    nctx.fillText(num, 128, 64);
    const numTex = new THREE.CanvasTexture(numCanvas);
    numTex.colorSpace = THREE.SRGBColorSpace;
    const numPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.45),
      new THREE.MeshBasicMaterial({ map: numTex, transparent: true, depthWrite: false, toneMapped: false })
    );
    numPlane.position.set(x, y + PANEL_H/2 + 0.45, z);
    numPlane.rotation.y = mesh.rotation.y;
    scene.add(numPlane);
    mesh.userData.num = numPlane;

    scene.add(mesh);
    panels.push(mesh);
  });

  // Failsafe
  setTimeout(() => {
    if (texturesLoaded < totalTex) window.dispatchEvent(new CustomEvent('atelier:loaded'));
  }, 6000);

  const TOTAL_Z = SPACING * (VILLAS.length - 1);

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ HUD                                                           ║
  // ╚══════════════════════════════════════════════════════════════╝
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

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ SCROLL                                                        ║
  // ╚══════════════════════════════════════════════════════════════╝
  let scrollProg = 0, camZTarget = 0, camZCurrent = 0, scrollVel = 0, prevS = 0;
  function updateScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollProg = Math.max(0, Math.min(1, scrollY / max));
    scrollVel = (scrollY - prevS) * 0.06;
    prevS = scrollY;
  }
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  minimapDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      if (immersiveMode) return;
      const i = parseInt(dot.dataset.idx, 10);
      const max = document.documentElement.scrollHeight - innerHeight;
      const target = (0.05 + (i / (VILLAS.length - 1)) * 0.85) * max;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ HERO ENTRY                                                    ║
  // ╚══════════════════════════════════════════════════════════════╝
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

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ MOUSE PARALLAX                                                ║
  // ╚══════════════════════════════════════════════════════════════╝
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

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ MODE IMMERSIF (click sur photo)                              ║
  // ╚══════════════════════════════════════════════════════════════╝
  let immersiveMode = false;
  let immersiveTransition = 0; // 0 = couloir, 1 = full immersion
  let immersiveTarget = 0;
  let immersiveVilla = null;
  let immersiveOrbit = 0;
  const skySphere = new THREE.Mesh(
    new THREE.SphereGeometry(60, 48, 32),
    new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x000000 })
  );
  skySphere.visible = false;
  scene.add(skySphere);

  const raycaster = new THREE.Raycaster();
  const mouseV = new THREE.Vector2();

  const exitBtn = document.createElement('button');
  exitBtn.className = 'exit-immersive';
  exitBtn.innerHTML = '<span>← Sortir</span>';
  exitBtn.style.cssText = `
    position:fixed;top:24px;right:24px;z-index:60;
    background:rgba(10,9,8,0.7);backdrop-filter:blur(12px);
    border:1px solid rgba(201,169,110,0.5);color:#F4EBD9;
    padding:14px 22px;font-family:Inter,sans-serif;font-size:11px;
    letter-spacing:0.3em;text-transform:uppercase;cursor:none;
    transition:all 0.3s;opacity:0;pointer-events:none;
  `;
  exitBtn.addEventListener('mouseenter', () => exitBtn.style.background = 'rgba(201,169,110,0.95)');
  exitBtn.addEventListener('mouseleave', () => exitBtn.style.background = 'rgba(10,9,8,0.7)');
  exitBtn.addEventListener('click', () => exitImmersive());
  document.body.appendChild(exitBtn);

  function enterImmersive(idx) {
    if (immersiveMode || !photoTextures[idx]) return;
    immersiveMode = true;
    immersiveVilla = VILLAS[idx];
    immersiveTarget = 1;
    skySphere.material.map = photoTextures[idx];
    skySphere.material.color.set(0xffffff);
    skySphere.material.needsUpdate = true;
    skySphere.visible = true;
    document.body.dataset.immersive = 'true';
    exitBtn.style.opacity = '1';
    exitBtn.style.pointerEvents = 'auto';
    // Hide HUD
    if (hudVilla) hudVilla.dataset.visible = 'false';
  }

  function exitImmersive() {
    immersiveMode = false;
    immersiveTarget = 0;
    document.body.dataset.immersive = 'false';
    exitBtn.style.opacity = '0';
    exitBtn.style.pointerEvents = 'none';
    setTimeout(() => {
      skySphere.visible = false;
      if (hudVilla && entryDone) hudVilla.dataset.visible = 'true';
    }, 800);
  }

  renderer.domElement.addEventListener('click', (e) => {
    if (immersiveMode) return;
    mouseV.x = (e.clientX / innerWidth) * 2 - 1;
    mouseV.y = -(e.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseV, camera);
    const hits = raycaster.intersectObjects(panels, false);
    if (hits.length) {
      const hit = hits[0].object;
      enterImmersive(hit.userData.idx);
    }
  });

  // Cursor hover sur panels
  let hovered = null;
  renderer.domElement.addEventListener('mousemove', (e) => {
    if (immersiveMode) return;
    mouseV.x = (e.clientX / innerWidth) * 2 - 1;
    mouseV.y = -(e.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseV, camera);
    const hits = raycaster.intersectObjects(panels, false);
    const obj = hits[0]?.object || null;
    if (obj !== hovered) {
      hovered = obj;
      const cur = document.querySelector('.cursor');
      if (cur) cur.dataset.state = obj ? 'enter' : '';
      const lbl = document.querySelector('.cursor__label');
      if (lbl && obj) lbl.textContent = 'Entrer';
      else if (lbl) lbl.textContent = '';
    }
  });

  // Drag horizontal en mode immersif → orbit
  let isDragging = false, dragStartX = 0, orbitStart = 0;
  renderer.domElement.addEventListener('mousedown', (e) => {
    if (!immersiveMode) return;
    isDragging = true;
    dragStartX = e.clientX;
    orbitStart = immersiveOrbit;
  });
  addEventListener('mouseup', () => isDragging = false);
  addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    immersiveOrbit = orbitStart + (e.clientX - dragStartX) * 0.005;
  });

  // ╔══════════════════════════════════════════════════════════════╗
  // ║ TICK                                                          ║
  // ╚══════════════════════════════════════════════════════════════╝
  const clock = new THREE.Clock();
  function tick() {
    try {
      const t = clock.getElapsedTime();
      const dt = Math.min(0.04, clock.getDelta());

      // Smooth immersive transition
      immersiveTransition += (immersiveTarget - immersiveTransition) * 0.06;

      if (!immersiveMode || immersiveTransition < 0.95) {
        // ── MODE COULOIR ──
        const p = (scrollProg - 0.04) / 0.92;
        camZTarget = -Math.max(0, Math.min(1, p)) * TOTAL_Z;
        camZCurrent += (camZTarget - camZCurrent) * 0.085;

        const targetX = mx * 0.22;
        const targetY = 1.7 + my * -0.1;
        camera.position.x += (targetX - camera.position.x) * 0.06;
        camera.position.y += (targetY - camera.position.y) * 0.06;
        camera.position.z = camZCurrent;
        camera.lookAt(mx * 0.4, 1.55, camZCurrent - 10);

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
          if (pos[i*3 + 1] > 6.5) pos[i*3 + 1] = 0.3;
        }
        partGeo.attributes.position.needsUpdate = true;
        partMat.opacity = (0.6 + Math.sin(t * 0.7) * 0.2) * (1 - immersiveTransition);

        const wind = Math.max(-1.5, Math.min(1.5, scrollVel));
        panels.forEach((pl, i) => {
          const u = pl.userData;
          const sign = u.side;
          pl.position.y = u.baseY + Math.sin(t * 0.5 + i * 0.7) * 0.07;
          pl.position.x = u.baseX + Math.sin(t * 0.3 + i) * 0.04 + wind * 0.08 * sign;
          pl.rotation.y = u.baseRotY + Math.sin(t * 0.4 + i * 0.5) * 0.025 + wind * 0.04;
          pl.rotation.z = Math.sin(t * 0.45 + i * 1.3) * 0.012;

          if (u.refl) {
            u.refl.position.x = pl.position.x;
            u.refl.position.y = -pl.position.y + 0.04;
            u.refl.rotation.y = pl.rotation.y;
          }
          if (u.num) {
            u.num.position.x = pl.position.x;
            u.num.position.y = pl.position.y + PANEL_H/2 + 0.45 + Math.sin(t * 0.5 + i) * 0.04;
            u.num.rotation.y = pl.rotation.y;
          }
          const dist = Math.abs(pl.position.z - camZCurrent);
          const closeBoost = Math.max(0, 1 - dist / 14);
          if (u.ray) u.ray.material.opacity = (0.10 + Math.sin(t * 1.2 + i) * 0.03) * (0.5 + closeBoost * 0.9);
          if (u.spot) u.spot.intensity = 0.9 + Math.sin(t * 0.8 + i * 0.5) * 0.2 + closeBoost * 0.8;
          if (u.halo) {
            u.halo.position.x = pl.position.x;
            u.halo.position.y = pl.position.y;
            u.halo.rotation.y = pl.rotation.y;
            u.halo.material.opacity = closeBoost * 0.22;
          }
        });

        // Fade scene quand on entre en immersif
        scene.fog.density = 0.015 + immersiveTransition * 0.05;
      }

      if (immersiveMode || immersiveTransition > 0.05) {
        // ── MODE IMMERSIF ──
        // Caméra au centre de la sphère, regardant l'horizon avec orbit
        const zoom = immersiveTransition;
        camera.position.x = camera.position.x * (1 - zoom * 0.3);
        camera.position.y = camera.position.y * (1 - zoom * 0.3) + zoom * 1.7;
        // En full immersif, on lock la cam au centre
        if (immersiveTransition > 0.95) {
          camera.position.set(0, 1.7, camZCurrent);
        }
        const lookX = Math.sin(immersiveOrbit) * 50;
        const lookZ = (camZCurrent || 0) - Math.cos(immersiveOrbit) * 50;
        const lookY = 1.7 + my * -0.4;
        camera.lookAt(
          camera.position.x * (1 - zoom) + lookX * zoom,
          lookY,
          camera.position.z * (1 - zoom) + lookZ * zoom
        );
        // Suit la position de la caméra
        skySphere.position.copy(camera.position);
      }

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

  console.log('%cAtelier Rivage · v8 immersive', 'color:#C9A96E;font:italic 16px Cormorant Garamond,serif;');
  window.__atelierReady = true;
  window.__atelierEnter = enterImmersive;
  window.__atelierExit = exitImmersive;
}
