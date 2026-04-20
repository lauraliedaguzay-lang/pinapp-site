/**
 * Pinapp V3.0 Phase 3 — #s7 tourbillon WebGL (Three r170, module self-host).
 * Pin #s7 + scrub : exception zero-scroll validée Phase 3.
 */
import * as THREE from '../vendor/three-0.170.module.js';

const DATA_URL = '/assets/data/realisations.json';

function reducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}

function sober() {
  return document.documentElement.classList.contains('voyage-sober');
}

function vimeoThumb(id) {
  return 'https://vumbnail.com/' + encodeURIComponent(String(id)) + '.jpg';
}

async function loadJson() {
  const res = await fetch(DATA_URL, { credentials: 'same-origin' });
  if (!res.ok) throw new Error('realisations json');
  return res.json();
}

function buildFallback(root, list) {
  const fb = root.querySelector('.oeuvre-fallback');
  if (!fb) return;
  fb.innerHTML = '';
  list.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'oeuvre-fallback-card';
    const cap = document.createElement('div');
    cap.className = 'oeuvre-fallback-card__cap';
    const h = document.createElement('h3');
    h.className = 'h-2';
    h.style.fontSize = '1rem';
    h.textContent = item.title;
    cap.appendChild(h);
    const p = document.createElement('p');
    p.className = 'body-lg';
    p.style.fontSize = '0.85rem';
    p.textContent = item.subtitle || '';
    cap.appendChild(p);
    if (item.type === 'vimeo' && item.vimeoId) {
      const img = document.createElement('img');
      img.src = vimeoThumb(item.vimeoId);
      img.alt = '';
      img.width = 640;
      img.height = 360;
      img.loading = 'lazy';
      img.decoding = 'async';
      card.appendChild(img);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-tertiary';
      btn.setAttribute('data-vimeo-id', String(item.vimeoId));
      btn.textContent = 'Plein écran';
      cap.appendChild(btn);
    } else if (item.url) {
      const a = document.createElement('a');
      a.className = 'btn btn-secondary';
      a.href = item.url;
      a.textContent = 'Ouvrir ↗';
      cap.appendChild(a);
    }
    card.appendChild(cap);
    fb.appendChild(card);
  });
}

function setActiveListItem(root, id) {
  root.querySelectorAll('.oeuvre-list-item').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-oeuvre-id') === id);
  });
}

function scrollToS7Progress(p) {
  if (typeof ScrollTrigger === 'undefined') return;
  var st = ScrollTrigger.getAll().find(function (s) {
    var tr = s.vars && s.vars.trigger;
    return tr && tr.id === 's7';
  });
  if (!st) return;
  try {
    ScrollTrigger.refresh();
  } catch (eR) {}
  var y = st.start + (st.end - st.start) * Math.min(1, Math.max(0, p));
  try {
    window.scrollTo(0, y);
  } catch (eS) {
    window.scrollTo({ top: y, left: 0, behavior: 'auto' });
  }
}

