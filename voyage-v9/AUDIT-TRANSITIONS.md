# AUDIT CONFORMITÉ — voyage-v9/index.html vs wearebrand.io

> Diagnostic des transitions photo. Verdict et patch.

---

## 🔴 VERDICT : les transitions ne sont PAS de niveau wearebrand

### Pourquoi c'est dégueulasse (preuves dans le code)

**Problème #1 — Chaque photo est prisonnière de sa section**

```css
/* Ligne 106–108 */
.scene{position:relative;min-height:100vh;...}
.scene__bg{position:absolute;inset:0;z-index:-2;...}
.js .scene__bg{transform:scale(1.06);transition:transform 2.4s ...;opacity:0}
```

La photo est en `position:absolute` **à l'intérieur** de chaque `.scene`. Résultat : quand tu scrolles de la scène 1 à la scène 2, la photo hero-1 **sort par le haut** pendant que hero-2 **entre par le bas**. C'est une coupe sèche, pas un fondu. Chaque seam de section est visible.

**Problème #2 — Rien ne se fond entre scène A et scène B**

Le `transform:scale(1.06) → scale(1.02)` se joue **à l'intérieur** d'une scène quand elle entre dans le viewport. Il n'y a **aucune animation** qui gère le passage de la scène N à la scène N+1. Les photos se croisent bêtement en scrollant.

**Problème #3 — Les photos réutilisées créent quand même des seams**

```css
/* Lignes 250, 260, 273 */
.scene--06 .scene__bg{background-image:url('assets/hero-5.webp')}
.scene--07 .scene__bg{background-image:url('assets/hero-5.webp')}
.scene--08 .scene__bg{background-image:url('assets/hero-5.webp')}
```

Même image, mais 3 conteneurs `.scene__bg` différents qui s'affichent/disparaissent. À chaque limite de scène tu vois la photo **recharger sa position** (retour au `scale(1.06)` puis re-animation). L'œil perçoit un flash.

**Problème #4 — Les scrims sautent d'intensité**

```css
.scene--07 .scene__scrim{background:linear-gradient(180deg,rgba(5,11,20,.78),rgba(5,11,20,.9))}
.scene--08 .scene__scrim{background:linear-gradient(180deg,rgba(5,11,20,.85),rgba(5,11,20,.78))}
.scene--12 .scene__scrim{background:linear-gradient(180deg,rgba(5,11,20,.72),rgba(5,11,20,.86))}
```

Chaque scène a son propre scrim avec des valeurs hardcodées différentes (0.72 / 0.78 / 0.82 / 0.85 / 0.9…). Entre deux scènes, le voile **saute** de densité. Aucune cohérence.

**Problème #5 — Le photo scroll avec le contenu, pas derrière**

Aucun `position:fixed` ou `position:sticky` sur les backgrounds. Résultat : ça ressemble à un PDF avec des images pleine page, pas à un film. Wearebrand maintient **un seul fond qui traverse tout le document**, seul le contenu défile.

---

## ✅ LA TECHNIQUE WEAREBRAND (la vraie)

Wearebrand utilise un **stage fixe global** : une seule couche `position:fixed` au fond du document, contenant TOUTES les photos empilées. Une seule est visible à la fois. Au scroll, IntersectionObserver déclenche un **cross-fade opacity** de 1.2s entre couches. Plus un ken-burns très lent (scale 1.00 → 1.06 sur toute la durée de visibilité) et un léger blur(0 → 4px) en sortie.

Résultat : les photos **ne bougent jamais verticalement**. Elles se dissolvent. Seul le texte glisse.

---

## 🛠 PATCH — ce que Claude Code doit changer

### 1. HTML — sortir les backgrounds des scènes, créer un stage global

**Avant** (dans chaque scène) :
```html
<section class="scene scene--02">
  <div class="scene__bg" aria-hidden="true"></div>
  <div class="scene__scrim" aria-hidden="true"></div>
  <div class="container scene__content">...</div>
</section>
```

