# PATCH — Micha vidéaste événementiel Nouvelle-Aquitaine

> Ajout ciblé pour intégrer la vraie offre événementielle de Micha (séminaires, anniversaires, captation diverse) au site voyage-v9 + formulaire cohérent.

---

## 🎥 CE QUE FAIT MICHA (rappel complet)

| Activité | Modalité | Tarif |
|---|---|---|
| **Films IA online** (Star Wars, Walker, etc.) | Production à distance | 390 / 550 / 1 290 / 2 800 € HT |
| **🆕 Séminaires d'entreprise** | Déplacement Nouvelle-Aquitaine | **Sur devis** |
| **🆕 Anniversaires / événements privés** | Déplacement Nouvelle-Aquitaine | **Sur devis** |
| **🆕 Captation diverse** (mariages, festivals, conférences) | Déplacement Nouvelle-Aquitaine | **Sur devis** |
| Photos pro / shootings | Studio ou déplacement | Sur devis |
| Direction artistique / branding Adobe | À distance ou sur site | Sur devis |

---

## 🎯 PATCH EN 3 POINTS

### 1. Scène 03 Direction artistique (accordion métier) — enrichir

Dans la carte `<details class="metier">` du métier DA, remplacer le `<div class="metier__body">` par :

```html
<div class="metier__body">
  <div class="metier__proof">
    <div class="films-mini-grid">
      <img src="https://vumbnail.com/1184294810_large.jpg" alt="Star Wars teaser" loading="lazy">
      <img src="https://vumbnail.com/1184294762_large.jpg" alt="Walker Western" loading="lazy">
      <img src="https://vumbnail.com/1184294871_large.jpg" alt="Resident Evil" loading="lazy">
      <img src="https://vumbnail.com/1184294901_large.jpg" alt="M&P clip" loading="lazy">
    </div>
  </div>
  <div class="metier__meta">
    <p><strong>Vidéaste professionnel.</strong> Studio à Bordeaux, déplacement Nouvelle-Aquitaine.</p>
    <ul class="metier__list">
      <li>Films IA online (4 tiers 390 → 2 800 €)</li>
      <li>Séminaires d'entreprise · <em>sur devis</em></li>
      <li>Anniversaires / événements privés · <em>sur devis</em></li>
      <li>Captation diverse (mariages, festivals) · <em>sur devis</em></li>
      <li>Photos pro, shootings, branding Adobe</li>
    </ul>
    <a class="btn btn--secondary" href="#s05d">Voir les films IA →</a>
    <a class="btn btn--secondary" href="#s05f">Voir l'événementiel →</a>
  </div>
</div>
```

CSS :
```css
.metier__list{list-style:none;padding:0;margin:var(--space-2) 0 0;display:flex;flex-direction:column;gap:.4rem;font-family:var(--sans);font-size:.875rem;color:var(--ivoire-dim)}
.metier__list li{position:relative;padding-left:1rem}
.metier__list li::before{content:"";position:absolute;left:0;top:.65em;width:6px;height:1px;background:var(--or)}
.metier__list li em{font-family:var(--serif);font-style:italic;color:var(--or)}
```

---

### 2. Nouvelle scène 05f — Événementiel Nouvelle-Aquitaine

Insérer **après** la scène 05d Films IA (tiers online) et **avant** la scène 05e Formations :

