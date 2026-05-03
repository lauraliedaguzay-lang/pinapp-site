# Rapport forensique PR-S11 — Phase 1 (zéro code)

**Date :** 2026-05-03  
**Périmètre :** `voyage-v9/index.html` (script inline stage + HTML calques / sections), lecture croisée `voyage-v9/assets/js/scroll-smooth.js` (Lenis).  
**Hors périmètre lu en profondeur :** `pr3a-v12.js` (aucune logique `setHero` / `stage__layer` repérée au grep — IO localisé ailleurs).

---

## 1. Architecture observée

### 1.1 Calques de fond (HTML)

- Conteneur `.stage` avec **6** nœuds `.stage__layer`.
- Chaque calque porte **`data-hero`** = `"1"` … `"6"` (identifiant du calque, pas confondre avec `data-stage` des sections).
- **État initial :** le premier calque (`data-hero="1"`) a la classe **`is-active`** en dur dans le HTML ; les autres non.
- Les images de fond sont en `style="background-image:url(assets/hero-N.webp)"` (hors périmètre modification pour S11).

### 1.2 Sections scène (HTML)

- Chaque `<section id="…" class="scene" …>` sous `<main>` peut porner **`data-stage="hero-1"` … `hero-6"`** (narratif / mapping PR-T actuel : progression monotone documentée ailleurs).
- **`#hero`** est explicitement **`data-stage="hero-1"`** en production actuelle (contrainte PR-T / PR-L-Q : ne pas mapper `#hero` sur `hero-6` sans stratégie JS).

### 1.3 Mécanique JavaScript (script inline, `voyage-v9/index.html`)

Extrait logique (résumé fidèle au code) :

1. **`heroMap`** : table `data-stage` → id calque :  
   `'hero-1'→'1'`, …, `'hero-6'→'6'`.

2. **`layers`** : **une seule fois** au chargement du script,  
   `document.querySelectorAll('.stage__layer')` → tableau figé.

3. **`setHero(h)`** :  
   - Résout `id = heroMap[h]`.  
   - Pour chaque calque `L` : `L.classList.toggle('is-active', L.getAttribute('data-hero') === id)`.  
   → **Un seul** calque actif à la fois si les `data-hero` sont uniques.

4. **`emitScene(sectionId)`** :  
   - Met `data-active-section` sur `<html>`.  
   - Dispatche l’événement custom `voyage:scene-active`.  
   - Récupère `document.getElementById(sectionId)` puis **`sec.getAttribute('data-stage')`** et appelle **`setHero(st)`** si présent.

5. **`IntersectionObserver` (stage)** :  
   - Cible : **`document.querySelectorAll('main section[id]')`**.  
   - Options : `threshold: [0, 0.15, 0.35, 0.55, 0.75]`, `rootMargin: '-12% 0px -35% 0px'`.  
   - Callback : parmi les **`entries` du batch courant** uniquement, filtre `isIntersecting`, garde la section avec **`intersectionRatio` maximale** ; en cas d’échec du premier passage, second passage équivalent ; puis **`emitScene(best.id)`** si `best` existe.

**Point clé d’architecture :** le choix du « gagnant » est **local au batch d’entries** et **basé sur le ratio d’intersection**, pas sur une lecture explicite de « toutes les sections visibles » ni sur l’ordre documentaire prioritaire.

### 1.4 Lenis (`scroll-smooth.js`)

- Chargé avec **`defer`** après `lenis.min.js`.
- Instancie **`Lenis`** (`smoothWheel: true`, rAF interne), expose **`window.__pinappLenis`**.
- Écoute **`lenis.on('scroll', …)`** pour la jauge de progression (pas pour `setHero`).
- **Le script inline du stage n’écoute pas Lenis** : pas de `lenis.on('scroll', emit…)` ; la mise à jour des calques repose **uniquement** sur l’IO natif.

### 1.5 Ordre d’exécution approximatif (chargement page)

1. Parse HTML jusqu’aux balises `<script defer>` (lignes ~3060–3071) : elles sont **mises en file** sans s’exécuter.  
2. Le parseur atteint le **script inline** (~3072) : il s’exécute **immédiatement** (enregistre `layers`, `setHero`, `IntersectionObserver` sur `main section[id]`, etc.). À ce moment, tout le DOM **au-dessus** du script est déjà parsé (calques + sections : OK).  
3. Fin du parse du document : les scripts **`defer`** s’exécutent **dans l’ordre** → **`scroll-smooth.js`** crée **Lenis** et démarre le rAF **après** l’installation de l’IO stage.  
4. Premier rappel IO : après layout / paint, selon implémentation navigateur (indépendant de Lenis, mais le scroll ultérieur est lissé par Lenis).

