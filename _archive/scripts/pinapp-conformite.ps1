#Requires -Version 5.1
<#
.SYNOPSIS
  Audit ou correctifs conformité (viewport-fit, canonical, skip-link, main, etc.) via Node.
.DESCRIPTION
  Lance tools/pinapp-conformite.mjs depuis la racine du dépôt pinapp-site.
  -Audit : rapport seul, code de sortie 1 si erreurs (adapté CI / écran de contrôle).
  Utiliser PowerShell 7+ si Node n'est pas dans le PATH de Windows PowerShell.
#>
param(
  [switch]$Audit
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $Root
Set-Location $Root
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  throw "Node.js introuvable dans le PATH. Installez Node ou utilisez: pwsh -File pinapp-conformite.ps1"
}
$nodeArgs = @("$Root\tools\pinapp-conformite.mjs")
if ($Audit) { $nodeArgs += '--audit' }
& node @nodeArgs
if ($LASTEXITCODE -ne 0) { throw "pinapp-conformite.mjs a echoue (code $LASTEXITCODE)." }
Write-Host "OK — pinapp-conformite termine."
