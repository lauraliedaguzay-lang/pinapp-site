#!/usr/bin/env bash
# Audit post-push branche refonte V5 (voyage-v9).
# Usage : ./scripts/audit-voyage-v5-post-push.sh [BRANCH]
# Défaut BRANCH=origin/cursor/voyage-v9-refonte-v5-0309

set -euo pipefail
BRANCH="${1:-origin/cursor/voyage-v9-refonte-v5-0309}"

git fetch origin

echo "=== R1 · Photos hero byte-identiques (6/6 attendu) ==="
for i in 1 2 3 4 5 6; do
  a=$(git ls-tree origin/main -- "voyage-v9/assets/hero-$i.webp" 2>/dev/null | awk '{print $3}' || true)
  b=$(git ls-tree "$BRANCH" -- "voyage-v9/assets/hero-$i.webp" 2>/dev/null | awk '{print $3}' || true)
  if [ -n "$a" ] && [ "$a" = "$b" ]; then
    echo "  hero-$i OK"
  else
    echo "  hero-$i DIFF ou fichier absent sur une des branches"
  fi
done

TMP="${TMPDIR:-/tmp}/v5-audit-index.html"
if ! git show "${BRANCH}:voyage-v9/index.html" > "$TMP" 2>/dev/null; then
  echo ""
  echo "ERREUR : pas de voyage-v9/index.html sur $BRANCH (branche absente ou fichier manquant)."
  exit 1
fi

echo ""
echo "=== Sections id=s… (comptage brut, ajuster seuil selon spec) ==="
grep -cE 'id="s[0-9]+[a-z]?"' "$TMP" || true

echo ""
echo "=== IDs Vimeo (attendu : 4 uniques 118429…) ==="
grep -oE '118429[0-9]+' "$TMP" | sort -u || true

echo ""
echo "=== Mariages (cible 0) ==="
grep -ci 'mariage' "$TMP" || true

echo ""
echo "=== Chaîne 1 890 (pack + RE, ajuster seuil) ==="
grep -c '1 890' "$TMP" || true

echo ""
echo "=== Easter egg STAY / M&P ==="
grep -cE 'stay-modal|memoireetpresence' "$TMP" || true

echo ""
echo "=== Spider-Man whisper (snippet attendu) ==="
grep -cF 'Pas chez les autres. Chez nous, si' "$TMP" || true

echo ""
echo "=== Form chemins (adapter regex si implémentation change) ==="
grep -cE 'path.*tech|path.*image|path.*duo|data-path|diag__path' "$TMP" || true

echo ""
echo "=== JSON-LD ==="
grep -c 'LocalBusiness' "$TMP" || true
grep -c 'FAQPage' "$TMP" || true

echo ""
echo "=== Open Graph ==="
grep -c 'property="og:' "$TMP" || true

echo ""
echo "=== Taste-design (indicateurs) ==="
echo "  #000000 : $(grep -c '#000000' "$TMP" || true)"
echo "  h-screen (classe utilitaire) : $(grep -c 'h-screen' "$TMP" || true)"
echo "  100dvh : $(grep -c '100dvh' "$TMP" || true)"
echo "  scroll to explore (insensible à la casse) : $(grep -ciE 'scroll to explore|scroll down to' "$TMP" || true)"
echo "  Elevate / Seamless / Unleash / Next-Gen : $(grep -ciE 'elevate|seamless|unleash|next-gen' "$TMP" || true)"

echo ""
echo "=== Jargon outil (copy — revue manuelle si matches) ==="
grep -niE '\bn8n\b|\bcursor\b|\bclaude\b|\bworkflow\b|\bagent IA\b|\bprompt\b' "$TMP" || true

echo ""
echo "=== TDAH / bipolaire / neuro fondateurs (cible 0) ==="
grep -ciE 'tdah|bipolair|nous sommes neuro' "$TMP" || true

echo ""
echo "=== Fin (fichier temp : $TMP) ==="
