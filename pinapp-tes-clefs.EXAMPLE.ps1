# =============================================================================
# FICHIER MODELE — a toi de completer
#
# 1) Copie ce fichier vers :  pinapp-tes-clefs.ps1  (meme dossier = racine du depot)
#    Exemple PowerShell :
#      Copy-Item .\pinapp-tes-clefs.EXAMPLE.ps1 .\pinapp-tes-clefs.ps1
#
# 2) Remplace chaque COLLE_... par ta vraie valeur (hors chat, jamais dans Git).
#
# 3) Lance :  .\pinapp-relie-tout.ps1   ou   .\pinapp.ps1 relie   ou   .\deploy-pinapp-fr.ps1
#
# pinapp-tes-clefs.ps1 est ignore par Git (.gitignore) — ne le committe pas.
# =============================================================================

# --- Hostinger (obligatoire pour DNS pinapp.fr en local / API) ---
# hPanel > API > New token : https://hpanel.hostinger.com/
$env:HOSTINGER_API_TOKEN = "COLLE_JETON_API_HOSTINGER_ICI"

# --- GitHub (obligatoire pour declarer pinapp.fr sur Pages + gh CLI) ---
# GitHub > Settings > Developer settings > Personal access tokens
# Scopes conseilles : repo, workflow (si tu declenches des Actions en API)
$env:GH_TOKEN = "COLLE_PAT_GITHUB_ghp_ICI"

# Optionnel (relie-tout aligne tout seul si tu ne mets que GH_TOKEN) :
# $env:GITHUB_TOKEN = "COLLE_PAT_GITHUB_ghp_ICI"

# --- Meme jeton Hostinger sur le depot GitHub (Actions) ---
# Repo pinapp-site > Settings > Secrets and variables > Actions > New secret
#   Nom   : HOSTINGER_API_TOKEN
#   Valeur: la meme que $env:HOSTINGER_API_TOKEN ci-dessus
# (sinon le workflow met a jour GitHub Pages mais pas les DNS chez Hostinger)

# =============================================================================
# OPTIONNEL — n8n (webhooks pinapp-orchestrate.ps1)
# =============================================================================
# $env:PINAPP_N8N_ORCHESTRATE_START_URL = "https://TON-N8N/webhook/pinapp-debut"
# $env:PINAPP_N8N_ORCHESTRATE_DONE_URL  = "https://TON-N8N/webhook/pinapp-fin"
# $env:PINAPP_N8N_WEBHOOK_URL           = "https://TON-N8N/webhook/pinapp"

# =============================================================================
# OPTIONNEL — Anthropic (.\pinapp-orchestrate.ps1 -TestAnthropic)
# =============================================================================
# $env:ANTHROPIC_API_KEY = "COLLE_CLE_ANTHROPIC_ICI"
# $env:PINAPP_ANTHROPIC_MODEL = "claude-3-5-haiku-20241022"

# =============================================================================
# OPTIONNEL — Netlify / autres (voir AUTOMATIONS.md)
# =============================================================================
# $env:NETLIFY_AUTH_TOKEN = ""
# $env:AURALIS_APP_URL = ""   # secret GitHub AURALIS_APP_URL pour le build Pages
