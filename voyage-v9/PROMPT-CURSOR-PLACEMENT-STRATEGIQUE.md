# PROMPT CURSOR — PLACEMENT STRATÉGIQUE DES VIDÉOS

> Remplace entièrement la section "Scène 05 Portfolio" du sprint final.
> **Principe** : chaque vidéo/livrable atterrit au bon moment narratif pour renforcer la scène où elle apparaît. Pas de cimetière portfolio.

---

## 🎯 PLACEMENT STRATÉGIQUE VALIDÉ

| Scène | Asset placé | Intention | Signature |
|---|---|---|---|
| 01 Hero | Encart draft "Vidéo présentation Pinapp à produire" | Promesse | DUO |
| **02b Conviction** | **Teaser Star Wars 60s** (`1184294810`) | "L'IA encadrée, c'est ça" | MICHA |
| 03b Preuve auto | 8 workflows n8n (déjà en place) | Preuve technique | LAURALIE |
| **04 Pack Duo** | **Split screen Atelier Rivage + Walker** (`1184294762`) | Parité instantanée | DUO |
| **05 Carrefour** | Mini-hub 3 liens (léger, 1 viewport max) | Index preuves | DUO |
| 05b Aperçus | 13 démos sectorielles (inchangé) | Preuve volume | LAURALIE |
| **05d Films IA** | **Resident Evil** (`1184294871`) + **M&P clip** (`1184294901`) | Gamme cinéma | MICHA |
| **07 Qui sommes-nous** | **Encart voyage-v9 méta** sous bio Lauralie | Preuve live sous la créatrice | LAURALIE |
| **11 Manifeste** | **Star Wars film 3min climax** (`1184294831`) | Émotion chaude | MICHA |
| **11→13 transition** | **CTA "Jouer dans un film"** | Conversion AVANT prix | DUO |

**Parité** : 4 preuves Lauralie (workflows + Atelier Rivage + 13 démos + voyage-v9 méta) vs 5 preuves cinéma Micha (4 vidéos) — **parité d'impact**.

---

## 📋 INSTRUCTIONS DÉTAILLÉES

### FIX 1 — Scène 01 Hero : encart draft vidéo présentation

Ajouter un encart draft (invisible en prod) qui signale la future vidéo hero :

```html
<div class="placeholder-asset placeholder-asset--hero" aria-hidden="true">
  <p class="placeholder-asset__label">Vidéo de présentation Pinapp — 5ème Vimeo à produire</p>
  <p class="placeholder-asset__specs">→ teaser 45-60s cinematic · upload Vimeo → VIMEO_ID à remplir · autoplay muted loop hero · fallback hero-1.webp</p>
</div>
```

Les `<video>` actuellement en hero (utilisant `01-main-hologramme.mp4`) et contact (`08-atterrissage-sable.mp4`) sont **retirés**. Les photos hero-1 et hero-6 pures remplacent via le stage fixe.

---

### FIX 2 — Scène 02b Conviction : embed teaser Star Wars 60s

Dans la scène 02b Conviction (nouvellement créée), après le H2 "L'IA n'est pas une mode passagère", ajouter un embed Vimeo lite cliquable du teaser Star Wars 60s :

```html
<div class="conviction-proof">
  <p class="eyebrow">Preuve par l'image</p>
  <article class="port port--conviction" data-vimeo="1184294810">
    <div class="port__media">
      <img class="port__poster" loading="lazy" src="https://vumbnail.com/1184294810_large.jpg" alt="Star Wars — The Power of Female Unity (teaser 60s signé Micha, preuve IA encadrée)">
      <button class="port__play" type="button" aria-label="Lire le teaser Star Wars 60 secondes">
        <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg>
      </button>
    </div>
    <div class="port__body">
      <span class="port__tag" style="background:linear-gradient(135deg,#1a1a2e,#3ef5e0);color:#050b14">TEASER · 60s · SIGNÉ MICHA</span>
      <p class="port__caption">60 secondes qui prouvent notre approche : <em>Star Wars — The Power of Female Unity</em>. Signé Micha, monté IA, scénarisé Pinapp.</p>
    </div>
  </article>
</div>
```

CSS :
```css
.conviction-proof{max-width:960px;margin:var(--space-5) auto 0}
.port--conviction{border:1px solid var(--or);background:rgba(230,185,115,.06)}
.port--conviction .port__media{aspect-ratio:16/9}
.port--conviction .port__play{width:96px;height:96px}
.port--conviction .port__caption{font-family:var(--serif);font-style:italic;font-size:clamp(1rem,1.4vw,1.25rem);line-height:1.5;color:var(--ivoire-dim)}
.port--conviction .port__caption em{color:var(--or)}
```