**Après** — ajouter UNE SEULE FOIS en haut du `<body>`, juste après `<div class="grain">` :
```html
<div class="stage" aria-hidden="true">
  <div class="stage__layer" data-scene="01" style="background-image:url('assets/hero-1.webp')"></div>
  <div class="stage__layer" data-scene="02" style="background-image:url('assets/hero-2.webp')"></div>
  <div class="stage__layer" data-scene="03" style="background-image:url('assets/hero-3.webp')"></div>
  <div class="stage__layer" data-scene="05" style="background-image:url('assets/hero-4.webp')"></div>
  <div class="stage__layer" data-scene="06" style="background-image:url('assets/hero-5.webp')"></div>
  <div class="stage__layer" data-scene="09" style="background-image:url('assets/hero-6.webp')"></div>
  <div class="stage__scrim"></div>
</div>
```

Puis dans CHAQUE scène — **supprimer** les `<div class="scene__bg">` et `<div class="scene__scrim">`. Ajouter un attribut `data-scene-id` sur chaque section :
```html
<section class="scene scene--02" data-scene-id="02">...</section>
```

Mapping des scènes aux photos (réutilisation volontaire) :
- Scène 01 → hero-1 (invitation)
- Scène 02 → hero-2 (constat)
- Scène 03 → hero-3 (services)
- Scène 04 → hero-3 (pack duo — continue hero-3)
- Scène 05 → hero-4 (réalisations)
- Scène 06 → hero-5 (méthode)
- Scène 07 → hero-5 (équipe — continue)
- Scène 08 → hero-5 (valeurs — continue)
- Scène 09 → hero-6 (engagements)
- Scène 10 → hero-6 (refus)
- Scène 11 → hero-6 (manifeste)
- Scène 12 → hero-6 (M&P)
- Scène 13 → hero-6 (tarifs)
- Scène 14 → hero-6 (contact)

### 2. CSS — remplacer le pattern .scene__bg par le stage

**Supprimer** les règles actuelles :
```css
.scene__bg{...}
.js .scene__bg{...}
.js .scene.is-in .scene__bg{...}
.scene__scrim{...}
.scene__scrim--dark{...}
.scene__scrim--vignette{...}
/* et toutes les règles .scene--XX .scene__bg / .scene--XX .scene__scrim */
```

**Ajouter** :
```css
.stage{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.stage__layer{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
  opacity:0;
  transform:scale(1.04);
  filter:blur(6px);
  transition:opacity 1.4s cubic-bezier(.22,1,.36,1),
             transform 8s cubic-bezier(.22,1,.36,1),
             filter 1.4s cubic-bezier(.22,1,.36,1);
  will-change:opacity,transform,filter
}
.stage__layer[data-active]{
  opacity:1;
  transform:scale(1.00);
  filter:blur(0)
}
.stage__scrim{
  position:absolute;inset:0;
  background:
    linear-gradient(180deg,rgba(5,11,20,.45) 0%,rgba(5,11,20,.78) 100%),
    radial-gradient(ellipse at center,rgba(5,11,20,0) 0%,rgba(5,11,20,.35) 100%);
  pointer-events:none
}

/* Les scènes deviennent transparentes, le contenu flotte */
.scene{position:relative;min-height:100vh;display:flex;align-items:center;padding:var(--space-7) 0;background:transparent}
.scene--04,.scene--10,.scene--11,.scene--13{background:rgba(5,11,20,.72);backdrop-filter:blur(8px)} /* scènes "panneaux" qui cassent le flow photo */

@media (prefers-reduced-motion:reduce){
  .stage__layer{transition:opacity .2s,transform .2s,filter .2s;transform:scale(1);filter:none}
}
```

### 3. JS — IntersectionObserver qui pilote le stage

**Remplacer** l'IO existant qui pose `.is-in` sur les scènes par :

