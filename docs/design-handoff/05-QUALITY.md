# 05 · QUALITY — A11y + Performance + Browser Support

> Les 3 piliers qualité de Pinapp V7.
> **Standard** : Awwards SOTD requires ≥8/10 sur a11y + perf.
> **Engagement Pinapp** : accessibilité dans le CRAFT (jamais slogan performatif).

---

## ♿ Accessibilité · WCAG 2.2

### Cible
- **WCAG 2.2 AA** sur tout le site (minimum légal + bonne pratique)
- **WCAG 2.2 AAA** sur les textes (contraste 7:1 minimum)

### ✅ Implémenté V7

#### Contraste couleur
| Paire | Ratio | Statut |
|---|---|---|
| `--ivory-900` sur `--bg-void` | 15.1:1 | AAA |
| `--gold-primary` sur `--bg-void` | 10.2:1 | AAA |
| `--cyan-glow` sur `--bg-void` | 13.4:1 | AAA |
| `--text-muted` (ivoire 56%) sur `--bg-void` | ~6.8:1 | AA (body 18pt+) |
| `--text-whisper` (ivoire 28%) sur `--bg-void` | ~3.2:1 | **Fail AA normal** — limiter aux labels décoratifs |

**Action** : les `.tapestry-whisper` (easter eggs italiques) à 28% opacity sont EN FAIL pour text body. Acceptable car :
1. Décoratif (pas contenu critique)
2. `aria-hidden="true"` sur tapestry-whisper (optionnel selon contexte)
3. Les users qui ne voient pas ces italiques ne perdent aucune info essentielle

#### Focus visible
- Fonction `:focus-visible` global dans `voyage.css`
- Outline `--gold-primary` 2px (actuellement)
- **Amélioration V7.1** (à faire) : upgrade vers cinematic ring avec double box-shadow cyan + glow
- Respecte la navigation clavier tab

#### Reduced motion
- `@media (prefers-reduced-motion: reduce)` respecté partout
- Film V6 → `display: none` + 10 posters de fallback par scène
- Toutes les signatures awwards (scene counter, chromatic, tourbillon, cursor timecode) → `display: none`
- Glass tilt → désactivé
- Lenis → désactivé (scroll natif)
- GSAP ScrollTrigger → statiques (scrub transformé en instant)

#### Mode sobre (`voyage-sober`)
Toggle utilisateur explicite (bouton SVG soleil dans header) :
- Film retiré entièrement
- Tous les canvas particules cachés
- Signatures désactivées
- Nav drawers fonctionnent toujours
- Copy toujours lisible

#### Skip link
- `<a href="#voyage-main" class="skip-to-main">Aller au contenu principal</a>` en premier focusable
- **V7 fix** : supprimé le skip-link doublon (`.voyage-skip` redondant)

