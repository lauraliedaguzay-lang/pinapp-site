# Stripe — Kit Prompt Artisan à 19,90 € TTC

Ce guide complète la configuration **côté Stripe et n8n**. Le site pointe déjà vers `https://pinapp.fr/merci-kit/` après paiement (à renseigner dans le **lien de paiement** Stripe) et les boutons d’achat utilisent `STRIPE_KIT_PAYMENT_LINK` dans `formations/kit-prompts/index.html`.

---

## 1. Compte Stripe

1. [Créer un compte](https://dashboard.stripe.com/register) avec l’e-mail pro (ex. contact@pinapp.fr).
2. Compléter la vérification (SIRET, identité, RIB).
3. Passer en **mode Live** (pas test) avant tout encaissement réel.

---

## 2. Produit et prix

1. Dashboard Stripe → **Produits** → **Ajouter un produit**.
2. **Nom** : `Kit Prompt Artisan — 50 prompts IA`
3. **Description** (exemple) :  
   `50 prompts IA prêts à l'emploi pour artisans et indépendants. PDF + Notion. Mises à jour gratuites 1 an.`
4. **Prix** : **19,90 €**, paiement unique (TVA non applicable art. 293 B CGI — cohérent avec l’étiquette sur `pinapp.fr`).
5. **Image** : capture de couverture du PDF (optionnel mais recommandé).

---

## 3. Lien de paiement

1. Dashboard → **Liens de paiement** → **Créer**.
2. Sélectionner le produit ci-dessus.
3. Options utiles : demander **e-mail** et **nom** ; codes promo si vous le souhaitez.
4. **Page de confirmation** : URL personnalisée → `https://pinapp.fr/merci-kit/`
5. Copier l’URL du type `https://buy.stripe.com/xxxxx`

### Brancher sur le site

Dans `formations/kit-prompts/index.html`, en bas de page, remplacer la valeur de `STRIPE_KIT_PAYMENT_LINK` par cette URL (sans laisser `REMPLACER_KIT_1990`). Tant que l’URL contient `REMPLACER`, les boutons « Acheter » tombent en secours **mailto** vers contact@pinapp.fr.

---

## 4. Page merci (`/merci-kit/`)

Fichier : `merci-kit/index.html`

- Bouton **PDF** : `assets/files/kit-prompt-artisan-v1.pdf` (à déposer sur l’hébergement).
- Bouton **Notion** : remplacer `NOTION_KIT` dans le script en bas par l’URL publique de la page Notion.

---

## 5. Webhook Stripe → n8n

1. Dans n8n : workflow déclenché par **Webhook** (ou nœud Stripe natif) sur l’événement **`checkout.session.completed`**.
2. Extraire **e-mail** et **nom** du client depuis la session.
3. Envoyer l’e-mail avec les liens (PDF + Notion) — modèle : `emails/sequences/C1-kit-prompts-immediat.txt`.
4. Notification **Telegram** (optionnel) : `Vente Kit Prompts — [nom] — 19,90 €`.
5. Écrire une ligne dans **Notion** ou **Google Sheet** (CRM).

**Stripe** : Développeurs → **Webhooks** → Ajouter l’URL du webhook n8n → événement `checkout.session.completed` → copier le **secret de signature** dans n8n pour valider les payloads.

---

## 6. Références dépôt

| Élément | Chemin |
|--------|--------|
| Page de vente | `formations/kit-prompts/index.html` |
| Page merci | `merci-kit/index.html` |
| E-mail post-achat (texte) | `emails/sequences/C1-kit-prompts-immediat.txt` |
| Workflows n8n (notes) | `n8n-workflows/README.md` |

---

_Document interne Pinapp — avril 2026._
