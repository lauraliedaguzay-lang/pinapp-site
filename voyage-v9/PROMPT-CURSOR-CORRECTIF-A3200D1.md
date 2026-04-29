# PROMPT CURSOR — CORRECTIF post-a3200d1

> Le commit a3200d1 a introduit une régression (FAQ vidée) et des doublons d'encarts.
> Ce prompt corrige les 2 problèmes + termine les phases 2-5 du prompt ultime V2.

---

## 🚀 À LANCER

```powershell
cd C:\Users\Lauralie\Projects\pinapp-site
git pull origin main
```

Puis coller ce bloc dans Cursor :

```
Tu corriges 2 régressions du commit a3200d1 puis tu appliques les phases 2-5 encore non faites. Respecte les 6 règles immuables du PROMPT-CURSOR-ULTIME-V2.md (photos hero intouchables, stage intouchable, vanilla JS, voix, noopener noreferrer, prefers-reduced-motion).

========================================
PHASE A — RESTAURER LA FAQ (RÉGRESSION CRITIQUE)
========================================

Dans la scène #s13b (FAQ) de voyage-v9/index.html, vérifie la présence des 5 <details class="faq__item">. Si absents (actuellement 0 détecté), réinsère-les :

<section class="scene" id="s13b" data-scene-id="13" aria-labelledby="s13b-h">
  <div class="container">
    <p class="eyebrow">13b · FAQ</p>
    <h2 id="s13b-h" class="h1">Les questions <em>qu'on nous pose</em> le plus.</h2>
    <div class="faq">
      <details class="faq__item">
        <summary>Combien de temps pour livrer un site ?</summary>
        <p>7 jours pour un Site Vitrine, 14 jours pour un Pack Duo complet. Date de livraison ferme — 10 % de remboursement par jour de retard, plafonné à 50 % du projet.</p>
      </details>
      <details class="faq__item">
        <summary>Comment se passe le paiement ?</summary>
        <p>Uniquement sur livrable. Acompte 30 % à la commande, solde à la livraison validée. Aucun abonnement caché. Prix HT, TVA non applicable art. 293 B CGI.</p>
      </details>
      <details class="faq__item">
        <summary>Est-ce que je peux demander des révisions ?</summary>
        <p>Oui. Trois allers-retours inclus dans chaque livrable. Au-delà, nous chiffrons la révision au prorata et vous validez avant toute dépense.</p>
      </details>
      <details class="faq__item">
        <summary>Qu'est-ce qui se passe si je ne suis pas satisfait ?</summary>
        <p>Satisfait ou remboursé 30 jours. Sans justification. Sans friction. Vous gardez les livrables intermédiaires, nous reprenons les accès production.</p>
      </details>
      <details class="faq__item">
        <summary>Mes données restent-elles chez vous ?</summary>
        <p>Oui. Stack 100 % européen (Hostinger, n8n self-hosted, Bunny Fonts, Plausible). Aucun tracker US. Code source et accès vous appartiennent dès la livraison.</p>
      </details>
    </div>
  </div>
</section>

Préserve tout encart placeholder-asset existant à l'intérieur (l'ajouter APRÈS la fermeture </div> de la classe faq, pas à l'intérieur).

========================================
PHASE B — NETTOYER ENCARTS DUPLIQUÉS
========================================

Actuellement : 36 occurrences de .placeholder-asset détectées au lieu de 13.

Action :
1. Supprimer les variantes .placeholder-asset--inline et .placeholder-asset--block qui dupliquent (garder une seule classe .placeholder-asset)
2. Vérifier qu'il y a exactement 13 <div class="placeholder-asset"> dans le HTML final
3. Dans le JS toggle Ctrl+D, ajouter la mise à jour du compteur au chargement :

document.addEventListener('DOMContentLoaded', function(){
  const n = document.querySelectorAll('.placeholder-asset').length;
  document.body.setAttribute('data-draft-count', n);
});

Et dans le listener Ctrl+D, mettre à jour aussi :
document.body.setAttribute('data-draft-count', document.querySelectorAll('.placeholder-asset').length);

========================================
PHASE 2 — SCÈNE 05d FILMS IA (4 TIERS + 4 LIGNES TARIFS)
========================================

Insérer cette nouvelle section entre la fin de la scène 05 (carrousel 13 aperçus) et la scène 06 méthode. data-scene-id="05" (hérite photo scène Réalisations) :

<section class="scene" id="s05d" data-scene-id="05" aria-labelledby="s05d-h">
  <div class="container">
    <p class="eyebrow">05d · Films IA sur mesure</p>
    <h2 id="s05d-h" class="h1">Un film qui vous ressemble. <em>Ou un cadeau</em> qui marque.</h2>
    <p class="lead">Anniversaire, départ, mariage, lancement produit — on fabrique votre bande-annonce IA en moins d'une semaine.</p>

    <div class="films-grid">
      <article class="film-tier">
        <p class="film-tier__price">390 € <span>HT</span></p>
        <h3 class="film-tier__name">Film <em>cadeau</em></h3>
        <p class="film-tier__desc">Un instant qui marque. Un proche qui sourit. 30 secondes d'émotion.</p>
        <ul class="film-tier__specs">
          <li>Livraison 5 jours</li>
          <li>1 genre au choix</li>
          <li>1 révision incluse</li>
          <li>Format vertical ou horizontal</li>
        </ul>
        <span class="film-tier__badge film-tier__badge--new">NOUVEAU</span>
      </article>

      <article class="film-tier">
        <p class="film-tier__price">550 € <span>HT</span></p>
        <h3 class="film-tier__name">Clip IA</h3>
        <p class="film-tier__desc">30 à 60 secondes. Une idée. Un univers. Un clip.</p>
        <ul class="film-tier__specs">
          <li>Livraison 5 jours</li>
          <li>Genre au choix (western, sci-fi, romance, horreur, comédie)</li>
          <li>2 révisions incluses</li>
        </ul>
      </article>

      <article class="film-tier film-tier--featured">
        <p class="film-tier__price">1 290 € <span>HT</span></p>
        <h3 class="film-tier__name">Court-métrage <em>IA</em></h3>
        <p class="film-tier__desc">1 à 3 minutes. Un univers complet. Votre histoire en film.</p>
        <ul class="film-tier__specs">
          <li>Livraison 10 jours</li>
          <li>Scénario co-écrit</li>
          <li>3 révisions incluses</li>
          <li>Musique originale</li>
        </ul>
        <span class="film-tier__badge">★ le plus demandé</span>
      </article>

      <article class="film-tier">
        <p class="film-tier__price">2 800 € <span>HT</span></p>
        <h3 class="film-tier__name">Premium</h3>
        <p class="film-tier__desc">Bande-annonce type <em>Star Wars</em>, <em>Walker</em>, <em>Resident Evil</em>. Hollywood à votre nom.</p>
        <ul class="film-tier__specs">
          <li>Livraison 14 jours</li>
          <li>Direction artistique complète</li>
          <li>Révisions illimitées jusqu'à OK</li>
          <li>Musique + sound design pro</li>
        </ul>
      </article>
    </div>

    <p class="films-cta">
      <a class="btn btn--secondary" href="/realisations/films-ia/" target="_blank" rel="noopener noreferrer">Voir tous les exemples →</a>
      <span class="films-cta__gift"><em>Film à offrir</em> · cochez-le dans le formulaire diagnostic</span>
    </p>
  </div>
</section>

CSS à ajouter juste après les styles .sisters__grid existants :

.films-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-3);margin:var(--space-5) 0 var(--space-4)}
.film-tier{position:relative;padding:var(--space-4);background:rgba(10,20,32,.75);border:1px solid var(--fumee);border-radius:4px;display:flex;flex-direction:column;gap:var(--space-2);transition:transform .35s var(--ease),border-color .35s}
.film-tier:hover{transform:translateY(-3px);border-color:var(--or)}
.film-tier--featured{border-color:var(--or);background:rgba(230,185,115,.06)}
.film-tier__price{font-family:var(--serif);font-style:italic;font-size:clamp(1.75rem,2.8vw,2.25rem);color:var(--or);margin:0;line-height:1}
.film-tier__price span{font-family:var(--sans);font-style:normal;font-size:.75rem;letter-spacing:.14em;color:var(--ivoire-dim);margin-left:.25rem}
.film-tier__name{font-family:var(--sans);font-weight:500;font-size:clamp(1rem,1.4vw,1.25rem);letter-spacing:-0.01em;margin:0}
.film-tier__name em{font-family:var(--serif);font-style:italic;color:var(--or)}
.film-tier__desc{font-family:var(--sans);font-size:.875rem;line-height:1.5;color:var(--ivoire-dim);margin:0}
.film-tier__specs{list-style:none;padding:0;margin:var(--space-2) 0 0;display:flex;flex-direction:column;gap:.35rem;font-size:.8125rem;color:var(--ivoire-dim)}
.film-tier__specs li{position:relative;padding-left:1rem}
.film-tier__specs li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:1px;background:var(--or)}
.film-tier__badge{position:absolute;top:-10px;right:14px;padding:.25rem .7rem;border-radius:100px;background:var(--or);color:var(--nuit);font-family:var(--sans);font-size:.625rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.film-tier__badge--new{background:var(--cyan);color:var(--nuit)}
.films-cta{display:flex;align-items:center;justify-content:center;gap:var(--space-3);flex-wrap:wrap;margin-top:var(--space-3);text-align:center}
.films-cta__gift{font-family:var(--sans);font-size:.9375rem;color:var(--ivoire-dim)}
.films-cta__gift em{font-family:var(--serif);font-style:italic;color:var(--or);font-size:1rem}
@media (max-width:900px){.films-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:540px){.films-grid{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.film-tier,.film-tier:hover{transition:none;transform:none}}

4 lignes à insérer dans le tableau tarifs scène 13 entre "Système Complet" et "Pack Duo" :

<tr class="prices__group"><td colspan="3"><strong>Films IA — signés Micha</strong></td></tr>
<tr><td><a class="prices__link" href="/realisations/films-ia/">Film cadeau (30s)</a></td><td>390 € HT</td><td>5 jours · à offrir</td></tr>
<tr><td><a class="prices__link" href="/realisations/films-ia/">Clip IA (30-60s)</a></td><td>550 € HT</td><td>5 jours · perso ou pro</td></tr>
<tr><td><a class="prices__link" href="/realisations/films-ia/">Court-métrage IA</a></td><td>1 290 € HT</td><td>10 jours · univers sur-mesure</td></tr>
<tr><td><a class="prices__link" href="/realisations/films-ia/">Premium bande-annonce</a></td><td>2 800 € HT</td><td>14 jours · cinéma</td></tr>

========================================
PHASE 3 — OPTION "FILM À OFFRIR" DANS LE FORM
========================================

Dans le <select name="besoin"> du formulaire #diag scène 14, ajouter après "Mémoire & Présence" :

<option value="film-ia-cadeau">Film IA à offrir (cadeau)</option>
<option value="film-ia-pro">Film IA pour mon activité</option>

Ajouter un champ conditionnel juste après le <select> :

<div id="diagGiftRecipient" class="diag__conditional" hidden>
  <input type="text" name="gift_recipient" placeholder="Pour qui est ce film ? (prénom ou relation)" autocomplete="off">
</div>

Ajouter le JS dans le script inline :

document.querySelector('#diag select[name="besoin"]')?.addEventListener('change', function(e){
  const f = document.getElementById('diagGiftRecipient');
  if(f) f.hidden = e.target.value !== 'film-ia-cadeau';
});

Et le CSS :

.diag__conditional{margin:var(--space-2) 0 0}
.diag__conditional[hidden]{display:none}

========================================
PHASE 4 — EASTER EGGS V7
========================================

Les 3 scripts existent dans .claude/worktrees/musing-blackburn-057634/assets/js/. 

1. Copie-les dans voyage-v9/assets/js/ :
   - scene-counter.js
   - easter-eggs.js
   - film-chromatic.js

2. Référence-les en fin de <body>, avant </body> :

<script src="assets/js/scene-counter.js" defer></script>
<script src="assets/js/easter-eggs.js" defer></script>
<script src="assets/js/film-chromatic.js" defer></script>

3. Vérifie que chaque script ajoute en tête :
if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;

4. Adapte les sélecteurs si les scripts ciblent des IDs qui n'existent pas dans voyage-v9 (ex : ils cherchent #s4 mais voyage-v9 a #s04 ou data-scene-id="04").

========================================
PHASE 5 — PARTENAIRES FOOTER
========================================

Dans le <footer>, juste avant le .footer__bottom (ou la ligne copyright), ajouter :

<div class="partners">
  <p class="eyebrow partners__label">Stack technique européen</p>
  <div class="partners__grid">
    <img src="assets/partners/anthropic.svg" alt="Anthropic Claude" class="partners__logo" loading="lazy" width="120" height="32">
    <img src="assets/partners/stripe.svg" alt="Stripe" class="partners__logo" loading="lazy" width="80" height="32">
    <img src="assets/partners/n8n.svg" alt="n8n" class="partners__logo" loading="lazy" width="80" height="32">
    <img src="assets/partners/hostinger.svg" alt="Hostinger" class="partners__logo" loading="lazy" width="100" height="32">
    <img src="assets/partners/bunnyfonts.svg" alt="Bunny Fonts" class="partners__logo" loading="lazy" width="100" height="32">
    <img src="assets/partners/plausible.svg" alt="Plausible" class="partners__logo" loading="lazy" width="100" height="32">
    <img src="assets/partners/yousign.svg" alt="YouSign" class="partners__logo" loading="lazy" width="90" height="32">
  </div>
</div>

CSS :

.partners{margin:var(--space-5) 0 var(--space-3);text-align:center}
.partners__label{display:inline-block;margin-bottom:var(--space-2)}
.partners__grid{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:var(--space-4)}
.partners__logo{height:28px;width:auto;opacity:.5;filter:grayscale(1) brightness(2);transition:opacity .25s}
.partners__logo:hover{opacity:1}

Les SVG n'existent pas encore — l'encart placeholder #12 du draft mode signale qu'ils sont à fournir. Pas grave, les <img> afficheront une icône broken en prod, seulement visible en draft mode.

========================================
VÉRIFICATION FINALE
========================================

Relis voyage-v9/index.html et confirme :

✅ 5 <details class="faq__item"> dans la scène s13b (FAQ restaurée)
✅ Exactement 13 <div class="placeholder-asset"> (pas 36)
✅ Compteur data-draft-count = 13 au chargement (JS DOMContentLoaded)
✅ Section id="s05d" avec 4 .film-tier (dont Film cadeau 390€)
✅ 4 lignes films IA dans tableau tarifs scène 13
✅ Option "film-ia-cadeau" dans <select> du form
✅ Champ conditionnel #diagGiftRecipient caché par défaut
✅ 3 <script src="assets/js/{scene-counter|easter-eggs|film-chromatic}.js" defer>
✅ Section .partners avec 7 <img> dans footer
✅ Photos hero-1 à hero-6 TOUJOURS intactes (git log origin/main -- voyage-v9/assets/hero-*.webp)
✅ .stage et .stage__layer inchangés
✅ Aucun "!" ajouté, aucun mot M&P interdit
✅ Tous liens externes en rel="noopener noreferrer"

Commit :
git add voyage-v9/index.html voyage-v9/assets/js/
git commit -m "fix+feat(voyage-v9): restaure FAQ + nettoie encarts + films IA + film cadeau + easter eggs + partners"
git push origin main

Récap à produire :
## RÉGRESSIONS CORRIGÉES
- FAQ 5 <details> restaurés
- Encarts réduits de 36 à 13

## PHASES APPLIQUÉES
- Phase 2 : scène 05d Films IA + 4 lignes tarifs
- Phase 3 : option "Film à offrir" + champ conditionnel
- Phase 4 : 3 easter eggs V7 référencés
- Phase 5 : partners footer (7 placeholders SVG)

## À FOURNIR PAR LAURALIE
- 7 SVG logos partenaires
- (liste des autres encarts draft mode inchangée)
```

---

## 🚨 AVANT DE LANCER

**Fais une sauvegarde du fichier actuel** au cas où :
```powershell
cd C:\Users\Lauralie\Projects\pinapp-site
cp voyage-v9/index.html voyage-v9/index.html.backup-a3200d1
```

---

*Correctif 2026-04-23. Post-audit a3200d1.*
