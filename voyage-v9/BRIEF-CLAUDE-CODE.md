# BRIEF CLAUDE CODE — voyage-v9/index.html FULL WOW wearebrand-level

> Handoff complet. Tout ce qu'il faut pour finir ce site sans relire l'historique.

---

## 🎯 OBJECTIF

Refondre `C:\Users\Lauralie\Projects\pinapp-site\voyage-v9\index.html` en **single-file HTML** qualité **wearebrand.io** :
- Cinématique, éditorial, oversized serif italic + sans
- **6 photos héros en fond plein écran** (déjà en place, voir § ASSETS)
- **Tout le vrai contenu Pinapp** (voir § CONTENU)
- Zéro dépendance externe sauf Bunny Fonts (Fraunces + Inter)
- Vanilla JS uniquement

Directive verbatim Lauralie :
> "MAIS AVEC MES 6 PHOTOS EN FOND ET WEAREBRAND EXIGEANCE DONC FAIS DES RECHERCHES JE VEUX DU FULL WOW COMME LUI"
> "POSE TOI LA QUESTION COMMENT IL FERAIT LE SITE AVEC TOUTES CES INFOS METS TOI A SA PLACE ET DANS SA LOGIQUE"

---

## 📁 ASSETS DÉJÀ EN PLACE

```
voyage-v9/
├── index.html                    ← à REWRITE (actuellement 58521 bytes, 6 scènes mais images génériques)
├── BRIEF-CLAUDE-CODE.md          ← ce fichier
└── assets/
    ├── hero-1.webp               ← scène 1 (invitation)
    ├── hero-2.webp               ← scène 2 (constat/douleurs)
    ├── hero-3.webp               ← scène 3 (services)
    ├── hero-4.webp               ← scène 4 (réalisations)
    ├── hero-5.webp               ← scène 5 (méthode/équipe)
    └── hero-6.webp               ← scène 6 (closing/contact)
```

Les 6 photos proviennent du zip `v9-hero-12-images.zip`. Elles servent de **full-bleed background** pour chaque chapitre avec scrim sombre (`rgba(5,11,20,0.55)` + grain).

---

## 📚 SOURCES DE CONTENU (lire avant d'écrire)

| Fichier | Contient |
|---|---|
| `C:\Users\Lauralie\Projects\pinapp-site\COPY-PINAPP.md` | Ton, H1, 6 douleurs, valeurs, voix globale, mémoire & présence |
| `C:\Users\Lauralie\Projects\pinapp-site-backup-2026-04-12_230847\realisations\index.html` | 13 vraies réalisations (noms, secteurs, tags, couleurs) |
| `C:\Users\Lauralie\Projects\pinapp-site-backup-2026-04-12_230847\assets\js\demo-preview-urls.js` | IDs Unsplash utilisés pour les aperçus sectoriels |
| `C:\Users\Lauralie\Projects\pinapp-site-backup-2026-04-12_230847\engagements\index.html` | 5 engagements complets avec leurs body |
| `C:\Users\Lauralie\Projects\pinapp-site-backup-2026-04-12_230847\offres\index.html` | Détail Pack Duo Lauralie/Micha |
| `C:\Users\Lauralie\Projects\pinapp-site-backup-2026-04-12_230847\a-propos\index.html` | Bios Lauralie + Micha, compétences de chacun |

---

## 🎨 DESIGN SYSTEM

### Palette
```css
:root {
  --or: #e6b973;          /* accent chaud */
  --cyan: #3ef5e0;         /* accent froid (cta secondaire, highlight) */
  --ivoire: #f4e4c1;       /* texte warm */
  --nuit: #050b14;         /* background */
  --nuit-2: #0a1420;       /* surfaces */
  --fumee: rgba(244,228,193,0.06); /* borders */
  --veil: rgba(5,11,20,0.55);      /* scrim photos */
}
```

### Typo
```css
/* Bunny Fonts (no Google) */
@import url('https://fonts.bunny.net/css?family=fraunces:400i,500,600i,700,900|inter:400,500,600,700&display=swap');

--serif: 'Fraunces', ui-serif, Georgia, serif;   /* H + accents italic */
--sans:  'Inter', ui-sans-serif, system-ui, sans-serif;

/* échelle */
--text-hero: clamp(3.25rem, 8.8vw, 7.75rem);     /* H1 plein écran */
--text-h1:   clamp(2.5rem, 6vw, 5rem);
--text-h2:   clamp(2rem, 4vw, 3.5rem);
--text-h3:   clamp(1.25rem, 2vw, 1.75rem);
--text-lead: clamp(1.125rem, 1.5vw, 1.35rem);
```

