# BRIEF CLAUDE CODE · FULL UX REFONTE V5
> À copier-coller intégralement dans Claude Code.
> On garde la base technique (vanilla JS, Bunny Fonts, 6 photos hero R1, 4 vidéos Vimeo).
> On refait **tout l'UX** : composants, interactions, états, motion, mobile, a11y.
> Les textes verbatim existent déjà → encarts `[TEXTE: …]` qu'on remplira **après**.

---

## 🎯 MISSION

Régénérer `voyage-v9/index.html` en gardant :
- Stack vanilla JS, Bunny Fonts, 1 fichier HTML monolithique
- 6 photos hero `assets/hero-1.webp` … `hero-6.webp` (R1 NON NÉGOCIABLE)
- 4 vidéos Vimeo (1184294762 / 1184294810 / 1184294871 / 1184294831)
- Doctrine éditoriale (0 jargon, 0 "!", neuro = cible / fondateurs jamais)

Et en refaisant **complètement** :
- Architecture UX (14 scènes linéaires · pas de décimales)
- Système de composants (cards, buttons, inputs, modals, accordions)
- Système de motion (reveal cascade, cross-fade hero, scroll-trigger taggué)
- Système d'interaction (hover, focus, active, loading, error, empty)
- Mobile-first (≥ 44px touch, breakpoints 480/768/1024/1440)
- A11y WCAG 2.1 AA (focus visible, ARIA, contraste, reduced-motion, sr-only)

---

## 🧱 1 · DESIGN TOKENS (CSS custom properties dans `:root`)

```css
/* ─── PALETTE ─── */
--or:           #e6b973;
--or-light:     #f7d99d;
--or-glow:      rgba(230,185,115,0.18);
--ivoire:       #f4ece0;
--ivoire-dim:   #c9bfae;
--ivoire-mute:  rgba(244,228,193,0.62);
--cyan:         #3ef5e0;
--nuit:         #050b14;
--nuit-soft:    #0a121f;
--fumee:        rgba(20,30,42,0.6);
--fumee-strong: rgba(20,30,42,0.85);
--rouge-err:    #ff6b6b;
--vert-ok:      #5eddb6;
/* ❌ JAMAIS #000 pur · JAMAIS purple neon · JAMAIS gradient mesh */

/* ─── TYPO (Bunny Fonts uniquement) ─── */
--ff-display: "Fraunces", Georgia, serif;
--ff-body:    "Inter", -apple-system, system-ui, sans-serif;
--ff-mono:    "JetBrains Mono", ui-monospace, monospace;

/* ─── ÉCHELLE ─── */
--fs-h1:    clamp(3.5rem, 9vw, 7rem);
--fs-h2:    clamp(2.25rem, 5vw, 4rem);
--fs-h3:    clamp(1.75rem, 3.5vw, 2.5rem);
--fs-lead:  clamp(1.125rem, 1.5vw, 1.375rem);
--fs-body:  17px;
--fs-micro: 14px;
--lh-tight: 1.15;
--lh-body:  1.65;

/* ─── ESPACEMENT (échelle 4px) ─── */
--sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
--sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 64px;
--sp-9: 96px; --sp-10: 128px; --sp-11: 192px;

/* ─── RADIUS ─── */
--r-sm: 8px; --r-md: 16px; --r-lg: 24px; --r-pill: 999px;

/* ─── ELEVATION (subtle, jamais drop shadow neon) ─── */
--shadow-1: 0 1px 2px rgba(0,0,0,0.3);
--shadow-2: 0 8px 24px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.4);
--shadow-glow: 0 0 0 1px var(--or-glow), 0 0 32px var(--or-glow);

/* ─── MOTION ─── */
--ease-out:   cubic-bezier(0.22, 1, 0.36, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--dur-fast:   200ms;
--dur-mid:    400ms;
--dur-slow:   800ms;
--dur-cinema: 1200ms;

/* ─── BREAKPOINTS (mobile-first) ─── */
/* SM ≥ 480 · MD ≥ 768 · LG ≥ 1024 · XL ≥ 1440 */
```

---

## 🎬 2 · STAGE FIXE GLOBAL (toutes scènes)

```
┌─ <div class="stage" aria-hidden="true"> ────────────────────────────┐
│  position: fixed · inset: 0 · z-index: -1                            │
│                                                                      │
│  6 layers .stage__layer (un par hero) — empilés en absolute          │
│  Chacun : background-image: url(assets/hero-N.webp) · cover · center │
│                                                                      │
│  IntersectionObserver sur chaque <section data-stage="hero-N">       │
│    → ajoute .is-active sur le layer correspondant                    │
│    → opacity 0 → 1 sur var(--dur-cinema) ease-out                    │
│    → tous les autres layers: opacity 0                               │
│                                                                      │
│  Ken Burns : transform scale(1) → scale(1.05) sur 15s linear infini  │
│              uniquement sur .stage__layer.is-active                  │
│                                                                      │
│  Voile linéaire : pseudo-element ::after sur .stage                  │
│    background: linear-gradient(180deg,                                │
│      rgba(5,11,20,0.45) 0%,                                          │
│      rgba(5,11,20,0.78) 100%)                                        │
│                                                                      │
│  ⚠ @media (prefers-reduced-motion) → coupe Ken Burns + cross-fade    │
│  ⚠ body.sober → idem                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**Mapping hero → scènes** :
```
hero-1 vaisseau    → s01 · s02
hero-2 cockpit     → s03 · s04 · s04b
hero-3 offre       → s05 · s06 · s06b
hero-4 cinéma      → s07 · s08 · s09
hero-5 profondeur  → s09b · s10 · s11
hero-6 atterriss.  → s12 · s13 · footer
```

---

## 🧩 3 · SYSTÈME DE COMPOSANTS (atomique → moléculaire → organisme)

### 3.1 · Atomes

```
┌─ BUTTON · 4 variantes ──────────────────────────────────────────────┐
│  .btn--primary   bg or solid · text nuit · padding 14px 28px        │
│                  hover: -1px translateY · or-light bg               │
│                  active: 0 translateY · scale(0.98)                 │
│                  focus: ring 2px var(--cyan) offset 3px             │
│                                                                     │
│  .btn--ghost     bg transparent · border 1px or · text or           │
│                  hover: bg or-glow                                  │
│                                                                     │
│  .btn--text      text or · underline-offset 4px · pas de border     │
│                                                                     │
│  .btn--cta-large idem primary · padding 18px 40px · fs 1.125rem     │
│                                                                     │
│  Touch ≥ 44px obligatoire mobile                                    │
│  Loading state : spinner inline + text "Envoi…" · disabled          │
└─────────────────────────────────────────────────────────────────────┘

┌─ INPUT · 5 variantes ───────────────────────────────────────────────┐
│  Wrapper .field                                                     │
│    label visible AU-DESSUS · jamais sr-only · fs micro · ivoire-dim │
│    input bg fumee · border 1px ivoire-mute · radius md · padding   │
│      14px 16px · text ivoire                                        │
│    focus: border or · ring 2px or-glow                              │
│    error: border rouge-err · message inline rouge sous le champ     │
│    helper text: ivoire-mute fs micro sous le champ                  │
│                                                                     │
│  Variantes : text · email · tel · textarea · select                 │
└─────────────────────────────────────────────────────────────────────┘

┌─ CHECKBOX / RADIO custom ───────────────────────────────────────────┐
│  Carré 22×22 · border 2px ivoire-mute · checked: bg or + ✓ nuit     │
│  Touch zone étendue 44×44 via ::before                              │
│  Focus ring or-glow                                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─ BADGE / CHIP ──────────────────────────────────────────────────────┐
│  .badge--info     bg or-glow · text or · padding 4px 12px · pill    │
│  .badge--success  bg vert-ok alpha 0.15 · text vert-ok              │
│  .badge--popular  bg or solid · text nuit · "★ Le plus demandé"     │
└─────────────────────────────────────────────────────────────────────┘

┌─ ICON · taille uniforme ────────────────────────────────────────────┐
│  Stroke 1.5px · width 24 · height 24 · currentColor                 │
│  Pas d'emoji UI dans la nav · emojis OK pour signal contenu         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 · Molécules