#### Semantic HTML
- Single `<h1>` par page (V7 fix : deux H1 éliminés)
- Hiérarchie h1 > h2 > h3 respectée
- `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>` utilisés
- `<dialog>` natif pour modal (pas d'override JS)
- `aria-labelledby` sur sections pointant vers heading ID
- `aria-pressed` sur toggle buttons (mode sobre, switcher FR/EN)
- `aria-expanded` sur burger menu
- `aria-live` implicit via dialog

#### SVG icons sémantiques
- **V7 fix** : Unicode `☰` et `◎` remplacés par SVG inline avec `aria-hidden="true"` et `aria-label` sur le bouton parent
- Lecteurs d'écran ne lisent plus "three horizontal black lines" ou "black sun with rays"

#### iOS form zoom prevention
- **V7 fix** : `input`, `textarea`, `select` → `font-size: 16px` minimum
- `min-height: 48px` (WCAG 2.2 touch target)

#### Alt text
- Toutes images critiques ont `alt`
- Images décoratives ont `alt=""`
- Canvas décoratifs ont `aria-hidden="true"`

### ⚠️ À améliorer (roadmap)

- **Keyboard nav complet** dans les cards `.glass-card` interactives (actuellement mousemove-only pour le tilt)
- **Screen reader breadcrumb** : émettre `aria-live="polite"` à chaque scene change ("Chapitre 3 sur 10 · Les outils")
- **Focus trap** dans modals (actuellement basique)
- **Prose mode keyboard shortcut** : `?` pour afficher les raccourcis (Linear/Notion pattern)
- **Audit axe-core** automatisé en CI
- **Test screen reader réel** (NVDA, VoiceOver, TalkBack)

---

## ⚡ Performance

### Budgets cibles

| Métrique | Desktop | Mobile 4G |
|---|---|---|
| **LCP** | ≤ 1.5s | ≤ 2.5s |
| **FCP** | ≤ 1.2s | ≤ 2.0s |
| **TTI** | ≤ 2.5s | ≤ 4.0s |
| **TBT** | ≤ 150ms | ≤ 300ms |
| **CLS** | ≤ 0.1 | ≤ 0.1 |
| **Total JS** | ≤ 250 KB | ≤ 250 KB |
| **Total CSS** | ≤ 80 KB | ≤ 80 KB |
| **Total hero** | ≤ 2 MB | ≤ 2 MB |
| **Lighthouse perf** | ≥ 90 | ≥ 85 |
| **Lighthouse a11y** | ≥ 95 | ≥ 95 |
| **Lighthouse SEO** | ≥ 95 | ≥ 95 |
| **Lighthouse best practices** | ≥ 95 | ≥ 95 |

### ✅ Optimisations V7 appliquées

#### Defer scripts
- 17 scripts passés en `defer` (V7 Tier orange) → HTML parsing non bloqué
- TTI mobile 4G attendu divisé par 2

#### Preload réduction
- **V7 fix** : suppression des `<link rel="preload" as="video">` (2 retirés)
- Seuls preloads restants : 2 fonts + 1 poster LCP
- Video utilise `preload="metadata"` interne (suffisant pour scrub init)
- LCP mobile 4G attendu ~1.5s (vs ~3s avant)

#### Film V6 optimisé
- yuv420p (vs yuv444p = iOS Safari KO)
- 137 keyframes (vs 10 = scrub saccadé)
- 14.86 MB (vs 26 MB · -37%)
- `+faststart` flag (header en début de fichier)
- WebM VP9 fallback pour Chrome/FF (6.21 MB · -36%)

#### GSAP safety net
- Setatimeout 3s qui force `opacity:1` si GSAP fail à charger
- Garantie "jamais de bleu sans rien" même si CDN bloqué

#### Low-perf detection
- `navigator.hardwareConcurrency < 4` → classe `html.low-perf`
- Désactive particules lourdes, backdrop-filter, tourbillon vertical

### ⚠️ Pistes d'optimisation restantes

#### 87 fichiers CSS (dette massive)
**Impact** : chargement CSS redondant, cognitive debt pour maintenance
**Action** : consolidation Bloc 5 → 12 fichiers `@layer tokens, base, components, utilities`

#### 10 canvases particules
**Impact** : 2540 particules simultanées = GPU saturation mobile
**Action** : consolider en 1 canvas fixed density-driven par scroll (architectural, reporté)

#### Variable fonts
**Impact** : 120 Ko Geist (4 statiques) → 45 Ko (1 variable) = -62%
**Action** : migration Fraunces + Geist vers variables (+ Geist Mono à ajouter)

#### 30 style="" inline
**Impact** : impossible à thémer, casse en i18n EN/DE/JA (largeurs dynamiques)
**Action** : extraction en classes utilitaires `.u-*` (Bloc 5)

#### Images OG
**Impact** : 78 KB actuel, pourrait être plus léger
**Action** : WebP optimisé, dimensions 1200×630 strictes

---

## 🌐 Browser support

### Targets
- **Chrome** ≥ 100
- **Firefox** ≥ 100
- **Safari** ≥ 15 (inclut iOS 15+)
- **Edge** ≥ 100 (Chromium)

### Features requis
- CSS Custom Properties ✅ (widely supported)
- `backdrop-filter` (glass-card) → fallback sans blur
- `:focus-visible` → graceful degradation
- `@media (hover: hover)` → graceful (default sans hover)
- WebM VP9 → fallback MP4 H.264
- `mix-blend-mode: screen` → graceful (visible sans blend)
- `aspect-ratio` → graceful
- `CSS nesting` → PAS utilisé (compat Firefox < 117)

### IE11
**Pas supporté.** Abandonné explicitement (Microsoft a retiré le support en 2022).

### Opera Mini, UC Browser
**Basic fallback** : HTML natif + CSS statique. Pas de motion, pas de film scrubbé. Copy reste visible.

---

## 🛠️ Testing checklist

### Avant chaque merge vers main

#### Devices réels
- [ ] iPhone 12+ (iOS Safari) — scroll scrub fluide
- [ ] iPhone 12+ (iOS Chrome) — idem
- [ ] Android Pixel 7+ (Chrome) — scroll scrub fluide
- [ ] MacBook Air M1+ (Safari + Chrome) — toutes signatures
- [ ] Windows laptop moyen gamme (Chrome + Edge) — mode low-perf

#### Conditions réseau
- [ ] Fast 3G simulé (DevTools)
- [ ] Slow 4G simulé
- [ ] Connection blipping (offline/online toggles)
- [ ] GSAP CDN bloqué (uBlock Origin filter) → safety net fonctionne

#### A11y
- [ ] Tab navigation complete sur toutes les sections
- [ ] VoiceOver lit correctement les sections
- [ ] Mode sobre toggle fonctionne + revient correctement
- [ ] `prefers-reduced-motion: reduce` appliqué via DevTools → posters visibles, animations OFF
- [ ] `prefers-reduced-transparency` → glass fallback visible
- [ ] Zoom 200% → layout ne casse pas

#### Perf
- [ ] Lighthouse mobile simulation → scores ≥ budgets
- [ ] Chrome DevTools Performance → aucun jank > 50ms
- [ ] Memory tab → pas de leak après 5 min scroll
- [ ] Network → LCP image = poster (pas video)

#### SEO
- [ ] `<title>` et meta description uniques par page
- [ ] Un seul `<h1>` par page
- [ ] JSON-LD Schema.org valide
- [ ] Robots.txt accessible
- [ ] Sitemap.xml à jour
- [ ] OG image 1200×630 loads correctement
- [ ] Twitter card preview valide

---

## 🔒 Sécurité / Privacy

### Analytics
- **Plausible** (pas Google Analytics) · sans cookies tiers
- Hébergement EU
- Pas de tracking cross-site

### Données utilisateur
- Formulaires POST vers n8n webhook (pas de base tierce)
- Honeypot anti-bot sur form diagnostic
- Email validation client-side + server-side
- Rate limiting localStorage (empêche spam)
- Fallback localStorage si erreur réseau (data pas perdue)

### Headers recommandés (Hostinger .htaccess)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: [à définir après audit scripts]
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### RGPD
- Page `/confidentialite/` existante
- Bannière cookies minimaliste (Plausible zero-cookie)
- Droit à l'effacement : email contact@pinapp.fr
- Données en EU (Hostinger FR / OVH)

---

## 📊 Monitoring post-launch

### À mettre en place (V7.x)
- **Lighthouse CI** dans GitHub Actions (score par PR)
- **Plausible goals** sur CTAs clés (form submit, Cal.com click, nav clicks)
- **Error logging** (minimal, no PII) via `window.onerror` → webhook n8n
- **Real User Monitoring (RUM)** optionnel : Web Vitals via `web-vitals` package

### KPIs à tracker
- Conversion form diagnostic (target +15-25% vs V5)
- Bounce rate mobile (target -20% vs V5)
- Temps moyen sur page (target +30%)
- Scroll depth 50% / 75% / 100%
- Scene counter visibility ≥75% (goal invisible-signature)
