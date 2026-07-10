# CLAUDE.md · Pinapp Site — Doctrine de collaboration Claude + Cursor
> Ce fichier est lu automatiquement par Cursor à chaque session.
> Il définit les rôles, les règles et le workflow entre Claude (claude.ai)
> et Cursor (exécution dans le repo). Ne pas modifier sans validation de Lauralie.
> Dernière mise à jour : avril 2026.

---

## 1. Qui fait quoi — rôles non négociables

| Rôle | Outil | Périmètre |
|---|---|---|
| Architecte / Directeur technique | **Claude (claude.ai)** | Décisions, specs, prompts, audit, copy, review |
| Ingénieur exécutant | **Cursor Agent** | Fichiers, commits, builds, remplacements |
| Œil artistique | **Claude (claude.ai)** | Validation images Flux/Runway, cohérence V2 |
| Gardien du design system | **Claude (claude.ai)** | Cohérence nav/footer/typo/couleurs entre pages |
| Validation humaine finale | **Lauralie + Michaël** | Preview Netlify avant tout merge vers main |

**Règle d'or :** Cursor n'invente jamais une direction visuelle ni une décision d'architecture.
Si la spec n'est pas dans ce fichier ou dans le prompt reçu de Claude → Cursor s'arrête et demande.

---

## 2. Le workflow quotidien

```
Claude (claude.ai)          Cursor Agent              Humain
      |                          |                      |
      | Spec + prompt affiné     |                      |
      |------------------------->|                      |
      |                          | Exécute dans repo    |
      |                          | Git commit           |
      |                          | Push preview         |
      |                          |--------------------> |
      |                          |                      | Validation preview
      | Audit résultat           |                      |
      |<-------------------------------------------------|
      | (screenshot / code collé)|                      |
      | Correction de cap        |                      |
      |------------------------->|                      |
      |                          | Merge si validé      |
```

**Ne jamais merger vers `main` sans :**
1. Audit Claude du code produit
2. Validation humaine sur la preview Netlify
3. Vérification console : zéro erreur JS, zéro violation CSP

---

## 3. Stack technique — règles strictes

### Langages et outils
- **HTML / CSS / JS vanilla uniquement** — zéro framework, zéro React, zéro Vue
- **GSAP + ScrollTrigger + Lenis** — animations desktop uniquement
- **Canvas 2D** — particules bioluminescentes
- **esbuild** — bundling uniquement (`scripts/build-home-bundles.mjs`)
- **PowerShell** — scripts système et génération d'images (Windows)
- **Node .mjs** — scripts de build CI-compatibles

### Budgets non négociables
- JS total : ≤ 85 Ko (hors vendor)
- Page complète : ≤ 2 Mo
- Load time : ≤ 1.5 s
- Lighthouse mobile : ≥ 72 (cible 90+)
- LCP : ≤ 2.8 s

### Images et vidéos
- Format : WebP + AVIF (double) pour images, MP4 H.265 pour vidéos
- Poster hero : AVIF ≤ 40 Ko
- Vidéo : `preload="none"`, lecture via IntersectionObserver uniquement
- Génération : Flux 1.1 Pro via Replicate (PowerShell), Runway Gen-3

### Fonts
- **Geist** uniquement (Vercel, open source, auto-hébergé)
- 4 weights : 400 / 500 / 600 / 700 (~50 Ko total)
- Zéro CDN externe — tout auto-hébergé

---

## 4. Design system — valeurs de référence

### Palette
```css
--bg-primary:    #0A1425;   /* fond nuit profonde */
--cyan-bio:      #3EF5E0;   /* bioluminescent principal */
--violet-accent: #7B5EA7;   /* accent magenta/violet */
--white-off:     #F0F8FF;   /* texte principal sur fond noir */
--cyan-pandora:  #00E5B0;   /* cyan secondaire (accents) */
```

### Typographie
```css
font-family: 'Geist', system-ui, sans-serif;
/* H1 cinématique */ font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 700;
/* Body */          font-size: 1rem; font-weight: 400; line-height: 1.6;
/* Caption */       font-size: 0.75rem; font-weight: 500; letter-spacing: 0.15em;
```

