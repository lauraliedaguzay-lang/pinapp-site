# PATCH RÉALISATIONS V2 — voyage-v9 (remplace PATCH-CARROUSEL.md)

> Correction majeure : les 13 "réalisations" actuelles sont des **aperçus sectoriels**, pas de vraies réalisations.
> Les VRAIES réalisations Pinapp sont dans `assets/data/realisations.json`.

---

## 🎯 LES 5 VRAIES RÉALISATIONS (source : `assets/data/realisations.json`)

| # | Titre | Type | Lien / Vimeo ID | À featurer ? |
|---|---|---|---|---|
| 1 | **Atelier Rivage** | Site web | `/demo/atelier-rivage/` | 🏛 FEATURED — site architecte |
| 2 | **Walker** | Film IA western | Vimeo `1184294762` | La "vidéo Texas" |
| 3 | **Star Wars — The Power of Female Unity** | Film IA sci-fi | Vimeo `1184294810` | 🌌 **HERO** — à mettre en avant |
| 4 | **Resident Evil** | Film IA horreur | Vimeo `1184294871` | — |
| 5 | **Mémoire & Présence — clip** | Extrait cinéma | Vimeo `1184294901` | — |

Confirmation "Walker = Texas" : dans `diagnostic/index.html` ligne 592, le champ "Western (Walker, Django…)" confirme la catégorie. Dans `films-ia/index.html` ligne 244 : « Action, sci-fi, **western**, horreur, fantaisie, comédie ». **Walker est bien la vidéo western/Texas.**

---

## 🏗 NOUVELLE STRUCTURE — SCÈNE 05

```
┌───────────────────────────────────────────────────────┐
│  05 · RÉALISATIONS                                    │
│                                                       │
│  ┌──────────────────────┐ ┌───────────────┐           │
│  │   STAR WARS (HERO)   │ │   WALKER      │           │
│  │   Vimeo 1184294810   │ │   Vimeo Western│          │
│  │   2×2 cell (plein)   │ │               │           │
│  └──────────────────────┘ ├───────────────┤           │
│                           │ RESIDENT EVIL │           │
│                           │               │           │
│                           └───────────────┘           │
│  ┌──────────────────────┐ ┌───────────────┐           │
│  │   ATELIER RIVAGE     │ │   M&P CLIP    │           │
│  │   Site archi · LIVE  │ │   Vimeo       │           │
│  └──────────────────────┘ └───────────────┘           │
│                                                       │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─       │
│                                                       │
│  05b · APERÇUS SECTORIELS DISPONIBLES                 │
│  Sous-titre : Ces 13 aperçus illustrent ce que nous    │
│  déployons par secteur — ils ne sont pas des sites     │
│  livrés. (honnêteté règle .cursorrules)               │
│                                                       │
│  [ Carrousel horizontal 13 cartes — patch précédent ] │
└───────────────────────────────────────────────────────┘
```

### Rationale
- **Honnêteté** : on arrête d'appeler les 13 démos "réalisations". On les appelle "aperçus sectoriels" (ce qu'ils sont).
- **Star Wars en hero** : plus gros placement visuel → directive Lauralie verbatim « la bande annonce star wars à mettre en avant ».
- **Atelier Rivage promoted** : badge "Voir le site live" → directive Lauralie verbatim « mon site d'architecte pareil ».
- **Les 13 aperçus restent** : ils servent de proof-of-concept sectoriel, juste bien cadrés.

---

## 🛠 PATCH 1 — HTML portfolio (remplace la grille 13 cartes)

Remplacer tout le contenu actuel de la scène 05 (entre `<section id="s05">` et `</section>`) par :

