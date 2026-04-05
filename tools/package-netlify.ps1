# ZIP complet pour Netlify (racine = index.html + assets/ + toutes les pages).
# Exécuter : clic droit > Exécuter avec PowerShell, ou dans PowerShell :
#   cd "C:\Users\laura\Downloads\pinapp-site\tools"
#   .\package-netlify.ps1

$ErrorActionPreference = "Stop"
$src = Resolve-Path (Join-Path $PSScriptRoot "..")
$parent = Split-Path $src -Parent
$zipPath = Join-Path $parent "pinapp-site-NETLIFY-COMPLET.zip"
$temp = Join-Path $env:TEMP ("pinapp-netlify-" + (Get-Random))

Write-Host "Source : $src"
Write-Host "ZIP    : $zipPath"

New-Item -ItemType Directory -Path $temp -Force | Out-Null
robocopy $src $temp /E /XD .cursor tools .git node_modules /XF .sftp.json .cursorrules .gitignore /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
$rc = $LASTEXITCODE
if ($rc -ge 8) { throw "robocopy a echoue (code $rc)" }

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $temp '*') -DestinationPath $zipPath -CompressionLevel Optimal -Force
Remove-Item $temp -Recurse -Force

$size = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "OK - Archive creee ($size MB)"
Write-Host $zipPath