### Composants partagés (toutes pages)
- **Nav** : hamburger 3 sections ("Le voyage / Explorer / L'entreprise")
- **Footer** : `contact@pinapp.fr` · `06 59 88 20 15` · SIRET 523 884 898 00017
- **Copyright** : "Pinapp Inc. © 2026" — jamais "Pinapp Studio"
- **CTA principal** : `#3EF5E0` sur fond `#0A1425`, border-radius 2px, Geist 600

---

## 5. Règles de marque — absolues

### Nommage
| ❌ Interdit | ✅ Correct |
|---|---|
| Pinapp Studio | Pinapp (corps de texte) |
| Pinapp Studio | Pinapp Inc. (footer, mentions légales) |
| Aurora | ambient-api (code), "ambiance" (copy) |
| Pandora | biolume (code), "bioluminescent" (copy) |
| pandora-* (assets) | biolume-* (assets) |

### Attribution fondateurs — jamais modifier
```
Lauralie Daguzay — Co-fondatrice — Sites, Automatisation, IA
Michaël Bouilhac — Co-fondateur — Vidéo, Image, Production
49 Avenue Edmond Rostand, 33700 Mérignac
SIRET : 523 884 898 00017
```

### Ton de voix
- **Direct et benefit-oriented** — jamais poétique ni abstrait
- **"Nous"** en voix de marque (pas "je" sauf Lauralie en 1ère personne explicite)
- **Jamais** de métaphores non expliquées dans les CTAs
- **Toujours** une preuve ou un chiffre avec chaque promesse

---

## 6. SEO — règles de base à respecter sur toute page

```html
<!-- Title : toujours en français, 50-60 chars, mot-clé + localisation -->
<title>[Sujet principal] · Pinapp Bordeaux</title>
<!-- Description : 150-160 chars, benefit-driven -->
<meta name="description" content="...">
<!-- Canonical : toujours absolu -->
<link rel="canonical" href="https://pinapp.fr/[chemin]/">
<!-- OG minimal -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="https://pinapp.fr/[chemin]/">
<meta property="og:image" content="https://pinapp.fr/assets/img/og/og-[page].jpg">
<!-- JSON-LD Organization : ne jamais supprimer de la home -->
```

Ne jamais modifier les balises SEO existantes sans avoir vérifié
que le canonical, l'OG et le JSON-LD sont présents et corrects après modification.

---

## 7. Sécurité — règles Netlify Functions

Toute Netlify Function doit :
- Vérifier le token/session **côté serveur** (jamais juste un header client)
- Restreindre CORS à `https://pinapp.fr` uniquement
- Lire les secrets via `process.env.*` — jamais hardcodés
- Logger les erreurs sans exposer les détails internes dans la réponse

Fichiers protégés — ne jamais supprimer ni modifier sans validation Lauralie :
```
netlify/functions/
legal/
emails/
n8n-workflows/
apps-script/
```

---

## 8. Accessibilité — non négociable

```js
// Toujours gate les animations derrière prefers-reduced-motion
if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  // GSAP, Lenis, ScrollTrigger, Canvas particules
  // import() dynamiques uniquement ici
}
```

- Tout `<img>` a un `alt` descriptif ou `alt=""` si décoratif
- Contraste texte : WCAG AA minimum (4.5:1 pour corps, 3:1 pour grands titres)
- Formulaires : tous les `<input>` ont un `<label>` associé
- Focus visible sur tous les éléments interactifs

---

## 9. Git — règles de branche et commit

```
main          → production, jamais de push direct
feat/*        → nouvelles fonctionnalités
fix/*         → corrections
chore/*       → maintenance, nettoyage
perf/*        → optimisations performance
refactor/*    → restructuration sans changement fonctionnel
security/*    → correctifs sécurité
```

**Format conventional commits obligatoire :**
```
type(scope): description courte en français

Corps optionnel — pourquoi, pas comment.
```

**Jamais :**
- `git filter-repo` ou réécriture d'historique
- `--force-with-lease` sur main
- `git rm` sans avoir fait le grep de références croisées d'abord
- Suppression physique de fichiers — toujours déplacer en `assets/_legacy/` ou `docs/_legacy/`

---

## 10. Workflow images V2 (Passengers/Avatar)

