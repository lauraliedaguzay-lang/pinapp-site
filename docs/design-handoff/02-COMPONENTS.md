# 02 · COMPONENTS — Inventaire + spécifications

> Composants actuellement déployés sur `v60-recalibrate` (V7).
> Source CSS : `assets/css/*.css` · JS : `assets/js/*.js`

---

## 📦 Composants existants (V7)

### 🎬 Core cinema

#### `#pinapp-film` — Film scroll-scrubbé
- **Position** : `fixed; top:0; left:0; width:100%; height:100vh`
- **z-index** : `0` (derrière tout)
- **Attributs HTML** : `muted playsinline preload="metadata" disablepictureinpicture aria-hidden="true"`
- **Sources** : `.webm` (VP9 yuv420p) + `.mp4` (h264 yuv420p)
- **Control JS** : `assets/js/pinapp-film-v6.js` · scroll position → `currentTime` avec lerp 0.12
- **API exposée** : `window.__pinappFilm` (`getCurrentTime`, `getDuration`, `getScrollProgress`)
- **Filter** : `saturate(1.04) hue-rotate(var(--film-hue-shift, 0deg))` — piloté par `film-chromatic.js`
- **Fallback reduced-motion** : `display:none` → 10 posters CSS `.voyage-scene--*` (1 par scène)

#### `.pinapp-film-overlay` — Gradient lisibilité
- Gradient vertical 25% top → 70% bottom (tokens `--film-overlay-*`)
- z-index 1
- `pointer-events: none`

---

### 🧭 Navigation

#### `.voyage-site-header` — Header sticky
- Brand "Pinapp" (gauche)
- Nav 4 items (Univers, Auralis, M&P, Nous écrire) · desktop ≥ 900px
- Actions (droite) : switcher FR/EN + hamburger + mode sobre
- Backdrop-filter blur

#### `.lang-switcher` — Switcher FR/EN (V7 nouveau)
- Pill compact Geist Mono 0.6875rem
- 2 buttons "FR" / "EN" avec séparateur `·`
- Active state : gold-primary
- Inactive : ivory-500 (hover ivory-800)
- Wiring : `window.pinappI18n.setLang(lang)` (voir `03-MOTION.md`)

#### `#voyage-nav` — Drawer burger menu
- Hidden par défaut (`hidden` attribute)
- Slide-in depuis droite (transform translateX)
- 11 liens internes (s0 à s8 + pages externes)
- Close button top-right

#### `#voyage-nav-open` · `#voyage-sober-btn` — Icon buttons
- SVG inline 20×20, stroke 1.5, currentColor
- Hamburger : 3 lignes horizontales
- Sober : soleil avec 8 rayons (circle + 8 paths)
- Fix V7 : Unicode `☰` et `◎` remplacés par SVG sémantiques (commit `5fff944`)

---

### 🔲 Sections & chapitres

Chaque `<section id="s{N}" class="voyage-scene voyage-scene--{name} lightshaft">` :

- `data-scene`, `data-chapter`, `data-film-start`, `data-film-end`, `data-video` (legacy V5)
- `aria-labelledby` pointing to heading ID
- Enfants : `<canvas class="particles-canvas">` + `.voyage-scene__veil` + `.chapter__content`
- Layout : `min-height: 100vh` · flex center (pour s0) ou stack vertical

#### `.voyage-scene__veil` — Voile semi-transparent par section
- Gradient vertical sombre (tokens-voyage `.voyage-scene__veil`)
- z-index 2 (entre film et content)
- `opacity: 0.88` par défaut

---

### 💳 Cards

#### `.glass-card` — Card premium Apple
- Backdrop-filter blur(20px) + saturate(1.4)
- Border 1px ivory-100
- Rounded 1.25rem
- Elevation niveau 2 + glow cyan au hover
- Fallback `prefers-reduced-transparency` : solid bg
- Hover : léger scale 1.01 + elevation augmentée
- **V7 ajout** : 3D tilt ±3° au mousemove (`glass-tilt.js`)

