# BRIEF CLAUDE CODE V2 — voyage-v9/index.html (remplace V1)

> V1 et AUDIT-TRANSITIONS sont obsolètes. V2 = source de vérité unique.
> Ajouts vs V1 : vidéos cinématiques Voyage · 8 workflows n8n · formulaire diagnostic · règles .cursorrules · doctrine CLAUDE.md · manques assets déclarés.

---

## 🎯 SOURCES DE VÉRITÉ (à lire en premier, dans cet ordre)

| # | Fichier | Pourquoi |
|---|---|---|
| 1 | `C:\Users\Lauralie\Projects\pinapp-site\CLAUDE.md` | Doctrine pinapp.fr vs sites clients — v9 = "voyage cinématique V2 assumé" |
| 2 | `C:\Users\Lauralie\Projects\pinapp-site\.cursorrules` | 213 lignes de règles permanentes (stack, palette, typo, M&P, TDAH, tarifs) |
| 3 | `C:\Users\Lauralie\Projects\pinapp-site\PINAPP_CURSOR_V2_MASTER.md` | Spec exécutive v9 (150 lignes) |
| 4 | `C:\Users\Lauralie\Projects\pinapp-site\COPY-PINAPP.md` | Ton, voix, interdits, 6 douleurs |
| 5 | `C:\Users\Lauralie\Projects\pinapp-site\AUTOMATIONS.md` | Doc des 8 workflows n8n |
| 6 | `C:\Users\Lauralie\Projects\pinapp-site\docs\LEAD_FLOW.md` | Architecture Tally → n8n → Notion |
| 7 | `C:\Users\Lauralie\Projects\pinapp-site\n8n-workflows\README.md` | Tableau 8 workflows |
| 8 | `C:\Users\Lauralie\Projects\pinapp-site-backup-2026-04-12_230847\realisations\index.html` | 13 clients + tags + secteurs |
| 9 | `C:\Users\Lauralie\Projects\pinapp-site-backup-2026-04-12_230847\engagements\index.html` | 5 engagements + bodies |
| 10 | `C:\Users\Lauralie\Projects\pinapp-site-backup-2026-04-12_230847\offres\index.html` | Pack Duo split |

---

## 🎬 ASSETS RÉELS DISPONIBLES

### Photos hero (déjà en place)
```
voyage-v9/assets/hero-1.webp  → hero-6.webp   ← 6 photos d'atmosphère
```

### Vidéos cinématiques Voyage (NOUVELLES — à intégrer)
```
assets/video/voyage/
├── 01-main-hologramme.mp4
├── 02-couloir-passengers.mp4
├── 03-hublot-cosmos.mp4
├── 04-constellation-mp.mp4
├── 05-sortie-vaisseau.mp4
├── 06-balade-cosmos.mp4
├── 07-tourbillon-etoiles.mp4
├── 08-atterrissage-sable.mp4
├── pinapp-film-v6.mp4
└── pinapp-film-v6.webm
```
**Usage** : **ces vidéos peuvent remplacer ou doubler les 6 photos fond** pour une narration cinématique réelle. Poids à auditer avant intégration — probablement > 2 Mo chacune, donc :
- Hero scène 01 : `01-main-hologramme.mp4` en autoplay muted loop
- Scènes 05/06/07 : une des vidéos cosmos en bg (mobile = fallback photo)
- Scène 14 contact : `08-atterrissage-sable.mp4` (clôture, atterrissage)
- `<video playsinline muted autoplay loop preload="metadata">` + `<source>` webm puis mp4
- **Désactiver sur mobile** (`@media (max-width: 768px)` ou via JS si `navigator.connection.saveData`)
- **Désactiver si `prefers-reduced-motion: reduce`**

### QR diagnostic
```
assets/images/qr-diagnostic.png   ← scène Contact, à afficher en encart "Scan pour diagnostic"
```

### Config JS (webhook Tally / n8n)
```
assets/js/config.js   ← contient PINAPP_WEBHOOK_URL + flags production
```

---

## 🚫 MANQUES CONNUS (à acter avec Lauralie)

Ces assets **n'existent pas dans le repo** — décision à prendre avant build :

