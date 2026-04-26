# Schéma workflows n8n — diagnostic voyage-v9

Documentation **aval webhook** : ce qui doit se passer dans n8n **après** réception du payload, **par tag de routage**. Le formulaire `voyage-v9/index.html` envoie un champ calculé côté client : `n8n_route_tag` (voir `telegram_digest` et logique submit).

---

## 1. Source de vérité (code)

**Référence unique** : objet JavaScript `n8nMap` + branche `auto-pack` dans `voyage-v9/index.html` (bloc inline du formulaire `#diag`).

Les workflows n8n et les noms de branches **doivent** aligner sur ces chaînes **exactes** (préfixe `#` inclus dans le tag émis quand le map renvoie une valeur avec `#`).

### 1.1 Carte statique `n8nMap` (clé `besoin` → tag)

| Valeur `besoin` (select) | `n8n_route_tag` émis |
|--------------------------|------------------------|
| `site-vitrine` | `#site-vitrine` |
| `ia-mesure` | `#ia-mesure` |
| `direction-artistique` | `#direction-artistique` |
| `duo-complet` | `#duo-complet` |
| `film-ia-cadeau` | `#film-ia-cadeau` |
| `film-ia-pro` | `#film-ia-pro` |
| `event-seminaire` | `#event-seminaire` |
| `event-prive` | `#event-prive` |
| `event-autre` | `#event-autre` |
| `form-l1` | `#form-l1` |
| `form-l2` | `#form-l2` |
| `form-l3` | `#form-l3` |
| `form-inconnu` | `#form-inconnu` |
| `unsure` | `#lead-unsure` |

**Note** : la clé `auto-pack` n’apparaît pas dans `n8nMap` ; elle est gérée à part (§1.2).

### 1.2 Branche `besoin === 'auto-pack'` (sous-scénario `auto_scenario`)

| Valeur `auto_scenario` (select) | `n8n_route_tag` émis |
|---------------------------------|----------------------|
| `auto-lead` | `#auto-lead` |
| `auto-devis` | `#auto-devis` |
| `auto-formation` | `#auto-formation` |
| `auto-livraison` | `#auto-livraison` |
| `auto-autre` | `#auto-autre` |
| (vide après normalisation) | `#auto-pack` |
| Valeur déjà préfixée `#…` | conservée telle quelle |

### 1.3 Cas hors map

Si `besoin` n’est pas reconnu : le code met `n8n_route_tag` à la chaîne **`—`** (tiret cadratin). Prévoir un chemin n8n « exception / log » ou rejet.

---

## 2. Décisions stratégiques actées

