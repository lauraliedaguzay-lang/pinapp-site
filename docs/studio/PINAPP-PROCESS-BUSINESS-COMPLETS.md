# PINAPP — Process business complets

Document de référence (avril 2026). Les **corps d’e-mails exploitables** pour n8n sont en UTF-8 dans `emails/sequences/` ; ce fichier rassemble la vision d’ensemble, la checklist papier et les liens techniques.

---

## 1. Séquences e-mail automatiques (n8n)

### Fichiers source (copier-coller dans n8n / Gmail)

| Séquence | Fichiers |
|----------|----------|
| **A — Post-diagnostic** | `emails/sequences/A1-post-diagnostic-immediat.txt` … `A4-post-diagnostic-j30.txt` |
| **B — Onboarding client** | `emails/sequences/B1-onboarding-immediat.txt` … `B5-onboarding-j7.txt` |
| **C — Kit Prompts** | `emails/sequences/C1-kit-prompts-immediat.txt` |

Détails workflow : `emails/sequences/README.txt`.

**Rappels liens publics** (déjà utilisés dans les modèles) :

- Réalisations / démos : `https://pinapp.fr/demo/`
- Article relance J+30 : `https://pinapp.fr/blog/automatisation-tpe/`
- Formation IA (ex. e-mail kit) : `https://pinapp.fr/formations/ia-collegue/`

Les **montants** mentionnés dans B4 (maintenance, formation, pack contenu) sont des **placeholders métier** : les aligner sur la grille tarifaire publiée (`/offres/`, formations) avant industrialisation dans n8n.

---

## 2. Notion CRM — template

Instructions détaillées (propriétés, vues, mapping n8n) : **`docs/notion-crm-prospects.md`**.

Résumé :

- Base **Prospects** avec colonnes Nom, Entreprise, Email, Téléphone, Secteur (35 secteurs = même vocabulaire que le `<select>` diagnostic), Besoin (multi-select), Budget, Statut, Source, dates, montant devis, notes, priorité, assignation.
- Vues : **Pipeline** (Kanban statut), **À relancer**, **Ce mois**, **Revenus** (somme montant si statut Signé).
- Webhook diagnostic → création page ; **Acquisition** alimentée par le champ JSON `acquisition_source` (voir ci-dessous).

---

## 3. Checklist onboarding client (PDF / impression)

Version texte prête à imprimer ou à coller dans un PDF :

**`docs/studio/CHECKLIST-ONBOARDING-CLIENT-pinapp.txt`**

---

## 4. QR code → diagnostic + tracking `source`

- **URL cible** : `https://pinapp.fr/diagnostic/?source=qr`
- **Fichiers générés** : `assets/images/qr-diagnostic.svg` (vectoriel, logo ananas centré, violet `#7B4FE8` sur blanc) et `assets/images/qr-diagnostic.png` (800×800, même rendu avec composite).
- **Script** : `tools/generate-qr.mjs` (Node + `qrcode` + `sharp` pour le PNG avec logo).
- **Regénérer** : à la racine du dépôt, `npm install` puis `npm run qr:diagnostic`.

### Formulaire diagnostic

Le champ caché et la logique **existent déjà** dans `diagnostic/index.html` (`#ppSource`) et dans `assets/js/diagnostic-native.js` : le JSON envoyé au webhook contient `acquisition_source` (valeur de `?source=` ou `?utm_source=`, sinon `direct`). Le champ fixe `source: 'pinapp.fr/diagnostic'` identifie le formulaire.

**Usages du QR** : carte de visite, plaquettes, véhicule, supports M&P, signature e-mail discrète, etc.

---

## 5. Index rapide dépôt

| Besoin | Emplacement |
|--------|-------------|
| Corps séquences A/B/C | `emails/sequences/*.txt` |
| README séquences | `emails/sequences/README.txt` |
| Notion + n8n | `docs/notion-crm-prospects.md` |
| Checklist imprimable | `docs/studio/CHECKLIST-ONBOARDING-CLIENT-pinapp.txt` |
| QR diagnostic | `tools/generate-qr.mjs` · `npm run qr:diagnostic` |
| Payload diagnostic | `assets/js/diagnostic-native.js` (`buildPayload`) |

---

© 2026 Pinapp — usage interne et livraison client alignés sur les engagements légaux (prix, TVA art. 293 B CGI, contenus publics).
