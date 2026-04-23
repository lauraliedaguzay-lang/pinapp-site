# PROMPT CURSOR P0 — voyage-v9

**Usage**

- **Option A** : ouvrir ce fichier, copier **uniquement** le contenu entre les deux lignes `---PROMPT-DEBUT---` et `---PROMPT-FIN---`, coller dans le chat Cursor.
- **Option B** : après `git pull`, dans le chat : `Lis voyage-v9/PROMPT-CURSOR-P0.md et applique le bloc PROMPT (entre les marqueurs) sur voyage-v9/index.html` + le `<style>` inline concerné si ton fichier est monolithique.

**Notes dépôt Pinapp**

- Sur le fichier **complet** 1473 lignes : respecter `data-scene-id` du stage (souvent `13` pour FAQ après tarifs, `12` pour sisters — vérifier ton `index.html` réel).
- **Emoji** dans le CTA Cal du prompt ci-dessous : à remplacer par du texte si tu suis la règle « pas d’emoji » du site livré (`.cursorrules`).

---

## ---PROMPT-DEBUT---

```
Tu es architecte front senior sur Pinapp v9. Objectif : appliquer 6 P0 issus de GAPS-TRAVAUX-ANTERIEURS.md sur voyage-v9/index.html, sans régression.

========================================
PHASE 0 — LECTURE OBLIGATOIRE
========================================

Lis dans cet ordre avant toute modification :

1. voyage-v9/GAPS-TRAVAUX-ANTERIEURS.md (les 6 P0 détaillés)
2. .cursorrules (règles permanentes 213 lignes)
3. CLAUDE.md (doctrine pinapp.fr)
4. COPY-PINAPP.md (voix, interdits)
5. docs/_legacy/V24-DREAM-SPEC.md (spec maîtresse — §5 et §6)
6. voyage-v9/index.html (état actuel post-commit 1915014)

========================================
RÈGLES IMMUABLES
========================================

- Vanilla JS only. Pas de lib externe.
- Voix : "nous" partout, "je" uniquement dans bios Lauralie/Micha.
- Interdits copy : "!", "solution innovante", "résultat garanti".
- Interdits M&P : mort, deuil, décès, funérailles.
- NE PAS toucher : .stage / .stage__layer (transitions), mode sobre #soberToggle, structure des 14 scènes existantes, typo Fraunces/Inter, portfolio Star Wars hero, duo photos Lauralie/Micha.
- Aucun href vers une URL non vérifiée (règle V24-DREAM-SPEC §5).

========================================
P0.1 — SCÈNE 13b FAQ
========================================

Insérer une nouvelle scène entre la scène 13 (tarifs) et la scène 14 (contact). Utiliser data-scene-id="13" pour hériter du même layer du stage (pas de nouvelle photo).

HTML à insérer après </section> de la scène 13 tarifs :

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

CSS à ajouter dans le <style> inline (après les styles de la scène 13) :

.faq{display:flex;flex-direction:column;gap:0;margin-top:var(--space-5);max-width:780px}
.faq__item{border-bottom:1px solid var(--fumee);padding:var(--space-3) 0}
.faq__item:first-child{border-top:1px solid var(--fumee)}
.faq__item summary{
  list-style:none;cursor:pointer;
  display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3);
  font-family:var(--serif);font-style:italic;font-weight:400;
  font-size:clamp(1.125rem,1.8vw,1.5rem);line-height:1.35;
  color:var(--ivoire);
  transition:color .3s var(--ease)
}
.faq__item summary::-webkit-details-marker{display:none}
.faq__item summary::after{
  content:"+";flex-shrink:0;
  font-family:var(--sans);font-size:1.5rem;font-weight:300;color:var(--or);
  transition:transform .35s var(--ease)
}
.faq__item[open] summary::after{transform:rotate(45deg)}
.faq__item[open] summary{color:var(--or)}
.faq__item p{
  font-family:var(--sans);font-size:clamp(.9375rem,1.15vw,1.0625rem);line-height:1.6;
  color:var(--ivoire-dim);margin:var(--space-2) 0 0;max-width:64ch
}
@media (prefers-reduced-motion:reduce){
  .faq__item summary,.faq__item summary::after{transition:none}
}

========================================
P0.2 — CTA Cal.com SCÈNE 14
========================================

Dans la scène 14 (contact), juste avant ou après le <form id="diag"> (selon le layout), ajouter un CTA secondaire :

<a class="btn btn--secondary" href="https://cal.com/lauralie-daguzay-hdglzw/diagnostic" target="_blank" rel="noopener">
  <span aria-hidden="true">📅</span> Ou prendre rendez-vous en ligne →
</a>

CSS si .btn--secondary n'existe pas déjà :

.btn--secondary{
  background:transparent;color:var(--cyan);
  border:1px solid var(--cyan);
  display:inline-flex;align-items:center;gap:.6rem;
  padding:.85rem 1.5rem;border-radius:100px;
  font-family:var(--sans);font-size:.9375rem;font-weight:500;letter-spacing:.04em;
  text-decoration:none;
  transition:background .25s var(--ease),color .25s,transform .25s
}
.btn--secondary:hover{background:var(--cyan);color:var(--nuit);transform:translateY(-2px)}
.btn--secondary:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}

Ajouter au-dessus ou en dessous du formulaire avec marge :
<p class="diag__or">— ou —</p>
<style>
.diag__or{text-align:center;font-family:var(--sans);font-size:.75rem;letter-spacing:.3em;text-transform:uppercase;color:var(--ivoire-dim);margin:var(--space-3) 0}
</style>

========================================
P0.3 — LIENS /demo/<slug>/ SUR LES 13 APERÇUS
========================================

Dans la scène 05, sous-section "05b · Aperçus sectoriels", transformer chaque <article class="real"> en <a class="real"> cliquable.

Mapping EXACT des 13 slugs (déjà déployés dans le repo, vérifiés V24-DREAM-SPEC §5) :

| Nom carte | slug /demo/<slug>/ |
|---|---|
| Renov&Co (BTP) | artisan |
| Ōkami (RESTO) | restaurant |
| Clara Fontaine (COACH) | coach |
| Cabinet Renaud (DROIT) | avocat |
| Studio Élise (SPA) | estheticienne |
| Lash Studio Camille (LASH) | cils |
| Nail Studio Nina (NAILS) | ongles |
| Salon Obsidian (HAIR) | coiffeur |
| Barber&Co (BARBER) | barbier |
| Maison Brioche (BOULANG) | boulangerie |
| Forge Athletics (FITNESS) | trainer |
| Nocturna Ink (INK) | tatoueuse |
| Luminance&Lieu (COMPLET) | sur-mesure |

Transformation à appliquer sur chaque carte :

AVANT :
<article class="real">
  <img class="real__img" ...>
  <div class="real__scrim"></div>
  <span class="real__tag" ...>...</span>
  <span class="real__apercu">Aperçu sectoriel</span>
  <div class="real__body">...</div>
</article>

APRÈS :
<a class="real" href="/demo/<SLUG>/" target="_blank" rel="noopener" aria-label="Voir l'aperçu sectoriel <Nom> (<secteur>) — nouvel onglet">
  <img class="real__img" ...>
  <div class="real__scrim" aria-hidden="true"></div>
  <span class="real__tag" ...>...</span>
  <span class="real__apercu">Aperçu sectoriel</span>
  <div class="real__body">...</div>
</a>

Ajouter au CSS :
.real{text-decoration:none;color:inherit}
.real:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}

========================================
P0.4 — TEASE "3 projets en cours"
========================================

Dans la scène 05, AVANT le séparateur "05b · Aperçus sectoriels" (juste après la grille .portfolio), insérer :

<p class="portfolio__tease">
  <span aria-hidden="true">+</span> <em>Trois autres projets</em> en cours de production · Maison Aurélie · Maison Céleste · Domaine Éclipse
</p>

CSS :

.portfolio__tease{
  text-align:center;margin:var(--space-4) auto 0;max-width:60ch;
  font-family:var(--sans);font-size:.9375rem;line-height:1.5;
  color:var(--ivoire-dim);opacity:.75;letter-spacing:.02em
}
.portfolio__tease em{
  font-family:var(--serif);font-style:italic;font-weight:400;
  color:var(--or);font-size:1.0625rem
}

IMPORTANT : aucun href. Juste du texte. Règle V24-DREAM-SPEC §5 : "pas de href inventé".

========================================
P0.5 — FORMATIONS LIÉES AU TABLEAU TARIFS
========================================

Dans le tableau des tarifs scène 13, pour les 3 lignes "Formation niveau 1 / 2 / 3", envelopper le label dans un <a>.

AVANT (exemple) :
<td>Formation niveau 1</td>

APRÈS :
<td><a href="/formations/kit-prompts/" class="prices__link">Formation niveau 1</a></td>

Faire pareil pour les niveaux 2 et 3 (href="/formations/kit-prompts/" pour les 3).

CSS :
.prices__link{
  color:var(--ivoire);text-decoration:underline;
  text-decoration-thickness:1px;text-underline-offset:3px;
  text-decoration-color:rgba(230,185,115,.45);
  transition:color .25s,text-decoration-color .25s
}
.prices__link:hover{color:var(--or);text-decoration-color:var(--or)}
.prices__link:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}

========================================
P0.6 — BLOC "BRANCHES SŒURS" ENTRE SCÈNES 12 ET 13
========================================

Insérer un <aside class="sisters"> entre la scène 12 (M&P) et la scène 13 (tarifs). Utiliser data-scene-id="12" pour garder la photo M&P.

<section class="scene scene--sisters" id="s12b" data-scene-id="12" aria-labelledby="s12b-h">
  <div class="container">
    <p class="eyebrow">12b · Branches sœurs</p>
    <h2 id="s12b-h" class="h1">Deux produits propres. <em>La preuve</em> par l'usage.</h2>
    <p class="lead">Ce que nous construisons pour vous, nous le construisons d'abord pour nous.</p>
    <div class="sisters__grid">
      <a class="sisters__card" href="/auralis/">
        <p class="sisters__tag">SaaS · RH</p>
        <h3 class="sisters__name">Auralis <em>RH</em></h3>
        <p class="sisters__desc">Notre IA bien-être au travail. 53 % des RH sont épuisés — Auralis gère le burnout des équipes. Pour eux, pour nous, avec vous.</p>
        <span class="sisters__link">Découvrir Auralis <span aria-hidden="true">→</span></span>
      </a>
      <a class="sisters__card" href="https://memoireetpresence.fr/" target="_blank" rel="noopener">
        <p class="sisters__tag">🌿 BRANCHE · M&amp;P</p>
        <h3 class="sisters__name">Mémoire & <em>Présence</em></h3>
        <p class="sisters__desc">La présence qui traverse le temps. Hommages numériques · QR codes · transmission. Notre branche la plus discrète, la plus exigeante.</p>
        <span class="sisters__link">Visiter memoireetpresence.fr <span aria-hidden="true">↗</span></span>
      </a>
    </div>
  </div>
</section>

CSS :

.scene--sisters{min-height:auto;padding:var(--space-7) 0}
.sisters__grid{
  display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);
  margin-top:var(--space-5)
}
.sisters__card{
  display:flex;flex-direction:column;gap:var(--space-2);
  padding:var(--space-5);
  background:rgba(10,20,32,.75);
  border:1px solid var(--fumee);border-radius:4px;
  text-decoration:none;color:inherit;
  transition:transform .45s var(--ease),border-color .45s
}
.sisters__card:hover{transform:translateY(-3px);border-color:var(--or)}
.sisters__card:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}
.sisters__tag{
  font-family:var(--sans);font-size:.6875rem;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;color:var(--or);
  margin:0
}
.sisters__name{
  font-family:var(--sans);font-weight:500;
  font-size:clamp(1.75rem,3vw,2.5rem);letter-spacing:-0.02em;line-height:1;
  margin:0
}
.sisters__name em{
  font-family:var(--serif);font-style:italic;font-weight:400;color:var(--or)
}
.sisters__desc{
  font-family:var(--sans);font-size:1rem;line-height:1.55;
  color:var(--ivoire-dim);margin:0;max-width:40ch
}
.sisters__link{
  margin-top:auto;padding-top:var(--space-2);
  font-family:var(--sans);font-size:.875rem;color:var(--cyan);
  letter-spacing:.04em;
  border-top:1px solid var(--fumee)
}

@media (max-width:720px){
  .sisters__grid{grid-template-columns:1fr}
}

========================================
PHASE FINALE — VÉRIFICATION + COMMIT
========================================

Après application des 6 P0, vérifier en relisant voyage-v9/index.html :

✅ Scène 13b FAQ présente avec 5 <details>
✅ CTA Cal.com dans scène 14 avec href https://cal.com/lauralie-daguzay-hdglzw/diagnostic
✅ 13 <a class="real" href="/demo/<slug>/"> avec les bons slugs (artisan, restaurant, coach, avocat, estheticienne, cils, ongles, coiffeur, barbier, boulangerie, trainer, tatoueuse, sur-mesure)
✅ Tease "Trois autres projets" sous portfolio (Maison Aurélie, Maison Céleste, Domaine Éclipse) — PAS de href
✅ 3 <a href="/formations/kit-prompts/"> dans tableau tarifs
✅ Bloc sisters Auralis + M&P entre scènes 12 et 13
✅ Scène 13b + Scène 12b héritent du bon data-scene-id (12 et 13 existants, pas de nouvelle photo)
✅ Aucune régression : le stage fixe, le portfolio Star Wars, les duo photos, le form consent — tout intact

Commit final :
git add voyage-v9/index.html
git commit -m "feat(voyage-v9): P0 gaps travaux antérieurs — FAQ + Cal.com + /demo links + teasers + branches sœurs"
git push origin main

Puis produis un récap :
## APPLIQUÉ
- (liste des 6 P0 avec n° de ligne)
## À CONFIRMER
- (si questions restent : liens /formations/kit-prompts/ existent ? /auralis/ existe ? Poster Atelier Rivage ?)

========================================
NE FAIS PAS
========================================

- Ne touche pas au stage fixe ni aux IntersectionObserver.
- Ne supprime pas les badges "Aperçu sectoriel".
- Ne modifie pas les 5 réalisations du portfolio (Star Wars, Walker, Resident Evil, Atelier Rivage, M&P).
- Ne change pas la structure des 14 scènes existantes.
- N'ajoute AUCUN script externe.
- Ne crée pas de href vers des URLs non vérifiées.

Commence maintenant par PHASE 0 lecture. Puis P0.1 → P0.6 dans l'ordre. Commit à la fin.
```

## ---PROMPT-FIN---

*Prompt du 2026-04-23. Consolide GAPS-TRAVAUX-ANTERIEURS.md + V24-DREAM-SPEC.md §5-6.*
