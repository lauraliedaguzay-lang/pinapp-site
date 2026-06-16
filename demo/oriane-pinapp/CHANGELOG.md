# CHANGELOG — Maison ORIANE · Démo Pinapp Studio

## [Unreleased] — Branche `cursor/oriane-source-zip-6c99`

---

### 2026-05-02 — Hero V5 · Scène 1 photorealistic 3D (session 3)

#### feat(scene-1): rebuild Hero V5 photorealistic 3D parfumerie cinema-grade

**Commit `b082d7ec`**

- **Canvas R3F plein écran** — fond noir, position Z=5.5, FOV 38°, ACES tonemapping
- **Flacon procédural LatheGeometry** — 17 points de profil (base → corps → épaule → col → goulot → lèvre), 80 segments
- **MeshTransmissionMaterial** (verre) — backside + backsideThickness, transmission 0.96, IOR 1.52, chromaticAberration, distortion, temporalDistortion, attenuation `#D4A96A`
- **Capuchon meshPhysicalMaterial** (or) — metalness 0.92, roughness 0.08, envMapIntensity 2.2, emissive subtle
- **Environment + 4 Lightformers** : key chaud `#FFE4A0` haut-gauche, fill froid `#B0C8FF` bas-droite, rim blanc derrière, bounce doré bas
- **Sparkles x2** : 150 en fond scale=8 doré, 60 proches scale=3 or-pale
- **Shader GLSL backdrop** : radial bordeaux→noir avec halo doré pulsant (uniform `uTime`)
- **EffectComposer** (desktop) : Bloom mipmap intensity=1.15, DepthOfField bokeh=2.8, ChromaticAberration, Vignette darkness=0.65
- **useFrame camera rig** : mouse lerp 8%/frame (delta-based) + Float (speed=1.2) + scroll drift y/z
- **HTML overlay** `mix-blend-mode: screen` — ORIANE (font-display) + ornement + tagline
- **GSAP intro** : blur 12px→0 + translateY stagger (title 0s, tagline 0.55s, hint 1.4s)
- **Mobile** : DPR 1.5, sparkles réduits, postprocessing désactivé
- **prefers-reduced-motion** : Canvas désactivé, fond bordeaux CSS statique
- **Packages ajoutés** : `@react-three/postprocessing ^3.0.4`, `maath ^0.10.8`, `vite` (peer dep fix)

---

### 2026-05-02 — Audit visuel (session 2)

#### fix(audit): 5 bugs visuels corrigés

**BUG 1 — Compteur "03/03" hors viewport** (`Scene4ThreeAubes.tsx`)
- Guard `progress > 0.005 && progress < 0.995` autour du compteur
- Le "03/03" disparaît quand on sort de la scène → ne déborde plus sur S5-8

**BUG 2/3 — Sections S5/S6/S7/S8 invisibles (espaces noirs)**
- Cause : `ScrollTrigger { once: true }` calcule des positions erronées après les sections pinnées S2/S3 (GSAP scroll distance virtuelle)
- Fix : `IntersectionObserver` natif dans chaque scène (threshold 0.1–0.2)
- État initial via `gsap.set()` au mount — plus d'`opacity:0` inline dans le JSX
- Suppression de `ScrollTrigger` et de son import dans S5/S7/S8

**BUG 4 — Paillettes S2 invisibles + phrase non visible** (`Scene2Verser.tsx`)
- Cause particles : `var(--tx)/var(--ty)` dans `calc()` de `@keyframes` — non rendu dans certains contextes navigateur
- Fix : 28 keyframes uniques `capJet_0..27` avec valeurs px hardcodées (calc sans variable)
- Cause phrase : `style={{ opacity: 0 }}` inline conflictait avec `gsap.set autoAlpha`
- Fix : `gsap.set({ autoAlpha: 0, y: 32 })` au mount, JSX sans inline opacity

