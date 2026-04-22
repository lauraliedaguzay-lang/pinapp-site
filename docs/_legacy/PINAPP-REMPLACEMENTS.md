# Marqueurs à remplacer (`[[PINAPP_TODO:…]]`)

Dans VS Code / Cursor : recherche globale **`[[PINAPP_TODO:`** (ou `PINAPP_TODO` dans les commentaires).  
Remplace chaque bloc par ta valeur, puis supprime le marqueur.

**Astuce :** pour l’email, utilise **« remplacer tout »** sur `[[PINAPP_TODO:email_contact]]` avec la même adresse partout (légal, footer accueil, JSON-LD, accessibilité, éthique…).

---

## `[[PINAPP_TODO:email_contact]]`

| Zone                                                                                                    |
| ------------------------------------------------------------------------------------------------------- |
| `index.html` (footer + JSON-LD Organization)                                                            |
| `legal/mentions-legales.html`, `confidentialite.html`, `cgv.html`, `ethique.html`, `accessibilite.html` |

---

## Légal (identité entreprise)

| Clé                                    | Fichiers                                                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `[[PINAPP_TODO:raison_sociale]]`       | `legal/mentions-legales.html`                                                                                                                   |
| `[[PINAPP_TODO:forme_juridique]]`      | idem                                                                                                                                            |
| SIRET (renseigné)                      | `legal/mentions-legales.html` : **523 884 898 00017** — doc interne = partenaire Michaël ; remplacer si l’éditeur légal est une autre structure |
| `[[PINAPP_TODO:adresse_siege]]`        | `mentions-legales.html`, `confidentialite.html`, `cgv.html`                                                                                     |
| `[[PINAPP_TODO:nom_famille_lauralie]]` | `mentions-legales.html` (directrice de publication)                                                                                             |
| `[[PINAPP_TODO:credits_fonds_ecran]]`  | `mentions-legales.html` (crédits visuels de fond)                                                                                               |

---

## Mémoire & Présence (`memoire-et-presence/index.html`)

| Clé                                          |
| -------------------------------------------- |
| `[[PINAPP_TODO:mp_sous_titre_ligne]]`        |
| `[[PINAPP_TODO:mp_ligne1]]`                  |
| `[[PINAPP_TODO:mp_ligne2]]`                  |
| `[[PINAPP_TODO:mp_ligne3]]`                  |
| `[[PINAPP_TODO:mp_lien_partenaire_url]]`     |
| `[[PINAPP_TODO:mp_lien_partenaire_libelle]]` |

---

## Technique (hors marqueurs HTML)

| Élément                     | Où                                                                            |
| --------------------------- | ----------------------------------------------------------------------------- |
| `WEBHOOK_N8N`               | `index.html` → `window.__PINAPP__` ; optionnel `data-webhook` sur `#obForm`   |
| Webhooks n8n, feature flags | `assets/js/config.js` — remplacer `[TON-N8N]`, activer `features.*`           |
| WhatsApp                    | `assets/js/config.js` → `whatsapp` (URL `wa.me`)                              |
| Stripe formations           | `offres/formation/index.html` → `STRIPE_FORMATION_*`, `STRIPE_PACK_PROMPTING` |
| Notion, Gmail, etc.         | `CHECKLIST-LANCEMENT.md`                                                      |

---

## Routes créées pour combler les liens cassés

- **`formations/index.html`** — redirection `noindex` vers `offres/formation/`.
- **`memoire-et-presence/index.html`** — page brouillon à personnaliser.

Après remplacement : `.\pinapp.ps1 ci` (ou `npm run ci`), puis vérification manuelle des liens `mailto:`, paiements et workflows n8n.