### Principes wearebrand
1. **Editorial restraint** — beaucoup de blanc, 1 idée par écran
2. **Oversized serif italic accents** — `<em>` en Fraunces italic 400 au milieu de sans-serif
3. **Chapter labels** — petites capitales monospace-like en haut de chaque section ("01 · INVITATION", etc.)
4. **Full-bleed photos avec scrim** — jamais de photo décorative, toujours immersive
5. **Grain overlay** — léger (opacity 0.04) sur tout pour texture film
6. **Horizontal scroll-snap** pour le carrousel réalisations avec compteur "01 / 13"
7. **Scroll progress bar** en haut, 2px, or
8. **Sticky nav** avec backdrop-blur activé au scroll

---

## 📝 STRUCTURE COMPLÈTE DU SITE

### Nav (sticky)
- Logo `Pinapp.` (Fraunces 700)
- Menu : Société · Réalisations · Offres · Contact
- CTA : `Diagnostic offert →`

### Scène 01 · INVITATION (hero-1.webp)
- Eyebrow : `01 · INVITATION`
- Coord : `44°50′N · 0°34′W · BORDEAUX`
- H1 :
  ```
  Nous construisons <em>ce que</em>
  vos concurrents
  <span class="accent-cyan">n'ont pas</span> encore.
  ```
- Baseline : `Vos outils travaillent. Vous décidez.`
- 3 stats row : `24h délai` · `0€ diagnostic` · `30j remboursé`
- CTA primary : `Premier échange offert →`
- Scroll hint animé en bas

### Scène 02 · CONSTAT (hero-2.webp)
- Eyebrow : `02 · CONSTAT`
- H2 : `Vos outils ont été conçus pour le bureau. <em>Votre équipe,</em> elle, travaille de partout.`
- Grille 6 douleurs (emoji · numéro serif italic · titre · → · fix) :
  1. ⏱ Vous répondez trop lentement. → IA qui répond pendant que vous êtes sur le terrain.
  2. 🔗 5 outils qui ne se parlent pas. → On connecte tout. Une seule source de vérité.
  3. 🌙 Les factures le dimanche soir. → Générée à la signature. Relance si impayé.
  4. 🖥 Honte de donner votre URL. → Un site que vous partagez fièrement.
  5. 📅 Les no-shows non relancés. → Confirmation · rappel · relance automatiques.
  6. 🏠 Équipe en télétravail, process de bureau. → Workflows reconstruits pour le distanciel.

### Scène 03 · SERVICES (hero-3.webp)
- Eyebrow : `03 · SERVICES`
- H2 : `Quatre expertises. <em>Un seul</em> résultat.`
- Sous-titre : `Vos outils travaillent. Vous décidez.`
- Grille 4 services (icon · nom · desc · meta price) :
  - Sites vitrine · 1 290€ · 7 jours
  - Automatisation · dès 490€ · 1 jour/mois libéré
  - IA sur-mesure · 890€ · 48h livraison
  - Direction artistique · sur devis · photo/vidéo/branding

### Scène 04 · PACK DUO (spread, hero transition)
- Eyebrow : `04 · PACK COMPLET DUO`
- H2 : `Un interlocuteur. <em>Deux</em> expertises.`
- **Split layout 2 colonnes**
  - Gauche — **Lauralie apporte** :
    - Site premium 7 jours
    - 3 automatisations clés
    - Assistant IA métier
    - Formation 2h
  - Droite — **Micha apporte** :
    - Direction artistique
    - Shooting photo pro
    - Vidéo de présentation
    - Branding Adobe complet
- Footer panel : `Dès 3 900 € HT` · `~1 600 € économisés vs. séparé`

### Scène 05 · RÉALISATIONS (hero-4.webp)
- Eyebrow : `05 · PREUVE`
- H2 : `Treize univers. <em>Treize</em> systèmes sur mesure.`
- **Carrousel horizontal scroll-snap** (13 cartes)
- Compteur live `01 / 13` + prev/next arrows
- Chaque carte : image Unsplash (via IDs de `demo-preview-urls.js`) · tag coloré · nom · secteur

