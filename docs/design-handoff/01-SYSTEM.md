# 01 · DESIGN SYSTEM — TOKENS

> Source unique runtime : `assets/css/tokens-voyage.css` (463 lignes + ajouts V7)
> Règle : toute modification passe par ce fichier, jamais par override local.

---

## 🎨 Palette

### Dark background (seul mode supporté en public)

| Token | Valeur | Usage |
|---|---|---|
| `--bg-oled` | `#04040e` | Fallback absolu (mode sobre, pas de film) · dossier ultime référence |
| `--bg-void` | `#050b14` | Deep void (V6 par défaut) |
| `--bg-deep` | `#0a1425` | Surface élevée niveau 1 |
| `--bg-elevated` | `#0f1a2e` | Surface élevée niveau 2 (cards non-glass) |
| `--bg-glass` | `rgba(10, 20, 37, 0.35)` | Surface glass transparente |
| `--bg-glass-strong` | `rgba(10, 20, 37, 0.55)` | Glass hover/active state |

### Tri-chrome signature (or · cyan · ivoire)

| Token | Valeur | Usage |
|---|---|---|
| `--gold-primary` | `#e6b973` | **Accent unique UI** · CTA primaire SEUL · max 1-2 par écran |
| `--gold-light` | `#ffd99f` | Hover gold |
| `--gold-deep` | `#b89968` | Pressed gold |
| `--cyan-glow` | `#3ef5e0` | **Signature biolumi** · focus, scene-active, holo-circle, ::selection |
| `--cyan-bright` | `#62ffe8` | Cyan hover |
| `--ivory-text` | `#f4e4c1` | Texte principal (= `--ivory-900`) |
| `--ivory-muted` | `rgba(244, 228, 193, 0.7)` | Ancien (V6) — remplacé par `--text-secondary` |

### Neutrals graduels ivoire (V7 neutral-on-film)

| Token | Opacity | Usage |
|---|---|---|
| `--ivory-50` | 4% | Dividers ultra-légers |
| `--ivory-100` | 8% | Borders hairline |
| `--ivory-200` | 16% | Borders hover |
| `--ivory-300` | 28% | Captions (tapestry whispers, scene-counter sep) |
| `--ivory-400` | 42% | Metadata discrets (tapestry-whisper default) |
| `--ivory-500` | 56% | Text muted (labels, eyebrows) |
| `--ivory-600` | 72% | Text secondary (body) |
| `--ivory-700` | 84% | Text quasi-primary |
| `--ivory-800` | 94% | Text primary (quasi-full) |
| `--ivory-900` | 100% | Titres, H1, CTA labels |

### Textes sémantiques (V7)

| Token | Résolution | Usage |
|---|---|---|
| `--text-primary` | `--ivory-900` | H1, CTA labels |
| `--text-secondary` | `--ivory-700` | Body paragraphes |
| `--text-muted` | `--ivory-500` | Labels, eyebrows, metadata |
| `--text-whisper` | `--ivory-300` | Captions discrètes, tapestry italics |

### Semantic states

| État | BG | Border | FG |
|---|---|---|---|
| Success | `rgba(62, 245, 224, 0.08)` | `rgba(62, 245, 224, 0.35)` | `var(--cyan-glow)` |
| Warning | `rgba(230, 185, 115, 0.1)` | `rgba(230, 185, 115, 0.4)` | `var(--gold-primary)` |
| Error | `rgba(220, 92, 75, 0.12)` | `rgba(220, 92, 75, 0.45)` | `#ff8366` |
| Info | `rgba(120, 180, 255, 0.08)` | `rgba(120, 180, 255, 0.3)` | `#7fb4ff` |

### Beauty palette (démos Tier M ongles / cils)

| Token | Valeur | Usage |
|---|---|---|
| `--beauty-nude` | `#e8d4c5` | Fond chaud |
| `--beauty-rose` | `#d4899d` | Accent doux |
| `--beauty-bordeaux` | `#5a1a2b` | Accent profond |
| `--beauty-gold` | `#c9a875` | Accent métal |
| `--beauty-ivory` | `#f4ede1` | Texte principal |
| `--beauty-velvet` | `#2a1218` | Fond noir velours |

### Verticales produit (accents contextuels)

| Vertical | Token | Valeur |
|---|---|---|
| Auralis RH | `--vertical-auralis` | `#b8a4ff` (violet doux) |
| Mémoire & Présence | `--vertical-mp` | `var(--gold-primary)` (or core) |
| Formation | `--vertical-formation` | `var(--cyan-glow)` |

### Film overlay (lisibilité textes sur vidéo)

| Token | Valeur |
|---|---|
| `--film-overlay-top` | `rgba(10, 20, 37, 0.25)` |
| `--film-overlay-mid` | `rgba(10, 20, 37, 0.45)` |
| `--film-overlay-bottom` | `rgba(10, 20, 37, 0.65)` |