async function initWeb(root, list) {
  const canvas = root.querySelector('#tourbillon-canvas');
  const stage = root.querySelector('.oeuvre-stage');
  if (!canvas || !stage) return;

  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, Math.max(1, w / h), 0.1, 200);
  camera.position.set(0, 0.6, 8.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);

  const group = new THREE.Group();
  scene.add(group);

  const starGeo = new THREE.BufferGeometry();
  const starCount = 200;
  const pos = new Float32Array(starCount * 3);
  const col = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 10 + Math.random() * 22;
    const th = Math.random() * Math.PI * 2;
    const ph = (Math.random() - 0.5) * Math.PI * 0.85;
    pos[i * 3] = r * Math.cos(th) * Math.cos(ph);
    pos[i * 3 + 1] = r * Math.sin(ph);
    pos[i * 3 + 2] = r * Math.sin(th) * Math.cos(ph);
    const roll = Math.random();
    let rr;
    let gg;
    let bb;
    if (roll < 0.6) {
      rr = 0.9;
      gg = 0.73;
      bb = 0.45;
    } else if (roll < 0.9) {
      rr = 0.25;
      gg = 0.95;
      bb = 0.88;
    } else {
      rr = 0.95;
      gg = 0.9;
      bb = 0.76;
    }
    col[i * 3] = rr;
    col[i * 3 + 1] = gg;
    col[i * 3 + 2] = bb;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  group.add(stars);

  const sorted = [...list].sort((a, b) => (a.priority || 99) - (b.priority || 99));
  const n = sorted.length;
  const cards = [];
  const texLoader = new THREE.TextureLoader();
  texLoader.setCrossOrigin('anonymous');

  const aSp = 0.45;
  const bSp = 0.18;
  for (let i = 0; i < n; i++) {
    const item = sorted[i];
    const geom = new THREE.PlaneGeometry(2.2, 1.24);
    const mat = new THREE.MeshBasicMaterial({ color: 0x1a2b40, transparent: true, opacity: 1 });
    if (item.type === 'vimeo' && item.vimeoId) {
      texLoader.load(
        vimeoThumb(item.vimeoId),
        (tex) => {
          if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
          mat.map = tex;
          mat.needsUpdate = true;
        },
        undefined,
        () => {}
      );
    }
    const mesh = new THREE.Mesh(geom, mat);
    const theta = (i / Math.max(1, n)) * Math.PI * 2;
    const radius = aSp * Math.exp(bSp * theta);
    mesh.position.set(Math.sin(theta) * radius, 0, Math.cos(theta) * radius);
    mesh.lookAt(new THREE.Vector3(0, 0.1, 0));
    if (i === 0) mesh.scale.multiplyScalar(1.45);
    mesh.userData.item = item;
    group.add(mesh);
    cards.push(mesh);
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointer(ev) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(cards, false);
    if (!hits.length) return;
    const item = hits[0].object.userData.item;
    if (!item) return;
    if (item.type === 'vimeo' && item.vimeoId) {
      if (typeof window.PinappVimeoOpen === 'function') {
        window.PinappVimeoOpen(String(item.vimeoId), canvas);
      }
    } else if (item.url) {
      window.location.href = item.url;
    }
  }
  canvas.addEventListener('click', onPointer, { passive: true });

  const meshWorld = new THREE.Vector3();
  const ndc = new THREE.Vector3();

  function updateActiveFromRotation() {
    let best = null;
    let bestDist = 1e9;
    cards.forEach((mesh) => {
      mesh.getWorldPosition(meshWorld);
      ndc.copy(meshWorld).project(camera);
      const d = ndc.x * ndc.x + ndc.y * ndc.y;
      if (ndc.z < 1 && d < bestDist) {
        bestDist = d;
        best = mesh.userData.item;
      }
    });
    if (best && best.id) setActiveListItem(root, best.id);
  }

  function onResize() {
    const ww = stage.clientWidth;
    const hh = stage.clientHeight;
    camera.aspect = Math.max(1, ww / hh);
    camera.updateProjectionMatrix();
    renderer.setSize(ww, hh, false);
  }
  window.addEventListener('resize', onResize, { passive: true });

  function tick() {
    stars.rotation.y += 0.00035;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: '#s7',
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        group.rotation.y = self.progress * Math.PI * 2;
        updateActiveFromRotation();
      },
    });
    try {
      ScrollTrigger.refresh();
    } catch (eRf) {}
  }

  root.querySelectorAll('.oeuvre-list-item').forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        const id = btn.getAttribute('data-oeuvre-id');
        const idx = sorted.findIndex((x) => x.id === id);
        if (idx < 0 || n < 1) return;
        var p = n > 1 ? idx / (n - 1) : 0;
        scrollToS7Progress(p);
      },
      { passive: true }
    );
  });

  updateActiveFromRotation();
}

function fillListNav(root, list) {
  const nav = root.querySelector('#oeuvre-list-mount');
  if (!nav) return;
  nav.innerHTML = '';
  const sorted = [...list].sort((a, b) => (a.priority || 99) - (b.priority || 99));
  sorted.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'oeuvre-list-item';
    btn.setAttribute('data-oeuvre-id', item.id);
    const title = document.createElement('span');
    title.textContent = item.title;
    btn.appendChild(title);
    if (item.subtitle) {
      const sub = document.createElement('span');
      sub.className = 'oeuvre-list-item__sub';
      sub.textContent = item.subtitle;
      btn.appendChild(sub);
    }
    nav.appendChild(btn);
  });
}

async function boot() {
  const root = document.querySelector('[data-tourbillon-root]');
  if (!root) return;
  let list = [];
  try {
    list = await loadJson();
  } catch (e) {
    buildFallback(root, []);
    root.querySelector('.oeuvre-fallback') && root.querySelector('.oeuvre-fallback').classList.add('is-visible');
    return;
  }
  fillListNav(root, list);
  buildFallback(root, list);
  if (reducedMotion() || sober()) {
    const fb = root.querySelector('.oeuvre-fallback');
    if (fb) fb.classList.add('is-visible');
    root.querySelectorAll('.oeuvre-list-item').forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          const id = btn.getAttribute('data-oeuvre-id');
          const item = list.find((x) => x.id === id);
          if (!item) return;
          if (item.type === 'vimeo' && item.vimeoId && typeof window.PinappVimeoOpen === 'function') {
            window.PinappVimeoOpen(String(item.vimeoId), btn);
          } else if (item.url) {
            window.location.href = item.url;
          }
        },
        { passive: true }
      );
    });
    return;
  }
  try {
    await initWeb(root, list);
  } catch (e2) {
    console.error('[tourbillon-webgl]', e2);
    const fb = root.querySelector('.oeuvre-fallback');
    if (fb) fb.classList.add('is-visible');
  }
}

boot();
