#requires -Version 5.1
<#
.SYNOPSIS
  Charge les profils locaux puis lance fr-auto (sans menu).
.DESCRIPTION
  Ordre : ~\.pinapp-fr-env.ps1 puis ~\.pinapp-secrets.ps1 puis pinapp-tes-clefs.ps1 (racine depot, prioritaire).
  Utilise un vrai jeton Hostinger (pas COLLE_ICI) et GH_TOKEN / GITHUB_TOKEN ou gh auth login.
  Modele tout-en-un : pinapp-tes-clefs.EXAMPLE.ps1 -> pinapp-tes-clefs.ps1
.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\deploy-pinapp-fr.ps1
#>
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
foreach ($p in @(
        (Join-Path $env:USERPROFILE '.pinapp-fr-env.ps1'),
        (Join-Path $env:USERPROFILE '.pinapp-secrets.ps1')
    )) {
    if (Test-Path -LiteralPath $p) {
        Write-Host ('Chargement : ' + $p) -ForegroundColor DarkGray
        . $p
    }
}
$tesClefs = Join-Path $PSScriptRoot 'pinapp-tes-clefs.ps1'
if (Test-Path -LiteralPath $tesClefs) {
    Write-Host ('Chargement : ' + $tesClefs) -ForegroundColor DarkGray
    . $tesClefs
}
& .\pinapp.ps1 fr-auto
