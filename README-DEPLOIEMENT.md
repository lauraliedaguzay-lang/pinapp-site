# Pinapp.fr · Déploiement v2 final · 29 avril 2026

## Récap exécutif

✅ **Refonte homepage Pinapp.fr** — section "8 dimensions" supprimée, section démos refaite en 4 cards premium avec **vraies captures de homepage**
✅ **Section vidéo de présentation** ajoutée entre Hero et Réalisations (placeholder élégant prêt à recevoir le mp4)
✅ **3 sites démos premium** créés from scratch : Cabinet Renaud (avocat), Maison Aurore (restaurant), Studio Léna (esthétique)
✅ **Atelier Rivage** (Claude Design) intégré dans `/demo/atelier-rivage/`
✅ **Page mentions-légales.html** créée avec template complet (à compléter selon SIRET définitif)
✅ **Audit complet exécuté** : 0 erreur de page, 0 erreur console, tous les liens validés
✅ **Photo Micha** prête pour Mémoire & Présence

---

## ⚠️ 2 actions critiques côté toi

### 1. Vidéo de présentation (quand tu l'auras)

Dans `index.html`, section vidéo, tu trouveras ce bloc :

```html
<video controls preload="metadata" id="video-el" class="video-el" playsinline>
  <!-- <source src="assets/video/pinapp-presentation.mp4" type="video/mp4"> -->
  <p>Votre navigateur ne supporte pas la lecture vidéo HTML5.</p>
</video>
<div class="video-placeholder-msg" id="video-msg">
  ...
</div>
```

**Quand la vidéo est prête, 3 actions :**
1. Uploader ton mp4 dans `pinapp/assets/video/pinapp-presentation.mp4`
2. **Décommenter** la ligne `<source>` (retirer les `<!--` et `-->`)
3. **Supprimer** le bloc `<div class="video-placeholder-msg">` complet

C'est tout. Le player s'occupe du reste (play/pause/fullscreen natif).

### 2. Mentions légales (avant mise en ligne pro)

Le fichier `mentions-legales.html` contient un template avec des champs marqués `[à compléter]` :
- Statut juridique exact (EI, EURL, SAS…)
- Adresse de l'entreprise
- N° SIRET définitif
- Code APE

Quand l'immatriculation est finalisée, ouvre `mentions-legales.html` et remplace les `[à compléter]`.

---

## Architecture finale

```
pinapp/
├── index.html                          ← Homepage (hero + vidéo + 4 cards + approche + diag + footer)
├── mentions-legales.html               ← Page légale (mentions + CGV + RGPD)
├── README-DEPLOIEMENT.md               ← Ce fichier
├── assets/
│   ├── css/style.css                   ← DA Passengers/Avalon
│   ├── js/main.js                      ← Vanilla : header scroll, nav, reveal, modal vidéo
│   └── img/
│       ├── logo-pinapp-color.png       ← Logo violet/bleu (transparent)
│       ├── logo-pinapp-gold.png        ← Variante or cuivré (cohérence DA)
│       ├── logo-pinapp-ivory.png       ← Variante ivoire (footer)
│       ├── micha.jpg                   ← Photo Micha 800×800 (pour Mémoire & Présence)
│       ├── micha-400.jpg               ← Version légère 400×400
│       └── previews/                   ← Captures réelles des homepages démos
│           ├── cabinet-renaud.jpg
│           ├── maison-aurore.jpg
│           └── studio-lena.jpg
└── demo/
    ├── atelier-rivage/                 ← Site Claude Design (Three.js villa 3D)
    ├── cabinet-renaud/                 ← Avocat · vert bouteille / or · editorial
    ├── maison-aurore/                  ← Restaurant · bordeaux / or · auberge étoile
    └── studio-lena/                    ← Cils · rose nude / mauve / café · soft romantic
```

---

## Audit technique exécuté

### ✅ Validation des liens

Tous les liens internes et externes ont été audités automatiquement :

| Page | href orphelins | Ancres cassées | Pages manquantes | Images manquantes |
|---|---|---|---|---|
| `index.html` | 0 | 0 | 0 | 0 |
| `mentions-legales.html` | 0 | 0 | 0 | 0 |
| `demo/cabinet-renaud/` | 4 (désactivés via JS) | 0 | 0 | 0 |
| `demo/maison-aurore/` | 1 (désactivé via JS) | 0 | 0 | 0 |
| `demo/studio-lena/` | 4 (désactivés via JS) | 0 | 0 | 0 |
| `demo/atelier-rivage/` | (Claude Design intact) | 0 | 0 | 0 |

Les `href="#"` sans destination sont **interceptés au clic** par JavaScript pour éviter les sauts intempestifs en haut de page.

### ✅ Test parcours prospect simulé

| Card cliquée | Page chargée | Erreurs JS |
|---|---|---|
| Atelier Rivage | "Atelier Rivage · Architecte d'intérieur · Bordeaux & Atlantique" | 0 |
| Maison Aurore | "Maison Aurore · Restaurant gastronomique · Bordeaux" | 0 |
| Cabinet Renaud | "Cabinet Renaud · Avocat · Droit des affaires · Paris" | 0 |
| Studio Léna | "Studio Léna · Extensions cils · Lille" | 0 |