| Asset manquant | Impact sur v9 | Décision possible |
|---|---|---|
| **Screenshots des 13 sites clients** | Le carrousel réalisations reste en placeholders Unsplash | Option A : générer 13 screens réels via `assets/js/demo-preview-urls.js` et les capturer · Option B : garder Unsplash mais ajouter un badge "Aperçu sectoriel" pour honnêteté |
| **Vidéos de réalisation Micha** | Aucune vidéo client existante | Option A : ne pas en mettre · Option B : utiliser les cinématiques Voyage comme "atmosphère Pinapp" (pas comme preuve client) |
| **Photos Micha branding / Mémoire & Présence** | Dossier `assets/images/micha/` vide | Brief Micha pour shooter ces assets · en attendant : cartes texte only |
| **Portrait Micha** | `assets/images/micha.jpg` n'existe pas | Idem — carte texte only |

**Règle `.cursorrules` à respecter** : *« zéro photo publique sans validation »* — donc ne pas inventer de photos, ne pas piocher des stocks pour représenter le duo.

---

## 🔌 AUTOMATISATIONS — 8 WORKFLOWS N8N RÉELS

Tirés de `n8n-workflows/` :

| # | Fichier | Rôle | À afficher sur v9 ? |
|---|---|---|---|
| W1 | `W1-prospect-entrant.json` | Tally → Notion + email Lauralie | ✅ oui, scène "Preuve automatisations" |
| W2 | `W2-devis-yousign-stripe.json` | Devis signé → paiement Stripe | ✅ oui |
| W3 | `W3-formation-sequence.json` | Séquence J+1/J+3/J+7/J+14/J+30 | ✅ oui |
| W4 | `W4-livraison-feedback.json` | Livraison + avis Google J+7 | ✅ oui |
| W5 | `W5-mp-contact.json` | Mémoire & Présence → WhatsApp Micha | ✅ oui, scène M&P |
| W8 | `W8-auralis-aurora.json` | Router Auralis RH | ✅ mention discrète |
| W9/W10/W11 | Telegram approval flows | Validation jalons | mention dans méthode |

### 🆕 Nouvelle scène à ajouter : **"Preuve automatisations"**

Position : entre scène 03 (Services) et scène 04 (Pack Duo) — ou en remplaçant le fond photo scène 04.

Contenu :
- Eyebrow : `PREUVE AUTOMATISATIONS`
- H2 : `Huit flux qui tournent. <em>Pour nous.</em> Pour vous.`
- Desc : Nos propres opérations passent par ces workflows. Ceux qu'on déploie chez vous sont testés chez nous d'abord.
- Grille 6 cartes workflow (W1, W2, W3, W4, W5, W8) — chaque carte :
  - Icône + code (W1…)
  - Titre court (« Prospect entrant »)
  - Flèche de flux (« Tally → Notion → Email »)
  - 1 ligne de bénéfice (« Chaque lead qualifié en < 2 min »)
- Lien discret : `Voir la doc AUTOMATIONS.md →` (pour devs curieux — peut pointer vers `/n8n-workflows/README.md`)

---

## 📝 FORMULAIRE DIAGNOSTIC (NOUVEAU — manquait en V1)

### Spec (conforme `.cursorrules` + `docs/LEAD_FLOW.md`)

La scène 14 (Contact) doit inclure un **formulaire réel**, pas juste un mailto.

### Deux options

**Option A — Embed Tally (recommandé, zéro code, déjà en prod)**
```html
<iframe
  src="https://tally.so/embed/<TALLY_FORM_ID>?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
  loading="lazy"
  width="100%"
  height="520"
  frameborder="0"
  title="Diagnostic Pinapp"></iframe>
```
→ Lauralie doit donner `TALLY_FORM_ID`. Webhook déjà branché sur W1.

**Option B — Form HTML natif + fetch vers webhook n8n**
```html
<form id="diag" class="diag">
  <input required name="vous" placeholder="Votre prénom">
  <input required name="entreprise" placeholder="Votre entreprise">
  <input required type="email" name="email" placeholder="Email">
  <input name="tel" placeholder="Téléphone (optionnel)">
  <select required name="besoin">
    <option value="">Votre besoin principal</option>
    <option>Site vitrine</option>
    <option>Automatisation</option>
    <option>IA sur-mesure</option>
    <option>Pack Duo complet</option>
    <option>Mémoire & Présence</option>
    <option>Autre</option>
  </select>
  <textarea required name="message_libre" rows="4" placeholder="Décrivez votre besoin en quelques lignes"></textarea>
  <label class="consent"><input type="checkbox" required> J'accepte d'être recontacté par écrit sous 24h.</label>
  <button class="btn btn--primary" type="submit">Envoyer — réponse sous 24h →</button>
  <p class="diag__note">Aucun appel. Aucun engagement. Vos données restent chez nous.</p>
</form>

<script>
document.getElementById('diag').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.disabled = true; btn.textContent = 'Envoi...';
  const data = Object.fromEntries(new FormData(e.target));
  data.submittedAt = new Date().toISOString();
  data.source = 'voyage-v9';
  data.meta = { ua: navigator.userAgent, ref: document.referrer };
  try {
    const res = await fetch(window.__PINAPP__.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('webhook');
    e.target.innerHTML = '<div class="diag__ok"><h3>Message reçu.</h3><p>Nous vous répondons sous 24h, par écrit.</p></div>';
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Réessayer';
    alert('Erreur d\'envoi. Réessayez ou écrivez à contact@pinapp.fr');
  }
});
</script>
```
Dépend de `assets/js/config.js` qui expose `window.__PINAPP__.WEBHOOK_URL`.

