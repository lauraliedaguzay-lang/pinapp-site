# Démarre Vite depuis la racine du dépôt (install npm si besoin).
# Usage : powershell -ExecutionPolicy Bypass -File tools\dev-vite.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

function Test-Node {
  try {
    $null = & node -v 2>&1
    return $LASTEXITCODE -eq 0
  } catch { return $false }
}

if (-not (Test-Node)) {
  Write-Host 'Node.js est introuvable (commande `node`). Installez la LTS : https://nodejs.org/' -ForegroundColor Red
  Write-Host 'Ensuite : ouvrez un NOUVEAU terminal, puis relancez ce script.' -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path (Join-Path $root 'node_modules\vite\package.json'))) {
  Write-Host 'Installation npm (premiere fois)...' -ForegroundColor Cyan
  npm install
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host ''
Write-Host 'Serveur Vite — laissez cette fenetre OUVERTE.' -ForegroundColor Green
Write-Host 'Ouvrez : http://127.0.0.1:5173/  ou  http://localhost:5173/' -ForegroundColor Green
Write-Host ''

npm run dev
exit $LASTEXITCODE