**Les 13 réalisations** (noms · secteur · couleur tag) :

| # | Nom | Secteur | Tag color |
|---|---|---|---|
| 01 | Renov&Co | BTP | `#e8760a` |
| 02 | Ōkami | RESTO | `#c41e3a` |
| 03 | Clara Fontaine | COACH | `#2d6a4f` |
| 04 | Cabinet Renaud | DROIT | `#c9a96e` |
| 05 | Studio Élise | SPA | `#c9748f` |
| 06 | Lash Studio Camille | LASH | `#9b7ff8` |
| 07 | Nail Studio Nina | NAILS | `#d4a574` |
| 08 | Salon Obsidian | HAIR | `#c0a882` |
| 09 | Barber&Co | BARBER | `#8b7355` |
| 10 | Maison Brioche | BOULANG. | `#c4622d` |
| 11 | Forge Athletics | FITNESS | `#dc2626` |
| 12 | Nocturna Ink | INK | gradient `linear-gradient(135deg,#1a1a2e,#c41e3a)` |
| 13 | Luminance&Lieu | COMPLET | `#c4a77d` |

### Scène 06 · MÉTHODE (hero-5.webp, intercalée)
- Eyebrow : `06 · MÉTHODE`
- H2 : `De la première question <em>à la</em> livraison.`
- Sous-titre : `Pas d'appel. Tout par écrit. Vous gardez la main.`
- 4 étapes (numéros serif italic 144pt) :
  1. Diagnostic — sous 24h, par écrit, offert
  2. Devis clair — lignes détaillées, zéro surprise
  3. Construction — vous validez aux jalons
  4. Livraison + 30j — satisfait ou remboursé