```
1. Claude (claude.ai) → prompt Flux 1.1 Pro affiné selon direction validée
2. PowerShell → Replicate API → image générée (16:9 + 9:16)
3. Lauralie partage l'image à Claude → audit direction artistique
4. Si validé → optimisation WebP/AVIF (PowerShell)
5. Cursor → intégration HTML, IntersectionObserver, lazy load
6. Claude → audit du code d'intégration
```

**Direction visuelle V2 validée (ne pas dériver) :**
- Références : *Passengers* (architecture spatiale) + *Avatar* (bioluminescence)
  + *Interstellar* (solennité) + *Oxygène* (cyan précieux)
- Mantra : "humain seul, solennel, qui découvre"
- Fond : `#0A1425` · Cyan : `#3EF5E0` · Accents : violet/magenta
- Silhouette humaine de dos sur une passerelle, baie vitrée sur paysage bioluminescent
- Jamais de visages en gros plan dans les scènes de fond
- Grain cinématique : 15% — pas de rendu trop net/numérique

---

## 11. Ce que Cursor ne doit jamais faire seul

- Choisir une direction visuelle
- Modifier la copy marketing sans spec Claude
- Changer les valeurs de couleur sans validation
- Supprimer du SEO (canonical, OG, JSON-LD)
- Modifier `.cursor/rules/*.mdc` sans demande explicite de Lauralie
- Créer un nouveau composant nav ou footer sans spec de design system
- Décider du naming d'un asset (suivre la convention section 5)
- Merger vers `main` sans validation humaine sur preview

---

## Règle fondatrice · pinapp.fr vs sites clients

**Distinction critique** : Pinapp produit 2 types de sites, chacun avec ses règles opposées.

### pinapp.fr (vaisseau-amiral Pinapp)

C'est la **vitrine Pinapp elle-même**. Elle peut assumer un **voyage cinématique scroll-driven** avec parallax multi-couches et sections pinnées. C'est le showcase qui prouve le savoir-faire auprès des prospects TPE/PME.

**Autorisé et attendu (quand le chantier le prévoit, ex. refonte V2)** :

- Scroll narratif plein écran (scènes plan-séquence type Passengers / 1917)
- Parallax multi-couches (scale, clip-path, transforms sur calques dédiés)
- Pin ScrollTrigger pendant la lecture d'une scène
- Canvas particules (densité selon scène, plafond raisonnable)
- Cross-fade, blur-reveal sur contenu, text split
- Hero plein écran cinéma, accents biolumi (cyan, violet, magenta)

**Obligatoire malgré tout (garde-fous)** :

- `prefers-reduced-motion: reduce` désactive le spectacle lourd (CSS + JS)
- Bouton **Mode sobre** visible (ex. menu hamburger) : coupe le scroll narratif, navigation classique par ancres
- Textes marketing dans le **HTML visible**, jamais Canvas seul (SEO)
- Performance : budget global cible raisonnable (ex. ≤ ~2 Mo assets critiques), LCP cible ≤ 1,5 s desktop / ≤ 2,5 s mobile 4G, Lighthouse ≥ 90 (perf / a11y / SEO) objectifs
- Mode `.low-perf` si `navigator.hardwareConcurrency < 4` : moins de particules, moins de blur

### Sites clients Pinapp (démos, vitrines livrées, etc.)

**Inverse** : sobriété, pas de parallax décoratif gratuit, pas de scroll narratif imposé si ce n'est pas le brief. La marque **client** prime ; conversion > immersion. Voir `.cursor/rules/pinapp-zero-scroll.mdc`.

### Principe de décision

> Avant une animation scroll-driven ou une parallax : **c'est pinapp.fr (vitrine) ou un site client ?**
>
> - **pinapp.fr** → immersion cinéma **assumée** si documenté (ex. `PINAPP_CURSOR_V2_MASTER.md`)
> - **Site client** → règle **zéro scroll / pas de parallax décorative** du dépôt

### Abrogation ciblée

Les règles générales « zéro scroll » / « pas de parallax sur le scroll » **ne s'appliquent pas** à la **home pinapp.fr** en mode **voyage cinématique V2** validé sur la branche de refonte. Elles **restent** pour les sites et démos clients.

---

*CLAUDE.md maintenu par Lauralie Daguzay · Pinapp Inc. · pinapp.fr*
*En cas de doute sur une règle → demander à Claude avant d'exécuter.*
*Aligné avec `.cursorrules` et `PINAPP_CURSOR_V2_MASTER.md`.*