```
┌─ CARD · 5 variantes ────────────────────────────────────────────────┐
│  .card--glass    bg fumee · backdrop-blur 20px · border 1px         │
│                  rgba(or alpha 0.15) · radius lg · padding sp-6     │
│  .card--solid    bg nuit-soft · border idem · radius lg             │
│  .card--feature  glass + glow on hover (shadow-glow)                │
│  .card--pricing  glass + slot price-anchor + badge popular slot     │
│  .card--placeholder  border 2px dashed or · padding sp-7 · label    │
│                      "📭 PLACEHOLDER" top-left or                   │
│                      visible uniquement si body.draft-mode          │
└─────────────────────────────────────────────────────────────────────┘

┌─ ACCORDION (FAQ) ───────────────────────────────────────────────────┐
│  <details class="accordion">                                        │
│    <summary>                                                        │
│      [ ▸ ] Question                          [ + ]                  │
│    </summary>                                                       │
│    <div class="accordion__body">Answer</div>                        │
│  </details>                                                         │
│                                                                     │
│  Open state: rotate 90deg sur ▸ · + devient − · body slide-down     │
│  Border bottom 1px ivoire-mute · padding y sp-5                     │
│  Hover summary: text or                                             │
└─────────────────────────────────────────────────────────────────────┘

┌─ STAT BLOCK ────────────────────────────────────────────────────────┐
│  Number Fraunces 600 · or · clamp(2.5rem, 6vw, 4.5rem)              │
│  Label Inter 500 · ivoire-dim · fs micro · uppercase letter-sp 0.1em│
│  CountUp animation au reveal (IntersectionObserver une fois)        │
└─────────────────────────────────────────────────────────────────────┘

┌─ VIDEO POSTER ──────────────────────────────────────────────────────┐
│  Wrapper aspect-ratio 16/9 · radius lg · overflow hidden            │
│  <img src=vumbnail …_large.jpg loading="lazy">                      │
│  Overlay play button : circle 72×72 · bg or-glow · ▶ icon or        │
│  Hover : scale(1.04) · play overlay scale(1.1) · cursor pointer     │
│  Click → remplace par iframe Vimeo player (lazy embed)              │
└─────────────────────────────────────────────────────────────────────┘

┌─ TOOLTIP ───────────────────────────────────────────────────────────┐
│  Hover/focus → bubble nuit-soft · text ivoire · fs micro · padding  │
│    8px 12px · radius sm · shadow-2 · max-width 240px                │
│  Arrow CSS pointing to anchor                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 · Organismes

```
┌─ NAV (top fixed) ───────────────────────────────────────────────────┐
│  <nav class="nav" role="navigation">                                │
│  height 72px desktop · 64px mobile                                  │
│  bg fumee-strong · backdrop-blur 24px · border-bottom 1px or-glow   │
│                                                                     │
│  ┌────────┬─────────────────────────────────┬────────┬─────┬─────┐  │
│  │ [Logo] │                                 │ [CTA]  │[sob.]│ [☰] │  │
│  └────────┴─────────────────────────────────┴────────┴─────┴─────┘  │
│  Logo gauche · CTA centre/droite (caché < 768) · toggle sober ·     │
│  hamburger drawer drawer plein écran 4 actes                        │
│                                                                     │
│  Scroll behavior :                                                  │
│    scrollY 0-80   → bg transparent                                  │
│    scrollY > 80   → bg fumee-strong + shadow-2                      │
│    scrollY > 600 ET direction down → translate-y -100% (hide)       │
│    scroll up      → translate-y 0 (reveal)                          │
└─────────────────────────────────────────────────────────────────────┘

┌─ MODAL · M&P easter egg ────────────────────────────────────────────┐
│  Overlay nuit alpha 0.85 · backdrop-blur 12px · fixed inset 0       │
│  Dialog max-width 480px · centered · padding sp-7 · bg nuit-soft    │
│  Close: ESC · click-outside · button × top-right                    │
│  Trap focus : focus 1er élément · Tab cycle dans modal              │
│  Open: scale 0.92 → 1 + opacity 0 → 1 sur dur-mid                   │
└─────────────────────────────────────────────────────────────────────┘

┌─ DRAWER · "Qui sommes-nous" 4 actes ────────────────────────────────┐
│  Slide depuis right · width 100vw · bg nuit · padding sp-7          │
│  4 sections plein écran scrollable verticalement                    │
│  Close: ESC · button × top-right · click outside fermable           │
└─────────────────────────────────────────────────────────────────────┘

┌─ FORM 3 CHEMINS (s13) ──────────────────────────────────────────────┐
│  Step 1 : 3 cards visuelles (PAS radio buttons natifs)              │
│           hover : translateY -2px · shadow-glow                     │
│           active : border 2px or · bg or-glow                       │
│  Step 2 : champs essentiels (toujours visibles)                     │
│  Step 3 : champs conditionnels (apparition slide-down 300ms)        │
│  Step 4 : checkbox solidaire + RGPD                                 │
│  Step 5 : 2 CTA (envoyer brief + prendre RDV)                       │
│                                                                     │
│  Validation inline temps réel · debounced 400ms                     │
│  Submit : disabled si invalide · loading state pendant POST         │
│  Success : message confirmation + reset form après 3s               │
│  Error : banner rouge top + scroll vers 1er champ erreur            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🌀 4 · SYSTÈME DE MOTION

```
┌─ REVEAL CASCADE (au scroll) ────────────────────────────────────────┐
│  IntersectionObserver root margin -10%                              │
│  Elements [data-reveal]                                             │
│    initial : opacity 0 · translateY 24px                            │
│    intersect: opacity 1 · translateY 0 sur dur-mid ease-out         │
│  Stagger via [data-reveal-delay="N"] (N = 1..5 → delay N*80ms)      │
│  Une seule fois (unobserve après reveal)                            │
│  reduced-motion : pas de translate, juste opacity                   │
└─────────────────────────────────────────────────────────────────────┘

┌─ TEXT-SPLIT (s08 tapestry-whisper) ─────────────────────────────────┐
│  Splitter caractère par caractère via JS                            │
│  Chaque char en <span data-char> opacity 0 · translateY 8px         │
│  Scroll progress (0..1) → reveal char N proportionnel               │
│  Désactivé en reduced-motion                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─ KEN BURNS (stage layers) ──────────────────────────────────────────┐
│  Voir section 2                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ COUNT-UP (stat blocks) ────────────────────────────────────────────┐
│  Number animation 0 → target sur 2s ease-out                        │
│  Au 1er reveal uniquement (IO + flag)                               │
│  reduced-motion : affiche directement target                        │
└─────────────────────────────────────────────────────────────────────┘

┌─ HOVER PHYSICS (cards · buttons) ───────────────────────────────────┐
│  transform translateY -2px sur hover                                │
│  transition transform dur-fast ease-spring                          │
│  Active : 0 translate                                               │
└─────────────────────────────────────────────────────────────────────┘

┌─ MORSE-STAY (easter egg) ───────────────────────────────────────────┐
│  Animation @keyframes 4s linear infinite                            │
│  STAY = ●●● ─ ─ ●─ ─ ─●─                                            │
│  8 dots en or qui clignotent en séquence morse                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 5 · RESPONSIVE BEHAVIOR

```
< 480 (mobile S)
  - Nav : hamburger only · CTA caché · logo réduit
  - H1 : 3.5rem
  - Cards : full-width · stack vertical · sp-4 padding
  - Form 3 chemins : stack vertical · 100% width chaque card
  - Vidéos posters : 1 colonne
  - Stage : Ken Burns 1→1.03 (réduit) · cross-fade dur-mid

480-768 (mobile L · tablet portrait)
  - Cards : 1 colonne · gap sp-5
  - H1 : 4rem
  - Stats : 2 colonnes
  - Vidéos posters : 1 colonne (poids média)
  - Form 3 chemins : 1 colonne

