#!/usr/bin/env bash
# Re-fetch Taste Skill (https://www.tasteskill.dev / Leonxlnx/taste-skill) into vendor/taste-skill.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${ROOT}/vendor/taste-skill"
REPO="https://github.com/Leonxlnx/taste-skill.git"
rm -rf "${DEST}"
git clone --depth 1 "${REPO}" "${DEST}"
rm -rf "${DEST}/.git"
echo "OK: ${DEST}"
