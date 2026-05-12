#!/usr/bin/env bash
# Runs on the VPS as root (via GitHub Actions apply). Idempotent merge of env patch + Caddy + n8n restart.
set -euo pipefail

PATCH_FILE="${PATCH_FILE:-/tmp/n8n.env.patch}"

log() {
  printf '[%s] %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$*"
}

fail() {
  log "FAIL: $*"
  exit 1
}

success() {
  log "SUCCESS: $*"
}

require_root() {
  if [[ "${EUID:-0}" -ne 0 ]]; then
    fail "run as root on the VPS"
  fi
}

resolve_compose_file() {
  if [[ -n "${N8N_DIR:-}" && -f "${N8N_DIR}/docker-compose.yml" ]]; then
    printf '%s\n' "${N8N_DIR}/docker-compose.yml"
    return 0
  fi
  local c
  c="$(find /root /home /var/lib /opt /srv -name 'docker-compose.yml' -path '*n8n*' 2>/dev/null | head -1 || true)"
  if [[ -n "${c}" ]]; then
    printf '%s\n' "${c}"
    return 0
  fi
  c="$(find / -maxdepth 10 -name 'docker-compose.yml' -path '*/n8n*' 2>/dev/null | head -1 || true)"
  if [[ -n "${c}" ]]; then
    printf '%s\n' "${c}"
    return 0
  fi
  printf '%s\n' ""
}

merge_env_patch() {
  local env_file="$1"
  local patch_file="$2"
  local tmp newt line key val

  tmp="$(mktemp)"
  if [[ -f "${env_file}" ]]; then
    cp "${env_file}" "${tmp}"
  else
    : >"${tmp}"
  fi

  while IFS= read -r line || [[ -n "${line:-}" ]]; do
    line="${line%$'\r'}"
    [[ -z "${line// }" ]] && continue
    [[ "${line}" =~ ^[[:space:]]*# ]] && continue
    key="${line%%=*}"
    val="${line#*=}"
    key="${key%"${key##*[![:space:]]}"}"
    key="${key#"${key%%[![:space:]]*}"}"
    [[ -z "${key}" ]] && continue
    newt="$(mktemp)"
    if grep -q "^${key}=" "${tmp}" 2>/dev/null; then
      grep -v "^${key}=" "${tmp}" >"${newt}" || true
    else
      cp "${tmp}" "${newt}"
    fi
    mv "${newt}" "${tmp}"
    printf '%s=%s\n' "${key}" "${val}" >>"${tmp}"
  done <"${patch_file}"

  mv "${tmp}" "${env_file}"
}

main() {
  require_root
  log "deploy.sh start"

  if [[ ! -f "${PATCH_FILE}" ]]; then
    fail "missing patch at ${PATCH_FILE}"
  fi

  COMPOSE_FILE="$(resolve_compose_file)"
  if [[ -z "${COMPOSE_FILE}" ]]; then
    fail "could not locate docker-compose.yml for n8n (set N8N_DIR or place compose under a *n8n* path)"
  fi

  N8N_DIR="$(dirname "${COMPOSE_FILE}")"
  ENV_FILE="${N8N_DIR}/.env"
  log "N8N_DIR=${N8N_DIR}"
  log "COMPOSE_FILE=${COMPOSE_FILE}"

  if [[ ! -f "${ENV_FILE}" ]]; then
    log "no .env yet — creating empty ${ENV_FILE}"
    : >"${ENV_FILE}"
  fi

  log "backup .env"
  cp "${ENV_FILE}" "${ENV_FILE}.backup-$(date +%Y%m%d-%H%M%S)"

  log "merge ${PATCH_FILE} into .env (keys in patch only)"
  merge_env_patch "${ENV_FILE}" "${PATCH_FILE}"

  export DEBIAN_FRONTEND=noninteractive
  if ! command -v caddy >/dev/null 2>&1; then
    log "apt install caddy"
    apt-get update -y
    apt-get install -y caddy
  fi

  mkdir -p /var/log/caddy
  chmod 755 /var/log/caddy

  log "caddy validate"
  caddy validate --config /etc/caddy/Caddyfile

  if systemctl is-active --quiet caddy 2>/dev/null; then
    log "systemctl reload caddy"
    systemctl reload caddy
  else
    log "systemctl enable --now caddy"
    systemctl enable --now caddy
  fi

  log "docker compose restart n8n"
  (
    cd "${N8N_DIR}"
    if docker compose version >/dev/null 2>&1; then
      docker compose restart n8n
    else
      docker-compose restart n8n
    fi
  )

  log "wait 15s for n8n"
  sleep 15

  log "test 1: https://n8n.pinapp.fr/healthz"
  code1="000"
  code1="$(curl -s -o /dev/null -w '%{http_code}' https://n8n.pinapp.fr/healthz || echo "000")"
  log "healthz HTTP=${code1}"
  if [[ "${code1}" != "200" ]]; then
    fail "healthz expected 200, got ${code1}"
  fi

  log "test 2: OPTIONS webhook + CORS"
  if ! curl -sSI -X OPTIONS 'https://n8n.pinapp.fr/webhook/diagnostic-lead' -H 'Origin: https://pinapp.fr' | grep -qi 'access-control-allow-origin:.*pinapp\.fr'; then
    curl -sSI -X OPTIONS 'https://n8n.pinapp.fr/webhook/diagnostic-lead' -H 'Origin: https://pinapp.fr' || true
    fail "missing Access-Control-Allow-Origin for https://pinapp.fr on OPTIONS"
  fi
  curl -sSI -X OPTIONS 'https://n8n.pinapp.fr/webhook/diagnostic-lead' -H 'Origin: https://pinapp.fr' | grep -i 'access-control-allow-origin' || true

  success "Caddy + n8n env applied; healthz=200; CORS header present"
}

main "$@"