```html
<section class="scene" id="s05" data-scene-id="05" aria-labelledby="s05-h">
  <div class="container">
    <div class="reals__head">
      <div>
        <p class="eyebrow">05 · Réalisations</p>
        <h2 id="s05-h" class="h1">Ce que nous avons <em>déjà</em> construit.</h2>
        <p class="lead">Films IA signés Micha, sites signés Lauralie. Vimeo et démos live.</p>
      </div>
    </div>

    <!-- Portfolio grid : Star Wars hero + 4 cartes -->
    <div class="portfolio">

      <!-- STAR WARS — HERO (span 2 col) -->
      <article class="port port--hero" data-vimeo="1184294810">
        <div class="port__media">
          <img class="port__poster" loading="lazy"
               src="https://vumbnail.com/1184294810_large.jpg"
               alt="Star Wars — The Power of Female Unity (teaser Pinapp)">
          <button class="port__play" type="button" aria-label="Lire Star Wars — The Power of Female Unity">
            <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg>
          </button>
        </div>
        <div class="port__body">
          <span class="port__tag" style="background:linear-gradient(135deg,#1a1a2e,#3ef5e0);color:#050b14">FILM IA · SCI-FI</span>
          <h3 class="port__title">Star Wars — <em>The Power of Female Unity</em></h3>
          <p class="port__sub">Bande-annonce IA · réalisation Micha</p>
        </div>
      </article>

      <!-- WALKER -->
      <article class="port" data-vimeo="1184294762">
        <div class="port__media">
          <img class="port__poster" loading="lazy"
               src="https://vumbnail.com/1184294762_large.jpg"
               alt="Walker — Western Christian Remake (film IA Pinapp)">
          <button class="port__play" type="button" aria-label="Lire Walker"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg></button>
        </div>
        <div class="port__body">
          <span class="port__tag" style="background:#c4622d">FILM IA · WESTERN</span>
          <h3 class="port__title">Walker</h3>
          <p class="port__sub">Western IA · réalisation Micha</p>
        </div>
      </article>

      <!-- RESIDENT EVIL -->
      <article class="port" data-vimeo="1184294871">
        <div class="port__media">
          <img class="port__poster" loading="lazy"
               src="https://vumbnail.com/1184294871_large.jpg"
               alt="Resident Evil — extrait film IA Pinapp">
          <button class="port__play" type="button" aria-label="Lire Resident Evil"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg></button>
        </div>
        <div class="port__body">
          <span class="port__tag" style="background:#8b1e2e">FILM IA · HORREUR</span>
          <h3 class="port__title">Resident Evil</h3>
          <p class="port__sub">Extrait · réalisation Micha</p>
        </div>
      </article>

      <!-- ATELIER RIVAGE — site archi -->
      <a class="port port--site" href="/demo/atelier-rivage/" target="_blank" rel="noopener">
        <div class="port__media">
          <img class="port__poster" loading="lazy"
               src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
               alt="Atelier Rivage — site architecte (démo live)">
          <span class="port__live"><span class="port__dot"></span>DÉMO LIVE</span>
        </div>
        <div class="port__body">
          <span class="port__tag" style="background:#c4a77d;color:#1a1408">SITE · ARCHITECTE</span>
          <h3 class="port__title">Atelier Rivage</h3>
          <p class="port__sub">Vitrine cabinet · réalisation Lauralie</p>
        </div>
      </a>

      <!-- MÉMOIRE & PRÉSENCE -->
      <article class="port" data-vimeo="1184294901">
        <div class="port__media">
          <img class="port__poster" loading="lazy"
               src="https://vumbnail.com/1184294901_large.jpg"
               alt="Mémoire & Présence — clip Pinapp">
          <button class="port__play" type="button" aria-label="Lire Mémoire & Présence — clip"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg></button>
        </div>
        <div class="port__body">
          <span class="port__tag" style="background:#2d6a4f">EXTRAIT CINÉMA</span>
          <h3 class="port__title">Mémoire &amp; Présence — clip</h3>
          <p class="port__sub">Projet à part · Pinapp M&amp;P</p>
        </div>
      </article>

    </div>

    <!-- Sous-titre séparateur -->
    <div class="apercus-head">
      <p class="eyebrow">05b · Aperçus sectoriels</p>
      <h3 class="h2">Treize terrains de jeu <em>par secteur</em>.</h3>
      <p class="lead">Démos construites pour montrer ce que nous déployons sur des TPE/PME. <strong>Ce ne sont pas des sites clients livrés</strong> — juste des aperçus de la méthode sectorielle.</p>
    </div>

    <!-- Carrousel 13 aperçus : GARDER la structure actuelle ici -->
    <!-- cf PATCH-CARROUSEL.md précédent pour le CSS + JS -->
    <div class="reals__head" style="margin-top:var(--space-4)">
      <div></div>
      <div class="reals__nav">
        <span class="reals__counter" id="realsCounter" aria-live="polite" aria-atomic="true">01 / 13</span>
        <button class="reals__arrow" id="realsPrev" type="button" aria-label="Aperçu précédent">‹</button>
        <button class="reals__arrow" id="realsNext" type="button" aria-label="Aperçu suivant">›</button>
      </div>
    </div>
    <div class="reals__scroll" id="realsScroll" role="region" aria-label="Aperçus sectoriels" aria-roledescription="carrousel">
      <!-- 13 cartes aperçu existantes — conserver tel quel -->
    </div>
  </div>
</section>
```