---

### FIX 3 — Scène 04 Pack Duo : split screen Atelier Rivage + Walker

Dans la scène 04 Pack Duo, **après** le split textuel "Lauralie apporte / Micha apporte" et **avant** le prix 3 900 € HT, ajouter une bande visuelle split screen qui matérialise la parité :

```html
<div class="duo-proof">
  <p class="eyebrow" style="text-align:center">La parité en action</p>
  <div class="duo-proof__split">
    <!-- Côté Lauralie : Atelier Rivage -->
    <a class="port port--proof" href="/demo/atelier-rivage/" target="_blank" rel="noopener noreferrer">
      <div class="port__media">
        <img class="port__poster" loading="lazy" src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80" alt="Atelier Rivage — site architecte live signé Lauralie">
        <span class="port__live"><span class="port__dot"></span>DÉMO LIVE</span>
      </div>
      <div class="port__body">
        <span class="port__tag" style="background:#c4a77d;color:#1a1408">SITE · LAURALIE</span>
        <p class="port__caption">Atelier Rivage — <em>un site client</em> livré en 10 jours.</p>
      </div>
    </a>
    <!-- Côté Micha : Walker -->
    <article class="port port--proof" data-vimeo="1184294762">
      <div class="port__media">
        <img class="port__poster" loading="lazy" src="https://vumbnail.com/1184294762_large.jpg" alt="Walker — western IA signé Micha">
        <button class="port__play" type="button" aria-label="Lire Walker">
          <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg>
        </button>
      </div>
      <div class="port__body">
        <span class="port__tag" style="background:#c4622d">FILM IA · MICHA</span>
        <p class="port__caption">Walker — <em>un univers cinéma</em> généré et monté.</p>
      </div>
    </article>
  </div>
</div>
```

CSS :
```css
.duo-proof{margin:var(--space-5) auto;max-width:1200px}
.duo-proof__split{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-top:var(--space-3)}
.port--proof{text-decoration:none;color:inherit;position:relative;overflow:hidden;border-radius:4px;background:var(--nuit-2);border:1px solid var(--fumee);transition:transform .4s,border-color .4s}
.port--proof:hover{transform:translateY(-3px);border-color:var(--or)}
.port--proof .port__media{aspect-ratio:16/10;position:relative}
.port--proof .port__caption{font-family:var(--serif);font-style:italic;font-size:.9375rem;color:var(--ivoire-dim);margin:0}
.port--proof .port__caption em{color:var(--or)}
@media (max-width:900px){.duo-proof__split{grid-template-columns:1fr}}
```

---

### FIX 4 — Scène 05 "Portfolio" devient un CARREFOUR léger

**SUPPRIMER** tout le contenu actuel du portfolio monolithique (ancienne structure avec 5 cartes Vimeo + Atelier Rivage). Le remplacer par un **carrefour de 3 liens** (1 viewport max) qui renvoie vers les preuves dispersées dans le site :

```html
<section class="scene" id="s05" data-scene-id="05" aria-labelledby="s05-h">
  <div class="container">
    <p class="eyebrow">05 · Nos réalisations</p>
    <h2 id="s05-h" class="h1">Ce qui se <em>voit</em>. Ce qui <em>tourne</em>. Ce qui se <em>raconte</em>.</h2>
    <p class="lead">Nos preuves sont dispersées dans ce site pour prouver par l'exemple — pas empilées dans un portfolio.</p>
    <nav class="carrefour-nav">
      <a class="carrefour-card" href="#s07">
        <span class="carrefour-card__tag">CE QUI SE VOIT</span>
        <h3 class="carrefour-card__title">Ce site <em>lui-même</em></h3>
        <p>Voyage-v9 : single-file HTML cinématique signé Lauralie.</p>
        <span class="carrefour-card__link">Remonter au duo ↑</span>
      </a>
      <a class="carrefour-card" href="#s05b">
        <span class="carrefour-card__tag">CE QUI TOURNE</span>
        <h3 class="carrefour-card__title">13 aperçus <em>sectoriels</em> + 8 workflows</h3>
        <p>Gabarits prêts-à-déployer + automatisations qui tournent chez nous.</p>
        <span class="carrefour-card__link">Voir les aperçus ↓</span>
      </a>
      <a class="carrefour-card" href="#s11">
        <span class="carrefour-card__tag">CE QUI SE RACONTE</span>
        <h3 class="carrefour-card__title">Les films <em>signés Micha</em></h3>
        <p>Teaser, western, horreur, clip — et le climax Star Wars 3min.</p>
        <span class="carrefour-card__link">Descendre au manifeste ↓</span>
      </a>
    </nav>
  </div>
</section>
```

