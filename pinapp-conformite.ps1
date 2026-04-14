#Requires -Version 5.1
<#
.SYNOPSIS
  Applique conformite (viewport-fit, canonical, skip-link, main id) via Node.
.DESCRIPTION
  Lance tools/pinapp-conformite.mjs depuis la racine du depot pinapp-site.
  Utiliser PowerShell 7+ si Node n'est pas dans le PATH de Windows PowerShell.
#>
$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
Set-Location $Root
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  throw "Node.js introuvable dans le PATH. Installez Node ou utilisez: pwsh -File pinapp-conformite.ps1"
}
& node "$Root\tools\pinapp-conformite.mjs"
if ($LASTEXITCODE -ne 0) { throw "pinapp-conformite.mjs a echoue (code $LASTEXITCODE)." }
Write-Host "OK — pinapp-conformite termine."
