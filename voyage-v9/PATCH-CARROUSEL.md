# PATCH CARROUSEL RÉALISATIONS — voyage-v9

> Le carrousel est actuellement un squelette HTML sans CSS ni JS.
> Score actuel : 10/30. Ce patch doit le remonter à 28/30.

---

## 🚨 DIAGNOSTIC

**HTML (scène 05)** :
- ✅ 13 cartes dans le bon ordre avec bons noms, secteurs, tags et couleurs
- ✅ Badges "Aperçu sectoriel" présents
- ✅ Images Unsplash de prod
- ✅ `loading="lazy"`, `alt` descriptifs, `role="region"`

**CSS** :
- ❌ Aucune règle pour `.reals__scroll` (pas d'overflow-x, pas de scroll-snap)
- ❌ Aucune règle pour `.real` (pas de flex, pas de largeur, pas d'aspect-ratio)
- ❌ Résultat : les 13 cartes s'empilent verticalement, pleine largeur. Pas de carrousel.

**JS** :
- ❌ Les boutons prev/next (L760–761) n'ont **aucun event listener**
- ❌ Le compteur `#realsCounter` n'est jamais mis à jour
- ❌ Pas de navigation clavier, pas de gestion scroll

**Vs prod** (`backup/realisations/index.html`) :
- Prod a carrousel 3D perspective, filtres (Tous / Beauté / Métiers / Créations), dots navigation, info dynamique, **liens vers `/demo/<slug>/`**
- v9 n'a rien de cliquable

---

## 🛠 PATCH 1 — CSS (à ajouter dans le `<style>` inline)

```css
/* === CARROUSEL RÉALISATIONS === */
.reals{position:relative}

.reals__head{
  display:flex;align-items:flex-end;justify-content:space-between;
  gap:var(--space-4);margin-bottom:var(--space-5);flex-wrap:wrap
}

.reals__counter{
  font-family:var(--sans);font-variant-numeric:tabular-nums;
  font-size:.75rem;letter-spacing:.2em;color:var(--ivoire-dim);
  padding:.5rem .9rem;border:1px solid var(--fumee);border-radius:100px
}

.reals__nav{display:flex;gap:.5rem}

.reals__arrow{
  width:48px;height:48px;border-radius:50%;
  border:1px solid var(--fumee-2);background:transparent;color:var(--ivoire);
  display:grid;place-items:center;cursor:pointer;
  transition:background .25s var(--ease),border-color .25s,color .25s,transform .25s
}
.reals__arrow:hover{background:var(--or);border-color:var(--or);color:var(--nuit);transform:translateY(-2px)}
.reals__arrow:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}
.reals__arrow:disabled{opacity:.3;cursor:not-allowed;transform:none;background:transparent;color:var(--ivoire);border-color:var(--fumee)}
.reals__arrow svg{width:18px;height:18px}

/* Piste scrollable */
.reals__scroll{
  display:flex;gap:var(--space-3);
  overflow-x:auto;overflow-y:hidden;
  scroll-snap-type:x mandatory;
  scroll-behavior:smooth;
  padding:4px 4px var(--space-3) 4px;
  margin:0 calc(-1 * var(--gutter));
  padding-left:var(--gutter);padding-right:var(--gutter);
  scrollbar-width:none;-ms-overflow-style:none;
  overscroll-behavior-x:contain
}
.reals__scroll::-webkit-scrollbar{display:none}

/* Carte */
.real{
  flex:0 0 clamp(280px, 38vw, 420px);
  scroll-snap-align:start;
  position:relative;aspect-ratio:3/4;
  overflow:hidden;border-radius:4px;
  background:var(--nuit-2);border:1px solid var(--fumee);
  text-decoration:none;color:inherit;
  transition:transform .45s var(--ease),border-color .45s
}
.real:hover{transform:translateY(-4px);border-color:var(--fumee-2)}
.real:hover .real__img{transform:scale(1.06);filter:grayscale(0) contrast(1.05) brightness(.95)}
.real:focus-visible{outline:2px solid var(--cyan);outline-offset:4px}

.real__img{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  filter:grayscale(20%) contrast(1.05) brightness(.82);
  transition:transform .8s var(--ease),filter .6s var(--ease)
}
.real__scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,11,20,.08) 0%,rgba(5,11,20,.35) 55%,rgba(5,11,20,.92) 100%);pointer-events:none}

.real__tag{
  position:absolute;top:14px;left:14px;
  padding:.35rem .75rem;border-radius:100px;
  font-family:var(--sans);font-size:.6875rem;font-weight:600;
  letter-spacing:.12em;text-transform:uppercase;color:#fff;
  backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)
}

.real__apercu{
  position:absolute;top:14px;right:14px;
  padding:.25rem .6rem;border-radius:100px;
  font-family:var(--sans);font-size:.625rem;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;
  color:var(--ivoire-dim);
  border:1px dashed rgba(244,228,193,.35);
  background:rgba(5,11,20,.4);
  backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)
}

.real__body{
  position:absolute;inset:auto 0 0 0;padding:var(--space-3);
  display:flex;flex-direction:column;gap:.25rem
}
.real__num{
  font-family:var(--serif);font-style:italic;font-size:1.75rem;
  line-height:1;color:var(--or);margin-bottom:.15rem
}
.real__name{
  font-family:var(--sans);font-weight:500;font-size:1.125rem;
  letter-spacing:-0.01em;margin:0
}
.real__sector{
  font-family:var(--sans);font-size:.75rem;color:var(--ivoire-dim);
  letter-spacing:.1em;text-transform:uppercase
}

/* Mobile : cartes plus petites */
@media (max-width:640px){
  .real{flex:0 0 78vw;aspect-ratio:4/5}
}

/* Reduced motion */
@media (prefers-reduced-motion:reduce){
  .reals__scroll{scroll-behavior:auto}
  .real,.real__img,.real:hover .real__img{transition:none;transform:none}
}
```

---

## 🛠 PATCH 2 — HTML (enveloppe les cartes dans un lien)

**Actuellement** chaque carte est un `<article>` non-cliquable. Transformer en `<a>` pour pointer vers la démo sectorielle correspondante.

Remplacer chaque `<article class="real">...</article>` par :

```html
<a class="real" href="/demo/<slug>/" aria-label="Voir l'aperçu sectoriel <nom>">
  <img class="real__img" loading="lazy" src="<url>" alt="<alt>">
  <div class="real__scrim" aria-hidden="true"></div>
  <span class="real__tag" style="background:<color>"><SECTEUR></span>
  <span class="real__apercu" aria-label="Aperçu sectoriel — pas le site livré">Aperçu sectoriel</span>
  <div class="real__body">
    <span class="real__num">01</span>
    <h3 class="real__name"><nom></h3>
    <span class="real__sector"><secteur></span>
  </div>
</a>
```

### Mapping des slugs (identique prod backup)
| # | Nom | slug `/demo/<slug>/` |
|---|---|---|
| 01 | Renov&Co | `artisan` |
| 02 | Ōkami | `restaurant` |
| 03 | Clara Fontaine | `coach` |
| 04 | Cabinet Renaud | `avocat` |
| 05 | Studio Élise | `esthetique` |
| 06 | Lash Studio Camille | `lash` |
| 07 | Nail Studio Nina | `nail` |
| 08 | Salon Obsidian | `coiffure` |
| 09 | Barber&Co | `barbier` |
| 10 | Maison Brioche | `boulangerie` |
| 11 | Forge Athletics | `coach-sportif` |
| 12 | Nocturna Ink | `tatouage` |
| 13 | Luminance&Lieu | `luminance` |

⚠️ Avant de brancher les liens, vérifier que les pages `demo/<slug>/` existent — elles sont dans la prod mais pas nécessairement dans le périmètre v9.
**Fallback** : si les démos ne sont pas déployées, mettre `href="#reals"` (ancre vers la section) et `onclick` désactivé, OU garder des `<article>` cliquables qui ouvrent une modale légère.

---

## 🛠 PATCH 3 — JS (navigation + compteur + clavier)

À ajouter dans le bloc `<script>` inline (en IIFE ou dans l'init principal) :

```js
(function initRealsCarousel(){
  const reel = document.getElementById('realsScroll');
  const counter = document.getElementById('realsCounter');
  const btnPrev = document.getElementById('realsPrev');
  const btnNext = document.getElementById('realsNext');
  if(!reel) return;

  const cards = reel.querySelectorAll('.real');
  const total = cards.length;

  const getStep = () => {
    const first = cards[0];
    if(!first) return 0;
    const gap = parseFloat(getComputedStyle(reel).gap) || 0;
    return first.getBoundingClientRect().width + gap;
  };

  const currentIndex = () => {
    const step = getStep();
    if(!step) return 0;
    return Math.min(total - 1, Math.max(0, Math.round(reel.scrollLeft / step)));
  };

  const updateCounter = () => {
    const idx = currentIndex() + 1;
    counter.textContent = String(idx).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
    btnPrev.disabled = reel.scrollLeft <= 2;
    btnNext.disabled = reel.scrollLeft + reel.clientWidth >= reel.scrollWidth - 2;
  };

  btnPrev.addEventListener('click', () => reel.scrollBy({left: -getStep(), behavior: 'smooth'}));
  btnNext.addEventListener('click', () => reel.scrollBy({left: getStep(), behavior: 'smooth'}));

  // Clavier quand le carrousel a le focus
  reel.setAttribute('tabindex','0');
  reel.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight'){ e.preventDefault(); reel.scrollBy({left: getStep(), behavior:'smooth'}); }
    if(e.key === 'ArrowLeft'){ e.preventDefault(); reel.scrollBy({left: -getStep(), behavior:'smooth'}); }
    if(e.key === 'Home'){ e.preventDefault(); reel.scrollTo({left: 0, behavior:'smooth'}); }
    if(e.key === 'End'){ e.preventDefault(); reel.scrollTo({left: reel.scrollWidth, behavior:'smooth'}); }
  });

  // Update counter au scroll (throttle natif via rAF)
  let ticking = false;
  reel.addEventListener('scroll', () => {
    if(!ticking){
      requestAnimationFrame(() => { updateCounter(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateCounter, { passive: true });
  updateCounter();
})();
```

---

## 🛠 PATCH 4 — HTML compteur / boutons (vérifier IDs)

Le HTML actuel doit avoir :
```html
<div class="reals__head">
  <div>
    <p class="eyebrow">05 · Preuve</p>
    <h2 class="h1">Treize univers. <em>Treize</em> systèmes sur mesure.</h2>
  </div>
  <div class="reals__nav">
    <span class="reals__counter" id="realsCounter" aria-live="polite" aria-atomic="true">01 / 13</span>
    <button class="reals__arrow" id="realsPrev" type="button" aria-label="Réalisation précédente">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
    </button>
    <button class="reals__arrow" id="realsNext" type="button" aria-label="Réalisation suivante">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
    </button>
  </div>
</div>

<div class="reals__scroll" id="realsScroll" role="region" aria-label="Carrousel des réalisations" aria-roledescription="carrousel">
  <!-- 13 cartes ici -->
</div>
```

**Vérifier** : les IDs `realsScroll`, `realsCounter`, `realsPrev`, `realsNext` existent bien dans le HTML actuel. Sinon les ajouter.

---

## ✅ CHECKLIST POST-PATCH

- [ ] Sur desktop, les 13 cartes s'affichent en ligne horizontale, scroll natif fluide
- [ ] Boutons prev/next font scroller d'**une carte** à la fois (smooth)
- [ ] Compteur `01 / 13` se met à jour au scroll manuel ET aux clics prev/next
- [ ] `Prev` est disabled quand on est tout à gauche, `Next` disabled tout à droite
- [ ] Scroll-snap cale chaque carte au bord gauche
- [ ] Les flèches clavier gauche/droite naviguent quand le carrousel a le focus
- [ ] Swipe tactile fonctionne nativement sur mobile
- [ ] Sur mobile 390px, les cartes font 78vw et se snappent une par une
- [ ] `prefers-reduced-motion` : scroll instantané, pas de transform hover
- [ ] Focus visible (outline cyan) sur chaque élément interactif
- [ ] Chaque carte est cliquable vers `/demo/<slug>/` OU ancre `#reals` (selon disponibilité démos)

---

## 🎯 COMMANDE CLAUDE CODE

```bash
cd C:\Users\Lauralie\Projects\pinapp-site\voyage-v9

claude "Lis PATCH-CARROUSEL.md puis applique les 4 patchs à index.html dans cet ordre : (1) ajoute le bloc CSS du PATCH 1 dans le style inline existant (garde tout le reste intact), (2) remplace chaque <article class='real'> par <a class='real' href='/demo/<slug>/'> en utilisant le mapping slugs du PATCH 2, (3) ajoute l'IIFE initRealsCarousel du PATCH 3 dans le script inline, (4) vérifie que les IDs realsScroll, realsCounter, realsPrev, realsNext matchent le HTML (PATCH 4). Teste mentalement la checklist finale. Ne touche à rien d'autre que la scène 05 et ses styles associés."
```

---

## 🧭 SI LES PAGES /demo/<slug>/ N'EXISTENT PAS EN V9

Trois options :

**Option A — Fallback ancre (recommandée rapide)**
`href="#reals"` sur toutes les cartes + `aria-label` honnête "Aperçu sectoriel — démo non publiée sur ce domaine". L'utilisateur reste dans le carrousel.

**Option B — Modale image**
Chaque carte ouvre une lightbox avec l'image en grand + texte "Démo complète sur pinapp.fr/realisations/<slug>/". Ajoute un minuscule module modale (15 lignes de JS + 30 lignes CSS).

**Option C — Intégrer les vraies démos dans voyage-v9**
Copier les 13 dossiers `demo/<slug>/` du repo principal dans `voyage-v9/demo/`. Le plus propre mais le plus long.

Mon conseil : **Option A pour livrer cette semaine**, Option C à planifier dans une itération suivante.

---

*Patch du 2026-04-23. À appliquer avant de réexécuter l'AUDIT-FINAL.md.*
