#Requires -Version 5.1
<#
.SYNOPSIS
  Deploiement Pinapp vers Hostinger (SFTP) via WinSCP — double-clic ou PowerShell.

.PARAMETER ZipPath
  Chemin absolu vers le ZIP du site. Si omis, le script prend le .zip le plus recent dans Téléchargements (pinapp*, site*, puis tout *.zip).

.PARAMETER RemotePath
  Dossier distant (defaut : /public_html). Peut aussi etre defini dans $env:USERPROFILE\.pinapp-deploy-env.ps1 via $PinappDeployRemotePath.

.DESCRIPTION
  - Decompresse le ZIP dans %TEMP%, detecte la racine site (ZIP a un seul dossier racine ou fichiers a plat).
  - Installe WinSCP via winget si absent.
  - Demande hôte SFTP, utilisateur, mot de passe (port 22). Option : $PinappDeployHost, $PinappDeployUser, $PinappDeployPass dans .pinapp-deploy-env.ps1
  - Renomme index.html distant en index-OLD-AAAA-MM-JJ-HHmmss.html (ignore si absent).
  - synchronize remote : envoie tout le contenu du dossier local vers le chemin distant.
  - Ouvre pinapp.fr en navigation privée (Edge/Chrome si presents).

.NOTES
  - Ne pas committer de mots de passe.
  - Apres deploiement : hPanel → Cache → Vider le cache, ou https://pinapp.fr/?v=1
  - Si execution bloquee : Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
  - FTP port 21 : Hostinger SFTP reste le defaut ; si besoin FTP uniquement, ouvrir un ticket / adapter open ftp://...
#>

[CmdletBinding()]
param(
  [string]$ZipPath = '',
  [string]$RemotePath = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Step([string]$Msg) { Write-Host "`n==> $Msg" -ForegroundColor Cyan }
function Write-Ok([string]$Msg) { Write-Host "OK  $Msg" -ForegroundColor Green }
function Write-Warn([string]$Msg) { Write-Host "!   $Msg" -ForegroundColor Yellow }

$Downloads = Join-Path $env:USERPROFILE 'Downloads'
if (-not (Test-Path $Downloads)) {
  throw "Dossier introuvable : $Downloads"
}

$EnvFile = Join-Path $env:USERPROFILE '.pinapp-deploy-env.ps1'
if (Test-Path $EnvFile) {
  Write-Ok "Chargement : $EnvFile"
  . $EnvFile
}

# --- ZIP ---
if ($ZipPath -and (Test-Path -LiteralPath $ZipPath)) {
  $ZipFull = (Resolve-Path -LiteralPath $ZipPath).Path
} else {
  $patterns = @('pinapp*.zip', 'site*.zip', 'pinapp-site*.zip', '*.zip')
  $zips = @()
  foreach ($p in $patterns) {
    $zips = @(Get-ChildItem -Path $Downloads -Filter $p -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending)
    if ($zips.Count -gt 0) { break }
  }
  if ($zips.Count -eq 0) {
    throw "Aucun .zip dans $Downloads — place le ZIP du site ou passe -ZipPath 'C:\...\fichier.zip'"
  }
  $ZipFull = $zips[0].FullName
}
Write-Ok "ZIP : $ZipFull"

$Stamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
$ExpandRoot = Join-Path $env:TEMP ("pinapp-deploy-" + $Stamp)
New-Item -ItemType Directory -Path $ExpandRoot -Force | Out-Null
try {
  Write-Step "Décompression vers $ExpandRoot"
  Expand-Archive -LiteralPath $ZipFull -DestinationPath $ExpandRoot -Force
} catch {
  Remove-Item -LiteralPath $ExpandRoot -Recurse -Force -ErrorAction SilentlyContinue
  throw
}

$children = @(Get-ChildItem -LiteralPath $ExpandRoot -Force)
$LocalSiteRoot = $ExpandRoot
if ($children.Count -eq 1 -and $children[0].PSIsContainer) {
  $LocalSiteRoot = $children[0].FullName
  Write-Ok "Racine site (sous-dossier du ZIP) : $LocalSiteRoot"
} else {
  Write-Ok "Racine site : $LocalSiteRoot"
}

$fileCount = (Get-ChildItem -LiteralPath $LocalSiteRoot -Recurse -File -Force | Measure-Object).Count
Write-Ok "Fichiers locaux dans le ZIP : $fileCount"

# WinSCP attend des chemins avec antislash ; echapper les doubles quotes dans le script
$LocalWinScp = ($LocalSiteRoot -replace '\\', '\\')

# --- WinSCP ---
$WinScpCandidates = @(
  "${env:ProgramFiles(x86)}\WinSCP\WinSCP.com",
  "$env:ProgramFiles\WinSCP\WinSCP.com",
  "$env:LOCALAPPDATA\Programs\WinSCP\WinSCP.com"
)
$WinScpCom = $WinScpCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $WinScpCom) {
  Write-Step "WinSCP introuvable — installation winget"
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if (-not $winget) {
    throw "winget absent. Installe WinSCP : https://winscp.net/ puis relance."
  }
  & winget install --id WinSCP.WinSCP -e --source winget --accept-package-agreements --accept-source-agreements
  $WinScpCom = $WinScpCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $WinScpCom) {
    throw "WinSCP toujours introuvable. Ferme/réouvre PowerShell ou installe WinSCP à la main."
  }
}
Write-Ok "WinSCP : $WinScpCom"