1. **Code = source de vérité** — Les workflows n8n portent les **mêmes noms / triggers** que les tags ci-dessus ; on ne renomme pas les tags pour coller à d’anciens noms de workflows.
2. **W1 = dispatch central unique** — Un seul webhook d’entrée (ex. « diagnostic voyage-v9 ») ; **aucun** tag ne court-circuite W1 ; traçabilité Notion sur toutes les entrées.
3. **Approbation humaine obligatoire** — Aligné avec `docs/PINAPP-WORKFLOW-MAIL-CLAUDE.md` : tout email structurant côté client passe par validation (ex. étape W9 Telegram « OK envoyer » avant envoi Gmail).
4. **Sous-scénarios auto conservés** — Les cinq tags `#auto-lead`, `#auto-devis`, `#auto-formation`, `#auto-livraison`, `#auto-autre` (+ repli `#auto-pack`) restent le contrat pour l’offre « Automatisation (pack n8n) ».
5. **M&P obsolète sur voyage-v9** — L’option formulaire `transmission` a été retirée (PR #64) ; le routage `#transmission` ne doit plus être attendu depuis cette page. Le site Mémoire & Présence reste un périmètre séparé (ex. W5 uniquement si tu branches un autre formulaire / domaine).

---

## 3. Flux cible (ASCII)

```
POST webhook W1 (payload diagnostic + n8n_route_tag)
        │
        ├─→ Notion : créer / mettre à jour fiche lead (champ Tag = n8n_route_tag)
        │
        ├─→ Switch sur n8n_route_tag ──→ W2 … Wn (un workflow ou sous-branche par tag)
        │
        ├─→ Telegram digest (résumé + tag) — optionnel mais recommandé
        │
        └─→ W9 validation humaine ──→ email confirmation / suite (si approuvé)
```

Remplacer `W2…Wn` par les IDs réels de tes workflows une fois renommés pour matcher les tags.

---

## 4. Par tag — comportement attendu après W1 (à compléter en ops)

Pour chaque ligne du tableau §1.1 et §1.2, documenter dans n8n (description du workflow) :

- **Notion** : statut initial, responsable, vue kanban.
- **Email** : sujet type, ton « patte Pinapp », pièces jointes éventuelles.
- **SLA** : ex. « réponse sous 24h » cohérent avec la promesse site.
- **Escalade** : si champ événement (`event_date`, `event_lieu`) ou film cadeau (`gift_recipient`) présent — quoi faire.

| Tag | Statut impl. (à cocher) | Notes |
|-----|-------------------------|-------|
| `#site-vitrine` | ☐ | |
| `#ia-mesure` | ☐ | |
| `#direction-artistique` | ☐ | |
| `#duo-complet` | ☐ | |
| `#film-ia-cadeau` | ☐ | Utiliser `gift_recipient` si renseigné |
| `#film-ia-pro` | ☐ | |
| `#event-seminaire` | ☐ | `event_date`, `event_lieu` |
| `#event-prive` | ☐ | idem |
| `#event-autre` | ☐ | idem |
| `#form-l1` | ☐ | |
| `#form-l2` | ☐ | |
| `#form-l3` | ☐ | |
| `#form-inconnu` | ☐ | |
| `#lead-unsure` | ☐ | Qualification manuelle |
| `#auto-pack` | ☐ | Repli si scénario auto vide |
| `#auto-lead` | ☐ | |
| `#auto-devis` | ☐ | |
| `#auto-formation` | ☐ | |
| `#auto-livraison` | ☐ | |
| `#auto-autre` | ☐ | |
| `—` (exception) | ☐ | Log / alerte |

---

## 5. Changements vs ancien `SCHEMA-FORM-COHERENT.md`

| Ancien schéma (pré-alignement code) | Ce document |
|--------------------------------------|---------------|
| Options / alias théoriques | Tags **réellement** émis par `n8nMap` + branche auto |
| Noms type `#site`, `#ia`, `#pack-duo` | `#site-vitrine`, `#ia-mesure`, `#duo-complet`, etc. |
| Mapping non versionné | Statut d’implémentation par workflow (§4) |
| Peu ou pas de spec email | 14+ variantes à rédiger + règles validation W9 |

L’ancien fichier `voyage-v9/SCHEMA-FORM-COHERENT.md` est conservé comme **legacy** avec renvoi ici.

---

## 6. Références croisées

- `docs/LEAD_FLOW.md` — pipeline Notion / scoring / Slack (à harmoniser avec `n8n_route_tag` si besoin).
- `docs/PINAPP-WORKFLOW-MAIL-CLAUDE.md` — brouillon Gmail, pas d’envoi auto des messages engageants.
- Code : `voyage-v9/index.html` — recherche `n8nMap` et `n8n_route_tag`.

---

## 7. Prochaines étapes ops (hors périmètre de ce fichier)

1. Activer W1 en prod (URL webhook réelle, feature flag / `PinappConfig` côté site).
2. Renommer ou dupliquer les workflows n8n pour matcher **exactement** les tags du §1.
3. Rédiger les gabarits d’email de confirmation par tag.
4. Finaliser la base Notion « Leads Pinapp » (schéma : `docs/LEAD_FLOW.md`).
5. Brancher le bot Telegram pour W9–W10 (validation avant envoi).
