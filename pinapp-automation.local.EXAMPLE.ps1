# Copier vers pinapp-automation.local.ps1 (non versionné — voir .gitignore)
# Puis : .\pinapp-automation-connect.ps1 -Apply
#
# WhatsApp Business API, Stripe, Make, Zapier : se configurent DANS n8n / Make
# (clés API, OAuth). Ce fichier ne fait que brancher le SITE vers vos webhooks.

# Hôte n8n cloud (sans https://) — remplace [TON-N8N] dans assets/js/config.js
$PinappN8nHostname = 'votre-instance.n8n.cloud'

# Lien wa.me pour les visiteurs (numéro international sans + ni espaces)
# Remplace le placeholder 33XXXXXXXXX
$PinappWhatsAppWaMe = '33600000000'

# Activer les envois fetch() depuis le navigateur uniquement quand le workflow n8n est prêt + testé
$PinappEnableDiagnosticWebhook       = $false
$PinappEnableOnboardingWebhook       = $false
$PinappEnableLeadWebhook             = $false
$PinappEnableAuroraAnalyseIA         = $false
$PinappEnableAuroraUniversIA         = $false
$PinappEnableWhatsappNotifs          = $false
$PinappEnableDiagnosticClaudePrep    = $false