### Scène 07 · ÉQUIPE (hero-5.webp continuation)
- Eyebrow : `07 · DUO`
- H2 : `Deux personnes. <em>Zéro</em> intermédiaire.`
- 2 cartes texte (PAS d'image — évite les chemins cassés) :
  - **Lauralie** — Co-associée · Architecte systèmes & IA
    > Je conçois les systèmes, j'écris les specs, je les déploie. De l'IA à l'automatisation, du site au SaaS — sans intermédiaire.
    - Compétences : Sites premium · Automatisation n8n · IA sur-mesure · Auralis RH · Scripts Hostinger
  - **Micha** — Co-associé · Directeur artistique
    > Je crée les visuels qui font ressentir ce que les mots ne peuvent pas dire. Adobe, IA générative, restauration — depuis mon studio ou chez vous.
    - Compétences : Photo & vidéo pro · Direction artistique · Branding Adobe · Restauration · Mémoire & Présence

### Scène 08 · VALEURS (hero-5.webp)
- Eyebrow : `08 · VALEURS`
- H2 : `Six principes. <em>Non négociables.</em>`
- 6 valeurs (italic serif name + body) :
  1. 🤝 *L'humain d'abord* — La technologie existe pour servir les gens.
  2. 🔗 *La connexion* — Entre les outils, les gens, les générations.
  3. 🌱 *La sobriété* — Zéro outil superflu. Stack 100% européen.
  4. 📖 *La transmission* — Documentation incluse. Vous êtes autonomes.
  5. ⚖️ *L'honnêteté* — Paiement sur livrable. Satisfait ou remboursé 30j.
  6. 🎯 *L'égalité* — Entre nous d'abord. Dans nos projets ensuite.

### Scène 09 · ENGAGEMENTS (hero-6.webp)
- Eyebrow : `09 · ENGAGEMENTS`
- H2 : `Cinq promesses. <em>Écrites.</em> Opposables.`
- Liste 5 engagements (chaque : titre serif + body) :

1. **Livraison dans les délais annoncés**
   Chaque devis indique une date de livraison ferme. Si nous la dépassons de notre fait, nous vous remboursons **10 % du montant par jour de retard**, plafonné à 50 % du projet. Les délais sont réalistes — nous préférons annoncer 10 jours et livrer en 8, que l'inverse.

2. **Satisfait ou remboursé 30 jours**
   Si le livrable ne correspond pas à ce qui était spécifié dans le devis, vous êtes remboursé intégralement sous 30 jours après livraison. Sans justification. Sans friction.

3. **Un seul interlocuteur**
   Vous parlez directement à Lauralie (technique) ou Micha (direction artistique). Jamais à un commercial. Jamais à un chef de projet. Les décisions se prennent avec ceux qui construisent.

4. **Transparence totale**
   Tout par écrit. Specs, planning, livrables, factures. Vous avez accès à l'ensemble de la documentation technique, des identifiants et des accès dès la livraison.

5. **Code propre, à vous**
   Tout ce que nous construisons vous appartient. Code source, modèles IA, workflows n8n, prompts. Nous fournissons la documentation pour qu'un autre prestataire puisse reprendre sans friction.

### Scène 10 · CE QUE NOUS REFUSONS
- Eyebrow : `10 · TRANSPARENCE`
- H2 : `Ce que nous <em>refusons</em>.`
- Liste `×` :
  × Les agences fantômes qui facturent sans livrer
  × Les outils inutiles qu'on revend en commission
  × Les sites WordPress à 300€ livrés en 3 mois
  × Les résultats garantis sans conditions
  × Le jargon pour impressionner
  × Les appels "d'information" pour pitcher

### Scène 11 · MANIFESTE
- Eyebrow : `11 · MANIFESTE`
- Quote géante (Fraunces italic, clamp 3–6rem) :
  > « Nous avons construit ces outils pour nous d'abord. Pour gérer notre propre complexité. Aujourd'hui nous les construisons pour vous. »
  — Lauralie & Micha

### Scène 12 · MÉMOIRE & PRÉSENCE (hero-6.webp, bridge)
- Eyebrow : `12 · BRANCHE SŒUR`
- H2 : `La présence <em>qui traverse</em> le temps.`
- Desc : Nous digitalisons les hommages, préservons les mémoires et créons des liens durables entre ceux qui restent et ceux qui sont partis.
- **Vocabulaire strict** : hommage · transmission · présence · lien · mémoire · famille. **Jamais** : mort, deuil, décès, funérailles, enterrement, obsèques.
- 4 piliers :
  1. 📱 **QR codes d'hommage** — Un QR. Une page. Une présence numérique durable.
  2. 🎞 **Captation & transmission** — Vidéos de mémoire, photos de famille, restauration d'archives.
  3. 🌐 **Présence numérique** — Sites et interfaces pour les professionnels du secteur.
  4. 🤝 **Accompagnement** — Discret, respectueux, centré sur l'humain.
- Lien : `Découvrir Mémoire & Présence →`

### Scène 13 · TARIFS
- Eyebrow : `13 · TARIFS`
- H2 : `Prix clairs. <em>Sans</em> abonnement caché.`
- Tableau 11 lignes (featured row = Pack Duo, bordure or) :

| Offre | Prix HT | Gain |
|---|---|---|
| Automatisation Messages | 490 € | 1 jour/mois · entrée |
| Automatisation Facturation | 590 € | 1 jour/mois |
| Automatisation Devis | 790 € | 3h/semaine |
| Automatisation RDV | 990 € | 5h/semaine |
| IA sur-mesure | 890 € | 48h livraison |
| Site Vitrine | 1 290 € | 7 jours |
| Système Complet | Dès 2 400 € | Sur devis |
| **Pack Duo Lauralie+Micha** ⭐ | **Dès 3 900 €** | **~1 600 € économisés** |
| Formation niveau 1 | 67 € | — |
| Formation niveau 2 | 147 € | — |
| Formation niveau 3 | 397 € | Pack Prompting inclus |

- Mention bas de table : `Prix HT · TVA non applicable art. 293 B CGI · Paiement sur livrable · Satisfait ou remboursé 30 jours`

### Scène 14 · CONTACT (hero-6.webp final)
- Eyebrow : `14 · COMMENÇONS`
- H2 : `Par quoi on <em>commence</em> ?`
- Desc : Décrivez votre besoin par écrit. Nous vous répondons sous 24h avec un diagnostic et une proposition concrète. Aucun engagement.
- 4 stats : `24h réponse` · `0€ diagnostic` · `30j remboursé` · `100% par écrit`
- CTA principal : mailto contact@pinapp.fr
- CTA secondaire : `Voir les réalisations →`

### Footer
4 colonnes :
1. **Pinapp Inc.** — tagline "Connecter. Construire. Transmettre." + copyright © 2026
2. **Explorer** — Société · Réalisations · Offres · Engagements · Mémoire & Présence
3. **Contact** — contact@pinapp.fr · LinkedIn · Bordeaux, France
4. **Légal** — Mentions · CGV · Confidentialité · Prix HT · TVA non applicable art. 293 B CGI

---

## ⚙️ INTERACTIONS JS (vanilla)

```js
(function(){
  // 1. Scroll progress bar (2px or, top)
  const bar = document.querySelector('.progress__fill');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });

  // 2. Nav backdrop-blur on scroll
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  // 3. IntersectionObserver .is-in pour chaque .scene et ses [data-reveal]
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-in');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.scene, [data-reveal]').forEach(el => io.observe(el));

  // 4. Carrousel réalisations — scroll-snap + compteur + arrows
  const reel = document.querySelector('.reals-scroll');
  const counter = document.querySelector('.reals-counter');
  const prev = document.querySelector('.reals-prev');
  const next = document.querySelector('.reals-next');
  const total = reel.querySelectorAll('.real').length;
  const step = () => reel.querySelector('.real').getBoundingClientRect().width + 24;
  const updateCounter = () => {
    const idx = Math.round(reel.scrollLeft / step()) + 1;
    counter.textContent = String(idx).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
  };
  reel.addEventListener('scroll', updateCounter, { passive: true });
  prev.addEventListener('click', () => reel.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => reel.scrollBy({ left: step(), behavior: 'smooth' }));
  updateCounter();

  // 5. Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // 6. Mouse parallax sur hero-1 (hover devices only)
  if (matchMedia('(hover:hover)').matches) {
    const heroBg = document.querySelector('.scene--01 .scene__bg');
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroBg.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    });
  }
})();
```

---

## 🚫 PIÈGES À ÉVITER

- ❌ Ne pas référencer `../assets/img/team/lauralie.jpg` ou `../assets/images/micha.jpg` — ces chemins n'existent pas. Équipe = cartes texte only.
- ❌ Ne pas embed de vidéos Micha — aucun `.mp4` dans le backup (vérifié via find).
- ❌ Ne pas utiliser Google Fonts — Bunny Fonts only (RGPD-friendly).
- ❌ Ne pas mentionner "mort/deuil/décès/funérailles/obsèques" dans Mémoire & Présence.
- ❌ Pas de "!" dans les textes publics (règle TDAH copy).
- ❌ Pas de "solution innovante", "résultat garanti".
- ✅ "Nous" sur tout le site. "Je" réservé aux bios Lauralie/Micha.

---

## ✅ CHECKLIST DE LIVRAISON

- [ ] `index.html` < 150 Ko (single file)
- [ ] 6 photos hero-N.webp affichées en full-bleed avec scrim
- [ ] 13 réalisations dans carrousel horizontal scroll-snap
- [ ] Compteur `01 / 13` qui se met à jour au scroll
- [ ] 5 engagements avec body complet (incluant clause 10% remboursement)
- [ ] Pack Duo split 2 colonnes avec 3 900 € HT
- [ ] Tableau tarifs 11 lignes, Pack Duo en featured
- [ ] Mémoire & Présence avec vocabulaire respecté
- [ ] Footer 4 colonnes avec mention art. 293 B CGI
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Contraste WCAG AA (texte ivoire sur scrim nuit)
- [ ] `<meta name="description">` + OpenGraph + `lang="fr"`

---

## 🎬 COMMANDE CLAUDE CODE SUGGÉRÉE

```bash
cd C:\Users\Lauralie\Projects\pinapp-site\voyage-v9
claude "Lis BRIEF-CLAUDE-CODE.md et construis index.html en suivant strictement la structure. Lis aussi les 6 fichiers sources listés dans la section 'SOURCES DE CONTENU' avant d'écrire. Aucune dépendance externe sauf Bunny Fonts. Vanilla JS inline. 6 photos hero-N.webp en fond cinématique. Qualité wearebrand.io. FULL WOW."
```

---

*Brief préparé le 2026-04-23. Version du contenu : validée par Lauralie sur COPY-PINAPP.md.*