### ✅ SEO / structured data

| Page | Title | Meta description | Schema.org |
|---|---|---|---|
| pinapp.fr | ✓ | ✓ | ProfessionalService |
| atelier-rivage | ✓ | ✓ | LocalBusiness |
| cabinet-renaud | ✓ | ✓ | Attorney |
| maison-aurore | ✓ | ✓ | Restaurant |
| studio-lena | ✓ | ✓ | BeautySalon |

### ✅ Accessibilité

- **No-JS fallback** : si JavaScript désactivé, le contenu reste visible (classe `html.no-js`)
- **Reduced-motion** : toutes les animations désactivées si l'OS le demande
- **Focus visible** : outline doré (`#C9A96E`) sur tous les éléments interactifs
- **Alt text** : toutes les images ont un alt descriptif
- **ARIA** : modal vidéo, nav burger, boutons ont les aria-* appropriés
- **Sémantique HTML5** : `<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`

---

## ⚠️ Alerte DA persistante (Marco)

Le **logo violet/bleu** n'est pas dans la palette Pinapp Passengers/Avalon validée (ivoire / or cuivré / bleu hublot).

| Option | Action | Fichier |
|---|---|---|
| **A** (par défaut, livrée) | Logo couleur original violet/bleu en header | `assets/img/logo-pinapp-color.png` |
| **B** (cohérence DA max — Marco recommande) | Version or cuivré monochrome | `assets/img/logo-pinapp-gold.png` |
| **C** | Version ivoire (sur fond sombre) | `assets/img/logo-pinapp-ivory.png` |

**Pour switcher** : édite `index.html`, ligne `<img src="assets/img/logo-pinapp-color.png" ...>` du header et change le nom du fichier.

---

## Déploiement Hostinger SFTP

### 1. Installer FileZilla
**https://filezilla-project.org/download.php?type=client**

### 2. Récupérer identifiants Hostinger
hpanel.hostinger.com → Hébergements → ton site → Avancé → Comptes FTP.
Hôte, Utilisateur, Mot de passe, Port **22** (SFTP).

### 3. Connecter
Quick Connect → accepter empreinte.

### 4. Backup
Dans `/public_html/` : renomme `index.html` → `index-OLD-2026-04-29.html` et `assets/` → `assets-OLD/`.

### 5. Upload
Glisse-dépose le **contenu** du dossier `pinapp-deploy/` dans `/public_html/`. ~3 min sur fibre.

### 6. Vérification

`https://pinapp.fr` (mode incognito).

**Checklist visiteur :**
- [ ] Logo en haut gauche, CTA "Diagnostic 24h" en haut droite
- [ ] Hero "Le site qu'on signe. Le système qui tourne."
- [ ] Section vidéo "Voyez comment on travaille." → clic → modal s'ouvre avec placeholder
- [ ] Section Réalisations : 4 cards avec vraies captures (Atelier Rivage featured + 3 cards)
- [ ] Clic sur chaque card → ouvre la démo correspondante en nouvel onglet
- [ ] Section Approche · 3 engagements
- [ ] Section Diagnostic · CTA WhatsApp
- [ ] Footer · clic sur "Mentions légales" → ouvre `mentions-legales.html`
- [ ] Footer · clic sur "Mémoire & Présence" → ouvre GitHub Pages

**Mobile :** burger menu, cards en single column, CTA WhatsApp direct.

### 7. Vider cache

hPanel Hostinger → Avancé → Cache → Vider. Ou ajouter `?v=3` à l'URL.

---

## Photo de Micha → Mémoire & Présence

`assets/img/micha.jpg` (800×800, 89 Ko) prêt à uploader.

### Option GitHub web
1. **github.com/lauraliedaguzay-lang/memoireetpresence**
2. Trouve l'ancien `micha.jpg`
3. Delete → commit
4. Add file → Upload files → glisse `micha.jpg`
5. Commit → GitHub Pages se met à jour en 1-2 min

⚠️ **Vérifie le nom exact attendu** : ouvre `index.html` du repo, ctrl+F sur `micha`. Le nom du fichier doit matcher exactement.

---

## Test local avant upload

```bash
cd pinapp-deploy
python3 -m http.server 8000
```

Ouvre **http://localhost:8000** (pas double-clic, Atelier Rivage a besoin d'un vrai serveur HTTP pour les modules ES6).

---

## Prêt pour automatisations n8n

- **Diagnostic 24h** : bouton WhatsApp pré-rempli (`wa.me/33786173715?text=...`). Capture des leads WhatsApp possible via webhook n8n.
- **Form contact** : si tu veux ajouter un formulaire avec capture lead → Notion CRM, je peux fournir le code après brief.
- **Plausible Analytics** : à intégrer en 1 ligne dans le `<head>` quand prêt.

---

**Pinapp Studio · pinapp.fr · 29 avril 2026 · v2 final**
