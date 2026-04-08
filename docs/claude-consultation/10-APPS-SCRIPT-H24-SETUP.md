# 10 — Automatisation « H24 » : Gmail + Claude (Apps Script)

> **Objectif :** être **guidée en continu** par Claude sur les mails Pinapp : analyse et brouillons **sans envoi automatique** au client — vous gardez le dernier mot (aligné avec `02-MAIL-CLAUDE-BROUILLONS-DEVIS.md` et `PINAPP-WORKFLOW-MAIL-CLAUDE.md`).

## Ce que ça fait

1. Toutes les **5 minutes** (réglable), le script cherche des conversations Gmail avec l’étiquette **`Pinapp-À-traiter`** et **sans** `Pinapp-Traité-Claude`.
2. Pour chaque fil (par défaut **5 max** par passage, pour respecter les quotas), il envoie le dernier message reçu à **Claude** (API Anthropic).
3. Il crée un **brouillon** de réponse dans le fil, avec :
   - en tête : **repères internes** (actions pour vous) — **à supprimer avant envoi** si vous ne voulez pas les voir côté client ;
   - puis le **texte type client** extrait des marqueurs `===BROUILLON_CLIENT===`.
4. Il ajoute **`Pinapp-Traité-Claude`** pour ne pas retraiter la même conversation en boucle.

**Ce que ça ne fait pas :** envoyer des mails, signer des devis, promettre des montants sans votre validation.

## Prérequis

- Compte Google (Gmail) utilisé pour **Pinapp** (ex. `lauralie.daguzay@pinapp.fr`).
- Clé **ANTHROPIC_API_KEY** (console Anthropic).
- Étiquette Gmail **`Pinapp-À-traiter`** créée à la main ; vous l’appliquez aux mails entrants à analyser.

## Installation (15–20 min)

### 1. Créer le projet Apps Script

1. [script.google.com](https://script.google.com) → **Nouveau projet**.
2. Renommer le projet : ex. `Pinapp Gmail Claude`.
3. Supprimer le contenu par défaut, coller tout le fichier  
   `apps-script/pinapp-gmail-claude.gs` du dépôt `pinapp-site`.
4. **Enregistrer** (Ctrl+S).

### 2. Propriétés du script (clés)

1. **Paramètres du projet** (engrenage) → **Propriétés du script** → **Ajouter une propriété** :

| Propriété                | Valeur                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`      | Votre clé API                                                                                  |
| `CLAUDE_MODEL`           | (optionnel) ex. `claude-sonnet-4-20250514` ou `claude-3-5-haiku-20241022` pour réduire le coût |
| `MAX_THREADS`            | (optionnel) ex. `3` ou `8`                                                                     |
| `LABEL_IN` / `LABEL_OUT` | (optionnel) si vous renommez les étiquettes                                                    |

### 3. Autorisations

1. Dans l’éditeur, sélectionner la fonction **`pinappManualRun`** → **Exécuter**.
2. Accepter les autorisations **Gmail** et **URL externes** (appel api.anthropic.com).

### 4. Déclencheur « H24 »

1. Dans l’éditeur, exécuter une fois **`pinappInstallTriggerEvery5Minutes`** (menu déroulant des fonctions → Exécuter).
2. Vérifier dans **Déclencheurs** (horloge à gauche) : `runPinappClaudePass` — minuteur — toutes les **5** minutes.

Pour arrêter : exécuter **`pinappRemoveTriggers`**.

### 5. Gmail

1. Créer l’étiquette **`Pinapp-À-traiter`** (et idéalement **`Pinapp-Traité-Claude`** ; sinon le script la crée à la volée).
2. Règle Gmail filtre (ex.) : messages à `lauralie.daguzay@pinapp.fr` avec mot-clé → appliquer **`Pinapp-À-traiter`** (ou application manuelle).

### 6. Test

1. Envoyez-vous un mail de test, appliquez **`Pinapp-À-traiter`**, enlevez **`Pinapp-Traité-Claude`** si présent.
2. Exécuter **`pinappManualRun`**.
3. Ouvrir Gmail : un **brouillon** doit apparaître dans le fil ; le fil doit avoir **`Pinapp-Traité-Claude`**.

## Dépannage

- **Aucun fil trouvé :** tester la recherche Gmail manuellement (`label:Pinapp-À-traiter -label:Pinapp-Traité-Claude newer_than:7d`). Ajuster les noms d’étiquettes ou `LABEL_IN` / `LABEL_OUT`.
- **Erreur API :** vérifier la clé, le modèle (`CLAUDE_MODEL`), et le quota Anthropic.
- **Dernière limite :** Google impose des quotas `UrlFetchApp` ; `MAX_THREADS` bas + fréquence 5 min reste raisonnable pour une TPE.

## Complément : leads site (diagnostic)

Pour un **premier passage Claude** dès qu’un lead envoie le formulaire diagnostic (en plus du mail Netlify / Gmail), activez dans `assets/js/config.js` :

- `webhooks.diagnosticClaudePrep` → URL n8n (ou Make) ;
- `features.diagnosticClaudePrep: true` ;

Le site enverra le même JSON que pour `diagnostic-lead`, avec `intent: 'diagnostic-claude-prep'`, pour que votre orchestrateur appelle Claude et vous notifie (Slack, email interne, etc.) — **toujours sans envoi auto au prospect** si vous respectez la même règle métier.