---

## 🛠 PATCH 2 — CSS portfolio

```css
/* === PORTFOLIO (5 vraies réalisations) === */
.portfolio{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  grid-auto-rows:minmax(240px,auto);
  gap:var(--space-3);
  margin-bottom:var(--space-6)
}

.port{
  position:relative;display:flex;flex-direction:column;
  background:var(--nuit-2);border:1px solid var(--fumee);
  border-radius:4px;overflow:hidden;
  text-decoration:none;color:inherit;cursor:pointer;
  transition:transform .45s var(--ease),border-color .45s
}
.port:hover{transform:translateY(-3px);border-color:var(--fumee-2)}
.port:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}

/* Star Wars = 2 colonnes × 2 rangées */
.port--hero{grid-column:span 2;grid-row:span 2}

.port__media{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--nuit)}
.port--hero .port__media{aspect-ratio:16/9}

.port__poster{
  width:100%;height:100%;object-fit:cover;
  filter:grayscale(10%) contrast(1.05) brightness(.88);
  transition:transform .8s var(--ease),filter .6s
}
.port:hover .port__poster{transform:scale(1.04);filter:grayscale(0) brightness(.95)}

.port__play{
  position:absolute;inset:0;margin:auto;
  width:72px;height:72px;border-radius:50%;
  color:var(--ivoire);background:transparent;
  display:grid;place-items:center;cursor:pointer;
  transition:transform .3s,color .3s
}
.port--hero .port__play{width:96px;height:96px}
.port:hover .port__play{color:var(--or);transform:scale(1.08)}
.port__play svg{width:100%;height:100%}

.port__live{
  position:absolute;top:14px;right:14px;
  padding:.35rem .75rem;border-radius:100px;
  font-family:var(--sans);font-size:.6875rem;font-weight:600;
  letter-spacing:.12em;text-transform:uppercase;color:var(--ivoire);
  background:rgba(5,11,20,.65);backdrop-filter:blur(4px);
  display:inline-flex;align-items:center;gap:.4rem
}
.port__dot{width:8px;height:8px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan);animation:pulse 2.4s ease-in-out infinite}

.port__body{padding:var(--space-3);display:flex;flex-direction:column;gap:.4rem}
.port__tag{
  align-self:flex-start;padding:.3rem .7rem;border-radius:100px;
  font-family:var(--sans);font-size:.625rem;font-weight:600;
  letter-spacing:.12em;text-transform:uppercase;color:#fff
}
.port__title{font-family:var(--sans);font-weight:500;font-size:clamp(1.125rem,1.6vw,1.5rem);letter-spacing:-0.01em;margin:0}
.port__title em{font-family:var(--serif);font-style:italic;color:var(--or)}
.port--hero .port__title{font-size:clamp(1.5rem,2.4vw,2.25rem)}
.port__sub{font-family:var(--sans);font-size:.875rem;color:var(--ivoire-dim);margin:0}

/* État "playing" — iframe Vimeo injectée */
.port.is-playing .port__poster,
.port.is-playing .port__play{display:none}
.port__iframe{position:absolute;inset:0;width:100%;height:100%;border:0}

/* Séparateur aperçus */
.apercus-head{margin:var(--space-6) 0 var(--space-4);text-align:center;max-width:52ch;margin-left:auto;margin-right:auto}
.apercus-head .lead strong{color:var(--or)}

/* Responsive */
@media (max-width:900px){
  .portfolio{grid-template-columns:repeat(2,1fr)}
  .port--hero{grid-column:span 2;grid-row:span 1}
}
@media (max-width:540px){
  .portfolio{grid-template-columns:1fr}
  .port--hero{grid-column:span 1}
}

@media (prefers-reduced-motion:reduce){
  .port,.port__poster,.port:hover .port__poster,.port:hover .port__play{transition:none;transform:none}
}
```

---

## 🛠 PATCH 3 — JS lite Vimeo (click to play, pas d'iframe tant qu'on ne clique pas)

