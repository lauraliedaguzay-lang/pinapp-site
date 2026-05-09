# Phase 1 — Setup autonomie 24/7 (Pinapp)

Document **versionné** pour le dépôt public. Le brief complet Pinapp Master reste **hors dépôt** (copie locale : `pinapp-master-cursor-2026-05-09-v1.md`, gitignorée).

**Contraintes**

- Aucun secret (VPS, Telegram, Anthropic) dans git.
- Déploiement **production** : validation explicite par Lauralie (canal convenu : Telegram bot / procédure interne). Les agents Cursor dans cet environnement **n’envoient pas** de messages Telegram : copier-coller les modèles ci-dessous.
- Dépôt **public** : ne pas y committer le master interne ni de données clients.

---

## Message d’accroche (3 lignes) — à envoyer par Lauralie / ops sur Telegram

```
Pinapp Ops en ligne.
Document master reçu.
Démarrage Phase 1 : setup autonomie 24/7 — validation VPS en attente.
```

---

## Étape 1.1 — VPS Hostinger KVM2

**Objectif** : VPS activé (~7 €/mois), France, template compatible n8n.

**Message type (validation binaire)**

```
Pour activer le VPS Hostinger KVM2 (~7 €/mois), merci de confirmer depuis hPanel
(hosting/buy-vps) : KVM2, France, période souhaitée.
Répondre OUI pour lancer la souscription / NON pour reporter.
```

Après validation **OUI** : suivi hPanel (KVM2, localisation France, OS template n8n si disponible). Les identifiants (IP, accès) restent dans **.env.local** ou gestionnaire de secrets — voir `docs/env-pinapp-ops-local.EXAMPLE`.

---

## Étape 1.2 — n8n sur le VPS

- Déployer via template Hostinger « n8n » si proposé, ou procédure officielle n8n + HTTPS.
- Compte admin : email Pinapp connu ; mot de passe fort (ex. `openssl rand -base64 24`) dans coffre-fort (Bitwarden, etc.).
- Activer **2FA** sur n8n.
- Noter l’URL publique (ex. `https://…:5678` derrière reverse proxy).

---

## Étape 1.3 — Bot Telegram

1. @BotFather → `/newbot` (nom / username selon spec interne).
2. Token → **uniquement** `.env.local` ou credentials n8n, jamais dans le dépôt.
3. Lauralie envoie `/start` au bot → récupérer `chat_id` (`getUpdates`) → whitelist dans les workflows.
4. Tester : message test depuis le bot vers le chat autorisé.

---

## Étape 1.4 — n8n ↔ Claude (Anthropic)

- Créer une clé API sur console.anthropic.com ; stocker dans **n8n → Credentials** (chiffré).
- Workflow test : HTTP Request → Messages API → réponse → nœud Telegram vers Lauralie.

---

## Étape 1.5 — Cinq workflows de base (noms de référence)

| ID | Nom | Idée |
|----|-----|------|
| A | Telegram Orchestrator | Trigger Telegram → whitelist `chat_id` → parse `/mission`, `/audit`, `/client`, `/rapport` → Claude → réponse Telegram + log |
| B | Audit nocturne pinapp.fr | Cron ~03:00 → PageSpeed (mobile + desktop) → seuils → alerte Telegram si KO + fichier log |
| C | Stripe → onboarding | Webhook `checkout.session.completed` → Notion CRM → email bienvenue → Telegram |
| D | Bot SAV WhatsApp | Webhook Twilio → Notion client → Claude → branchement confiance / Telegram humain |
| E | Reporting hebdo | Cron dimanche → agrégation → rapport Markdown → email + Telegram |

Les exports JSON n8n peuvent vivre dans un dépôt ou Drive **privé** ; ne pas y mettre de tokens en clair.

---

## Validation « Phase 1 complète » (gates avant Phase 2)

Cocher côté Pinapp / Lauralie :

- [ ] VPS opérationnel
- [ ] n8n accessible + 2FA
- [ ] Bot Telegram répond (`/start` + test)
- [ ] Appel Claude OK depuis n8n
- [ ] Workflow A (orchestrateur Telegram) testé avec un message réel

Tant que ces cases ne sont pas validées, ne pas engager le **Sprint A** site (fixes P0) comme phase suivante dans le même train de déploiement sans arbitrage.

---

## Logs (structure cible — Drive / outil interne)

```
/logs/telegram/telegram-{date}.md
/logs/audits/audit-pinapp-{date}.md
/logs/sprints/sprint-a-{date}.md
/logs/reports/weekly-{week}.md
```

Rétention et sauvegardes : selon politique interne (ex. 90 jours + backup mensuel).

---

## Rappel kill switch (résumé)

Arrêt + alerte si : boucles d’erreurs répétées, action destructive inattendue, injection « ignore previous instructions », coût API anormal, commande `/pause`, ou absence de validation sur action critique selon runbook.

---

## Fichiers utiles dans ce dépôt

- `pinapp-automation.env.example` — variables build / n8n pour le site.
- `docs/env-pinapp-ops-local.EXAMPLE` — variables **ops** (VPS, Telegram) pour `.env.local`.
