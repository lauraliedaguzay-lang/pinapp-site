# 03 · MOTION & INTERACTIONS

> Règle d'or : **AVATAR**. Si l'utilisateur remarque l'effet → trop fort.
> Si le site semble vivant sans qu'on sache pourquoi → réussi.

---

## ⚙️ Stack motion

| Lib | Version | Rôle |
|---|---|---|
| **GSAP** | 3.12.5 | Core animation engine |
| **ScrollTrigger** | 3.12.5 | Scroll-driven animations (scrub, pin, snap) |
| **Lenis** | 1.1.18 | Smooth scroll (desktop) + rAF ticker unified |
| **Canvas 2D** (vanilla) | native | Particules (tourbillon vertical, sand reveal, etc.) |

**Chargement** : tous vendors en `/assets/vendor/` self-hosted + `defer` attribute. Ordre d'exécution : `gsap` → `ScrollTrigger` → `lenis` → scripts app.

---

## 🎼 Easings tokens (source `tokens-voyage.css`)

```css
--ease           cubic-bezier(0.22, 1, 0.36, 1)    /* Apple easeOutQuart */
--ease-in        cubic-bezier(0.6, 0, 1, 1)
--ease-out       cubic-bezier(0, 0, 0.2, 1)
--ease-expressive cubic-bezier(0.7, 0, 0.3, 1)     /* Slot-machine morph */
```

### Durées

```css
--d-micro        150ms    /* Small hover state change */
--d-short        300ms    /* Normal interaction feedback */
--d-med          600ms    /* Section reveal / big state change */
--d-long         1200ms   /* Scene transition, hero entrance */
```

---

## 🎬 4 signatures principales

### #1 · Scene counter slot-machine
**Fichier** : `assets/js/scene-counter.js`
**Position** : fixed top: 1.5rem; right: 1.5rem
**Format** : "01 / 08" en Geist Mono tabular-nums 0.75rem
**Couleur** : `var(--gold-primary)` · opacity 60% repos, 85% section active
**Mix-blend-mode** : `screen` (brille proprement sur film)

**Animation slot-machine** :
1. Nouveau span avec numéro suivant entre `translateY(100%)` (invisible, en bas)
2. Ancien span exit `translateY(-100%)` (invisible, en haut)
3. Transition 600ms `cubic-bezier(0.7, 0, 0.3, 1)` simultanée
4. DOM cleanup 700ms après

**Déclenchement** : écoute `voyage:scene-active` event + fallback `MutationObserver` sur `data-active-section`.

**Mobile** : top 1rem / right 1rem / font-size 0.6875rem.
**Désactivé** : `voyage-sober`.

---

### #2 · Film chromatic aberration per scene
**Fichier** : `assets/js/film-chromatic.js`
**Target** : `#pinapp-film` (filter CSS)
**Propriété animée** : `--film-hue-shift` (CSS custom prop)
**Amplitude** : ±14° hue-rotate max (subtle)

**Mapping scène → hue** :
```js
s0:  0deg   // main hologramme neutre
s1:  -2deg  // prologue
s2:  +4deg  // couloir passengers
s3:  +8deg  // métiers hublot
s4:  +10deg // constellation M&P
s5:  -4deg  // preuves
s5b: -6deg  // N8N mécanisme
s6:  -12deg // lune manifeste
s7:  +6deg  // œuvre tourbillon
s8:  -6deg  // atterrissage sable
```

**CSS** : `.pinapp-film { filter: saturate(1.04) hue-rotate(var(--film-hue-shift, 0deg)); transition: filter 900ms cubic-bezier(0.4, 0, 0.2, 1); }`

**Désactivé** : `prefers-reduced-motion` (filter neutre) · `voyage-sober` (saturation 0.85, hue 0).

---

### #3 · Cursor cinema timecode
**Fichier** : `assets/js/cursor-timecode.js`
**Position** : fixed, follows mouse avec offset `+22px / +38px`
**Format** : "00:12 / 01:02" Geist Mono 10px tabular-nums
**Couleur** : `rgba(244, 228, 193, 0.42)` + `mix-blend-mode: screen`

**Update** : polling 100ms sur `window.__pinappFilm.getCurrentTime()` + `getDuration()`

**Désactivé** : `@media (hover: none), (pointer: coarse)` (mobile) · `prefers-reduced-motion` · `voyage-sober`.

**Garantie** : silent fail si `__pinappFilm` pas exposé.

---

### #4 · Tourbillon vertical ascendant (Aladdin signature)
**Fichier** : `assets/js/tourbillon-vertical.js`
**Target** : `#tourbillon-vertical` canvas fixed full viewport
**Mix-blend-mode** : `screen`
**z-index** : 2

