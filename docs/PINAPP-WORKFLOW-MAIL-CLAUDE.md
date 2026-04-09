# Workflow mail Pinapp + Claude (spécification)

Périmètre : **Pinapp uniquement**. Objectif : Lauralie **valide toujours** ; Claude **analyse et propose** ; après **devis accepté**, chaque traitement repart sur un **contexte neuf**.

---

## 1. Principe : passif mais pas automatique vers le client

| Élément            | Règle                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Analyse            | Claude lit le mail / le fil et sort une **liste d’actions** + un **brouillon de réponse**.                                 |
| Envoi client       | **Uniquement** après ouverture du brouillon dans Gmail et clic **Envoyer** par Lauralie (ou édition puis envoi).           |
| Script Apps Script | `GmailApp.createDraft(...)` pour les propositions ; **pas** de `sendEmail` vers le client pour le corps généré par Claude. |

Les accusés de réception automatiques éventuels (hors Claude) doivent être **décrits à part** et rester neutres, si tu en ajoutes un jour.

---

## 2. Confirmation obligatoire

- Tout ce qui engage (prix, date, périmètre, « oui j’accepte ») : **brouillon uniquement**.
- Lauralie = **dernière validation humaine** avant tout message sortant structurant la relation.

---

## 3. Nouvelle « conversation » Claude quand le devis est accepté

**Problème** : réutiliser tout l’historique pré-vente pollue la phase livraison (ton commercial, vieilles objections).

**Règle métier** : à la date / événement **devis accepté** :

1. **Figér un brief dossier** (manuel ou semi-auto) : offre acceptée, montant TTC/HT, délai, livrables, email client, contraintes.
2. Les appels Claude **post-acceptation** utilisent **ce brief** + **les mails récents de la phase production** — **sans** coller les 40 messages de négociation.
3. Côté **API Anthropic** : ne pas enchaîner sur un ancien `response_id` ou une « conversation » longue pour la phase exécution ; traiter comme **session indépendante** avec prompt système adapté (« tu es en phase livraison Pinapp, le devis est signé, voici le brief »).

**Signal côté Gmail (exemple)** : label `Pinapp-Devis-accepté` ou `Pinapp-Production` sur le fil ; le script choisit le **prompt pack** « production » et injecte le brief, pas l’historique complet.

---

## 4. Labels suggérés

- `Pinapp-À-traiter` — mail entrant à analyser.
- `Pinapp-Suivi` — fil actif avant signature.
- `Pinapp-Devis-accepté` — bascule contexte neuf + brief obligatoire.
- `Pinapp-Traité-Claude` — éviter de retraiter le même message en boucle (optionnel).

---

## 5. Sortie attendue de Claude (marqueurs)

Pour faciliter le parsing dans un brouillon Gmail :

```
===ACTIONS_LAURALIE===
1. …
2. …
===FIN_ACTIONS===

===BROUILLON_CLIENT===
(texte prêt à envoyer, ton Pinapp)
===FIN_BROUILLON===
```

Lauralie supprime les blocs confidentiels avant envoi si le brouillon est structuré comme sur Mémoire & Présence (tout en bas du brouillon).

---

## 6. Implémentation technique (livré dans le dépôt)

1. **Gmail + Claude en continu :** `apps-script/pinapp-gmail-claude.gs` + guide `docs/claude-consultation/10-APPS-SCRIPT-H24-SETUP.md` — déclencheur toutes les 5 min, brouillons uniquement, clé API en **Propriétés du script** (pas dans Git).
2. **Lead diagnostic → orchestrateur (optionnel) :** `assets/js/config.js` — `diagnosticClaudePrep` + flag `diagnosticClaudePrep` pour envoyer le payload à n8n/Make (premier passage Claude / notification interne), **sans** envoi auto au prospect si vous respectez la règle §1.
