#!/usr/bin/env bash
# Read-only discovery on the VPS (stdout only; safe to paste logs).
# shellcheck disable=SC2012
set -u

echo "## n8n discover — $(date -u +"%Y-%m-%dT%H:%M:%SZ") (UTC) ##"

echo ""
echo "### docker ps --format ###"
if command -v docker >/dev/null 2>&1; then
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}' || echo "(docker ps failed)"
else
  echo "(docker not in PATH)"
fi

echo ""
echo "### find docker-compose.yml under *n8n* (first 20 hits, may take a while) ###"
# shellcheck disable=SC2035
find / -name 'docker-compose.yml' -path '*/n8n*' 2>/dev/null | head -20 || true

COMPOSE_FIRST=""
COMPOSE_FIRST="$(find / -name 'docker-compose.yml' -path '*/n8n*' 2>/dev/null | head -1 || true)"
echo "COMPOSE_FIRST=${COMPOSE_FIRST:-<none>}"

echo ""
echo "### head -80 of first compose (if any) ###"
if [[ -n "${COMPOSE_FIRST}" && -f "${COMPOSE_FIRST}" ]]; then
  head -80 "${COMPOSE_FIRST}" || true
else
  echo "(no compose file found)"
fi

echo ""
echo "### grep ports (compose + hints) ###"
if [[ -n "${COMPOSE_FIRST}" && -f "${COMPOSE_FIRST}" ]]; then
  grep -E 'ports:|5678|host:|published:' "${COMPOSE_FIRST}" || true
fi

echo ""
echo "### reverse proxies installed ###"
command -v caddy >/dev/null 2>&1 && echo "caddy: $(command -v caddy)" || echo "caddy: (not found)"
command -v traefik >/dev/null 2>&1 && echo "traefik: $(command -v traefik)" || echo "traefik: (not found)"
command -v nginx >/dev/null 2>&1 && echo "nginx: $(command -v nginx)" || echo "nginx: (not found)"

echo ""
echo "### /etc/caddy/Caddyfile (head 50, if exists) ###"
if [[ -f /etc/caddy/Caddyfile ]]; then
  head -50 /etc/caddy/Caddyfile || true
else
  echo "(no /etc/caddy/Caddyfile)"
fi

echo ""
echo "### n8n .env (keys only, values redacted) ###"
N8N_ENV=""
if [[ -n "${COMPOSE_FIRST}" ]]; then
  N8N_DIR="$(dirname "${COMPOSE_FIRST}")"
  if [[ -f "${N8N_DIR}/.env" ]]; then
    N8N_ENV="${N8N_DIR}/.env"
  fi
fi
if [[ -n "${N8N_ENV}" ]]; then
  echo "ENV_FILE=${N8N_ENV}"
  grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "${N8N_ENV}" 2>/dev/null | sed 's/=.*/=<REDACTED>/' || true
else
  echo "(no .env next to first compose — search common locations)"
  for f in /root/n8n/.env /root/*/n8n/.env /opt/n8n/.env /var/lib/n8n/.env; do
    if [[ -f "$f" ]]; then
      echo "ENV_FILE=${f}"
      grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$f" 2>/dev/null | sed 's/=.*/=<REDACTED>/' || true
    fi
  done
fi

echo ""
echo "### dig +short n8n.pinapp.fr ###"
if command -v dig >/dev/null 2>&1; then
  dig +short n8n.pinapp.fr || true
else
  echo "(dig not installed)"
fi

echo ""
echo "### curl n8n /healthz on localhost:5678 (TLS insecure, code only) ###"
code="000"
code="$(curl -k -s -o /dev/null -w '%{http_code}' https://localhost:5678/healthz 2>/dev/null || echo "000")"
echo "HTTP_CODE=${code}"

echo ""
echo "## discover finished ##"