# --- Credentials (ne pas utiliser $Host : variable automatique reservee) ---
$SftpHost = $PinappDeployHost
$SftpUser = $PinappDeployUser
$SftpPass = $PinappDeployPass
if ($RemotePath) {
  $SftpRemote = $RemotePath.TrimEnd('/')
} elseif ($PinappDeployRemotePath) {
  $SftpRemote = $PinappDeployRemotePath.TrimEnd('/')
} else {
  $SftpRemote = '/public_html'
}

if (-not $SftpHost) { $SftpHost = Read-Host 'Hôte SFTP Hostinger' }
if (-not $SftpUser) { $SftpUser = Read-Host 'Utilisateur SFTP' }
if (-not $SftpPass) {
  $sec = Read-Host 'Mot de passe SFTP' -AsSecureString
  $SftpPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
  )
}

$save = Read-Host "Enregistrer hôte + user + chemin dans $EnvFile (sans mot de passe) ? (o/n)"
if ($save -eq 'o' -or $save -eq 'O') {
  @"
`$PinappDeployHost = '$($SftpHost -replace "'", "''")'
`$PinappDeployUser = '$($SftpUser -replace "'", "''")'
`$PinappDeployRemotePath = '$($SftpRemote -replace "'", "''")'
# Option : `$PinappDeployPass = '...'  (deconseille — preferer saisie a chaque fois)
"@ | Set-Content -LiteralPath $EnvFile -Encoding UTF8
  Write-Ok "Profil partiel sauvegardé."
}

Add-Type -AssemblyName System.Web
$PassEnc = [System.Web.HttpUtility]::UrlEncode($SftpPass)
$UserEnc = [System.Web.HttpUtility]::UrlEncode($SftpUser)

$RemoteNorm = $SftpRemote
if (-not $RemoteNorm.StartsWith('/')) { $RemoteNorm = '/' + $RemoteNorm }

$BackupName = "index-OLD-$Stamp.html"
$WinScpScriptPath = Join-Path $env:TEMP "winscp-pinapp-deploy-$Stamp.txt"
$WinScpLog = Join-Path $env:TEMP "winscp-pinapp-deploy-$Stamp.log"

# batch continue : rename peut echouer si pas d'index ; puis synchro en batch abort
$winScript = @"
option batch continue
option confirm off
open sftp://${UserEnc}:${PassEnc}@${SftpHost}/ -hostkey=*
cd $RemoteNorm
rename index.html $BackupName
option batch abort
option transfer binary
synchronize remote "$LocalWinScp" "$RemoteNorm"
exit
"@

$winScript | Set-Content -LiteralPath $WinScpScriptPath -Encoding UTF8

Write-Step "Upload SFTP → $RemoteNorm (backup distant index → $BackupName si présent)"
& $WinScpCom "/ini=nul" "/log=$WinScpLog" "/script=$WinScpScriptPath"
$winExit = $LASTEXITCODE

Remove-Item -LiteralPath $WinScpScriptPath -Force -ErrorAction SilentlyContinue

if ($winExit -ne 0) {
  Write-Warn "WinSCP code : $winExit — voir $WinScpLog"
} else {
  Write-Ok "Synchronisation OK (code 0)."
}

Remove-Item -LiteralPath $ExpandRoot -Recurse -Force -ErrorAction SilentlyContinue

Write-Step "Ouverture pinapp.fr"
$url = 'https://pinapp.fr/?deploy=' + $Stamp
$edge = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
$edge86 = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$chrome = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
$chrome86 = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
if (Test-Path $edge) {
  Start-Process $edge -ArgumentList @('-inprivate', $url)
} elseif (Test-Path $edge86) {
  Start-Process $edge86 -ArgumentList @('-inprivate', $url)
} elseif (Test-Path $chrome) {
  Start-Process $chrome -ArgumentList @('--incognito', $url)
} elseif (Test-Path $chrome86) {
  Start-Process $chrome86 -ArgumentList @('--incognito', $url)
} else {
  Start-Process $url
}

Write-Host ""
Write-Warn "Cache Hostinger : hPanel → Avancé → Cache → Vider. Ou test : pinapp.fr/?v=3"
Write-Host "Log WinSCP : $WinScpLog" -ForegroundColor DarkGray
Write-Host ""

if ($winExit -ne 0) { exit $winExit }