Gradient vertical progressif pour assurer readability sans tuer le film.

---

## ✏️ Typographie

### Familles

| Rôle | Famille | Hébergement |
|---|---|---|
| Display (italique cinéma) | **Fraunces** (SIL OFL) | Self-hosted `/assets/fonts/fraunces-italic-*.woff2` |
| Body (sans neutre moderne) | **Geist** (Vercel · OFL) | Self-hosted `/assets/fonts/geist-sans-{400,500,600,700}.woff2` |
| Mono (timecodes, code) | **Geist Mono** OU fallback `'JetBrains Mono'`, `ui-monospace`, `Menlo` | À ajouter (pas encore self-hosted) |

### Token `--font-*`

```css
--font-body: 'Geist', system-ui, sans-serif;
--font-accent: 'Fraunces', Georgia, serif;
```

### Type scale (proposé · non encore formalisé en variables)

```
display-2xl   clamp(4.5rem,  10vw, 7.5rem)   / 0.95 / -0.04em  Fraunces italic
display-xl    clamp(3.5rem,  8vw,  5.5rem)   / 1.00 / -0.035em Fraunces italic
display-lg    clamp(2.75rem, 6vw,  4.5rem)   / 1.05 / -0.03em  Fraunces italic
h1            clamp(2rem,    5vw,  3.5rem)   / 1.1  / -0.03em  Geist 700
h2            clamp(1.5rem,  3.5vw,2.25rem)  / 1.2  / -0.02em  Geist 600
h3            clamp(1.25rem, 2.5vw,1.75rem)  / 1.3  / -0.015em Geist 600
h4            1.25rem                         / 1.4  / -0.01em  Geist 600
h5            1.125rem                        / 1.5  / 0        Geist 600
body-lg       1.125rem                        / 1.65 / 0        Geist 400
body          1rem                            / 1.6  / 0        Geist 400
body-sm       0.875rem                        / 1.5  / 0        Geist 400
caption       0.8125rem                       / 1.4  / 0.01em   Geist 500
label         0.75rem                         / 1.3  / 0.15em   Geist 500 UPPERCASE
micro         0.6875rem                       / 1.3  / 0.2em    Geist 500 UPPERCASE
code          0.875rem                        / 1.6  / 0        Geist Mono 500
```

**À faire** : formaliser en `--type-*` tokens CSS (Bloc 4 post-review).

### Variable fonts (à migrer)

- Actuellement 4 fichiers statiques Geist (400/500/600/700) · ~120 Ko total
- Migration vers `Geist-Variable.woff2` (1 fichier, ~45 Ko = -62%)
- Fraunces italic variable existe (axe SOFT/WONK/opsz/wght)
- Gain attendu : 165 Ko total (vs 220 Ko actuel) · axes `font-variation-settings` tokenisables

### Optical sizing (Fraunces uniquement)

Une fois Fraunces Variable intégrée, activer `font-variation-settings: 'opsz' auto` sur `.h-hero`, `.ouverture-title`, `.h-1` → rendu différencié des titres XXL vs body italic.

---

## 📏 Spacing

### Échelle puissance de 2

```
--s-1    0.25rem     (4px)
--s-2    0.5rem      (8px)
--s-3    0.75rem     (12px)
--s-4    1rem        (16px)
--s-6    1.5rem      (24px)
--s-8    2rem        (32px)
--s-10   2.5rem      (40px)
--s-12   3rem        (48px)
--s-16   4rem        (64px)
--s-20   5rem        (80px)
--s-24   6rem        (96px)
--s-32   8rem        (128px)
```

### Cinema spacing (fluide clamp)

```
--space-cinema-xs     0.75rem
--space-cinema-sm     1.5rem
--space-cinema-md     clamp(3rem, 6vw, 5rem)
--space-cinema-lg     clamp(6rem, 12vw, 10rem)
--space-cinema-xl     clamp(10rem, 20vw, 16rem)
```

**À clarifier** : règle `--s-*` vs `--space-cinema-*` (mélange actuellement). Proposition : `--s-*` pour layout interne composant, `--space-cinema-*` pour espacement entre sections/chapitres.

---

## 🎛️ Elevation

```
--elevation-0              none
--elevation-1              0 1px 2px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)
--elevation-2              0 4px 12px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.12)
--elevation-3              0 12px 32px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15)
--elevation-glow-cyan      0 0 24px rgba(62,245,224,0.25)
--elevation-glow-gold      0 0 24px rgba(230,185,115,0.3)
```

### Usage