**Déclenchement** : IntersectionObserver sur `#s6` (threshold 0.35) → start animation.

**Particules** : 60 max, spawned avec stagger 30ms chacune.

**Trajectoire** :
- Spawn : bas du viewport (y = h + jitter 200px) · x dispersé 15-85% width
- Vélocité Y : `-0.6` à `-2.0` (ascending)
- Drag Y : `×= 0.998` (slight deceleration)
- Drag X : micro-turbulence `±0.4`

**Alpha envelope** : fade-in 0-15% · stable 15-70% · fade-out 70-100%.

**Rendu** : gradient radial HSL or 42-54° · core point + halo 4x.

**Life** : 3-6s per particle (randomized).

**Performance** : DPR max 2 · auto-stop quand toutes particules mortes · 0 frame-cost hors animation.

**Désactivé** : `prefers-reduced-motion` · `voyage-sober` · `low-perf`.

---

## 🥚 3 Easter eggs

### Egg #1 · Spider-Man inversé
**HTML** : `<p class="tapestry-whisper">` sous H2 de s3 Métiers
**Texte** : *"Un grand pouvoir n'implique pas forcément de grosses responsabilités."*
**Style** : Fraunces italic 0.75rem ivory 42% opacity
**Aucune attribution visible.**

### Egg #2 · Morse STAY
**Fichier** : `assets/js/easter-eggs.js` (addendum V7)
**DOM** : `<div class="morse-stay">` injecté au DOMContentLoaded
**Pattern** : 13 spans (3 dot + gap + 1 dash + gap + dot+dash + gap + dash+dot+dash+dash)
**Animation** : blink 4s infinite avec stagger 80ms per span
**Trigger** : `html[data-active-section="s4"]` → opacity 0.55

Technique :
```css
html[data-active-section="s4"] .morse-stay { opacity: 0.55; }
@keyframes morse-blink {
  0%, 45%, 100% { opacity: 0.35; }
  20% { opacity: 1; }
  60% { opacity: 0.6; }
}
```

### Egg #3 · JARVIS
**Visible** : caption `.tapestry-whisper` "À votre service." sous card IA s3
**Dev-facing** : banner console DevTools F12 au load
```js
console.log('%c J.A.R.V.I.S. systems online.', 'color:#3ef5e0;font:italic 14px Fraunces;');
console.log('%c Just A Rather Very Intelligent System.', '...');
```

### Autres easter eggs (dans `easter-eggs.js` depuis avant V7)

- **Konami code** (↑↑↓↓←→←→BA) → overlay fullscreen "KONAMI CODE" 4s
- **`pinapp.duo()`** — fonction globale qui log les stats duo Lauralie/Michaël en console

---

## 🎭 Sand reveal (Aladdin signature #2)
**Fichier** : `assets/js/voyage-sand-reveal.js` (existant V5)
**Selector** : `section.voyage-scene[data-chapter] > .chapter__content h2.h-1`
**Trigger** : IntersectionObserver (rootMargin -35% bottom)

**Comportement** :
- Crée canvas 2D superposé au H2
- Décompose texte en `lines` + `chars` via position rect
- Génère 56 particules par caractère (max 480 total, max 3 instances concurrentes)
- Particules convergent depuis positions aléatoires vers pixels finaux
- Couleurs mix gold ↔ cyan interpolées

**Easing** : easeOutQuart (`1 - (1 - t)^4`).

**Durée** : ~1.5s par H2.

**Désactivé** : `voyage-sober` · `low-perf`.

---

## 🧲 Magnetic cursor
**Fichier** : `assets/js/magnetic-cursor.js`
**Selector** : `[data-magnetic]`, `.btn-primary`, `.holo-circle`
**Comportement** : pull magnétique 12px dans rayon 80px (desktop)
**Elastic ease** au mouseleave

---

## 🖱️ Custom cursor
**Fichier** : `assets/js/custom-cursor.js`
**Éléments créés** : `#cursor-ring` + `#cursor-label`
**Lerp** : 0.15 via `gsap.quickTo`

**Zones contextuelles** :
- `[data-cursor="view"]` → ring scale + label "Voir"
- `iframe[src*="vimeo"]` → label "Plein écran"
- `.glass-card img` → label "Découvrir"

**Désactivé** : touch · `prefers-reduced-motion` · `voyage-sober`.

---

## 💠 Glass card 3D tilt (V7 polish)
**Fichier** : `assets/js/glass-tilt.js`
**Selector** : `.glass-card`
**Amplitude** : ±3° max (damping 0.7 = 2.1° effectif)
**Transition** : 120ms linear pendant mousemove, 420ms cubic-bezier au mouseleave

