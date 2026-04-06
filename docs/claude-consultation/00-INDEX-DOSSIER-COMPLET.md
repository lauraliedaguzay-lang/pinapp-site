# Dossier complet Pinapp — analyse Claude

## Source canonique : GitHub

Tout le dossier est lisible et à jour sur **GitHub** (branche `main`) :

**[→ Ouvrir le dossier `docs/claude-consultation` sur GitHub](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation)**

| Fichier | Lien GitHub |
|---------|-------------|
| Index (ce fichier) | [00-INDEX-DOSSIER-COMPLET.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/00-INDEX-DOSSIER-COMPLET.md) |
| Ancien index court | [00-INDEX.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/00-INDEX.md) |
| 01 — Contexte site | [01-CONTEXTE-ET-SITE.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/01-CONTEXTE-ET-SITE.md) |
| 02 — Mail / devis | [02-MAIL-CLAUDE-BROUILLONS-DEVIS.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/02-MAIL-CLAUDE-BROUILLONS-DEVIS.md) |
| 03 — Réseaux sociaux | [03-RESEAUX-SOCIAUX-AUTO.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/03-RESEAUX-SOCIAUX-AUTO.md) |
| 04 — Ops H24 | [04-OPS-H24.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/04-OPS-H24.md) |
| 05 — Questions | [05-QUESTIONS-POUR-CLAUDE.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/05-QUESTIONS-POUR-CLAUDE.md) |
| 06 — Veille / RH / admin | [06-VEILLE-RH-ADMIN.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/06-VEILLE-RH-ADMIN.md) |
| 07 — Synthèse règles | [07-SYNTHESE-REGLES-PROJET.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/07-SYNTHESE-REGLES-PROJET.md) |
| 08 — Modèles e-mail | [08-ANNEXE-MODELES-EMAIL.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/08-ANNEXE-MODELES-EMAIL.md) |

**Dépôt :** [github.com/lauraliedaguzay-lang/pinapp-site](https://github.com/lauraliedaguzay-lang/pinapp-site)

> `https://pinapp.fr/docs/claude-consultation/` : si cette URL est déployée, la page `index.html` **redirige** vers le dossier GitHub ci-dessus (le domaine peut ne pas publier `/docs` selon l’hébergeur).

## Objectif de ce dossier

Fournir **tout le contexte nécessaire** pour une **analyse critique** (architecture, risques, roadmap, incohérences) du projet **Pinapp Studio** et de ses **automatisations prévues** — **sans autre marque** que Pinapp.

## Contenu : ordre de lecture

| # | Fichier | Rôle |
|---|---------|------|
| 0 | **Ce fichier** | Plan + liens GitHub + consigne Claude |
| 1 | `01-CONTEXTE-ET-SITE.md` | Marque, URLs, stack, état réel des formulaires |
| 2 | `02-MAIL-CLAUDE-BROUILLONS-DEVIS.md` | Mail passif, brouillons, devis, contexte neuf post-signature |
| 3 | `03-RESEAUX-SOCIAUX-AUTO.md` | Social assisté + validation |
| 4 | `04-OPS-H24.md` | Site toujours en ligne |
| 5 | `05-QUESTIONS-POUR-CLAUDE.md` | **Questions obligatoires** — y répondre point par point |
| 6 | `06-VEILLE-RH-ADMIN.md` | Veille tech par mail, RH/admin assistés, limites |
| 7 | `07-SYNTHESE-REGLES-PROJET.md` | Synthèse des règles internes Cursor / produit (peut diverger du code) |
| 8 | `08-ANNEXE-MODELES-EMAIL.md` | Modèles de corps d’e-mail (veille, sécurité, RH/admin) |

## Consigne à coller pour Claude (copier tout le bloc)

```
MISSION — Analyse dossier « claude-consultation » (Pinapp uniquement)

Tu es consultant senior (produit + tech + conformité France / RGPD, niveau praticien).
1) Lis les fichiers 01 à 08 dans l’ordre sur GitHub :
   https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation
2) Réponds à TOUTES les questions du fichier 05-QUESTIONS-POUR-CLAUDE.md, numérotation respectée.
3) Signale les INCOHÉRENCES entre (a) le code/site décrit en 01, (b) les règles résumées en 07, (c) les ambitions décrites en 02–04 et 06–08.
4) Produit une roadmap MVP → V2 (4 à 8 étapes) réaliste pour UNE personne + outils no-code/scripts.
5) Ne invente pas de clés API ni d’obligations légales précises sans nuance — indique quand il faut un expert-comptable ou juriste.

Langue : français. Ton : direct, actionnable.
```

## Après analyse

Les sorties attendues : **verdicts par bloc**, **risques**, **priorisation**, **ce qu’il faut corriger en premier** dans le dépôt ou dans les process.