768-1024 (tablet land · desktop S)
  - Nav : CTA visible · sober toggle visible
  - Cards : 2 colonnes
  - H1 : 5.5rem
  - Vidéos posters : grille 2×2
  - Form 3 chemins : 3 colonnes

1024+ (desktop)
  - Layout complet
  - H1 : 7rem
  - Cards : 3-4 colonnes selon contexte
  - Vidéos : 2×2 mosaïque

1440+ (XL)
  - Max-width 1280px container · centré
  - Padding latéral sp-8
```

---

## ♿ 6 · A11Y · WCAG 2.1 AA

```
✓ Contraste : ivoire/nuit ≥ 11.5:1 · or/nuit ≥ 8:1 (vérifier perso)
✓ Focus visible : ring cyan 2px offset 3px sur TOUS les interactifs
✓ Skip-link "Aller au contenu" en haut (apparaît au focus)
✓ Hiérarchie heading : 1 H1 · H2 par section · pas de skip de niveau
✓ Landmark roles : <nav> <main> <footer> · <section aria-labelledby>
✓ ARIA :
   - hamburger : aria-expanded · aria-controls
   - drawer/modal : role="dialog" · aria-modal="true" · aria-labelledby
   - accordion : <details> natif (gratuit)
   - form errors : aria-invalid + aria-describedby
   - live regions : aria-live="polite" sur form status
✓ Vidéos : <iframe title> + sous-titres dispo (mention)
✓ Images : alt descriptif sur photos hero (vide alt="" si décoratif)
✓ Reduced-motion : respecté (cf section motion)
✓ Touch targets : ≥ 44×44px obligatoire
✓ Lang attribute : <html lang="fr">
✓ prefers-color-scheme : non (site déjà sombre par design)
✓ Tab order : logique linéaire · pas de tabindex positifs
✓ sr-only utility class pour labels visuellement absents si jamais
```

---

## 🗺 7 · ARCHITECTURE 14 SCÈNES (linéaire)

> **Chaque scène = 1 `<section>` indépendante avec data-stage attribute.**
> Les textes verbatim seront ajoutés après — j'ai laissé des `[TEXTE: …]` qui pointent vers les blocs déjà rédigés dans `PROMPT-CLAUDE-DESIGN-V5.md`.

---

### s01 · HERO `data-stage="hero-1"`

```
LAYOUT desktop (≥ 1024px)
┌────────────────────────────────────────────────────────────────────┐
│  100dvh · padding-top 96px (compense nav)                          │
│                                                                    │
│  ┌──────────────── Container max 1280px ──────────────────────┐   │
│  │  [eyebrow]                                                  │   │
│  │  [H1 split 2 lignes Fraunces italique]                      │   │
│  │  [Lead 3 lignes Inter ivoire-dim]                           │   │
│  │  [Badge engagements pill or-glow]                           │   │
│  │                                                             │   │
│  │  ┌──────────────────────────┐  ┌────────── stats ────────┐ │   │
│  │  │ [Card placeholder vidéo  │  │ 24h | 0€ | 30j           │ │   │
│  │  │  60s mode draft]         │  │ stat │ stat │ stat       │ │   │
│  │  │ aspect 16/9 · or dashed  │  └──────────────────────────┘ │   │
│  │  └──────────────────────────┘                              │   │
│  │                                                             │   │
│  │  [CTA primary large]   [CTA ghost]                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘

LAYOUT mobile (< 768)
- Tout stack vertical
- H1 plus petit
- Card placeholder vidéo full-width
- CTAs stack 100% width chaque · gap sp-3

ÉLÉMENTS
- eyebrow              → [TEXTE: s01.eyebrow]
- H1                   → [TEXTE: s01.h1 split sur 2 lignes]
- lead                 → [TEXTE: s01.lead]
- badge engagements    → [TEXTE: s01.badge_engagements]
- card placeholder     → [PLACEHOLDER: vidéo Pinapp 60s · à compléter quand vidéo tournée]
- stats (3 colonnes)   → [TEXTE: s01.stats_24h, s01.stats_0eur, s01.stats_30j]
- CTA primary          → [TEXTE: s01.cta_primary]
- CTA ghost            → [TEXTE: s01.cta_ghost]

INTERACTIONS
- Reveal cascade au load (eyebrow → H1 → lead → badge → card → stats → CTAs)
- CTA primary : scroll to s13 form
- CTA ghost   : scroll to s03 (le diagnostic)
- Card placeholder vidéo : visible uniquement body.draft-mode

A11Y
- H1 unique sur la page · landmark <main> commence ici
- CTAs avec text descriptif (pas "cliquez ici")
```

---

### s02 · LE DUO `data-stage="hero-1"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow]                                                         │
│  [H2 sur 2 lignes Fraunces italique]                               │
│                                                                    │
│  ┌───── card glass Lauralie ─────┬───── card glass Micha ─────┐   │
│  │  🔧 Avatar/icon               │  🎬 Avatar/icon             │   │
│  │  Nom Fraunces 600             │  Nom Fraunces 600           │   │
│  │  Rôle (1 ligne italique)      │  Rôle (1 ligne italique)    │   │
│  │  Bio (3-4 lignes)             │  Bio (3-4 lignes)           │   │
│  │  "Tient X. Du brief à Y."     │  "Tient X. Du brief à Y."   │   │
│  │  Localisation (fs micro)      │  Localisation (fs micro)    │   │
│  └───────────────────────────────┴─────────────────────────────┘   │
│                                                                    │
│              [Tagline Fraunces italique 1.5rem centré]             │
│                                                                    │
│              [CTA text "En savoir plus →"] (ouvre drawer 4 actes)  │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow              → [TEXTE: s02.eyebrow]
- H2                   → [TEXTE: s02.h2]
- card Lauralie        → [TEXTE: s02.card_lauralie_role, s02.card_lauralie_bio, s02.card_lauralie_loc]
- card Micha           → [TEXTE: s02.card_micha_role, s02.card_micha_bio, s02.card_micha_loc]
                          ⚠ "10 ans dans l'événementiel" PAS "mariages"
- tagline              → [TEXTE: s02.tagline]
- CTA                  → [TEXTE: s02.cta_drawer]

INTERACTIONS
- Cards reveal staggered (left-to-right)
- Hover card : translateY -2px · shadow-glow
- CTA → ouvre drawer "Qui sommes-nous" (4 actes plein écran)

A11Y
- Cards sémantiques <article> avec heading H3 nom
- Drawer focus trap au open
```

---

### s03 · LE CONSTAT `data-stage="hero-2"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow]                                                         │
│  [H2 question Fraunces italique]                                   │
│                                                                    │
│  ┌── 4 colonnes asymétriques (PAS equal grid) ──────────────────┐ │
│  │ card 01 │ card 02 │ card 03 │ card 04                          │
│  │ wider   │ narrow  │ wider   │ narrow  (alterne)                │
│  └─────────────────────────────────────────────────────────────────│
│                                                                    │
│  ┌─── Avant ───┐         →         ┌─── Après ────┐               │
│  │ 3j · 12 %   │  arrow icon       │ 24h · 32 %   │               │
│  │ closent     │                   │ closent      │               │
│  └─────────────┘                   └──────────────┘               │
│                                                                    │
│  [Microcopy cible Fraunces italique · centré · ivoire-mute]        │
│                                                                    │
│  Note source en mute : "(Mesures sur nos propres ops · le diag…)"  │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow                      → [TEXTE: s03.eyebrow]
- H2                           → [TEXTE: s03.h2]
- 4 cards douleurs (01-04)     → [TEXTE: s03.douleur_01, s03.douleur_02, s03.douleur_03, s03.douleur_04]
- before/after avec metrics    → [TEXTE: s03.before_label, s03.before_metric, s03.after_label, s03.after_metric]
- note source                  → [TEXTE: s03.note_source]
- microcopy cible              → [TEXTE: s03.microcopy_cible]
                                  ⚠ neuro = CIBLE OK / fondateurs jamais

INTERACTIONS
- Cards reveal cascade
- Avant/après : compteurs CountUp animés au reveal