#### `.voyage-card` — Alias glass-card
- Variante sans backdrop-filter (plus performant si multiple onscreen)

#### `.metier` · `.pilote-card` · `.constel__node` — Cards thématiques
- Extends `.glass-card` avec tokens spécifiques section

---

### 🔘 Buttons

#### `.btn-primary` — CTA principal
- Background `--gold-primary`
- Color `--black-night` (voir `--v26-cta-primary-text`)
- Border-radius 999px (pill)
- Padding 0.75rem 1.5rem
- Font-weight 600
- Transition 240ms
- Hover : `--gold-light` + elevation glow-gold + scale 1.02
- **Manquant** : disabled state, loading state, active state explicite

#### `.btn-secondary`
- Background transparent
- Border 1px `--ivory-300`
- Color `--ivory-800`
- Hover : border `--cyan-glow`, color `--cyan-glow`

#### `.btn-tertiary`
- Link-style sans fond ni border
- Color `--ivory-600`
- Hover : color `--ivory-900` + underline offset

**Règle** : 1 seul `.btn-primary` visible par écran (pas 2 simultanés). C'est une règle stricte de `pinapp-ultime-v3.mdc`.

---

### 📝 Forms

#### `<input>`, `<textarea>`, `<select>` — Tokens V7
- `font-size: 16px` minimum (anti iOS zoom)
- `min-height: 48px` (WCAG 2.2 touch target)
- Padding `var(--s-3) var(--s-4)`
- Border-bottom 1px ivory-300, animated to cyan on focus
- Focus-visible : outline cyan 2px + offset 4px + box-shadow glow

#### Form states (à implémenter complètement)
- Idle : "Envoyer →"
- Loading : "Envoi en cours…" + spinner + disabled
- Success : "✓ Reçu — réponse sous 24h" + form fade out
- Error : "Oups. Réessayez ou écrivez à contact@pinapp.fr" + shake 240ms

**Actuel** : seul le idle + label feedback `#form-diagnostic-feedback` (basique). À finaliser.

---

### 🎯 CTAs

#### `#holo-presentation-trigger` — Bouton bande-annonce
- Custom class `.holo-circle` (pulse CSS infini)
- Déclenche modal `#presentation-modal` (slideshow 9 scènes)
- **À faire** : implémenter vraie vidéo 46s (actuellement TODO P7)

---

### 🔔 Modals & dialogs

#### `#presentation-modal` — Modal bande-annonce
- Slideshow scene-based (pas `<video>` encore)
- Close button + backdrop
- Focus trap

#### `#voyage-vimeo-dialog` — Lightbox Vimeo
- `<dialog>` natif
- Iframe Vimeo player
- Contrôle via `voyage-vimeo-lightbox.js`

---

### 📊 Data viz

#### `#automation-demo` — Workflow n8n
- SVG inline avec 6 nodes (Lead → IA → CRM → Slack → PDF → Cal.com)
- Animation de démo via `automation-demo.js` (374 lignes, asset précieux)
- Particles golden circulant le long des edges

#### `.voyage-stat__bar` — Barres stats
- `data-stat-fill` attribute pour animation
- Actuellement : IntersectionObserver binaire (initStats dans voyage.js)
- **À faire (Bloc 1 restant)** : passer en ScrollTrigger scrub pour sync fin avec scroll

---

### ⭐ Signatures V7 (voir `03-MOTION.md` détails)

| Composant | Fichier | Classe/ID |
|---|---|---|
| Scene counter | `scene-counter.js` | `.scene-counter` |
| Morse STAY | `easter-eggs.js` | `.morse-stay` |
| Cursor timecode | `cursor-timecode.js` | `#cursor-timecode` |
| Tourbillon vertical | `tourbillon-vertical.js` | `#tourbillon-vertical` |
| Film chromatic | `film-chromatic.js` | filter sur `#pinapp-film` |
| Glass tilt | `glass-tilt.js` | transform sur `.glass-card` |

---