CSS :
```css
.carrefour-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3);margin-top:var(--space-5)}
.carrefour-card{display:flex;flex-direction:column;gap:.75rem;padding:var(--space-4);background:rgba(10,20,32,.5);border:1px solid var(--fumee);border-radius:4px;text-decoration:none;color:inherit;transition:transform .35s,border-color .35s}
.carrefour-card:hover{transform:translateY(-3px);border-color:var(--or)}
.carrefour-card__tag{font-family:var(--sans);font-size:.6875rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--or)}
.carrefour-card__title{font-family:var(--sans);font-weight:500;font-size:clamp(1.25rem,1.8vw,1.625rem);margin:0;line-height:1.2}
.carrefour-card__title em{font-family:var(--serif);font-style:italic;color:var(--or)}
.carrefour-card p{font-family:var(--sans);font-size:.9375rem;line-height:1.5;color:var(--ivoire-dim);margin:0}
.carrefour-card__link{margin-top:auto;font-family:var(--sans);font-size:.8125rem;color:var(--cyan);letter-spacing:.04em}
@media (max-width:900px){.carrefour-nav{grid-template-columns:1fr}}
```

---

### FIX 5 — Scène 05d Films IA : intégrer Resident Evil + M&P clip

Dans la scène 05d Films IA actuelle (4 tiers tarifaires), ajouter une petite galerie preuve **au-dessus** des 4 tiers : 2 tuiles Vimeo (Resident Evil + M&P clip) qui illustrent la gamme :

```html
<div class="films-gallery">
  <p class="eyebrow">La gamme</p>
  <div class="films-gallery__grid">
    <article class="port port--gallery-tile" data-vimeo="1184294871">
      <div class="port__media">
        <img class="port__poster" loading="lazy" src="https://vumbnail.com/1184294871_large.jpg" alt="Resident Evil — extrait horreur IA">
        <button class="port__play" type="button" aria-label="Lire Resident Evil"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg></button>
      </div>
      <span class="port__tag" style="background:#8b1e2e">HORREUR</span>
    </article>
    <article class="port port--gallery-tile" data-vimeo="1184294901">
      <div class="port__media">
        <img class="port__poster" loading="lazy" src="https://vumbnail.com/1184294901_large.jpg" alt="Mémoire & Présence — clip cinéma">
        <button class="port__play" type="button" aria-label="Lire Mémoire & Présence clip"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg></button>
    </div>
      <span class="port__tag" style="background:#2d6a4f">EXTRAIT CINÉMA</span>
    </article>
  </div>
</div>
```

Placer **avant** la grille `.films-grid` des 4 tiers tarifaires.

CSS :
```css
.films-gallery{margin-bottom:var(--space-5)}
.films-gallery__grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-top:var(--space-3)}
.port--gallery-tile{position:relative;overflow:hidden;border-radius:4px}
.port--gallery-tile .port__media{aspect-ratio:16/9}
.port--gallery-tile .port__tag{position:absolute;top:14px;left:14px;padding:.35rem .75rem;border-radius:100px;font-family:var(--sans);font-size:.6875rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#fff}
@media (max-width:640px){.films-gallery__grid{grid-template-columns:1fr}}
```

---

### FIX 6 — Scène 07 Qui sommes-nous : encart voyage-v9 méta

Dans la scène 07 Qui sommes-nous, **dans la carte .duo__body de Lauralie** (côté gauche), ajouter juste après la liste des skills, **avant** la meta Bordeaux/France :

```html
<div class="duo__proof-meta">
  <p class="duo__proof-caption"><em>Ce site que vous parcourez</em> est sa démo.</p>
  <a href="#s01" class="duo__proof-link">Remonter au voyage ↑</a>
</div>
```

CSS :
```css
.duo__proof-meta{padding:var(--space-3);background:rgba(230,185,115,.06);border-left:2px solid var(--or);margin-top:var(--space-2)}
.duo__proof-caption{font-family:var(--serif);font-style:italic;font-size:1rem;color:var(--ivoire);margin:0 0 .35rem}
.duo__proof-caption em{color:var(--or)}
.duo__proof-link{font-family:var(--sans);font-size:.8125rem;color:var(--cyan);text-decoration:none;border-bottom:1px solid rgba(62,245,224,.4);padding-bottom:.15rem}
```

---

### FIX 7 — Scène 11 Manifeste : climax Star Wars 3min + CTA