```js
(function(){
  const scenes = document.querySelectorAll('[data-scene-id]');
  const layers = document.querySelectorAll('.stage__layer');
  const setActive = (id) => {
    layers.forEach(l => {
      if (l.dataset.scene === id) l.setAttribute('data-active','');
      else l.removeAttribute('data-active');
    });
  };
  const io = new IntersectionObserver((entries) => {
    // scene visible le plus centrée = pilote le stage
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      const sceneId = visible.target.dataset.sceneId;
      // fallback : si la scène n'a pas de layer dédié, hérite de la précédente
      const availableLayers = ['01','02','03','05','06','09'];
      const bestMatch = [...availableLayers].reverse().find(id => id <= sceneId) || '01';
      setActive(bestMatch);
      visible.target.classList.add('is-in');
    }
  }, { threshold: [0.25, 0.5, 0.75], rootMargin: '-10% 0px -10% 0px' });
  scenes.forEach(s => io.observe(s));
  setActive('01'); // initial
})();
```

Note : `availableLayers = ['01','02','03','05','06','09']` = les 6 vraies photos. Les scènes 04, 07, 08, 10–14 héritent de la photo précédente (pas de flash).

### 4. Bonus qualité wearebrand

- **Preload des 6 photos** en haut du `<head>` (pas juste hero-1) pour éviter un flash sur la première transition :
  ```html
  <link rel="preload" as="image" href="assets/hero-1.webp" fetchpriority="high">
  <link rel="preload" as="image" href="assets/hero-2.webp">
  <link rel="preload" as="image" href="assets/hero-3.webp">
  <link rel="preload" as="image" href="assets/hero-4.webp">
  <link rel="preload" as="image" href="assets/hero-5.webp">
  <link rel="preload" as="image" href="assets/hero-6.webp">
  ```

- **Désactiver le scroll parallax JS sur la scène 1** (ligne actuelle avec mousemove) — il fight avec le stage fixe. Ou le réécrire pour translater seulement la couche active :
  ```js
  if (matchMedia('(hover:hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX/innerWidth - .5) * 12;
      const y = (e.clientY/innerHeight - .5) * 12;
      document.querySelectorAll('.stage__layer[data-active]').forEach(l => {
        l.style.setProperty('--mx', x+'px');
        l.style.setProperty('--my', y+'px');
      });
    }, { passive:true });
  }
  /* + CSS */
  .stage__layer[data-active]{ transform: scale(1) translate(var(--mx,0), var(--my,0)); }
  ```

- **Grain au-dessus du stage** (déjà fait, OK — mais vérifier `z-index:180` > `-1`).

---

## 📋 CHECKLIST POST-PATCH

- [ ] Scroll de la scène 1 à la scène 2 : **cross-fade doux**, photo ne bouge pas verticalement
- [ ] Même photo entre scènes 6/7/8 : **aucun flash**, ken-burns continu
- [ ] Même photo entre scènes 9→14 : **continuité parfaite**
- [ ] Scène 4 (Pack Duo) : panneau semi-opaque qui laisse deviner hero-3 derrière
- [ ] Densité du scrim constante tout au long du scroll
- [ ] `prefers-reduced-motion` : pas d'animation, juste opacity swap
- [ ] Lighthouse Performance ≥ 90 mobile (6 photos preload acceptable si < 1.8 Mo total)

---

## 🎯 COMMANDE CLAUDE CODE

```bash
cd C:\Users\Lauralie\Projects\pinapp-site\voyage-v9
claude "Lis AUDIT-TRANSITIONS.md. Applique le patch complet à index.html : (1) sortir les 6 backgrounds dans un stage fixe global, (2) remplacer les règles CSS .scene__bg/.scene__scrim par .stage/.stage__layer avec cross-fade 1.4s + ken-burns 8s, (3) remplacer l'IntersectionObserver pour piloter data-active sur le stage avec le mapping scènes→layers indiqué, (4) preload les 6 photos. Vérifie qu'aucune scène ne contient plus scene__bg ou scene__scrim. FULL WOW wearebrand."
```

---

*Audit produit le 2026-04-23. Référence : wearebrand.io technique du stage fixe + opacity cross-fade IntersectionObserver.*