## 🧱 Composants manquants (roadmap design system)

Pour atteindre niveau top 1% design system agency :

### P0 (ship V7.1)
- **Button complet** (5 variants × 5 states × 4 sizes = 100 combos) — doc + tests
- **Input, Select, Checkbox, Radio, Toggle, Textarea** — système complet avec states
- **Modal générique** (pas snowflake presentation-modal)
- **Tooltip** (rich + basic)
- **Toast / Notification** (success/warning/error/info)
- **Loading spinner** (sm/md/lg, inline, overlay, page)
- **Form field group** (label + input + helper + error + counter)

### P1
- **Badge, Tag, Chip** (statut, filtres)
- **Avatar** (initiales LD/MB + grouped)
- **Breadcrumb**
- **Pagination**
- **Progress** (bar determinate/indeterminate, ring, steps)
- **Skeleton** (loading placeholders)
- **Empty state** (no data, no results, coming soon)

### P2 (nice-to-have)
- **Command palette `cmd+K`** — signature tech premium (Linear, Stripe, Vercel)
- **Segmented control**
- **Data table** (tri, filtre, pagination)
- **Timeline** (roadmap publique)
- **Stepper / Wizard** (onboarding diagnostic)
- **Video player custom** (remplacer iframe Vimeo)

---

## 🔗 Dépendances inter-composants

```
Film V6 (pinapp-film-v6.js)
  └─ expose window.__pinappFilm
     ├─ cursor-timecode.js (lit getCurrentTime, getDuration)
     ├─ film-chromatic.js (écoute voyage:scene-active, pas direct film)
     └─ scene-counter.js (écoute voyage:scene-active)

voyage.js (initSceneRevealsGsap)
  └─ émet voyage:scene-active
     ├─ film-chromatic.js
     ├─ scene-counter.js
     └─ easter-eggs.js (data-active-section)

easter-eggs.js (observer IntersectionObserver)
  └─ pose data-active-section sur <html>
     ├─ morse-stay CSS (afficher quand s4)
     └─ scene-counter.js (fallback MutationObserver)

glass-tilt.js
  └─ attache mousemove/mouseleave sur .glass-card (indépendant)

tourbillon-vertical.js
  └─ IntersectionObserver sur #s6 (indépendant)

i18n.js
  └─ fetch /locales/{lang}.json + apply sur [data-i18n]
     └─ wired par inline script dans index.html
```

---

## ⚠️ Composants à nettoyer (dette V5)

- `voyage-transitions.js` (489 lignes) : 70% dead code en V6 (gère pairs `<video>` par scène, obsolète). Garder `emitBreath` + bridge colors, supprimer le reste.
- `voyage-lazy-videos.js` : déjà supprimé V6 ✅
- `voyage-bg-video.js` : déjà supprimé V6 ✅
- `voyage-planete-realisations.js` : usage partiel · à auditer
- `voyage-s4-s6-cinema.js` : garder (constellation + manifeste logic)

---

## 🧪 Tests composants

**Actuel** : aucun test automatisé. Verification manuelle en local.

**À ajouter (roadmap)** :
- Playwright e2e pour scroll-scrub + signatures critiques
- Lighthouse CI pour perf budget
- axe-core pour a11y scan
- Visual regression testing (Percy ou Chromatic) sur les 10 sections

---

## 📍 Naming conventions

- Classes CSS : kebab-case avec préfixe thématique (`.voyage-*`, `.pinapp-*`, `.glass-*`)
- IDs : kebab-case, rarement utilisés (préférer classes)
- Custom properties : `--{category}-{name}-{variant}` (ex `--ivory-900`, `--gold-primary`)
- Data attributes : kebab-case (`data-scene`, `data-film-start`, `data-i18n`)
- Events customs : namespaced (`voyage:scene-active`, `pinapp:*`)

**Dette actuelle** : co-existence `v24-*`, `v26-*`, `v50-*`, `pinapp-*`, `voyage-*` = 5 préfixes de version. À consolider en Bloc 5.