**Référence** : Stripe/Linear/Arc browser.

---

## 🎞️ Scroll choreography

### Lenis smooth scroll
**Init** : `voyage.js#initLenis` · `duration: 1.2s` · `lerp: 0.12` · `easing: cubic-bezier(0.22,1,0.36,1)`
**Desktop only** : `mqDesktop.matches`
**Hijack natif** : fluid, programmatic

### ScrollTrigger reveals
**Function** : `voyage.js#initSceneRevealsGsap`
**Selector** : `.voyage-scene .reveal`
**Initial state** : `{ opacity: 0, filter: blur(36px), y: 60 }`
**Final state** : `{ opacity: 1, filter: blur(0px), y: 0, duration: 1.2, ease: 'power2.out', stagger: 0.15 }`
**Trigger** : `start: top 78%, end: top 35%, once: true`

**Désactivé** : `prefers-reduced-motion` · `voyage-sober` · mobile (`.reveal` a son propre fallback plus simple).

### Film scrub
**Function** : `pinapp-film-v6.js`
**Logic** :
```js
scrollTarget = (scrollY / maxScroll) * filmDuration;
currentTime += (scrollTarget - currentTime) * LERP_FACTOR; // 0.12
film.currentTime = currentTime;
```
**Smoothing** : lerp 0.12 pour éviter staccato
**Min delta** : 0.02s (évite writes inutiles)
**Listen** : `window.scroll` + `resize` + `Lenis scroll event` (si dispo)

---

## 📢 Events custom

| Event | Émis par | Écouté par |
|---|---|---|
| `voyage:scene-active` | `voyage.js` (scene tracking) | `film-chromatic.js`, `scene-counter.js`, `easter-eggs.js`, `match-cuts.js`, `voyage-particles.js` |
| `voyage:breath` | `voyage-chapter-breath.js` | (animations chapitre) |

### Contract event `voyage:scene-active`
```js
new CustomEvent('voyage:scene-active', {
  detail: {
    index: Number,        // 1-10
    sectionId: String     // 's0' à 's8'
  }
});
```

---

## ✨ CSS-only polishes (V7 additions)

### ::selection biolumi
```css
::selection {
  background: rgba(62, 245, 224, 0.35);
  color: var(--ivory-900);
  text-shadow: 0 0 12px rgba(62, 245, 224, 0.4);
}
```

### Scrollbar gradient gold→cyan
```css
*::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--gold-primary), var(--cyan-glow));
  border-radius: 999px;
}
```

### Focus-visible premium (à formaliser)
**Proposé** (pas encore appliqué partout) :
```css
:focus-visible {
  outline: 2px solid var(--cyan-glow);
  outline-offset: 4px;
  box-shadow: 0 0 0 4px rgba(62, 245, 224, 0.15), 0 0 32px rgba(62, 245, 224, 0.2);
  transition: outline-offset 240ms var(--ease), box-shadow 240ms var(--ease);
}
```

---

## 🚫 Garde-fous universels

Chaque composant motion doit respecter :

1. `@media (prefers-reduced-motion: reduce)` → fallback statique ou `display: none`
2. `html.voyage-sober` → désactivation des effets cinéma
3. `html.low-perf` (hardwareConcurrency < 4) → réduction particules, blur retirés
4. `@media (hover: none)` → désactivation effets desktop-only (magnetic, tilt, custom cursor)
5. `@media (pointer: coarse)` → idem mobile tactile

**Aucun effet motion ne doit bloquer l'accessibilité.**

---

## 🎯 Motion roadmap (V7.x / V8)

### P0 post-V7 launch
- Focus-visible premium ring appliqué globalement
- Loading spinner réutilisable
- Form submit loading state (existing idle → loading → success/error)

### P1
- Page transitions (view transitions API + fallback FLIP)
- Chapter breath event sync avec film chromatic
- Hover velocity sur buttons (push au hover, pull au mouseout)

### P2
- Audio ambient WebAudio (optional, user-initiated)
- Parallax depth layers sur portraits pilotes (s2)
- Stardust typography sur brand statement EN ("The operating system for the solo entrepreneur" qui se forme d'étoiles)

---

## 🔬 Perf monitoring

**Budgets actuels** :
- LCP ≤ 1.5s desktop / 2.5s mobile 4G
- TTI divisé par 2 vs V5 (grâce defer scripts V7)
- 60fps constant sur scrub
- GPU composition-only (pas de layout thrashing)

**Profiling à faire** :
- Chrome DevTools Performance tab pendant scroll scrub
- Lighthouse mobile 4G simulé
- Real device iPhone 12+ test terrain
