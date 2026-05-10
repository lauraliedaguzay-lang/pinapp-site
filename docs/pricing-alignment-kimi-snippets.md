# Alignement tarifs / packs (Kimi) — snippets pour docs & briefs

Ce fichier centralise les libellés validés lorsque le HTML source Kimi (`demo-b*.html`, `cabinet-renaud-avocat-T*.html`, etc.) n’existe pas encore dans le dépôt.

## Maison Solène (scroll-triggered spec)

- **Badge** : `Niveau Pack Signature · 3 890 € HT ★ PREMIUM` (remplace toute mention « Elite · 4 990 € HT »).

## Démo parfum / Three.js (mission 007 batch 3)

- **Badge** : `Niveau Pack Sur-Mesure · 5 990 € HT ★ PREMIUM` (remplace « Niveau Signature · 5 990 € HT »).
- **Mention réservée** : `Réservée niveau Sur-Mesure 5 990 € HT ★ PREMIUM`
- **Footer** : ajouter en fin de bloc : `Pinapp Care 79 €/mois (12 mois min)`.

## Fichiers HTML Kimi absents du dépôt (à créer ou coller depuis l’export chat)

| Fichier attendu par Kimi | Statut |
| --- | --- |
| `demo-b4-artisan-t0.html` | Couvert par `demo/artisan/index.html` (badge + footer alignés). |
| `studio-lena-extensions-cils-t1.html` | Couvert par `demo/extensions-cils/index.html`. |
| `demo-b1-photographe-t1.html` | Couvert par `demo/photographe/index.html`. |
| `demo-b6-immobilier-t5.html` | Couvert par `demo/immobilier.html`. |
| `cabinet-renaud-avocat-T3.html` → `T5` | Couvert par `demo/avocat/index.html` (équivalent Pack Signature). |
| `demo-b2-photographe-t3.html` → `t5` | Pas de second fichier photographe : voir `demo/photographe/index.html` unique. |
| `demo-b3-coach-psy-t3.html` → `t5` | Couvert par `demo/coach/index.html`. |
| `demo-b5-medical-t3.html` → `t5` | Aucune démo médicale dans le dépôt — à ajouter si un brief sectoriel santé est relancé (hors périmètre actuel). |

## Libellés interdits (contrôle QA)

Ne pas laisser dans le rendu : `Starter`, `Solo`, `Pro`, `Elite`, `Prestige`, `Basic` (sauf si encore présent hors périmètre pricing — à signaler en revue).