### 1.6 Diagramme des dépendances (texte)

```
[data-stage sur sections]
         │
         ▼
emitScene(sectionId) ──► getElementById ──► getAttribute('data-stage')
         │
         ▼
    setHero('hero-N') ──► heroMap ──► toggle .is-active sur .stage__layer[data-hero=N']
         ▲
         │
IntersectionObserver (batch entries, max intersectionRatio)
         ▲
         │
    layout (scroll) ◄──── Lenis (scroll virtuel / RAF) — pas de lien direct dans le code stage
```

---

## 2. Causes root identifiées (hypothèses pondérées)

### Cause #1 — **Sélection « max intersectionRatio » sur le batch IO** (gravité : **haute**)

**Description :**  
Quand plusieurs sections restent « intersecting » dans la zone sensible (rootMargin négatif réduit la fenêtre mais **#hero** peut rester longtemps partiellement dans la root), le callback ne compare que les **`entries` du tour courant**. Si **`#hero`** apparaît souvent avec un **ratio supérieur** aux sections plus bas dans la page (grand bloc initial, sticky partiel, etc.), **`emitScene('hero')`** est rappelé en boucle. Si **`#hero`** portait **`data-stage="hero-6"`** (scénario Avalon / PR-Q), alors **`setHero('hero-6')`** serait réappliqué **à chaque fois** que le hero « gagne » → **sensation de calque hero-6 figé** sur tout le parcours.

**Pourquoi compatible avec le symptôme « figé sur toutes les sections » :**  
Ce n’est pas que `setHero` ne marche pas ; c’est que **la section gagnante reste `#hero`** trop souvent, donc **`data-stage` lu est toujours celui du hero** (ex. `hero-6`).

### Cause #2 — **Absence d’`emitScene` initial / pas de `takeRecords()` après layout** (gravité : **moyenne**)

**Description :**  
Aucun appel **`emitScene`** au chargement pour aligner le DOM sur le scroll réel. Jusqu’au premier callback IO, le HTML impose **`is-active`** sur le calque 1. Un premier IO peut ensuite « sauter » brutalement. Moins probable comme **seule** explication du figeage **hero-6 partout**, mais pertinent pour des **à-coups** visuels.

### Cause #3 — **Couplage Lenis × layout × IO** (gravité : **moyenne**, surtout transitoire)

**Description :**  
Lenis anime le scroll ; l’IO se base sur le layout. En général les navigateurs recalculent les intersections ; le risque est surtout des **frames** où le « mauvais » gagnant est choisi, pas un blocage permanent — sauf si la logique #1 force toujours le même gagnant.

**Constat :** le stage **ne s’abonne pas** à `lenis.on('scroll')` ; donc pas de bug « événement scroll jamais reçu » côté stage, mais possible **déphasage** marginal.

### Cause #4 — **Confusion `data-hero` vs `data-stage`** (gravité : **basse** pour le bug actuel)

**Description :**  
Deux namespaces (`data-hero` sur calques, `data-stage` sur sections). Le code les relie via `heroMap`. Erreur possible en éditant le HTML à la main, mais **le code inline est cohérent** : pas de bug évident ici si les attributs restent alignés.

### Cause #5 — **`layers` figé au load** (gravité : **très basse**)

**Description :**  
Si les calques étaient ajoutés dynamiquement après le script, `layers` serait vide — **non le cas** ici (calques statiques avant `<main>`).

---

## 3. Plan de fix proposé (Phase 2+ — non réalisé ici)

> Toute modification reste soumise à validation Thomas / Lauralie avant implémentation.

### Fix #1 — **Changer la politique de « gagnant » IO** (fichier : `voyage-v9/index.html`, bloc inline ~L3093–3105)

- **Option A :** parmi les sections intersecting, choisir celle dont le **centre** (ou le bord supérieur) est le plus proche d’une ligne horizontale « lecture » (ex. 35 % viewport), plutôt que le max `intersectionRatio`.
- **Option B :** en cas d’égalité ou si `#hero` est candidat, **tie-break par ordre DOM** (indice de section max / dernière section dont le haut a dépassé un seuil de `scrollY`).
- **Option C :** après chaque scroll ( **`lenis.on('scroll', …)`** OU listener natif en mode sobre), appeler une fonction **`pickStageFromLayout()`** qui scanne les sections (ou utilise **`observer.takeRecords()`** puis la même logique) — **réduit la dépendance au seul batch**.

### Fix #2 — **`emitScene` au load + après resize** (même fichier inline)

- Un **`requestAnimationFrame`** ou `DOMContentLoaded` : calculer la section « courante » une fois (même heuristique que le fix #1) et **`emitScene`**.

### Fix #3 — **Ne pas mapper Avalon sur `#hero` avant Fix #1** (fichier : `voyage-v9/index.html`, Phase 3 uniquement)

- Garder **`#hero` → `hero-1`** jusqu’à preuve que le gagnant IO ne réécrase plus le hero quand les sections du bas sont actives.

### Fix #4 — **Instrumentation (debug uniquement, retirer avant prod)**

- `console.log` dans le callback IO : `best.id`, `bestR`, liste des `entries` avec `target.id` + `intersectionRatio` + `isIntersecting`.
- **Hypothèse falsifiable :** si les logs montrent `best.id === 'hero'` pendant que l’utilisateur voit `#engagements` au centre de l’écran, la **Cause #1** est confirmée.

---

## 4. Hypothèse falsifiable (formulation unique)

**Énoncé :**  
« Si la Cause #1 est correcte, alors après instrumentation on observera des callbacks où **`best.id` vaut `hero`** alors que la section visuellement dominante est une autre (`#engagements`, `#realisations`, …), avec **`#hero` toujours `isIntersecting: true`** et un **`intersectionRatio` supérieur** aux autres entrées du batch. **Si on remplace la règle de choix du gagnant** (Fix #1 option B ou C) **sans toucher aux `data-stage`**, alors en gardant temporairement **`#hero` en `hero-6` sur une branche de test**, le calque **changement** suivra le scroll (plus de blocage sur hero-6 partout). »

**Test manuel suggéré :** scroll molette / trackpad sur build de branche, avec overlay logs ou breakpoint sur `emitScene`.

---

## 5. Risques identifiés

| Risque | Détail |
|--------|--------|
| Effets de bord | Changer l’heuristique peut **désynchroniser** brièvement le fond et la nav active si d’autres IO utilisent d’autres `rootMargin`. |
| Lenis / IO | Forcer un recalcul via `takeRecords()` peut être coûteux si appelé à chaque frame — à **throttler** (rAF). |
| Ken Burns | Toujours lié à `.stage__layer.is-active` + CSS ; changer la fréquence des changements de calque peut changer la **perception** du mouvement (pas une régression technique directe). |
| Régression PR-T | Toute Phase 3 `data-stage` doit être **après** stabilisation du moteur de choix de section. |

---

## 6. Recommandation finale

**Recommandation : « Tentative Phase 2 conditionnelle » — pas de Phase 3 Avalon tant que la Cause #1 n’est pas invalidée ou corrigée.**

Arguments :

- Le code inline montre une **dépendance forte** à la compétition **`intersectionRatio` sur le batch** ; c’est **exactement** le genre de logique qui produit un « sticky winner » (#hero) incompatible avec un **`#hero` porteur du stage terminal** (`hero-6`).
- **PR-T linéaire** est stable, pitch-safe, et **ne touche pas** au bug structurel ; il atténue seulement le risque en gardant `#hero` sur `hero-1`.
- À **J-3 pitch**, toute Phase 2 doit rester **une branche isolée**, **un changement à la fois**, **revert trivial**, **tests live** avant merge — conformément au protocole Thomas.

**« STOP S11 » complet** serait justifié si : après 30 min d’instrumentation réelle sur navigateur, **aucune corrélation** n’apparaît entre `best.id` et le figeage — alors privilégier la **ligne PR-T** et reporter Avalon **post-pitch**.

---

## 7. Synthèse exécutive (coalition fictive)

| Alignement | Lecture |
|------------|---------|
| Simon / Viktor / Yasmine | Cause #1 testable par logs + changement de politique de sélection. |
| Thomas / Marco / Nadia | Phase 1 = rapport ; pas de merge code sans validation ; risque pitch. |
| Olivier | Phases atomiques : d’abord fix moteur IO, ensuite seulement `data-stage` Avalon. |

---

## 8. Métadonnées livrable Phase 1

- **Fichiers modifiés pour ce commit :** uniquement ce rapport (`RAPPORT-PR-S11-PHASE1-2026-05-03.md`).  
- **Aucune** modification de `voyage-v9/index.html`, `.js` ou `.css` dans cette phase.  
- **Branche :** `feature/v12-prS11-phase1-forensic-report`

---

*Fin du rapport Phase 1 — PR-S11.*
