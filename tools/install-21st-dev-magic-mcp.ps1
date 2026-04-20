<#
.SYNOPSIS
  Installe la config MCP Magic (21st.dev) pour Cursor sans coller la clé en dur.

.PREREQUIS
  Node.js + npx. Définir la clé dans l'environnement (jamais dans le dépôt) :

    $env:TWENTYFIRST_API_KEY = "votre_cle"
    .\tools\install-21st-dev-magic-mcp.ps1

  Ou une seule ligne (PowerShell) :
    $env:TWENTYFIRST_API_KEY = "..." ; .\tools\install-21st-dev-magic-mcp.ps1
#>
$ErrorActionPreference = 'Stop'

$key = $env:TWENTYFIRST_API_KEY
if (-not $key -or $key.Trim().Length -eq 0) {
  Write-Error "TWENTYFIRST_API_KEY est vide. Exemple : `$env:TWENTYFIRST_API_KEY = '...' puis relance ce script."
}

Write-Host "Installation MCP 21st.dev pour Cursor (npx @21st-dev/cli)..." -ForegroundColor Cyan
& npx -y @21st-dev/cli@latest install cursor --api-key $key

if ($LASTEXITCODE -ne 0) {
  Write-Error "npx a échoué (code $LASTEXITCODE)."
}

Write-Host "Terminé. Redémarre Cursor pour charger la config MCP." -ForegroundColor Green