```js
(function initPortfolioVimeo(){
  document.querySelectorAll('.port[data-vimeo]').forEach(card => {
    const play = card.querySelector('.port__play');
    const id = card.dataset.vimeo;
    if(!play || !id) return;

    const activate = () => {
      if(card.classList.contains('is-playing')) return;
      card.classList.add('is-playing');
      const iframe = document.createElement('iframe');
      iframe.className = 'port__iframe';
      iframe.src = `https://player.vimeo.com/video/${id}?dnt=1&autoplay=1&title=0&byline=0&portrait=0`;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.loading = 'lazy';
      iframe.title = card.querySelector('.port__title')?.textContent || 'Vidéo Pinapp';
      card.querySelector('.port__media').appendChild(iframe);
      if(window.plausible) plausible('Portfolio-Play', { props:{ id } });
    };
    play.addEventListener('click', activate);
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(); }
    });
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
  });
})();
```

Avantages :
- **Pas d'iframe Vimeo chargée au boot** → gain énorme de LCP et CLS
- **Poster image = `vumbnail.com/<id>_large.jpg`** (service gratuit qui renvoie le thumb Vimeo en 640×360)
- **Click-to-play** → respecte la confidentialité (pas de pixel Vimeo avant consentement implicite)
- **Tracking Plausible** : event `Portfolio-Play` avec l'id Vimeo

---

## ✅ CHECKLIST POST-PATCH

- [ ] Star Wars affiché en hero (grid 2×2), visible dès l'ouverture de la scène 05
- [ ] Walker affiché (vidéo Texas confirmée — demander à Lauralie si on ajoute la mention "Walker / Texas" dans le sub)
- [ ] Atelier Rivage avec badge "DÉMO LIVE" qui pointe vers `/demo/atelier-rivage/`
- [ ] Clic sur play → iframe Vimeo se charge uniquement à ce moment
- [ ] Poster images = vumbnail.com (sinon poster local si Lauralie a des stills)
- [ ] Titre "Ce que nous avons déjà construit" (honnête vs les 13 aperçus)
- [ ] Séparateur "Aperçus sectoriels — ce ne sont pas des sites clients livrés" visible
- [ ] Carrousel 13 aperçus conservé DESSOUS avec le CSS+JS du PATCH-CARROUSEL précédent
- [ ] Sur mobile, le hero Star Wars passe à 1 colonne

---

## 🧭 DÉCISIONS À CONFIRMER AVEC LAURALIE

1. **Walker = "vidéo Texas" ?** ou il y a une AUTRE vidéo western/Texas ailleurs ? (Confirmer)
2. **Posters Vimeo** : OK avec `vumbnail.com/{id}_large.jpg` (service gratuit, fetch les thumbs Vimeo officiels) ou tu préfères fournir des stills custom dans `assets/micha/` ?
3. **Atelier Rivage poster** : utiliser `/demo/atelier-rivage/` screenshot réel (Lauralie peut-elle fournir `assets/atelier-rivage-poster.webp` ?) ou garder un Unsplash générique architecture ?
4. **Ordre** : Star Wars en hero + Walker / Resident Evil / Atelier Rivage / M&P → OK ou autre hiérarchie ?
5. **CTA global** : ajouter `Voir tout le portfolio →` qui pointe vers `/realisations/` ?

---

## 🎯 COMMANDE CLAUDE CODE

```bash
cd C:\Users\Lauralie\Projects\pinapp-site\voyage-v9

claude "Lis PATCH-REALISATIONS-V2.md puis applique-le à index.html :
(1) réécris entièrement la scène 05 avec la structure portfolio + sous-section aperçus sectoriels,
(2) insère les 5 cartes du PATCH 1 (Star Wars en hero span 2×2, Walker, Resident Evil, Atelier Rivage avec lien /demo/atelier-rivage/, M&P),
(3) ajoute le CSS .portfolio / .port / .port--hero du PATCH 2 dans le style inline,
(4) ajoute le JS initPortfolioVimeo du PATCH 3 au script inline (lite-vimeo click-to-play),
(5) garde le carrousel 13 aperçus sectoriels DESSOUS avec son CSS/JS existant (du PATCH-CARROUSEL précédent si pas encore appliqué),
(6) change l'eyebrow de la scène en 'Réalisations' (plus 'Preuve') et le H2 en 'Ce que nous avons déjà construit.'.
Ne touche à aucune autre scène."
```

---

*Patch du 2026-04-23. Source canonique : `assets/data/realisations.json`. Remplace PATCH-CARROUSEL.md pour la partie portfolio — le carrousel 13 aperçus reste valide en complément.*
