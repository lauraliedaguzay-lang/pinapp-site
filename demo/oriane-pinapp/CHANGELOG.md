# CHANGELOG — Maison ORIANE · Démo Pinapp Studio

## [Unreleased] — Branche `cursor/oriane-source-zip-6c99`

---

### 2026-05-02

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