La scène 11 Manifeste accueille maintenant le **climax cinématique Star Wars 3min**. Structure :

```html
<section class="scene" id="s11" data-scene-id="11" aria-labelledby="s11-h">
  <div class="container">
    <p class="eyebrow">11 · Manifeste</p>

    <!-- Citation manifeste (existante) -->
    <h2 id="s11-h" class="manifesto__quote">« Nous avons construit ces outils pour nous d'abord. Pour gérer notre propre complexité. Aujourd'hui, nous les construisons pour vous. »</h2>
    <p class="manifesto__sig">— Lauralie &amp; Micha</p>

    <!-- CLIMAX VIDÉO -->
    <article class="port port--climax" data-vimeo="1184294831">
      <p class="portfolio__act-label"><em>Climax</em> — Trois minutes. Un univers. Un homme face à sa destinée.</p>
      <div class="port__media">
        <img class="port__poster" loading="lazy" src="https://vumbnail.com/1184294831_large.jpg" alt="Star Wars — combat final 3 minutes, film complet co-signé Pinapp">
        <button class="port__play" type="button" aria-label="Lire le film complet Star Wars (3 minutes)">
          <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/><path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/></svg>
        </button>
      </div>
      <div class="port__body">
        <span class="port__tag" style="background:linear-gradient(135deg,#c41e3a,#e6b973)">FILM COMPLET · 3 MIN · CO-SIGNÉ PINAPP</span>
        <div class="port__cta-gift">
          <p class="port__cta-manifesto"><em>Lauralie a construit</em> le site. <em>Micha a monté</em> le film. <em>Vous</em>, vous jouez dedans.</p>
          <a class="btn btn--primary" href="/realisations/films-ia/">Jouer dans un film monté par un cinéaste professionnel →</a>
        </div>
      </div>
    </article>
  </div>
</section>
```

Le CTA "Jouer dans un film" vit ici — **avant** les tarifs scène 13. L'émotion chaude ouvre la porte, le prix justifie ensuite.

---

### FIX 8 — Retirer la scène 05d "Films IA tiers" ailleurs ou la garder en 13c ?

Les 4 tiers tarifaires films IA (Film cadeau 390 € / Clip 550 € / Court-métrage 1290 € / Premium 2800 €) peuvent :
- **Option A** : rester en scène 05d (après le carrefour léger) → cohérent avec la promesse du carrefour
- **Option B** : déplacés après la scène 13 Tarifs comme "13c · Films IA tarifs" → regroupe tous les prix

**Choix recommandé** : **Option A** (rester en 05d juste après le carrefour, enrichie de la galerie 2 tuiles preuve cf FIX 5). Le parcours tarifaire se lit mieux quand films IA sont vus avec un exemple AVANT le tableau final.

---

## 📊 FLUX NARRATIF RÉSULTANT

```
01 Hero (promesse cinéma, encart vidéo à produire)
02 Constat (douleur TPE/PME)
02b Conviction (TEASER STAR WARS 60s = preuve)
03 Services
03b Preuve automatisations (workflows Lauralie)
04 Pack Duo (split Atelier Rivage + Walker)
05 Carrefour léger (3 liens vers preuves dispersées)
05b Aperçus sectoriels (13 démos)
05d Films IA (galerie RE + M&P + 4 tiers + CTA /realisations/)
06 Méthode
07 Qui sommes-nous (encart voyage-v9 méta sous Lauralie)
08 Valeurs
09 Engagements
10 Refus
11 MANIFESTE + CLIMAX STAR WARS 3min + CTA "Jouer dans un film"
12 Mémoire & Présence
12b Branche sœur (M&P uniquement)
13 Tarifs
13b FAQ
14 Contact + Cal.com
```

---

## 🎯 COMMANDE CURSOR

```
Lis voyage-v9/PROMPT-CURSOR-PLACEMENT-STRATEGIQUE.md et applique les 8 FIXES dans l'ordre. 

Règles immuables :
- Photos hero intouchables
- Stage fixe intouchable
- Vanilla JS + Bunny Fonts only
- Voix (nous/je, interdits), rel noopener noreferrer, prefers-reduced-motion

Après les FIXES, appliquer aussi les FIXES 1, 2, 4-14 du PROMPT-CURSOR-SPRINT-FINAL.md (retrait Auralis, liens légaux, mode sobre, Twitter Card, Conviction, backdrop-filter, reduced-motion wrap, skip link, burger mobile, labels form).

Commit : "feat(voyage-v9): placement stratégique vidéos + sprint final fixes"
```

---

*Placement stratégique validé par agent stratège narratif. 2026-04-24.*
