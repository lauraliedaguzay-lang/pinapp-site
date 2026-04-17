# Stripe — Kits Prompt Artisan (3 paliers TTC)

Ce guide complète la configuration **côté Stripe et n8n**. Après paiement, les liens de paiement peuvent rediriger vers `https://pinapp.fr/merci-kit/`. Sur le site, les boutons utilisent l’objet `STRIPE_KIT_LINKS` dans `formations/kit-prompts/index.html` (attribut `data-pinapp-kit-tier` : `pro` | `complet` | `essentiel`).

| Palier    | Prix TTC | Contenu résumé                                    |
| --------- | -------- | ------------------------------------------------- |
| Essentiel | 29 €     | 20 prompts (rédaction + réseaux + gestion)        |
| Complet   | 49 €     | 50 prompts, 7 catégories, PDF + Notion, MAJ 1 an  |
| Pro       | 149 €    | Complet + 1 h formation live + assistant IA perso |

TVA non applicable art. 293 B CGI — prix affichés TTC comme sur l’étiquette client.

---

## 1. Compte Stripe

1. [Créer un compte](https://dashboard.stripe.com/register) avec l’e-mail pro (ex. contact@pinapp.fr).
2. Compléter la vérification (SIRET, identité, RIB).
3. Passer en **mode Live** avant tout encaissement réel.

---

## 2. Trois produits et trois prix

Pour chaque palier : **Produits** → **Ajouter un produit**, puis un **prix** en paiement unique (EUR).

1. **Kit Essentiel — 20 prompts IA** — **29,00 €** TTC  
   Description (ex.) : sélection 20 prompts — rédaction, réseaux, gestion.

2. **Kit Complet — 50 prompts IA** — **49,00 €** TTC  
   Description : 50 prompts, 7 catégories, PDF + Notion, mises à jour 1 an.

3. **Kit Pro — 50 prompts + live + assistant** — **149,00 €** TTC  
   Description : tout le Complet + 1 h de formation live + mise en forme assistant IA métier.

_(Optionnel : une image par produit — couverture PDF.)_

---

## 3. Trois liens de paiement

1. **Liens de paiement** → **Créer** (×3).
2. Pour chaque lien : rattacher le **produit / prix** correspondant.
3. Demander **e-mail** et **nom** ; page de confirmation → `https://pinapp.fr/merci-kit/` (ou pages distinctes si vous segmentez plus tard).
4. Copier chaque URL `https://buy.stripe.com/...`

### Brancher sur le site

Dans `formations/kit-prompts/index.html`, script en bas de page : remplir `STRIPE_KIT_LINKS` :

- `pro` → URL du lien 149 €
- `complet` → URL du lien 49 €
- `essentiel` → URL du lien 29 €

Tant qu’une URL contient encore `REMPLACER`, le bouton de ce palier bascule en **mailto** pré-rempli vers contact@pinapp.fr.

---

## 4. Page merci (`/merci-kit/`)

Fichier : `merci-kit/index.html`

- Si un seul parcours post-achat : boutons **PDF** / **Notion** pour le **Complet** ; pour Essentiel / Pro, prévoir e-mail n8n avec le bon bundle ou des variantes de page selon `client_reference_id` (évolution).

---

## 5. Webhook Stripe → n8n

1. Workflow déclenché sur **`checkout.session.completed`**.
2. Lire **e-mail**, **nom**, et **ligne(s) de commande** ou **metadata** pour savoir quel palier a été payé (recommandé : **metadata** `tier` = `essentiel` | `complet` | `pro` sur chaque Payment Link).
3. Envoyer l’e-mail avec les bons liens — modèle de base : `emails/sequences/C1-kit-prompts-immediat.txt` (à adapter si livrables différents par palier).
4. Notification **Telegram** (optionnel) : `Vente Kit — [nom] — [palier] — [montant]`.
5. Ligne **Notion** / **Sheet** CRM.

**Webhooks** : URL n8n → secret de signature dans n8n.

---

## 6. Références dépôt

| Élément           | Chemin                                         |
| ----------------- | ---------------------------------------------- |
| Page de vente     | `formations/kit-prompts/index.html`            |
| Page merci        | `merci-kit/index.html`                         |
| E-mail post-achat | `emails/sequences/C1-kit-prompts-immediat.txt` |
| Workflows n8n     | `n8n-workflows/README.md`                      |

---

_Document interne Pinapp — avril 2026._
