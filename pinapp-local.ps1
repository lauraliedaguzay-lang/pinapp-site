#requires -Version 5.1
<#
.SYNOPSIS
  Travail local Pinapp — tout passe par PowerShell + npm (pas de bash).

.DESCRIPTION
  install | verify | ci | build | dev | serve | all
  - all (defaut) : npm install puis Vite (http://localhost:5173/)
  - serve : HTTP statique sur le depot (pinapp.ps1 serve, port 8899 par defaut)

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\pinapp-local.ps1
  .\pinapp-local.ps1 -Action dev
  .\pinapp-local.ps1 -Action verify
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('install', 'verify', 'ci', 'build', 'dev', 'serve', 'all')]
    [string] $Action = 'all'
)

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
Set-Location -LiteralPath $Root

function Invoke-PinappNpm {
    param([Parameter(Mandatory = $true)][string[]] $NpmArgs)
    Write-Host ('> npm ' + ($NpmArgs -join ' ')) -ForegroundColor DarkGray
    & npm @NpmArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error ('npm a echoue (code ' + $LASTEXITCODE + ').')
    }
}

$vite = Join-Path $Root 'tools\dev-vite.ps1'
$pinapp = Join-Path $Root 'pinapp.ps1'

switch ($Action) {
    'install' { Invoke-PinappNpm @('install') }
    'verify' { Invoke-PinappNpm @('run', 'verify') }
    'ci' { Invoke-PinappNpm @('run', 'ci') }
    'build' { Invoke-PinappNpm @('run', 'build') }
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
    'all' {
        Invoke-PinappNpm @('install')
        if (-not (Test-Path -LiteralPath $vite)) {
            Write-Error ('Introuvable : ' + $vite)
        }
        & $vite
    }
}
