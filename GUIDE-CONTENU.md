# Guide contenu — Lauralie & Micha

**Objectif :** ajouter **vidéos**, **photos**, **nouveaux sites démo** et autres visuels **sans deviner** où les mettre ni comment le site les charge.

**Règle d’or :** en production (`pinapp.fr`), les chemins publics commencent par **`/assets/...`** (racine du site). Vous déposez les fichiers dans le dossier du dépôt `pinapp-site/assets/...` avec les **mêmes noms** que ci‑dessous, sauf si vous mettez à jour le HTML/JS en même temps.

**Après chaque série de changements :** dans le dossier `pinapp-site`, lancer `.\pinapp.ps1 ci` (équivalent : `npm run ci` ; GitHub Actions le fait au push sur `main`).

---

## Sommaire

1. [Arborescence express](#1-arborescence-express)
2. [Vidéos](#2-vidéos)
3. [Photos & images fixes](#3-photos--images-fixes)
4. [Portfolio Micha (carousel Mémoire & Présence)](#4-portfolio-micha-carousel-mémoire--présence)
5. [Démos « sites vitrine » (secteurs)](#5-démos-sites-vitrine-secteurs)
6. [Créer une nouvelle page démo](#6-créer-une-nouvelle-page-démo)
7. [Fonds d’écran & partage réseaux](#7-fonds-décran--partage-réseaux)
8. [Motifs graphiques (optionnel)](#8-motifs-graphiques-optionnel)
9. [Automatisations (webhooks, formulaires)](#9-automatisations-webhooks-formulaires)
10. [Checklist avant publication](#10-checklist-avant-publication)

---

## 1. Arborescence express

| Dossier / fichier                    | À quoi ça sert                                                            |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `assets/video/`                      | Vidéo du **loader** (intro cinéma) — noms imposés, voir §2                |
| `assets/images/`                     | Images globales : logo, fonds Pandora, OG réseaux                         |
| `assets/images/micha/`               | **11 WebP** du portfolio carousel (noms imposés) — §4                     |
| `assets/js/demo-photo-packs.js`      | Photos des **démos secteur** (Unsplash ou vos URLs / chemins locaux) — §5 |
| `demo/<secteur>/index.html`          | Chaque **site démo** (HTML + script `PINAPP_DEMO_SITE`)                   |
| `realisations/index.html`            | Liens vers les démos (à mettre à jour si nouvelle démo)                   |
| `index.html`, `offres/index.html`, … | Pages vitrine Pinapp — textes, CTA, parfois images en dur                 |
| `assets/js/config.js`                | Webhooks n8n / flags — **pas** pour les médias ; voir §9                  |
| `tools/build-pages.mjs`              | Gabarit de pages générées (avancé)                                        |

**Documentation associée :**

- Automatisations : `AUTOMATIONS.md`
- Déploiement : `README.md`, `README-DEPLOIEMENT.md`
- Conformité design / audit : `docs/AUDIT-CAHIER-DES-CHARGES.md`

---

## 2. Vidéos

### Loader (toutes les pages qui affichent l’écran cinéma au chargement)

1. Exporter **deux** fichiers avec **exactement** ces noms :
   - `assets/video/pinapp-loader-intro.webm` (prioritaire, léger)
   - `assets/video/pinapp-loader-intro.mp4` (fallback Safari / iOS)
2. **Ne pas renommer** : le HTML référence ces noms partout ; si vous changez le nom, il faudra une recherche/remplacement dans tout le dépôt (`pinapp-loader-intro`).
3. **Autoplay** : le navigateur impose la vidéo **muette** au chargement. Pour une **voix IA audible** sans clic, il faut soit la **monter dans la vidéo** (image + son dans le même fichier, compréhension visuelle), soit prévoir plus tard un bouton « activer le son » (évolution code).

Détails techniques : `assets/video/README.txt`.

---

## 3. Photos & images fixes

| Fichier courant                           | Rôle                                      |
| ----------------------------------------- | ----------------------------------------- |
| `assets/images/pinapp-logo.png`           | Logo header / footer                      |
| `assets/images/bg-pandora-nuit.png`       | Fond nuit, poster du loader               |
| `assets/images/bg-pandora-jour.png`       | Fond jour                                 |
| `assets/images/og-pinapp-share.jpg`       | Aperçu lien (Open Graph) — beaucoup pages |
| `assets/images/bg-dark-pandora-apple.png` | Variante Apple / certaines pages          |

**Remplacer une image :** garder le **même nom de fichier** et écraser le fichier → aucune modification HTML nécessaire.

**Nouvelle image avec un nom nouveau :** chercher l’ancien nom dans le dépôt (recherche dans Cursor / VS Code) et remplacer par le nouveau chemin, ou demander une passe technique.

Formats recommandés : **WebP** pour le web ; PNG pour logos avec transparence si besoin.

---

## 4. Portfolio Micha (carousel Mémoire & Présence)

- **Dossier :** `assets/images/micha/`
- **Liste des noms :** `assets/images/micha/README.txt` (à jour avec les noms exacts).
- **Page qui les affiche :** `memoire-et-presence/index.html` — attributs `data-src="/assets/images/micha/....webp"` sur les items du carousel.

**Workflow simple :** exporter en WebP (~800×600 selon README), **même nom** que la liste → remplacer le fichier → recharger le site.

Pour **ajouter une vignette** ou changer le nombre d’items : modifier le HTML du carousel (structure répétée) + textes `data-alt`.

---

## 5. Démos « sites vitrine » (secteurs)

Les pages sous `demo/artisan/`, `demo/restaurant/`, etc. chargent des visuels via **`assets/js/demo-photo-packs.js`**.

- Chaque **clé** (`artisan`, `restaurant`, …) correspond au **`feature` ou au pack** utilisé dans le `<script>` de la page démo (`PINAPP_DEMO_SITE` + `Object.assign(..., PINAPP_DEMO_PHOTO_PACKS.xxx)`).
- Aujourd’hui les URLs pointent souvent vers **Unsplash** (fonction `img(...)` en tête de fichier).

**Pour mettre vos photos :**

1. Créer un sous-dossier propre, par ex. `assets/images/demos/artisan/`.
2. Y mettre `hero.webp`, `galerie-01.webp`, etc.
3. Dans `demo-photo-packs.js`, pour la clé concernée, remplacer les `img('...')` par des chaînes **`'/assets/images/demos/artisan/hero.webp'`** (chemin absolu depuis la racine du site).
4. Vérifier la page en local (`.\pinapp.ps1 dev`, ou `npm run dev`, ou ouverture du fichier selon votre habitude).

**Textes démo** (slogan, services, CTA) : dans le même `demo/.../index.html`, bloc `window.PINAPP_DEMO_SITE = { ... }`.

---

## 6. Créer une nouvelle page démo

1. **Dupliquer** un dossier proche, ex. `demo/artisan/` → `demo/mon-metier/`.
2. Dans `demo/mon-metier/index.html` :
   - `canonical`, `<title>`, `meta description`
   - Objet `PINAPP_DEMO_SITE` (nom, couleurs `accent`, textes)
   - Ligne `Object.assign(..., PINAPP_DEMO_PHOTO_PACKS.xxx)` : utiliser une **nouvelle clé** ou réutiliser un pack existant.
3. Dans `demo-photo-packs.js` : ajouter une entrée **`monMetier: { ... }`** calquée sur `artisan` si c’est un nouveau pack.
4. **Lien depuis le site :** `realisations/index.html` (ou menu) — ajouter une carte / lien vers `/demo/mon-metier/` (ou chemin relatif selon la page).
5. Lancer `.\pinapp.ps1 ci` (ou `npm run ci`) avant commit.

---

## 7. Fonds d’écran & partage réseaux

- Fonds : §3.
- **Image de partage** (`og:image`) : souvent `https://pinapp.fr/assets/images/og-pinapp-share.jpg` dans les `<meta>` — remplacer le **fichier** ou mettre à jour l’URL dans chaque page concernée si vous utilisez un autre nom.

---

## 8. Motifs graphiques (optionnel)

- Fichier : `assets/css/pinapp-audit-harmony.css` (importé globalement).
- Sur une page à sections plein écran : ajouter **`class="pinapp-da-page"`** sur `<main>` + **`pinapp-da-kicker`** sur les `span.label` de section pour le style « audit / Pandora ».
- Utilitaires : `.pinapp-da-strip`, `.pinapp-da-orbit` — voir commentaires en tête du fichier CSS.

---

## 9. Automatisations (webhooks, formulaires)

**Ce n’est pas où l’on met les médias**, mais la config à compléter pour les formulaires :

- **`AUTOMATIONS.md`** — procédure complète.
- **`assets/js/config.js`** — URLs n8n et flags ; en tête du fichier : rappel injection au build.
- **`pinapp-automation.env.example`** → copier en `pinapp-automation.env` (non versionné) pour build local.

---

## 10. Checklist avant publication

- [ ] Fichiers médias aux **bons chemins** et **bons noms** (ou HTML/JS mis à jour).
- [ ] **Alt** descriptifs sur les images importantes (`data-alt`, `alt=`).
- [ ] **WebP** compressé (éviter les 5 Mo+ sur la home).
- [ ] `.\pinapp.ps1 ci` (ou `npm run ci`) **vert** en local.
- [ ] Sur GitHub : push sur `main` → workflow Pages + injection automatisations si secrets définis.

---

## En résumé

| Vous voulez…           | Où / quoi                                                               |
| ---------------------- | ----------------------------------------------------------------------- |
| Vidéo loader           | `assets/video/pinapp-loader-intro.webm` + `.mp4`                        |
| 11 visuels portfolio   | `assets/images/micha/*.webp` — noms dans `micha/README.txt`             |
| Photos démo secteur    | `demo-photo-packs.js` + optionnellement `assets/images/demos/...`       |
| Nouveau mini-site démo | Nouveau dossier sous `demo/` + entrée dans `demo-photo-packs.js` + lien |
| Logo / fond / OG       | Remplacer fichiers sous `assets/images/` (noms existants)               |
| Formulaires / n8n      | `AUTOMATIONS.md` + `config.js` + secrets GitHub                         |

Pour toute **nouvelle convention** (nouveau dossier média, template vidéo page intérieure), ajoutez une ligne dans ce guide pour que la prochaine mise à jour reste claire pour vous deux.