A11Y
- Cards <article> avec H3 numéroté
- Avant/après : <table> sémantique simple (label/metric)
```

---

### s04 · POURQUOI L'IA `data-stage="hero-2"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2]                                                  │
│                                                                    │
│  ┌── 4 cards sources cliquables (grid 4 col) ──────────────────┐  │
│  │ 📊 McKinsey  │ 📊 Stanford  │ 📊 OECD     │ 📊 ADEME ★crit. │  │
│  │ Année        │ Année        │ Année       │ Année           │  │
│  │ Quote stat   │ Quote stat   │ Quote stat  │ Quote critique  │  │
│  │ [ Lire ↗ ]   │ [ Lire ↗ ]   │ [ Lire ↗ ]  │ [ Lire ↗ ]      │  │
│  └──────────────┴──────────────┴─────────────┴─────────────────┘  │
│                                                                    │
│  [Lead 3 lignes : "Un site agence … chez nous … 3 sources …"]      │
│                                                                    │
│  ┌── note critique encart pleine largeur · bg or-glow alpha 0.5 ─┐ │
│  │ "L'IA a un coût environnemental. Voici comment on le limite…" │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2                 → [TEXTE: s04.eyebrow, s04.h2]
- 4 cards sources              → [TEXTE: s04.source_mckinsey, s04.source_stanford, s04.source_oecd, s04.source_ademe]
                                  chacune : titre · année · quote · URL
- lead                         → [TEXTE: s04.lead]
- note critique                → [TEXTE: s04.note_critique]

INTERACTIONS
- Cards source : hover = scale 1.02 · click → open URL target=_blank rel="noopener"
- 4ème card "ADEME critique" : badge or-glow "Vue critique" pour la distinguer

A11Y
- Liens externes : aria-label "Lire l'étude X (nouvelle fenêtre)"
- Icon ↗ semantic
```

---

### s04b · PÉDAGOGIE IA (interstitiel) `data-stage="hero-2"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H3 lead]                                             │
│                                                                    │
│  ┌── Stack 4 cards Q&A · accordéon visuel · 1 colonne max-w-2xl ──┐│
│  │ ❓ Question 1                                                   ││
│  │ ✓ Réponse 1                                                    ││
│  │─────────────────────────────────────────────                   ││
│  │ ❓ Question 2                                                   ││
│  │ ✓ Réponse 2                                                    ││
│  │─────────────────────────────────────────────                   ││
│  │ … (×4 total)                                                   ││
│  └────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H3 + lead          → [TEXTE: s04b.eyebrow, s04b.h3, s04b.lead]
- 4 Q&A                        → [TEXTE: s04b.qa_quoi, s04b.qa_concrete, s04b.qa_combien, s04b.qa_si_nul]

INTERACTIONS
- Reveal cascade

A11Y
- Question = <dt> · réponse = <dd> · wrapper <dl>
```

---

### s05 · PACK DUO ★ ANCRE HAUTE `data-stage="hero-3"` `id="pack-duo"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2 Fraunces italique]                                │
│                                                                    │
│  ┌── Card ESSENTIEL ─────────┬── Card SIGNATURE [★ pop badge] ───┐ │
│  │ Title                     │ Title                              │ │
│  │ ~~price old~~ → price new │ price                              │ │
│  │ Économie · -X €           │ Économie · -X € (-Y %)             │ │
│  │                           │                                    │ │
│  │ ✓ feature 1               │ ✓ feature 1                        │ │
│  │ ✓ feature 2               │ ✓ feature 2                        │ │
│  │ ✓ feature 3               │ ✓ feature 3                        │ │
│  │ ✓ feature 4               │ ✓ feature 4                        │ │
│  │                           │ ✓ feature 5                        │ │
│  │                           │ ✓ feature 6                        │ │
│  │ Délai livraison           │ Délai livraison                    │ │
│  │                           │                                    │ │
│  │ [ CTA primary ]           │ [ CTA primary or solid · large ]   │ │
│  └───────────────────────────┴────────────────────────────────────┘ │
│                                                                    │
│  Note discrète sous : "On prend 3 projets par mois. Pas plus…"     │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2                 → [TEXTE: s05.eyebrow, s05.h2]
- card Essentiel               → [TEXTE: s05.essentiel_title, s05.essentiel_price_old, s05.essentiel_price_new, s05.essentiel_economie, s05.essentiel_features (×4), s05.essentiel_delai, s05.essentiel_cta]
- card Signature               → [TEXTE: s05.signature_title, s05.signature_price, s05.signature_economie, s05.signature_features (×6), s05.signature_delai, s05.signature_cta]
                                  badge popular fixe sur Signature
- note rareté                  → [TEXTE: s05.note_rarete]

INTERACTIONS
- Card Signature : shadow-glow always-on (effet "premium")
- Hover both : translateY -4px
- CTAs scroll to form s13 + pré-remplit chemin "Pack Duo"

A11Y
- Pricing : prix barrés via <s> sémantique
- CTAs : aria-label "Réserver le Pack Essentiel à 1890 €"
```

---

### s06 · LAURALIE · VUE D'ENSEMBLE `data-stage="hero-3"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2 sur 2 lignes]                                     │
│                                                                    │
│  ┌── Reel placeholder 14 sites · aspect 16/9 · radius lg ──────────┐│
│  │ [PLACEHOLDER: reel 20s WWDC-style à monter]                    ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                    │
│  ┌── 3 piliers · cercles connectés SVG ────────────────────────────│
│  │      ●─────────●─────────●                                      │
│  │  🌐 Sites    ⚙ Auto     ✨ Assist.                              │
│  │  prix        prix       prix                                    │
│  │                                                                 │
│  │  3 démos phares · grille asymétrique 1 large + 2 petits         │
│  │ ┌────────────┬──────────┬──────────┐                            │
│  │ │ ★ Atelier  │ Ōkami    │ Clara    │                            │
│  │ │   Rivage   │ resto    │ Fontaine │                            │
│  │ │ (large)    │ (petit)  │ (petit)  │                            │
│  │ │ [démo live]│ [voir↗]  │ [voir↗]  │                            │
│  │ └────────────┴──────────┴──────────┘                            │
│  │                                                                 │
│  │ <details> ▸ Trouver mon secteur (11 démos +)                    │
│  │   Liste 11 démos en grid 3 col après expand                     │
│  │ </details>                                                      │
│  │                                                                 │
│  │ ┌── Bundle Site + Outils auto ──────────────────────────────┐  │
│  │ │ 1 590 € HT · -190 € (-11 %) · separated price callout      │  │
│  │ │ [ CTA Réserver le bundle → ]                              │  │
│  │ └────────────────────────────────────────────────────────────┘  │
│  │                                                                 │
│  │ Doctrine prix : "Côté Lauralie : prix fixes affichés…"          │
│  └─────────────────────────────────────────────────────────────────│
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2                 → [TEXTE: s06.eyebrow, s06.h2]
- reel placeholder             → [PLACEHOLDER: reel 14 sites · à compléter quand monté]
- 3 piliers                    → [TEXTE: s06.pilier_sites, s06.pilier_auto, s06.pilier_assist] (titre · prix)
- 3 démos phares mockups       → [TEXTE: s06.demo_atelier_rivage, s06.demo_okami, s06.demo_clara_fontaine]
                                  + URL démo live (Atelier Rivage)
- 11 démos secondaires         → [TEXTE: s06.demos_11_secondaires] liste
- bundle card                  → [TEXTE: s06.bundle_label, s06.bundle_price, s06.bundle_economie, s06.bundle_cta]
- doctrine prix                → [TEXTE: s06.doctrine_prix]

INTERACTIONS
- 3 piliers : SVG animé · stroke-dashoffset draw au reveal
- Hover démo : scale image + reveal CTA
- <details> : transition smooth · custom marker