```html
<section class="scene" id="s05f" data-stage="04" aria-labelledby="s05f-h">
  <div class="container">
    <p class="eyebrow">05f · Événementiel vidéo</p>
    <h2 id="s05f-h" class="h1">Micha se déplace. <em>Nouvelle-Aquitaine.</em></h2>
    <p class="lead">Séminaires, anniversaires, événements professionnels ou privés. Prestations sur devis.</p>

    <div class="event-grid">

      <!-- Carte 1 : Séminaire entreprise -->
      <article class="event-card">
        <div class="event-card__visual">
          <div class="placeholder-asset placeholder-asset--event" aria-hidden="true">
            <p class="placeholder-asset__label">Exemple de captation séminaire d'entreprise</p>
            <p class="placeholder-asset__specs">→ assets/evenement/seminaire-entreprise.webp · 1200×800 · ≤ 180 Ko · capture vidéo Micha d'une vraie intervention</p>
          </div>
        </div>
        <div class="event-card__body">
          <span class="event-card__tag" style="background:#2d6a4f;color:#fff">PROFESSIONNEL</span>
          <h3 class="event-card__title">Séminaire <em>d'entreprise</em></h3>
          <p class="event-card__desc">Captation complète : keynotes, tables rondes, interviews, ambiance, plan large · montage livré sous 10 jours.</p>
          <ul class="event-card__includes">
            <li>Déplacement Nouvelle-Aquitaine inclus</li>
            <li>Matériel pro (caméra, son, éclairage)</li>
            <li>Montage + étalonnage</li>
            <li>Diffusion sur votre site / LinkedIn / YouTube</li>
          </ul>
          <p class="event-card__price">Sur devis · <a href="#s14">demander un chiffrage →</a></p>
        </div>
      </article>

      <!-- Carte 2 : Anniversaire / événement privé -->
      <article class="event-card">
        <div class="event-card__visual">
          <div class="placeholder-asset placeholder-asset--event" aria-hidden="true">
            <p class="placeholder-asset__label">Exemple de captation anniversaire / événement privé</p>
            <p class="placeholder-asset__specs">→ assets/evenement/anniversaire.webp · 1200×800 · ≤ 180 Ko · capture vidéo Micha d'un vrai événement</p>
          </div>
        </div>
        <div class="event-card__body">
          <span class="event-card__tag" style="background:#c9748f;color:#fff">PRIVÉ</span>
          <h3 class="event-card__title">Anniversaire · <em>événement privé</em></h3>
          <p class="event-card__desc">Un moment qui compte. 30, 40, 50 ans, départ en retraite, vœux · montage cinéma émotionnel livré sous 2 semaines.</p>
          <ul class="event-card__includes">
            <li>Déplacement Nouvelle-Aquitaine inclus</li>
            <li>Captation discrète et respectueuse</li>
            <li>Montage personnalisé avec musique</li>
            <li>Version longue (souvenir) + teaser réseau</li>
          </ul>
          <p class="event-card__price">Sur devis · <a href="#s14">demander un chiffrage →</a></p>
        </div>
      </article>

    </div>

    <p class="event-footer">
      Autres captations possibles : mariage, festival, conférence, inauguration, concert…
      <a href="#s14">Parlons-en →</a>
    </p>

  </div>
</section>
```

CSS :
```css
.scene--eventementiel{padding:var(--space-7) 0}
.event-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin:var(--space-5) 0 var(--space-3)}
.event-card{background:rgba(10,20,32,.5);border:1px solid var(--fumee);border-radius:4px;overflow:hidden;display:flex;flex-direction:column;transition:transform .4s,border-color .4s}
.event-card:hover{transform:translateY(-3px);border-color:var(--or)}
.event-card__visual{aspect-ratio:3/2;background:var(--nuit-2);position:relative;padding:var(--space-3)}
.event-card__body{padding:var(--space-4);display:flex;flex-direction:column;gap:var(--space-2)}
.event-card__tag{align-self:flex-start;padding:.35rem .75rem;border-radius:100px;font-family:var(--sans);font-size:.6875rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.event-card__title{font-family:var(--sans);font-weight:500;font-size:clamp(1.25rem,1.8vw,1.625rem);margin:0;line-height:1.2}
.event-card__title em{font-family:var(--serif);font-style:italic;color:var(--or)}
.event-card__desc{font-family:var(--sans);font-size:.9375rem;line-height:1.55;color:var(--ivoire-dim);margin:0}
.event-card__includes{list-style:none;padding:0;margin:var(--space-2) 0 0;display:flex;flex-direction:column;gap:.35rem;font-size:.8125rem;color:var(--ivoire-dim)}
.event-card__includes li{position:relative;padding-left:1rem}
.event-card__includes li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:1px;background:var(--or)}
.event-card__price{font-family:var(--serif);font-style:italic;color:var(--or);font-size:1rem;margin:var(--space-2) 0 0;padding-top:var(--space-2);border-top:1px solid var(--fumee)}
.event-card__price a{color:var(--cyan);text-decoration:none;border-bottom:1px solid rgba(62,245,224,.4)}

.event-footer{text-align:center;margin-top:var(--space-5);font-family:var(--sans);font-size:.9375rem;color:var(--ivoire-dim)}
.event-footer a{color:var(--cyan);text-decoration:none;border-bottom:1px solid rgba(62,245,224,.4);padding-bottom:.15rem;margin-left:.25rem}

@media (max-width:900px){
  .event-grid{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  .event-card,.event-card:hover{transition:none;transform:none}
}
```