### Obligatoire (RGPD + `.cursorrules`)
- Checkbox consentement coché explicite
- Mention « Vos données restent chez nous » + lien vers `/mentions-legales`
- Confirmation écran après envoi (pas juste un alert)
- Plausible event tracking : `plausible('Diagnostic-Submit')`

### QR code diagnostic (bonus)
À côté du formulaire, petit encart avec `assets/images/qr-diagnostic.png` + caption « Scan pour envoyer depuis votre mobile ».

---

## 🛠 TRANSITIONS PHOTO — CORRECTIF (cf AUDIT-TRANSITIONS.md)

### Le problème en 1 phrase
Les 6 photos sont actuellement en `position:absolute` **à l'intérieur** de chaque `<section>`. Elles entrent et sortent par le haut/bas comme du texte. Ce ne sont pas des transitions — ce sont des coupes.

### Le fix wearebrand
Un **stage fixe global** au fond du body, avec 6 couches photo empilées, dont une seule est `opacity:1` via IntersectionObserver. Cross-fade 1.4s + ken-burns 8s + blur sortie.

Détail complet du patch : voir `AUDIT-TRANSITIONS.md` sections 1–4. **Appliquer ce patch avant toute autre modif** — c'est ce qui fait la différence entre "slideshow" et "film".

### Variante vidéo (si on intègre les cinématiques Voyage)
Remplacer `.stage__layer` `background-image` par `<video>` pour les scènes où une vidéo est prévue :
```html
<div class="stage__layer" data-scene="01">
  <video autoplay muted loop playsinline preload="metadata" poster="assets/hero-1.webp">
    <source src="assets/video/voyage/01-main-hologramme.webm" type="video/webm">
    <source src="assets/video/voyage/01-main-hologramme.mp4" type="video/mp4">
  </video>
</div>
```
```css
.stage__layer video{width:100%;height:100%;object-fit:cover;display:block}
@media (max-width:768px), (prefers-reduced-motion:reduce){
  .stage__layer video{display:none}
  .stage__layer{background-image:var(--fallback-photo)}
}
```

---

## 📐 STRUCTURE V2 — 15 SCÈNES (V1 + preuve automatisations + formulaire)

| # | Scène | Photo/Vidéo fond | Nouveau vs V1 |
|---|---|---|---|
| 01 | Invitation | `hero-1.webp` + `01-main-hologramme.mp4` | — |
| 02 | Constat (6 douleurs) | `hero-2.webp` | — |
| 03 | Services (4 expertises) | `hero-3.webp` | — |
| **03b** | **Preuve automatisations (8 workflows)** | `hero-3.webp` + overlay grid | 🆕 **AJOUTÉ** |
| 04 | Pack Duo (split Lauralie/Micha) | `hero-3.webp` + scrim blur | — |
| 05 | Réalisations (carrousel 13) | `hero-4.webp` + cinema vidéo optionnelle | ⚠️ toujours placeholders |
| 06 | Méthode (4 étapes) | `hero-5.webp` | — |
| 07 | Équipe (duo texte) | `hero-5.webp` | — |
| 08 | Valeurs (6 principes) | `hero-5.webp` | — |
| 09 | Engagements (5 promesses) | `hero-6.webp` | — |
| 10 | Refus (6 refus) | panneau sombre | — |
| 11 | Manifeste (citation) | radial gradient | — |
| 12 | Mémoire & Présence | `hero-6.webp` | ajouter W5 mention |
| 13 | Tarifs (11 lignes) | panneau sombre | — |
| **14** | **Contact + Formulaire diagnostic** | `hero-6.webp` + `08-atterrissage-sable.mp4` | 🆕 **FORM RÉEL** |
| 15 | Footer | — | — |

---

## 📋 CHECKLIST DE LIVRAISON (mise à jour)