A11Y
- <details> natif (gratuit clavier)
- SVG : <title> describing each pilier
```

---

### s06b · LAURALIE · LE SYSTÈME (interstitiel) `data-stage="hero-3"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H3]                                                  │
│                                                                    │
│  ┌── Schéma rosace SVG centré ────────────────────────────────────┐│
│  │       UI/UX        Code                                        ││
│  │             ●────●                                             ││
│  │           ╱   │   ╲                                            ││
│  │  Hosting●   PROJET   ●Perf                                     ││
│  │           ╲   │   ╱                                            ││
│  │             ●────●                                             ││
│  │       SEO         A11y                                         ││
│  │     ●────●                                                     ││
│  │   Auto      Prompts                                            ││
│  │                                                                ││
│  │  Animation : centre en 1er, 8 cercles s'animent radial         ││
│  │  Stroke or fin · cercles glass · texte ivoire dans chacun      ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                    │
│  ┌── Schéma flux nodes (horizontal) ──────────────────────────────┐│
│  │ ◉ Lead → ◉ Notion → ◉ Devis → ◉ Paiement → ◉ Avis Google      ││
│  │ Animation : flèches qui se tracent puis pulsent                ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                    │
│  [Tagline centré]   [CTA text "Voir le travail invisible →"]       │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H3                 → [TEXTE: s06b.eyebrow, s06b.h3]
- 8 dimensions rosace          → [TEXTE: s06b.dim_uiux, dim_code, dim_hosting, dim_perf, dim_seo, dim_a11y, dim_auto, dim_prompts]
- centre rosace                → "PROJET" (fixe)
- 5 nodes flux                 → [TEXTE: s06b.flux_lead, flux_notion, flux_devis, flux_paiement, flux_avis]
- tagline                      → [TEXTE: s06b.tagline]
- CTA                          → [TEXTE: s06b.cta] (anchor → s10)

INTERACTIONS
- Rosace SVG : reveal radial au scroll · stroke-dashoffset
- Flux : timeline animation séquentielle

A11Y
- SVG : role="img" + <title> + <desc>
- Texte alternatif structuré pour lecteur d'écran
```

---

### s07 · MICHA · CINÉMA IA `data-stage="hero-4"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2 sur 2 lignes Fraunces italique]                   │
│                                                                    │
│  ┌── Grille mosaïque Apple TV+ · 2×2 ─────────────────────────────┐│
│  │ ┌─────────────┬─────────────┐                                  ││
│  │ │ ▶ Walker    │ ▶ SW Teaser │                                  ││
│  │ │ poster 16/9 │ poster 16/9 │                                  ││
│  │ │ titre       │ titre       │                                  ││
│  │ │ format      │ format      │                                  ││
│  │ │ prix dès X €│ prix dès X €│                                  ││
│  │ ├─────────────┼─────────────┤                                  ││
│  │ │ ▶ Resident  │ ▶ SW 3 min  │                                  ││
│  │ │   Evil      │   (microcopy│                                  ││
│  │ │ idem        │   "exemple")│                                  ││
│  │ └─────────────┴─────────────┘                                  ││
│  │                                                                ││
│  │ ┌── Slot Film cadeau IA · placeholder ──────────────────────┐ ││
│  │ │ [PLACEHOLDER: Vimeo Micha à fournir · 30s · dès 390 €]    │ ││
│  │ └───────────────────────────────────────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                    │
│  ┌── Argument tarifaire bloc compact or-glow ────────────────────┐ │
│  │ "Avant l'IA : 8000€ · Avec Pinapp : dès 1290€ · -84 %"       │ │
│  └────────────────────────────────────────────────────────────────┘│
│                                                                    │
│  Doctrine prix : "Côté Micha : à partir de + devis…"               │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2                 → [TEXTE: s07.eyebrow, s07.h2]
- 4 cards vidéo Vimeo          → pour chaque (Walker, SW Teaser, Resident Evil, SW 3 min) :
                                  vimeo_id (fixe) · poster URL vumbnail (fixe) ·
                                  [TEXTE: s07.{card}_titre, _format, _delai, _prix, _microcopy(SW3min)]
- slot film cadeau placeholder → [PLACEHOLDER: Vimeo Micha à fournir · esthétique cible à compléter]
- argument tarifaire           → [TEXTE: s07.argument_tarifaire]
- doctrine prix                → [TEXTE: s07.doctrine_prix]

INTERACTIONS
- Poster click → swap pour iframe Vimeo player (lazy)
- Hover poster : zoom 1.04 + play overlay scale
- Performance : posters lazy-loaded · iframe seulement au click

A11Y
- Card vidéo : <button> wrapper avec aria-label "Lire la vidéo X"
- iframe : title obligatoire
```

---

### s08 · CLIP IA · CLIMAX ★ `data-stage="hero-4"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2 BIG Fraunces italique split chars]                │
│                                                                    │
│  [Lead 3 lignes contraste prix studio vs Pinapp]                   │
│                                                                    │
│  ┌── Card placeholder STAR ★ ──────────────────────────────────────│
│  │  border 2px dashed or · padding sp-7 · radius lg · glow halo   │
│  │  animation pulse lente sur halo (4s ease-inout infinite)        │
│  │                                                                 │
│  │  [PLACEHOLDER: Lauralie chante 100% IA · clip CGI · à finaliser]│
│  │  Sous-titres descriptifs à compléter quand vidéo prête         │
│  └─────────────────────────────────────────────────────────────────│
│                                                                    │
│  ┌── Tapestry-whisper Spider-Man (text-split scroll-trigger) ────┐ │
│  │                                                                │ │
│  │  Fraunces italique · clamp(2.5rem, 6vw, 5rem)                 │ │
│  │  Cascade reveal char par char au scroll progress               │ │
│  │  text-align center · max-width 900px · padding y sp-9          │ │
│  │  [TEXTE: s08.whisper_spiderman_3lignes]                        │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Crédit triptyque (centré · ivoire-mute · fs micro)                │
│                                                                    │
│  ┌── Tableau comparatif 3 cols ──────────────────────────────────┐ │
│  │ Avant l'IA   │ Avec Pinapp     │ Économie                     │ │
│  │ X € - Y €    │ dès Z €         │ -W %                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Cible (3 chips horizontaux centrés)                               │
│                                                                    │
│              [ CTA primary "Recevoir un devis clip" ]              │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2                 → [TEXTE: s08.eyebrow, s08.h2]
- lead                         → [TEXTE: s08.lead]
- placeholder clip IA          → [PLACEHOLDER: clip Lauralie chante · à compléter quand prod terminée]
                                  description esthétique cible à compléter
- whisper Spider-Man           → [TEXTE: s08.whisper_spiderman]
- crédit triptyque             → [TEXTE: s08.credit_triptyque]
- tableau comparatif           → [TEXTE: s08.compar_avant, s08.compar_avec, s08.compar_eco]
- 3 chips cible                → [TEXTE: s08.cible_artistes, s08.cible_createurs, s08.cible_marques]
- CTA                          → [TEXTE: s08.cta_devis_clip]

INTERACTIONS
- Whisper text-split : caractère par caractère selon scroll progress
  reduced-motion → reveal direct opacity 0→1
- Halo placeholder pulse continu (sauf reduced-motion)
- CTA scroll to form s13 + pré-remplit "Image / Mouvement"

A11Y
- Whisper : <blockquote> sémantique avec <cite>
- Tableau : <table> + thead/tbody · scope="col"
```

---

### s09 · ÉVÉNEMENTIEL + DA `data-stage="hero-4"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2]                                                  │
│  [Lead "Micha filme en NA · sur devis…"]                           │
│                                                                    │
│  ┌── 3 cards en row ───────────────────────────────────────────────│
│  │ ┌─ Séminaire ─┬─ Anniversaire ─┬─ DA ────────┐                  │
│  │ │ placeholder │ placeholder    │ card solid  │                  │
│  │ │ dashed or   │ dashed or      │ pas dashed  │                  │
│  │ │             │                │             │                  │
│  │ │ esthétique  │ esthétique     │ Univers     │                  │
│  │ │ cible       │ cible          │ visuel      │                  │
│  │ │ description │ description    │             │                  │
│  │ │             │                │             │                  │
│  │ │ délais      │ délais         │ "Sur devis" │                  │
│  │ │ prix dès X €│ prix dès X €   │             │                  │
│  │ └─────────────┴────────────────┴─────────────┘                  │
│  └─────────────────────────────────────────────────────────────────│
│                                                                    │
│              [ CTA "Demander un devis événementiel" ]              │
│                                                                    │
│  ⚠ AUCUN MARIAGE                                                   │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2 + lead          → [TEXTE: s09.eyebrow, s09.h2, s09.lead]
- card Séminaire               → [PLACEHOLDER: Vimeo Micha à fournir]
                                  [TEXTE: s09.seminaire_titre, _description, _delais, _prix]
