#!/usr/bin/env bash
# Installe MCP Magic (21st.dev) pour Cursor — clé uniquement via variable d'environnement.
# Usage : TWENTYFIRST_API_KEY='votre_cle' ./tools/install-21st-dev-magic-mcp.sh
set -euo pipefail
if [[ -z "${TWENTYFIRST_API_KEY:-}" ]]; then
  echo "Erreur: exportez TWENTYFIRST_API_KEY (ne pas committer la clé)." >&2
  exit 1
fi
echo "Installation MCP 21st.dev pour Cursor..."
exec npx -y @21st-dev/cli@latest install cursor --api-key "$TWENTYFIRST_API_KEY"