**Note** : les 2 `.placeholder-asset--event` seront visibles en draft mode (Ctrl+D) jusqu'à ce que Micha fournisse ses exemples. Compteur draft passera de 13 à **15 encarts**.

---

### 3. Form diagnostic scène 14 — ajouter options événementiel

Dans le `<select name="besoin">`, ajouter sous "Direction artistique" ou dans un nouveau groupe :

```html
<optgroup label="Événementiel vidéo (Nouvelle-Aquitaine)">
  <option value="seminaire-entreprise">Séminaire d'entreprise</option>
  <option value="anniversaire-prive">Anniversaire · événement privé</option>
  <option value="captation-autre">Autre captation (mariage, festival, conférence…)</option>
</optgroup>
```

**Champ conditionnel** qui apparaît quand l'une de ces options est choisie :

```html
<div id="diagEventField" class="diag__conditional" hidden>
  <label for="diag-event-date" class="sr">Date prévue</label>
  <input id="diag-event-date" type="text" name="event_date" placeholder="Date approximative de l'événement" autocomplete="off">

  <label for="diag-event-location" class="sr">Lieu approximatif</label>
  <input id="diag-event-location" type="text" name="event_location" placeholder="Lieu (ville Nouvelle-Aquitaine)" autocomplete="off">
</div>
```

JS — étendre le listener existant `#diagGiftRecipient` pour gérer ces nouveaux champs :

```js
document.querySelector('#diag select[name="besoin"]')?.addEventListener('change', function(e){
  const val = e.target.value;
  // Champ cadeau film IA (existant)
  const giftField = document.getElementById('diagGiftRecipient');
  if(giftField) giftField.hidden = val !== 'film-ia-cadeau';
  // Champs événementiel (nouveau)
  const eventField = document.getElementById('diagEventField');
  if(eventField) eventField.hidden = !['seminaire-entreprise','anniversaire-prive','captation-autre'].includes(val);
});
```

---

## 🔌 COHÉRENCE n8n (pour plus tard, quand W1 sera activé)

Le webhook n8n W1 doit ajouter dans la DB Notion Leads un tag spécifique selon la valeur `besoin` :

| Valeur form | Tag Notion | Workflow |
|---|---|---|
| `seminaire-entreprise` | `#event-seminaire` | W1 prioritaire Micha + Lauralie |
| `anniversaire-prive` | `#event-prive` | W1 prioritaire Micha |
| `captation-autre` | `#event-autre` | W1 standard Micha |

---

## 📸 ACTIONS LAURALIE / MICHA

1. **Récupérer 2 captures vidéo** (stills WebP 1200×800) :
   - Une image d'une vraie intervention séminaire (même ancienne)
   - Une image d'un anniversaire / événement privé

2. **Placer dans** `voyage-v9/assets/evenement/` :
   - `seminaire-entreprise.webp`
   - `anniversaire.webp`

3. **Quand les 2 fichiers sont là** : supprimer les `placeholder-asset` et remplacer par les vraies `<img>`.

---

## 🎯 PROMPT CURSOR POUR APPLIQUER CE PATCH

```
Lis voyage-v9/PATCH-MICHA-EVENEMENTIEL.md et applique les 3 modifications :

1. Scène 03 métier DA : enrichir le body avec liste événementiel + 2 CTA (#s05d films IA, #s05f événementiel)
2. Insérer une nouvelle scène 05f "Événementiel Nouvelle-Aquitaine" entre 05d Films IA et 05e Formations, avec 2 cartes (Séminaire entreprise + Anniversaire) chacune contenant un placeholder-asset pour la capture vidéo à fournir
3. Form scène 14 : ajouter optgroup "Événementiel vidéo" avec 3 options + champs conditionnels date/lieu

Règles : vanilla JS, Bunny Fonts, photos hero intouchables, rel="noopener noreferrer", prefers-reduced-motion respecté.

Commit : "feat(voyage-v9): Micha événementiel Nouvelle-Aquitaine — séminaire + anniversaire + captation + form cohérent"
```

---

*Patch événementiel 2026-04-24. Rétablit la vraie offre Micha (vidéaste pro + IA).*
