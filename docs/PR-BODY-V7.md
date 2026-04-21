# PR BODY — À COPIER DANS GITHUB

> **Lien pour créer la PR** : https://github.com/lauraliedaguzay-lang/pinapp-site/pull/new/v60-recalibrate
>
> **Titre suggéré** : `V7 · The operating system for the solo entrepreneur (draft review)`
>
> **Mode** : Draft (pour review sans merge possible par erreur)
>
> **Base** : `main` · **Compare** : `v60-recalibrate`
>
> **Copier-coller le contenu ci-dessous dans le champ body de la PR** :

---

## Vue d'ensemble

17 commits atomiques qui transforment pinapp.fr en version **V7 "The operating system for the solo entrepreneur"** · cinéma scroll-scrubbé · 3 signatures awwards · 3 easter eggs tissés · i18n bilingue · textes protégés canoniques.

**Status : DRAFT** — review attendue avant merge. Prod `main` = V5 stable (intacte).

---

## 🎬 Les 3 signatures awwards (trinité complète)

| # | Signature | Impact |
|---|---|---|
| 1 | **Scene counter slot-machine** "01/08" fixed top-right | Navigation vivante pendant l'immersion |
| 2 | **Film chromatic aberration** per scene (±14° hue-rotate) | Transitions scène imperceptibles mais vivantes |
| 3 | **Cursor cinema timecode** "MM:SS / MM:SS" sous le curseur | Signe que l'user est DANS un film |

## 🧞 Signature Aladdin

- **Tourbillon vertical ascendant** sur s6 manifeste — 60 particules dorées qui montent du bas, réplique "A Whole New World"
- **Sand reveal** déjà actif sur s8 Atterrissage (réutilise `voyage-sand-reveal.js` existant)

## 🥚 3 easter eggs tissés (zéro attribution sur page)

- **Spider-Man inversé** (s3 Métiers) : *"Un grand pouvoir n'implique pas forcément de grosses responsabilités."*
- **Morse STAY** (s4 M&P bottom-left) : 4 dots/dashes cyan qui tapent "STAY"
- **JARVIS** (s3 IA card "À votre service." + banner console F12 DevTools)

## 🎨 Système V7 neutral-on-film

Tokens ivory 10 niveaux + semantic states + beauty palette + tapestry-whisper + ::selection biolumi + scrollbar gold→cyan. Film reste la star visuelle, UI s'efface.

## 🌍 i18n FR/EN

- `locales/fr.json` + `locales/en.json` (169 clés)
- `assets/js/i18n.js` reader vanilla avec détection auto path/query/localStorage/navigator
- Switcher FR/EN dans header (Geist Mono pill compact)
- Activation minimale sur hero H1 + manifeste + CTA Cal.com
- ~150 autres strings à décorer en session suivante

## 🛡️ Les 9 UX fixes (a11y + perf + SEO)

- Tier vert : skip-link doublon retiré, SVG icons sémantiques, Cal.com CTA unifié
- Tier jaune : iOS font-size 16px + min-height 48px, single H1, video manifeste redondante retirée
- Tier orange : `defer` sur 17 scripts, preload video réduit, GSAP safety net 3s

## 📝 Copy canonique

- `docs/TEXT-MASTER-V7.md` (621 lignes) = source unique du copy V7
- Manifeste s6 : texte PROTÉGÉ injecté *"Vous repoussez ce qui s'accumule..."*
- Meta SEO : brand statement mondial *"The operating system for the solo entrepreneur"*

## 🎞️ Film V6 recalibré

- Vraie main hologramme (5.04s macro IMAX)
- yuv420p iOS Safari compatible
- 137 keyframes (1 toutes les 0.47s) pour scrub mobile fluide
- Durée 62.83s, -37% poids vs avant

## 📋 Test plan

- [ ] Ouvrir en local : `python -m http.server 8000` ou `.\pinapp.ps1 dev`
- [ ] Console F12 : 2 banners (Pandora + JARVIS)
- [ ] Scroll : scene counter top-right slot-machine, chromatic aberration subtile
- [ ] s4 Constellation M&P : morse STAY bottom-left apparaît
- [ ] s6 Manifeste : tourbillon vertical ascendant à l'entrée
- [ ] Hover curseur desktop : timecode "MM:SS / MM:SS" sous curseur
- [ ] Switcher FR/EN header : hero H1 + manifeste + CTA basculent
- [ ] Form iPhone : pas de zoom au focus
- [ ] Konami code : overlay full-screen
- [ ] Taper `pinapp.duo()` console : stats duo
- [ ] Lighthouse mobile : perf + a11y + SEO ≥ 90 attendu

## ⚠️ Pas compris dans ce PR

- Variable fonts (nécessite download Fraunces Variable + Geist Variable)
- Bloc 5 CSS consolidation 87→12 fichiers (session dédiée)
- Beauty demos rewrite Tier M (décision Lauralie à valider)
- Stardust typography sur brand statement EN (signature optionnelle)
- i18n activation complète sur les ~150 strings restantes

## 🌙 Historique session

Voir `docs/HANDOVER-2026-04-21-NIGHT.md` pour le brief complet
de la session autonome (rollback plan, risques identifiés,
checklist détaillée).

---

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