- card Anniversaire            → [PLACEHOLDER: Vimeo Micha à fournir]
                                  [TEXTE: s09.anniv_titre, _description, _delais, _prix]
- card DA                      → [TEXTE: s09.da_titre, _description, _prix]
- CTA                          → [TEXTE: s09.cta_devis_evenement]

INTERACTIONS
- Cards reveal staggered
- Hover : translateY -2px

A11Y
- Cards <article> avec H3 sectionnel
- Placeholder : aria-label explicite "Démo en attente"
```

---

### s09b · MICRO-PAUSE (interstitiel plein écran) `data-stage="hero-5"`

```
LAYOUT
┌────────────────────────────────────────────────────────────────────┐
│  100dvh · padding 0 · contenu centré flex                          │
│                                                                    │
│              [ Phrase pause Fraunces italique 4rem ]               │
│              fade-in lent · 3s pause                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- phrase pause                 → [TEXTE: s09b.phrase_pause]

INTERACTIONS
- Fade-in lent (1.5s) au reveal · pas d'autre animation
- Cross-fade hero-4 → hero-5 commence ici

A11Y
- <p> sémantique simple · pas de heading (pas une vraie section)
```

---

### s10 · LE TRAVAIL INVISIBLE `data-stage="hero-5"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2 sur 2 lignes]                                     │
│  [Lead "Si on est moins cher qu'une agence…"]                      │
│                                                                    │
│  ┌── Slider Apple Health "Avant IA / Avec IA" ───────────────────┐ │
│  │                                                                │ │
│  │  Range input custom · curseur or · track ivoire-mute           │ │
│  │  ◀ ────────────●──────────── ▶                                 │ │
│  │  position 0 = full Avant · position 100 = full Avec            │ │
│  │                                                                │ │
│  │  ┌─ Colonne AVANT IA ──────┬─ Colonne AVEC PINAPP ────────┐   │ │
│  │  │ "16 étapes humaines"   │ "4 étapes IA"                │   │ │
│  │  │ Liste numérotée 01-16  │ Liste numérotée 01-04        │   │ │
│  │  │ Visible si curseur < 50│ Visible si curseur ≥ 50      │   │ │
│  │  │ Cross-fade selon pos    │ Cross-fade inverse           │   │ │
│  │  └────────────────────────┴──────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌── 3 compteurs animés CountUp ──────────────────────────────────┐ │
│  │ 16 → 4         8000€ → 1290€         30j → 7j                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  [Tagline Fraunces italique centré "La différence n'est pas…"]     │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2 + lead          → [TEXTE: s10.eyebrow, s10.h2, s10.lead]
- 16 étapes Avant              → [TEXTE: s10.avant_etape_01..16]
- 4 étapes Avec                → [TEXTE: s10.avec_etape_01..04]
- 3 compteurs (avant/après)    → valeurs numériques fixes (16, 4, 8000, 1290, 30, 7)
- tagline                      → [TEXTE: s10.tagline]

INTERACTIONS
- Slider input range : drag mouse + keyboard (arrows ±5, home/end ±100)
- Auto-play option : si user inactif 3s, slider va de 0 à 100 puis revient (toggle)
- Compteurs : CountUp au reveal une fois
- reduced-motion : slider statique au milieu, pas d'auto-play

A11Y
- <input type="range" min=0 max=100 aria-label="Comparer Avant IA / Avec Pinapp">
- aria-valuetext live update ("Avant IA · 16 étapes")
- Listes <ol> sémantiques
```

---

### s11 · FORMATIONS `data-stage="hero-5"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2 sur 2 lignes]                                     │
│  [Lead "Stanford 2025 : adoption +138 %…"]                         │
│                                                                    │
│  ┌── 4 cards niveau ──────────────────────────────────────────────┐│
│  │ 🌱 39€    │ 🟢 67€    │ 🔵 147€   │ 🟣 397€                    ││
│  │ Éveil     │ Découverte│ Praticien │ Travailleur                ││
│  │ 1h        │ 2h        │ 5h        │ 12h                        ││
│  │ desc      │ desc      │ desc      │ desc                       ││
│  │ [démarrer]│ [démarrer]│ [démarrer]│ [démarrer]                 ││
│  └───────────┴───────────┴───────────┴────────────────────────────┘│
│       ↑ tip "💡 Beaucoup commencent par Découverte" sur card 2    │
│                                                                    │
│  ┌── Banner cross-sell ────────────────────────────────────────────│
│  │ "Une fois Praticien terminé, beaucoup passent au Pack Duo…"     │
│  │                                              [ Voir Pack Duo →] │
│  └─────────────────────────────────────────────────────────────────│
│                                                                    │
│              [ CTA "Choisir mon niveau" ]                          │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2 + lead          → [TEXTE: s11.eyebrow, s11.h2, s11.lead]
- 4 cards formation            → pour chacune (eveil, decouverte, praticien, travailleur) :
                                  [TEXTE: s11.{niveau}_titre, _duree, _description, _cta]
                                  prix fixes (39, 67, 147, 397)
- tip card 2                   → [TEXTE: s11.tip_decouverte]
- banner cross-sell            → [TEXTE: s11.cross_sell_pack_duo]
- CTA                          → [TEXTE: s11.cta_principal]

INTERACTIONS
- Card 2 : badge "Recommandé débutant" · shadow-glow subtil
- Hover card : translateY -3px

A11Y
- Cards <article>
- Tip : <aside> sous card 2
```

---

### s12 · MÉTHODE + TARIFS RÉCAP + FAQ `data-stage="hero-6"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2 sur 2 lignes]                                     │
│                                                                    │
│  ┌── Timeline 4 étapes horizontale (desktop) / verticale (mobile) ┐│
│  │  ●────────●────────●────────●                                   ││
│  │  01       02       03       04                                  ││
│  │  BRIEF   CADRAGE  LIVRAISON ACCOMPAGN.                          ││
│  │  desc    desc     desc     desc                                 ││
│  └─────────────────────────────────────────────────────────────────│
│                                                                    │
│  ┌── Bloc doctrine prix (2 lignes) ───────────────────────────────┐│
│  │ 🔧 Côté Lauralie : prix fixes affichés…                         ││
│  │ 🎬 Côté Micha : "à partir de" + devis…                         ││
│  └─────────────────────────────────────────────────────────────────│
│                                                                    │
│  ┌── Tableau funnel 4 paliers ───────────────────────────────────┐ │
│  │ Palier 1 — ENTRÉE                                             │ │
│  │   ligne par ligne (label · prix · "vs alternatif")            │ │
│  │ Palier 2 — PRODUCTIVITÉ                                       │ │
│  │ Palier 3 — PROJETS PONCTUELS (sous-divisé Lauralie/Micha)     │ │
│  │ Palier 4 — TRANSFORMATION                                     │ │
│  │ Note solidaire bas : -40 % asso/ESS/TPE<5                     │ │
│  │ Note rareté bas : "3 projets/mois max" + live counter         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌── FAQ accordéon · 5 questions ─────────────────────────────────┐│
│  │ ▸ Q1 / R1                                                      ││
│  │ ▸ Q2 / R2                                                      ││
│  │ ▸ Q3 / R3                                                      ││
│  │ ▸ Q4 / R4                                                      ││
│  │ ▸ Q5 / R5                                                      ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                    │
│              [ CTA "Diagnostic offert sous 24h" ]                  │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2                 → [TEXTE: s12.eyebrow, s12.h2]
- 4 étapes timeline            → [TEXTE: s12.etape_brief, s12.etape_cadrage, s12.etape_livraison, s12.etape_accomp]
- doctrine prix bloc           → [TEXTE: s12.doctrine_lauralie, s12.doctrine_micha]
- tableau funnel               → [TEXTE: s12.palier_1_lignes, s12.palier_2_lignes, s12.palier_3_lignes, s12.palier_4_lignes]
                                  + tags Lauralie/Micha sur chaque ligne
