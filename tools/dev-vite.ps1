#requires -Version 5.1
<#
.SYNOPSIS
  Demarre Vite (npm run dev) — corrige ERR_CONNECTION_REFUSED si le serveur n’etait pas lance.

.DESCRIPTION
  - Se place a la racine du depot
  - Verifie Node.js
  - npm install si node_modules/vite absent
  - Si le port 5173 est deja occupe : message + PID (ne tue rien sans confirmation)

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\dev-vite.ps1

.EXAMPLE
  .\pinapp-dev.ps1
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $root

function Test-Node {
    try {
        $null = & node -v 2>&1
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

function Get-PinappVitePortListener {
    try {
        return @(Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue)
    }
    catch {
        return @()
    }
}

if (-not (Test-Node)) {
    Write-Host 'Node.js est introuvable (commande `node`). Installez la LTS : https://nodejs.org/' -ForegroundColor Red
    Write-Host 'Ensuite : ouvrez un NOUVEAU terminal, puis relancez ce script.' -ForegroundColor Yellow
    exit 1
}

$listeners = Get-PinappVitePortListener
if ($listeners.Count -gt 0) {
    $p = $listeners[0].OwningProcess
    $path = (Get-Process -Id $p -ErrorAction SilentlyContinue).Path
    Write-Host 'Le port 5173 est DEJA utilise (un autre Vite ou process ecoute).' -ForegroundColor Yellow
    Write-Host ('  PID : ' + $p + $(if ($path) { ' — ' + $path } else { '' })) -ForegroundColor Yellow
    Write-Host 'Arretez ce process (Gestionnaire des taches) ou : Stop-Process -Id ' + $p + ' -Force' -ForegroundColor DarkGray
    Write-Host 'Puis relancez ce script.' -ForegroundColor Yellow
    exit 2
}

if (-not (Test-Path (Join-Path $root 'node_modules\vite\package.json'))) {
    Write-Host 'Installation npm (premiere fois ou node_modules incomplet)...' -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

Write-Host ''
Write-Host 'Serveur Vite — laissez cette fenetre OUVERTE (Ctrl+C pour arreter).' -ForegroundColor Green
Write-Host 'Ouvrez dans le navigateur :' -ForegroundColor Green
Write-Host '  http://127.0.0.1:5173/' -ForegroundColor White
Write-Host '  http://localhost:5173/' -ForegroundColor White
Write-Host ''

npm run dev
exit $LASTEXITCODE
