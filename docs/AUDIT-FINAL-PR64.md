# Audit final — PR #64 (Voyage V9 + correctifs)

**Référence branche analysée :** `origin/cursor/voyage-v9-audit-fixes-0309`  
**Équivalence post-merge :** identique au contenu fichier après `git merge --no-ff` (le merge n’altère pas les fichiers sources).

## Résultat consolidé

| Axe | Note | Évolution (indicatif) |
|-----|------|------------------------|
| WCAG 2.1 AA | **9/10** | +1.5 |
| Narrative | **8.5/10** | +2 |
| UX visuelle | **8/10** | +1 |
| Brand voice | **9.5/10** | +0.2 |
| Form ↔ n8n routage | **15/15** | (4/13 → 15/15) |
| **Moyenne** | **~9.0/10** | **+2.2 vs ~6.8/10 départ** |

## Blockers initiaux — résolus (rappel)

- Contraste `--ivoire-mute` 0.48 → **0.62** (ratio renforcé sur fond sombre).
- Labels formulaire diagnostic : **`.diag__label` visibles** (plus SR-only seul).
- Carrousel Rivage : pattern **toolbar** + états clavier (APG cohérent).
- Routage n8n / tags : **couverture des besoins** (Pack Duo, auto, IA, DA, formations, etc.).

## R1 — photos hero

Les **6** fichiers `hero-1..6.webp` restent la référence scène ; pas de remplacement par Unsplash sur le stage principal. Les aperçus sectoriels `.real` utilisent Unsplash sectoriel (voir `voyage-v9/PATCH-APERCUS-UNSPLASH.md`).

## Priorités v+1 (hors scope PR #64)

1. **Star Wars** joué plusieurs fois → réduire la redondance (ex. teaser s05c vs hero + climax s11).
2. **Sous-scènes s05a–s05f** : densité narrative — fusion / repli (ex. formations en section dédiée).
3. **Démo Lauralie** : mise en avant pleine largeur pour équilibrer la parité visuelle / mentions.
4. **Formulaire** : message contextuel **Pack Duo** si absent.
5. **Copy** : repasses sur formulations (ex. « Hollywood à votre nom », ton témoignages, disclaimer « familles » vs secteur B2B).
6. **IP tierces** (Star Wars, Walker, Resident Evil) : cadre légal / hommage dans CGV ou retrait des noms marque.

## Merge (machine locale avec auth GitHub)

```powershell
cd C:\Users\Lauralie\Projects\pinapp-site
git fetch origin
git checkout main
git pull
git merge origin/cursor/voyage-v9-audit-fixes-0309 --no-ff -m "merge: audit fixes + glass + passe 10/10 + form DA/M&P + 14 aperçus Unsplash + photo-packs (PR #64)"
git push origin main
```

---

*Snapshot audit — avril 2026. Contenu aligné sur le rapport agents consolidé post-PR #64.*