### Transitions
- [ ] Stage fixe global au body, 6 layers photo (ou vidéo) empilées
- [ ] Cross-fade 1.4s entre scènes, aucune coupe visible
- [ ] Ken-burns continu sur layer active (scale 1.00 → 1.04 sur 8s)
- [ ] Photos réutilisées (scènes 6/7/8 même photo) : zéro flash
- [ ] `prefers-reduced-motion` : swap opacity seul, pas d'animation

### Contenu
- [ ] 15 scènes complètes (dont 03b Preuve automatisations + 14 Form diagnostic)
- [ ] 13 réalisations avec badge "Aperçu sectoriel" tant que screens réels absents
- [ ] 5 engagements bodies complets (clause 10% remboursement)
- [ ] Pack Duo split avec 3 900€ HT
- [ ] Tarifs 11 lignes + mention art. 293 B CGI
- [ ] Vocabulaire M&P respecté (interdits : mort/deuil/décès/funérailles)

### Automatisations & form
- [ ] Scène 03b "Preuve automatisations" avec 6 cartes workflow (W1, W2, W3, W4, W5, W8)
- [ ] Formulaire diagnostic fonctionnel dans scène 14 (option A Tally embed OU option B form natif + fetch)
- [ ] Webhook URL depuis `assets/js/config.js` (window.__PINAPP__.WEBHOOK_URL)
- [ ] Consentement RGPD + confirmation écran post-envoi
- [ ] Plausible event `Diagnostic-Submit`
- [ ] QR diagnostic affiché à côté du form

### Technique
- [ ] 6 photos preload (fetchpriority sur hero-1)
- [ ] Vidéos Voyage en `preload="metadata"` + fallback mobile
- [ ] Single file HTML < 250 Ko (hors assets)
- [ ] Lighthouse Performance ≥ 85 mobile (vidéos acceptées)
- [ ] A11Y : contraste AA, focus visibles, `<video>` avec poster

### Conformité projet
- [ ] Respect `CLAUDE.md` : voyage cinématique V2 assumé sur pinapp.fr
- [ ] Respect `.cursorrules` : zéro photo publique sans validation · ton TDAH · nous/je · vocabulaire M&P
- [ ] Pas de WordPress · pas de jQuery · vanilla only · Bunny Fonts

---

## 🎯 COMMANDE CLAUDE CODE (V2)

```bash
cd C:\Users\Lauralie\Projects\pinapp-site\voyage-v9

claude "Tu es architecte front sur le site Pinapp v9. Lis OBLIGATOIREMENT dans l'ordre : 1) CLAUDE.md racine, 2) .cursorrules racine, 3) PINAPP_CURSOR_V2_MASTER.md, 4) voyage-v9/BRIEF-CLAUDE-CODE-V2.md, 5) voyage-v9/AUDIT-TRANSITIONS.md. Reconstruis voyage-v9/index.html en 15 scènes (structure V2). Applique impérativement : (a) le patch stage fixe global du AUDIT pour les transitions, (b) la nouvelle scène 03b Preuve automatisations basée sur n8n-workflows/README.md, (c) le formulaire diagnostic scène 14 avec fetch sur window.__PINAPP__.WEBHOOK_URL + consentement + confirmation écran, (d) intégration conditionnelle des vidéos assets/video/voyage/ avec fallback photo sur mobile. Respecte zéro photo publique sans validation — garde les placeholders Unsplash pour les 13 réalisations mais ajoute un badge 'Aperçu sectoriel'. Vanilla JS, Bunny Fonts. FULL WOW wearebrand."
```

---

## 📎 ANNEXES

### A. Stack auto (extrait `.cursorrules`)
- Hostinger (hébergement) · n8n (automatisation) · Tally (forms)
- YouSign (devis) · Stripe (paiement) · Notion (CRM)
- Gmail · Buffer · Claude API · WhatsApp Business
- Budget mensuel : 100 €

### B. Catalogue (`assets/data/pinapp-catalog.json`)
À utiliser comme source des 11 lignes de tarifs. Ne pas hardcoder si possible — `fetch('/assets/data/pinapp-catalog.json')` au boot.

### C. Plausible analytics
Déjà intégré sur toutes les pages de prod. Conserver le script standard dans `<head>`.

### D. Règles vocabulaire (`.cursorrules` + `COPY-PINAPP.md`)
- Interdits : "solution innovante", "résultat garanti", phrases avec "!"
- Interdits M&P : mort, deuil, décès, funérailles, enterrement, obsèques
- "Nous" partout · "Je" réservé bios Lauralie/Micha

---

*V2 du 2026-04-23. Remplace BRIEF-CLAUDE-CODE.md et complète AUDIT-TRANSITIONS.md.*