- `.glass-card` : `--elevation-2` + glow-cyan au hover
- `.btn-primary` : `--elevation-1` default, `--elevation-glow-gold` hover
- Modals, popovers : `--elevation-3`

---

## 🎚️ z-index stack

```
--z-film            0      #pinapp-film
--z-film-overlay    1      .pinapp-film-overlay
--z-content         2      main content, sections
--z-chrome          100    nav, header sticky, CTAs fixed
--z-tapestry        10     morse STAY, scene counter, cursor timecode
--z-modal           1000   dialogs
--z-tooltip         2000   popovers
--z-cursor          100000 custom cursor + trail
```

Respecter strictement cet ordre. Aucun z-index hardcodé en dehors de ces tokens.

---

## 🌐 ::selection + scrollbar (polish awwards)

### ::selection

```css
::selection {
  background: rgba(62, 245, 224, 0.35);
  color: var(--ivory-900);
  text-shadow: 0 0 12px rgba(62, 245, 224, 0.4);
}
```

### Scrollbar (contextes hors Lenis)

```css
* { scrollbar-width: thin; scrollbar-color: var(--ivory-300) transparent; }
*::-webkit-scrollbar { width: 6px; height: 6px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--gold-primary), var(--cyan-glow));
  border-radius: 999px;
}
```

Lenis hijack le scroll principal, cette règle s'applique aux modals/drawers/overflows natifs.

---

## 📱 Breakpoints

```
Mobile          < 768px       (default)
Tablet          768 - 1023px  (@media min-width: 768)
Desktop         ≥ 1024px      (@media min-width: 1024)
Large desktop   ≥ 1440px      (@media min-width: 1440)
```

Mobile-first strict. `hover:hover` query pour désactiver effets desktop-only (custom cursor, tilts, etc.).

---

## 🎨 Classes utilitaires signature

### `.tapestry-whisper`

Phrases italiques discrètes pour easter eggs et citations cinéma :

```css
.tapestry-whisper {
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 0.75rem;
  color: var(--text-whisper);  /* ivoire 28% */
  letter-spacing: 0.01em;
  margin-top: var(--s-4);
  display: block;
}
```

### `.glass-card` (existant)

Définie dans `assets/css/glass-card.css` · glass Apple natif :
- `backdrop-filter: blur(20px) saturate(1.4)`
- Fallback sans backdrop-filter
- Hover states + `prefers-reduced-transparency`
- Respect sober mode

### `.btn-primary`, `.btn-secondary`, `.btn-tertiary`

Dans `assets/css/voyage.css`. **À formaliser** avec states complets (hover, active, disabled, loading) — manquant actuellement.

---

## ♻️ Règle critique : AVOID hardcoded values

**Proscrit** :
- `color: #f4e4c1` → utiliser `var(--text-primary)`
- `background: rgba(62, 245, 224, 0.3)` → utiliser `rgba(62, 245, 224, 0.35)` via `var(--state-success-bg)`
- `box-shadow: 0 2px 8px rgba(0,0,0,0.3)` → utiliser `var(--elevation-2)`

Tout override doit d'abord être tokenisé (ajouter variable dans `tokens-voyage.css` puis l'utiliser).

---

## 🔧 Fichiers CSS — inventaire critique

87 fichiers CSS existent dans `/assets/css/`. Liste prioritaire :

| Fichier | Statut | Rôle |
|---|---|---|
| `tokens-voyage.css` | ✅ SOURCE VÉRITÉ | Tokens + base |
| `voyage.css` | 🟡 REFACTOR (2513 L) | Layout + legacy · à splitter |
| `pinapp-film-v6.css` | ✅ KEEP | Film fixed + overlay + chromatic aberration |
| `glass-card.css` | ✅ KEEP | Composant premium |
| `custom-cursor.css` | ✅ KEEP | Cursor ring + label |
| `ouverture-v50.css` | ✅ KEEP | s0 ouverture |
| `metiers-grid.css`, `pilotes-grid.css`, `constellation-drift.css`, `manifeste-wow.css`, `oeuvre-tourbillon.css` | ✅ KEEP | Composants sections |
| `pinapp-master-v3.css`, `pinapp-master-v4.css`, `cosmos-*.css`, `biolume-*.css`, etc. | 🔴 ARCHIVE | Dette V3-V5 à consolider en Bloc 5 |

**À faire** : consolidation CSS 87→12 fichiers avec `@layer tokens, base, components, utilities` (session dédiée post-V7 launch).

---

## 🎯 Next steps design system

1. Formaliser type scale en tokens `--type-*`
2. Migrer vers Variable fonts (Geist + Fraunces)
3. Clarifier règle `--s-*` vs `--space-cinema-*`
4. Consolider 87 CSS → 12 fichiers `@layer`
5. Créer une page `/design-system/` publique (Storybook-light) pour documenter vivant