- note solidaire               → [TEXTE: s12.note_solidaire]
- note rareté + counter        → [TEXTE: s12.note_rarete] + JS live counter (placeholder hardcodé)
- 5 FAQ                        → [TEXTE: s12.faq_q1..5, s12.faq_r1..5]
- CTA                          → [TEXTE: s12.cta_diagnostic]

INTERACTIONS
- Timeline : ligne entre noeuds qui se trace au reveal
- Tableau funnel : reveal cascade par palier
- FAQ : <details> + chevron rotation 90deg
- CTA scroll to form s13

A11Y
- FAQ : <details>/<summary> natifs
- Tableau : <table> sémantique avec <caption> sr-only
- JSON-LD FAQPage généré depuis ces 5 questions/réponses
```

---

### s13 · ENGAGEMENTS + FORM ★ `data-stage="hero-6"` `id="form"`

```
LAYOUT desktop
┌────────────────────────────────────────────────────────────────────┐
│  [eyebrow] · [H2 sur 2 lignes]                                     │
│                                                                    │
│  ┌── 7 engagements grid 4+3 asymétrique ──────────────────────────┐│
│  │ Card 1 │ Card 2 │ Card 3 │ Card 4                               ││
│  │ Card 5 │ Card 6 │ Card 7                                        ││
│  │ Chaque card : icône 🟢 · titre · description courte             ││
│  └─────────────────────────────────────────────────────────────────│
│                                                                    │
│  ┌── Clause opposable bloc or-glow centré ────────────────────────┐│
│  │ "Si un engagement n'est pas tenu… on le dit, on rembourse."     ││
│  └─────────────────────────────────────────────────────────────────│
│                                                                    │
│  ─── FORMULAIRE 3 CHEMINS ────────────────────────────────────────  │
│                                                                    │
│  Step 1 · 3 cards visuelles (PAS radio buttons natifs)             │
│  ┌──────────┬──────────┬──────────┐                                │
│  │ 🔧 Tech  │ 🎬 Image │ ✨ Pack  │                                │
│  │ Lauralie │ Micha    │ Duo      │                                │
│  │ [○ select│ [○ select│ [● select│                                │
│  └──────────┴──────────┴──────────┘                                │
│                                                                    │
│  Step 2 · Champs essentiels (toujours visibles)                    │
│  [Prénom]      [Entreprise]                                        │
│  [Email]       [Téléphone (optionnel)]                             │
│                                                                    │
│  Step 3 · Champs conditionnels (apparition slide-down 300ms)       │
│  ── Si Tech ──   ── Si Image ──   ── Si Pack Duo ──               │
│  [URL site]      [Type projet]    [Périmètre cocher]               │
│  [Douleurs ☐]    [Date · Lieu]    [Échéance]                       │
│  [Délai ○]       [Univers visuel] [Budget ○]                       │
│                                                                    │
│  Step 4 · Solidaire + RGPD                                         │
│  ☐ Asso/ESS/TPE<5 (-40 %)                                          │
│  [Message libre textarea]                                          │
│  ☐ J'accepte d'être recontacté·e (RGPD)                           │
│                                                                    │
│  Step 5 · CTAs                                                     │
│  [ Envoyer mon brief — réponse écrite sous 24h ] (primary)         │
│  [ 📅 Prendre rendez-vous en ligne → ]            (secondary)      │
│                                                                    │
│  Microcopy reassurance (sous CTA)                                  │
│  Microcopy automation invisible (encart discret)                   │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- eyebrow + H2                 → [TEXTE: s13.eyebrow, s13.h2]
- 7 engagements                → [TEXTE: s13.eng_ia, s13.eng_eu, s13.eng_a11y, s13.eng_1mo, s13.eng_transp, s13.eng_inclu, s13.eng_2030]
                                  chacun titre + 1-2 lignes desc
- clause opposable             → [TEXTE: s13.clause_opposable]
- 3 cards chemin               → [TEXTE: s13.path_tech_titre, s13.path_tech_desc, idem image, idem pack_duo]
- champs essentiels labels     → [TEXTE: s13.field_prenom, _entreprise, _email, _tel + helper tel]
- conditionnels Tech           → [TEXTE: s13.tech_url, _douleurs (4 options), _delai (3 options)]
- conditionnels Image          → [TEXTE: s13.image_type (8 options), _date, _lieu, _univers]
- conditionnels Pack Duo       → [TEXTE: s13.pack_perimetre (6 cases), _echeance, _budget (3 options)]
- solidaire                    → [TEXTE: s13.solidaire_label]
- message libre                → [TEXTE: s13.message_label, _placeholder]
- RGPD                         → [TEXTE: s13.rgpd_label]
- CTAs                         → [TEXTE: s13.cta_primary, s13.cta_secondary]
- microcopy reassurance        → [TEXTE: s13.microcopy_reassurance]
- microcopy automation         → [TEXTE: s13.microcopy_automation]

INTERACTIONS
- Step 1 cards : click = active (or solid border + or-glow bg)
                 1 seul actif à la fois (radiogroup)
- Step 3 : slide-down 300ms ease-out à l'activation chemin · slide-up à désactivation
- Validation inline : debounce 400ms après blur · message error inline rouge
- Submit :
   1. Validation finale tous champs requis
   2. Si invalide → scroll to 1er erreur + focus
   3. Si valide → CTA loading state "Envoi…" + disable
   4. POST async vers endpoint (à câbler)
   5. Success → message banner vert "Brief reçu · réponse sous 24h" + reset
   6. Error réseau → banner rouge + retry button
- CTA secondaire RDV : open Calendly/cal.com en nouvelle fenêtre (URL à compléter)

A11Y
- Form : <form> avec aria-label
- Cards chemin : role="radiogroup" + chaque card role="radio" aria-checked
- Champs requis : aria-required="true"
- Erreurs : aria-invalid + aria-describedby pointant message
- Submit status : <div role="status" aria-live="polite"> pour success/error
- Touch targets ≥ 44px
- Tab order linéaire

VALIDATION RULES
- Prénom : required · min 2 chars
- Email : required · regex email basique
- Téléphone : optionnel · regex FR (06/07/+33)
- Message : optionnel · max 1000 chars
- RGPD : required · checked
```

---

### FOOTER

```
LAYOUT
┌────────────────────────────────────────────────────────────────────┐
│  Padding y sp-9 · centré                                           │
│  [Phrase signature Fraunces italique]                              │
│  [Métriques live CO₂]                                              │
│  [Liens légaux row]                                                │
│  [Microcopie M&P discrète]                                         │
│  [Copyright]                                                       │
└────────────────────────────────────────────────────────────────────┘

ÉLÉMENTS
- phrase signature             → [TEXTE: footer.signature]
- métriques live               → [TEXTE: footer.metrics_co2] (live JS via Website Carbon Calculator API ou estimation hardcodée)
- liens légaux                 → [TEXTE: footer.lien_mentions, footer.lien_cgv, footer.lien_confid, footer.lien_tva]
- microcopie M&P               → [TEXTE: footer.microcopie_mp]
- copyright                    → [TEXTE: footer.copyright]
```

---

## 🥚 8 · EASTER EGGS

```
🥚 1 · MODE DRAFT
   <body class="draft-mode" data-draft-count="N">
   N = nombre de placeholders visibles (calculé au load)
   Toggle clavier : Ctrl+Shift+D pour afficher/masquer les placeholders

🥚 2 · SCENE-COUNTER
   <div class="scene-counter" aria-hidden="true">01 / 14</div>
   position fixed top 24px right 24px
   IntersectionObserver met à jour selon section visible
   Caché en mode sober

🥚 3 · MORSE-STAY
   <button class="morse-stay" aria-label="Découvrir Mémoire & Présence">
     8 spans .morse-dot animés
   </button>
   position fixed bottom 24px left 24px
   Click → ouvre modale M&P
   Modale avec contenu [TEXTE: easter.modale_stay] + lien memoireetpresence.fr

🥚 4 · KONAMI CODE
   Listener keydown séquence ↑↑↓↓←→←→BA
   Reset après 2s d'inactivité
   Trigger : console.log ASCII art Pinapp + crédit
   [TEXTE: easter.konami_message]

🥚 5 · SPIDER-MAN WHISPER (s08)
   Voir s08 — c'est l'easter egg littéraire intégré
```

---

## 🧠 9 · STATE MANAGEMENT (vanilla JS)

```js
// État global minimal · pas de framework
const state = {
  isSober: false,           // toggle mode sober
  isDraftMode: true,        // affichage placeholders
  reducedMotion: false,     // détecté window.matchMedia
  currentScene: 1,          // 1..14 selon scroll
  formPath: null,           // 'tech' | 'image' | 'pack-duo' | null
  formData: {},             // valeurs form en cours
  modalOpen: null,          // 'mp' | 'drawer' | null
};

// Évents :
// - 'sober:toggle'          via header button + localStorage persist
// - 'scene:enter'           via IO sur sections
// - 'form:path-change'      sur click card chemin
// - 'modal:open' / 'close'  via tools morse/hamburger
// - 'reduced-motion:change' via matchMedia listener

// Persistance localStorage :
// - sober preference
// - form draft (auto-save 1× / 5s)
```

---

## 📦 10 · STRUCTURE FICHIER FINAL

```
voyage-v9/index.html (monolithique ~3000 lignes)

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>[TEXTE: meta.title]</title>
  <meta name="description" content="[TEXTE: meta.description]">

  <!-- OG -->
  <meta property="og:title" content="[TEXTE: meta.og_title]">
  <meta property="og:description" content="[TEXTE: meta.og_description]">
  <meta property="og:image" content="https://pinapp.fr/voyage-v9/assets/hero-1.webp">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Bunny Fonts uniquement -->
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=fraunces:400i,500,600i,700,900&family=inter:400,500,600,700&display=swap">

  <!-- Preload critical -->
  <link rel="preload" href="assets/hero-1.webp" as="image">

  <!-- JSON-LD LocalBusiness -->
  <script type="application/ld+json">{ ... à compléter ... }</script>
  <!-- JSON-LD FAQPage (généré depuis s12) -->
  <script type="application/ld+json">{ ... à compléter depuis s12 ... }</script>

  <!-- CSS inline (tokens + base + composants + scènes) -->
  <style>
    /* :root design tokens (cf section 1) */
    /* reset minimal */
    /* base typography */
    /* layout primitives (.container, .stack, .row) */
    /* composants (cf section 3) */
    /* motion utilities (cf section 4) */
    /* responsive (cf section 5) */
    /* a11y (cf section 6) */
    /* scènes (selectors par scène) */
    /* easter eggs (cf section 8) */
  </style>
</head>

<body class="draft-mode" data-draft-count="0">

  <a href="#main" class="skip-link">Aller au contenu</a>

  <nav class="nav">…</nav>

  <div class="stage" aria-hidden="true">
    <div class="stage__layer" data-hero="1"></div>
    …×6
  </div>

  <main id="main">
    <section id="s01" data-stage="hero-1" class="scene">…</section>
    <section id="s02" data-stage="hero-1" class="scene">…</section>
    <section id="s03" data-stage="hero-2" class="scene">…</section>
    <section id="s04" data-stage="hero-2" class="scene">…</section>
    <section id="s04b" data-stage="hero-2" class="scene scene--interstitial">…</section>
    <section id="s05" data-stage="hero-3" class="scene scene--anchor">…</section>
    <section id="s06" data-stage="hero-3" class="scene">…</section>
    <section id="s06b" data-stage="hero-3" class="scene scene--interstitial">…</section>
    <section id="s07" data-stage="hero-4" class="scene">…</section>
    <section id="s08" data-stage="hero-4" class="scene scene--anchor">…</section>
    <section id="s09" data-stage="hero-4" class="scene">…</section>
    <section id="s09b" data-stage="hero-5" class="scene scene--micropause">…</section>
    <section id="s10" data-stage="hero-5" class="scene">…</section>
    <section id="s11" data-stage="hero-5" class="scene">…</section>
    <section id="s12" data-stage="hero-6" class="scene">…</section>
    <section id="s13" data-stage="hero-6" class="scene scene--anchor">…</section>
  </main>

  <footer>…</footer>

  <!-- Easter eggs -->
  <div class="scene-counter" aria-hidden="true">01 / 14</div>
  <button class="morse-stay" aria-label="…">…</button>
  <dialog class="modal modal--mp">…</dialog>
  <div class="drawer drawer--about">…</div>

  <!-- JS inline -->
  <script>
    // 1. Stage manager (cross-fade hero layers via IO)
    // 2. Reveal cascade (data-reveal IO)
    // 3. Scene counter
    // 4. Sober toggle + localStorage
    // 5. Drawer/Modal open/close + focus trap
    // 6. Form 3 chemins (path switch + conditional fields + validation + submit)
    // 7. CountUp (stats)
    // 8. Slider Avant/Avec (s10)
    // 9. Vimeo lazy embed (poster click → iframe)
    // 10. Morse-stay → modal M&P
    // 11. Konami listener
    // 12. Text-split (s08 whisper)
    // 13. Reduced-motion respect partout
    // 14. localStorage form draft auto-save
  </script>

</body>
</html>
```

---

## ✅ 11 · CHECKLIST LIVRAISON

```
□ 14 sections complètes (s01..s13 + interstitiels)
□ Stage 6 layers cross-fade fonctionnel
□ Cross-fade Ken Burns respecte reduced-motion + sober
□ Tous les composants atomes/molécules/organismes implémentés
□ Form 3 chemins avec champs conditionnels JS
□ Validation inline + submit async (endpoint à câbler)
□ 5 easter eggs (mode draft, scene-counter, morse-stay→modal, konami, whisper)
□ FAQ accordéon natif <details>
□ Slider Avant/Avec interactif (s10)
□ Vidéos Vimeo : posters lazy → iframe au click
□ Skip-link "Aller au contenu"
□ Drawer "Qui sommes-nous" 4 actes
□ Modale M&P sur morse-stay
□ Toggle Mode sober persistant (localStorage)
□ Responsive mobile-first 4 breakpoints
□ Touch targets ≥ 44px
□ Focus visible partout
□ A11y WCAG 2.1 AA (ARIA, headings, contraste)
□ JSON-LD LocalBusiness + FAQPage
□ Bunny Fonts only (pas Google Fonts)
□ Vanilla JS only (pas GSAP/jQuery/Lenis)
□ 1 fichier HTML monolithique
□ Photos hero R1 intactes (assets/hero-1..6.webp)
□ Tous les [TEXTE: …] et [PLACEHOLDER: …] laissés EXPLICITES dans le HTML
   pour qu'on les remplisse après en lookup direct
```

---

## 🎬 INSTRUCTIONS POUR CLAUDE CODE

```
Tu reçois ce brief. Tu produis voyage-v9/index.html en suivant À LA LETTRE :
1. Tous les design tokens en :root
2. Tout le système de composants comme spec
3. Toutes les 14 scènes avec layout exact
4. Tous les états/interactions/motion
5. Tous les patterns a11y
6. Tous les easter eggs
7. Toute la structure JS modulaire (sections clairement séparées en commentaires)

Pour les textes : laisse [TEXTE: clé] et [PLACEHOLDER: description] tels quels dans le HTML.
On les remplira ensuite via un find-replace ciblé clé par clé.

Ne touche PAS à :
- assets/hero-1..6.webp (R1)
- IDs Vimeo des 4 vidéos
- doctrine prix (Lauralie fixe / Micha "à partir de")

Stack : vanilla JS · Bunny Fonts · 1 fichier HTML · ~3000 lignes attendues.
Commits propres section par section si possible.
```

---

*Brief V5 full UX · 2026-04-26 · prêt à coller dans Claude Code*
*On garde la base technique. On refait tout le UX.*
*Encarts à compléter : on remplit après par find-replace clé par clé.*
