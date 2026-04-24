# PATCH — Direction artistique + retrait M&P zombie (micro-commit PR #64)

Micro-commit sur `cursor/voyage-v9-audit-fixes-0309` avant merge PR #64.

## Modifs

1. **`<optgroup label="Prestations">`** : ajout `<option value="direction-artistique">Direction artistique</option>` après `ia-mesure` ; suppression `<option value="transmission">…</option>`.
2. **`n8nMap`** : ajout `'direction-artistique': '#direction-artistique'` ; suppression `'transmission': '#transmission'`.

Footer Mémoire & Présence (lien externe) **inchangé**.

## Validation bash

```bash
FILE=voyage-v9/index.html
grep -c 'value="direction-artistique"' "$FILE"   # attendu 1
grep -c "'direction-artistique': '#direction-artistique'" "$FILE"  # attendu 1
grep -c 'value="transmission"' "$FILE"           # attendu 0
grep -c "'transmission': '#transmission'" "$FILE"  # attendu 0
grep -c "memoireetpresence.fr" "$FILE"          # attendu >= 1
```
