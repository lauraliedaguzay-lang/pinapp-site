#requires -Version 5.1
<#
.SYNOPSIS
  Travail local Pinapp — tout passe par PowerShell (pinapp.ps1 + dev-vite ; pas de bash).

.DESCRIPTION
  install | verify | ci | build | dev | serve | all
  - all (defaut) : .\pinapp.ps1 install puis Vite (http://localhost:5173/)
  - verify | ci | build : delegues a .\pinapp.ps1 (PowerShell ; pas de bash)
  - serve : HTTP statique sur le depot (pinapp.ps1 serve, port 8899 par defaut)
  - pr : creer une PR vers main (pinapp-pr.ps1)

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\pinapp-local.ps1
  .\pinapp-local.ps1 -Action dev
  .\pinapp-local.ps1 -Action verify
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('install', 'verify', 'ci', 'build', 'dev', 'serve', 'pr', 'all')]
    [string] $Action = 'all'
)

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
Set-Location -LiteralPath $Root

$vite = Join-Path $Root 'tools\dev-vite.ps1'
$pinapp = Join-Path $Root 'pinapp.ps1'
$prScript = Join-Path $Root 'pinapp-pr.ps1'

switch ($Action) {
    'install' {
        if (-not (Test-Path -LiteralPath $pinapp)) {
            Write-Error ('Introuvable : ' + $pinapp)
        }
        & $pinapp install
    }
    'verify' {
        if (-not (Test-Path -LiteralPath $pinapp)) {
            Write-Error ('Introuvable : ' + $pinapp)
        }
        & $pinapp verify
    }
    'ci' {
        if (-not (Test-Path -LiteralPath $pinapp)) {
            Write-Error ('Introuvable : ' + $pinapp)
        }
        & $pinapp ci
    }
    'build' {
        if (-not (Test-Path -LiteralPath $pinapp)) {
            Write-Error ('Introuvable : ' + $pinapp)
        }
        & $pinapp build
    }
    'dev' {
        if (-not (Test-Path -LiteralPath $vite)) {
            Write-Error ('Introuvable : ' + $vite)
        }
        & $vite
    }
    'serve' {
        if (-not (Test-Path -LiteralPath $pinapp)) {
            Write-Error ('Introuvable : ' + $pinapp)
        }
        & $pinapp serve
    }
    'pr' {
        if (-not (Test-Path -LiteralPath $prScript)) {
            Write-Error ('Introuvable : ' + $prScript)
        }
        & $prScript
    }
    'all' {
        if (-not (Test-Path -LiteralPath $pinapp)) {
            Write-Error ('Introuvable : ' + $pinapp)
        }
        & $pinapp install
        if (-not (Test-Path -LiteralPath $vite)) {
            Write-Error ('Introuvable : ' + $vite)
        }
        & $vite
    }
}
