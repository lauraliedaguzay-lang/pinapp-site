#requires -Version 5.1
<#
.SYNOPSIS
  Lance le serveur de dev Vite (localhost:5173) — raccourci depuis la racine du depot.

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\pinapp-dev.ps1
#>
$ErrorActionPreference = 'Stop'
if (-not $PSScriptRoot) {
    Write-Error 'Executez : .\pinapp-dev.ps1 depuis la racine pinapp-site.'
}
$local = Join-Path $PSScriptRoot 'pinapp-local.ps1'
if (-not (Test-Path -LiteralPath $local)) {
    Write-Error ('Introuvable : ' + $local)
}
& $local -Action dev