**BUG 5 — SparkleRain global invisible** (`SparkleRain.tsx`)
- Cause : `OrthographicCamera` sans frustum explicite → THREE.js défaut `left=−1 right=1`
- `PointsMaterial size=0.045–0.11` en world units → ~4–10px à cette échelle = imperceptible
- Fix : composant `CameraFrustumFix` (via `useThree`) → `left=−1.2 right=1.2`, top/bottom ajustés par aspect ratio, `updateProjectionMatrix()` sur mount + resize

#### fix(scene-3): séquence manifeste stricte (session 1)
- Timeline GSAP avec slots `SLOT=0.72` — phrase i entièrement disparue avant que i+1 commence
- `end: '+=220%'` pour accommoder 3 phrases + ligne verticale

---

### 2026-05-02 — Session 1

#### fix(scene-1): 3 bugs corrigés

- **Bug 1 · ORIANE tronqué** : `overflow-x-clip` → `overflow-hidden` sur la section ; h1 `inline-flex` → `flex w-full` pour un centrage garanti sans clip du `O` gauche.
- **Bug 2 · Tagline scramble** : Suppression du conflit `opacity-0` / animation CSS. Tagline fade-in avec `animation-fill-mode: both` (état `from` appliqué avant que l'animation ne démarre).
- **Bug 3 · Goutte non visible** : Rayon sphère 0.15 → 0.28, `emissiveIntensity` 0.4 → 1.2, position y=0.5 (au-dessus du flacon), apparition dès t=0.6s (au lieu de 1s). Overlay noir réduit à 600ms.

---

#### feat(scenes 2-8): narration cinématique complète

**Scène 2 — Le flacon s'ouvre**
- GSAP pin scroll 150vh
- Capuchon CSS animé qui se lève sur le scrub
- Jet de 28 paillettes CSS jaillissant du capuchon (CSS `@keyframes capJet`, angles –160° à –20°)
- Flacon dérive vers coin haut-droit (x +8vw, y –8vh, scale 0.82) via GSAP scrub

**Scène 3 — Manifeste**
- Pin scroll 150vh
- 3 lignes révélées avec `blur(6px)→0` + translateY en séquence scrub
- Fond `radial-gradient` bordeaux subtil
- Ligne verticale dorée se déroule sur le dernier quart du scrub

**Scène 4 — Trois Aubes**
- Sticky 300vh existant conservé
- Radial glow couleur par fragrance : blush rose / mauve / or
- 18 micro-paillettes CSS par slide avec couleurs accordées à la fragrance
- Transition slide : `cubic-bezier(0.65,0,0.35,1)` 600ms

**Scène 5 — Émotion**
- Citation en 2 temps : première phrase, puis seconde (ScrollTrigger once, décalage 500ms)
- Effet `blur(4px)→0` + `translateY` sur chaque ligne
- 30 paillettes lentes CSS (durée 6–16s, drift aléatoire)
- Ligne or révèle après les deux phrases

**Scène 6 — Rebirth + Collection**
- 45 paillettes CSS convergentes vers le centre (silhouette flacon implicite)
- Section en clip-path polygone incliné (3%)
- 3 cards éditoriales : bordure or, coin doré décoratif, overlay gradient hover, stagger reveal GSAP
- Notes olfactives listées en bas de chaque carte

**Scène 7 — Contact CTA dramatique**
- Flacon SVG silhouette en fond (opacité 4%) plein écran
- 3 halos circulaires bordeaux pulsants (CSS animation)
- Titre révélé blur + translateY, sous-titre, bouton, prix en cascade
- Bouton bordeaux `#4A1F1F` au hover, border + color transition inline

**Scène 8 — Footer**
- Signature `M · O` : `letterSpacing` animé 0.05em → 0.18em avec blur-fade
- Ligne or se déroule (`scaleX 0→1`)
- Crédit Pinapp Studio révélé en dernier

---

### Antérieur (branche)

- `f1ed167` fix(scene-1): proper drop to morph to flacon timeline
- `9929291` fix(scene-1): center ORIANE title without overflow clip
- `239c43c` fix(scene-1): replace ScrambleText with simple static tagline
- `f2bfff5` feat(scene-1): cinematic opening drop to flacon to oriane
- `c5ffe3e` feat(oriane): wire narrative PageNarrative, scenes 1-8, preloader 400ms fade
