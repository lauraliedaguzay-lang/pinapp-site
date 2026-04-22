# PINAPP V7 — DESIGN HANDOFF DOSSIER

> **Destinataire** : Claude Design / Designer externe reprenant le projet.
> **État du site** : V7 en cours de review sur PR #51 · branche `v60-recalibrate` · 21 commits.
> **Prod actuelle** : V5 stable sur `main`.
> **Repo** : https://github.com/lauraliedaguzay-lang/pinapp-site

---

## 🎯 Context en 30 secondes

**Pinapp** = studio digital boutique à Bordeaux (Lauralie Daguzay + Michaël Bouilhac).

**Positioning V7** : *"The operating system for the solo entrepreneur."* — catégorie vacante mondialement (Linear = product teams, Notion = knowledge workers, Figma = designers, **Pinapp = solo entrepreneurs**).

**ADN visuel** : cinéma d'auteur type Passengers / Aladdin 2019 / Villeneuve. Film scroll-scrubbé 62.83s qui défile en fond, UI overlay en ivoire neutre (règle "neutral-on-film").

**Règle AVATAR suprême** :
> *"Si le visiteur remarque un effet → trop fort. Si le site semble vivant sans qu'on sache pourquoi → réussi."*

Tout est jugé à l'aune de cette règle. Kubrick, pas Hollywood.

---

## 📁 Structure du dossier

| Fichier | Contenu |
|---|---|
| `README.md` | Ce fichier · index · décisions architecturales |
| `01-SYSTEM.md` | Design tokens complets (couleurs, typo, spacing, elevation, z-index) |
| `02-COMPONENTS.md` | Inventaire composants · states · variants · réutilisation |
| `03-MOTION.md` | Choreography GSAP/ScrollTrigger/Lenis · 4 signatures · 3 easter eggs |
| `04-SCENES.md` | Mapping film V6 ↔ sections HTML ↔ inspirations Aladdin |
| `05-QUALITY.md` | A11y WCAG 2.2 AA · perf budgets · browser support |
| `06-ASSETS.md` | Fonts · vidéos · posters · inventaire complet |
| `07-COPY.md` | Pointeur vers TEXT-MASTER-V7.md · règles éditoriales · voix |

---

## 🧭 Architecture de décisions (ADR — au plus haut niveau)

### ADR-001 · Dark-only défendu, pas de light mode public
**Décision** : pinapp.fr est dark-only (fond OLED `#04040e`, fallback `#050b14`).
**Pourquoi** : Vercel, Linear, Framer sont dark-only et c'est assumé. Un light mode sur un site cinéma dilue l'ADN. Light mode réservé aux dashboards internes (Auralis, admin).
**Exception** : `/admin/`, futur Auralis SaaS, clients dashboards → light obligatoire (fatigue 8h/jour).

### ADR-002 · Neutral-on-film UI policy
**Décision** : aucune couleur UI saturée sur la home. Film = star visuelle, UI = ivoire cassé + or rare + cyan biolumi signature.
**Pourquoi** : laisser le film respirer. Palette saturée fighterait les chromies cinéma du film (cockpit chaud / cosmos violet / spirale or / lune / sable).
**Implémentation** : voir `01-SYSTEM.md` section Tokens Neutrals.

### ADR-003 · Film V6 scroll-scrubbé comme colonne vertébrale
**Décision** : UNE SEULE vidéo concaténée (8 segments) scrubbée via scroll position → `currentTime`.
**Pourquoi** : pattern Apple iPhone 16 Pro. Supprime les discontinuités entre fonds par section, donne un plan-séquence continu type 1917.
**Tech** : `assets/js/pinapp-film-v6.js` · scrollProgress × filmDuration · lerp 0.12 · yuv420p iOS + 137 keyframes pour scrub fluide.

### ADR-004 · Règle AVATAR stricte sur les effets
**Décision** : aucune signature visuelle ne doit être "criarde". L'utilisateur doit sentir la vie du site sans pouvoir identifier pourquoi.
**Pourquoi** : différenciation vs Cosmos Studio / Exo Ape / Merci-Michel (craft show-off) → Pinapp adopte le craft invisible Kubrick. Moat conceptuel unique.
**Exceptions contrôlées** : 3 signatures awwards explicitement visibles (scene counter, chromatic aberration, cursor timecode) — chacune à < 60% opacity, mix-blend-mode screen, jamais au centre visuel.

### ADR-005 · Stack vanilla uniquement
**Décision** : zéro framework React/Vue/Svelte. Vanilla HTML/CSS/JS + GSAP 3.12 + ScrollTrigger + Lenis + Canvas 2D.
**Pourquoi** : perf (LCP target ≤1.5s desktop / 2.5s 4G mobile), maintenance, self-hosting, zéro build step obligatoire, chaque démo sectorielle peut être autonome (1 fichier HTML ≤ 200 Ko).
**Vendors locaux** : `/assets/vendor/gsap.min.js` · `/assets/vendor/ScrollTrigger.min.js` · `/assets/vendor/lenis.min.js`.

