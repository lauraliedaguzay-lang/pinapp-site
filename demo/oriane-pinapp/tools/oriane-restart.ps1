# ORIANE — pull + caches + dev (Windows)
# Usage: clic droit > Exécuter avec PowerShell (depuis le dossier du repo ou ajustez $projectPath)

Write-Host "=== ORIANE RESTART ===" -ForegroundColor Cyan

Get-Process node -ErrorAction SilentlyContinue |
  Where-Object {
    $cmd = (Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)" -ErrorAction SilentlyContinue).CommandLine
    $cmd -and $cmd -notlike "*hostinger*"
  } |
  Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

$projectPath = $PSScriptRoot | Split-Path -Parent
if (-not (Test-Path (Join-Path $projectPath "package.json"))) {
  Write-Host "Place ce script dans demo/oriane-pinapp/tools/ ou defini `$projectPath manuellement." -ForegroundColor Red
  Read-Host "Entree pour fermer"
  exit 1
}

Set-Location $projectPath
Write-Host "Projet: $projectPath" -ForegroundColor Green

if (Test-Path ".git") {
  git fetch origin 2>&1 | Out-Null
  git checkout cursor/oriane-source-zip-6c99 2>&1 | Out-Null
  git pull origin cursor/oriane-source-zip-6c99
}

Remove-Item -Recurse -Force "node_modules\.vite", "node_modules\.astro", ".astro", "dist" -ErrorAction SilentlyContinue
Write-Host "Caches supprimes." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
  npm install
}

Write-Host "npm run dev -> http://localhost:4321" -ForegroundColor Cyan
npm run dev
