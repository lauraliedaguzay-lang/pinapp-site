#requires -Version 5.1
<#
.SYNOPSIS
  Lance Pinapp depuis la racine du depot (tout en PowerShell).

.DESCRIPTION
  Equivalent a .\tools\Pinapp.ps1 avec les memes arguments.

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\pinapp.ps1 suite
  .\pinapp.ps1 check
#>
$ErrorActionPreference = 'Stop'
if (-not $PSScriptRoot) {
    Write-Error 'Lance ce fichier comme script : .\pinapp.ps1 <commande>'
}
$inner = Join-Path $PSScriptRoot 'tools\Pinapp.ps1'
if (-not (Test-Path -LiteralPath $inner)) {
    Write-Error ('Introuvable : ' + $inner)
}
& $inner @args