### ADR-006 · i18n path-based EN/FR (décision à valider)
**Décision en attente** : `/fr/` + `/en/` paths (type Stripe, Linear, Apple) — scaffold prêt dans `locales/*.json` + `assets/js/i18n.js`, mais PAS activé en paths. Actuellement switcher via `localStorage` + `navigator.language`.
**À valider** : Lauralie décide quand elle veut lancer EN officiellement. Scaffold n'a aucun coût s'il reste dormant.

### ADR-007 · 3 marques sous 1 toit
**Décision proposée (pas encore validée)** : à terme, séparer en :
- `pinapp.fr` (principal, FR, funnel TPE Bordeaux)
- `pinapp.com` (à acquérir, EN+FR, ambition mondiale)
- `pinapp-labs.com` ou équivalent (products : Auralis, M&P)
**Actuel** : tout sur pinapp.fr. Migration progressive si besoin.

---

## 🏆 Les 3 signatures awwards (trinité complète)

1. **Scene counter slot-machine** "01/08" top-right — slot-machine morph au scroll (`assets/js/scene-counter.js`)
2. **Film chromatic aberration** per scene — hue-rotate ±14° max (`assets/js/film-chromatic.js`)
3. **Cursor cinema timecode** "MM:SS / MM:SS" sous curseur — lit `window.__pinappFilm` (`assets/js/cursor-timecode.js`)

Détails complets dans `03-MOTION.md`.

---

## 🧞 Signature Aladdin (cinéma d'auteur)

- **Tourbillon vertical ascendant** sur s6 manifeste — 60 particules dorées qui montent, réplique "A Whole New World" (`assets/js/tourbillon-vertical.js`)
- **Sand reveal** sur s8 atterrissage — titre qui se forme de grains dorés (`assets/js/voyage-sand-reveal.js`, déjà existant)
- **Mapping Aladdin → V6** : voir `04-SCENES.md`

---

## 🥚 3 Easter Eggs tissés (zéro attribution sur page)

1. **Spider-Man inversé** sur s3 Métiers : *"Un grand pouvoir n'implique pas forcément de grosses responsabilités."* (italique `.tapestry-whisper` 42% opacity)
2. **Morse STAY** sur s4 M&P : 4 dots/dashes bottom-left qui tapent S-T-A-Y en morse (`.morse-stay`)
3. **JARVIS** : card IA s3 caption *"À votre service."* + banner console F12 DevTools

Détails techniques dans `03-MOTION.md` section Tapestry.

---

## ⚙️ Infrastructure technique

- **Repo** : pinapp-site · branche travail `v60-recalibrate` · 124 pages HTML · 87 CSS · 92 JS (dette V3-V5 à consolider en Bloc 5)
- **Hébergement** : Hostinger (auto-sync push main via GitHub Actions)
- **Analytics** : Plausible (sans cookies tiers)
- **Fonts** : Fraunces italic + Geist (self-hosted woff2)
- **Vidéo** : ffmpeg pipeline (mp4 yuv420p + webm VP9) · scripts dans `tools/build-pinapp-film-v6.ps1`

---

## 🔗 Liens utiles

- **PR V7 review** : https://github.com/lauraliedaguzay-lang/pinapp-site/pull/51
- **TEXT-MASTER-V7** (source copy unique) : `docs/TEXT-MASTER-V7.md`
- **HANDOVER session** : `docs/HANDOVER-2026-04-21-NIGHT.md`
- **Storyboard V6** : `docs/STORYBOARD-MAPPING-V6.md`
- **Doctrine pinapp.fr vs sites clients** : `CLAUDE.md` (racine)
- **Cursor rules** : `.cursor/rules/pinapp-ultime-v3.mdc` (textes protégés)

---

## 🎨 Pour Claude Design · point d'entrée recommandé

1. Lire ce README + `01-SYSTEM.md` (30 min)
2. Ouvrir `docs/TEXT-MASTER-V7.md` (source unique copy · 621 lignes)
3. Ouvrir `assets/css/tokens-voyage.css` (système vivant)
4. Explorer `03-MOTION.md` pour comprendre les signatures
5. Consulter `04-SCENES.md` pour le mapping film↔sections↔inspiration
6. Si besoin d'un overview visuel : ouvrir `index.html` sur `v60-recalibrate` en local et scroller lentement

---

*Dossier généré 2026-04-21 par Claude Code (session autonome V7). Source unique de vérité : le code. Ces docs sont une cartographie pour navigation rapide.*
