# 06 — Veille tech, RH, administratif (Pinapp)

> **GitHub :** [ce fichier](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/06-VEILLE-RH-ADMIN.md) · [dossier `claude-consultation`](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation)

## Intention

- **E-mails réguliers** qui listent **nouveautés tech** pertinentes pour **pinapp-site** et proposent des **actions** + **prompts Cursor** pour demander des mises à jour de code.
- **RH** : rappels, checklists, brouillons — **pas** de gestion de paie ou déclarations légales définitives sans humain / expert.
- **Administratif** : synthèse des échéances, liens Drive, brouillons de courriers.

## Livrable attendu de Claude (avis externe)

1. Quelle stack **no-code** (Make vs Apps Script vs GitHub Actions) pour **agréger** RSS + Dependabot + envoyer **un** digest hebdo ?
2. Comment éviter le **bruit** (trop de mails) tout en ne **ratant** pas les correctifs sécurité ?
3. Côté **RH micro-entreprise / société** : quelles tâches sont **raisonnablement** automatisables en **rappel** vs **interdit / déconseillé** en full-auto ?
4. Modèle de **registre RGPD minimal** si les scénarios touchent à des données clients dans Gmail/Sheets.

## Fichiers détaillés dans le dépôt

- Modèles de corps d’e-mail : `docs/automation/DIGESTS-EMAIL-PINAPP.md`
- Règle Cursor : `.cursor/rules/pinapp-veille-rh-admin.mdc`
- Pilotage duo (console + rôles) : `docs/studio/ADMINISTRATION-INTELLIGENTE.md` et onglet **Gestion studio** sous `/admin/`
- Veille **offres site + IA créative** (Higgsfield, vidéo/photo, Adobe) : `docs/automation/VEILLE-IA-CREATIVE-PINAPP.md`

## Rappel honnête

Aucun système ne remplace **24h/24** une **décision humaine** pour tout ce qui **engage** juridiquement ou financièrement. L’objectif est **réduction de charge cognitive**, pas disparition de la responsabilité.
