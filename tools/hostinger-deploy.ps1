<# 
Pinapp — Hostinger deploy (staging) via FTPS — NO CLICK

Usage (PowerShell):
  1) Place pinapp-hostinger-deploy.zip on Desktop
  2) Run:
     PowerShell -ExecutionPolicy Bypass -File .\tools\hostinger-deploy.ps1

What it does:
  - Unzips the build zip locally
  - Uploads to Hostinger via FTPS (Explicit)
  - Prints 3 URLs to test + optionally checks them

Notes:
  - This cannot configure hPanel or connect GitHub to Hostinger automatically.
  - Do not paste credentials into chats.
#>

$ErrorActionPreference = "Stop"

try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

Write-Host ""
Write-Host "Pinapp — Hostinger staging deploy (FTPS)" -ForegroundColor Cyan
Write-Host ""

$ZipPath = Join-Path $env:USERPROFILE "Desktop\pinapp-hostinger-deploy.zip"
if (!(Test-Path $ZipPath)) { throw "ZIP introuvable: $ZipPath" }

$RemotePath = "/public_html/pinapp-staging/"
$TempUrlBase = Read-Host "URL temporaire Hostinger (ex: https://xxxxx.hostingersite.com)"
$FtpHost = Read-Host "FTP Host (hPanel → FTP Accounts)"
$FtpUser = Read-Host "FTP Username"
$FtpPass = Read-Host "FTP Password" -AsSecureString

function Unsecure([SecureString]$s) {
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

$Work = Join-Path $env:TEMP ("pinapp-deploy-" + [guid]::NewGuid().ToString("N"))
$ExtractDir = Join-Path $Work "site"
New-Item -ItemType Directory -Path $ExtractDir -Force | Out-Null

Write-Host "• Extraction ZIP..." -ForegroundColor DarkGray
Expand-Archive -Path $ZipPath -DestinationPath $ExtractDir -Force

if (!(Test-Path (Join-Path $ExtractDir "index.html")) -or !(Test-Path (Join-Path $ExtractDir "sw.js")) -or !(Test-Path (Join-Path $ExtractDir "assets"))) {
  throw "Structure inattendue après extraction. Attendu: index.html, sw.js, assets/"
}

Write-Host "• Téléchargement WinSCP portable..." -ForegroundColor DarkGray
$WinScpWork = Join-Path $Work "winscp"
New-Item -ItemType Directory -Path $WinScpWork -Force | Out-Null
$WinScpZip = Join-Path $WinScpWork "winscp.zip"
Invoke-WebRequest "https://winscp.net/download/WinSCP-6.3.6-Portable.zip" -OutFile $WinScpZip
Expand-Archive -Path $WinScpZip -DestinationPath $WinScpWork -Force

$Dll = Get-ChildItem -Path $WinScpWork -Recurse -Filter "WinSCPnet.dll" | Select-Object -First 1
if (!$Dll) { throw "WinSCPnet.dll introuvable." }
Add-Type -Path $Dll.FullName

$PlainPass = Unsecure $FtpPass

$sessionOptions = New-Object WinSCP.SessionOptions -Property @{
  Protocol  = [WinSCP.Protocol]::Ftp
  HostName  = $FtpHost
  UserName  = $FtpUser
  Password  = $PlainPass
  FtpSecure = [WinSCP.FtpSecure]::Explicit
}

$session = New-Object WinSCP.Session
try {
  Write-Host "• Connexion FTPS + upload..." -ForegroundColor DarkGray
  $session.Open($sessionOptions)

  # mkdir -p remote
  $parts = $RemotePath.Trim("/").Split("/")
  $path = ""
  foreach ($p in $parts) {
    $path += "/" + $p
    $null = $session.CreateDirectory($path)
  }

  # Mirror upload (no delete for safety)
  $res = $session.SynchronizeDirectories(
    [WinSCP.SynchronizationMode]::Remote,
    $ExtractDir,
    $RemotePath,
    $False,
    $True,
    [WinSCP.SynchronizationCriteria]::Time
  )
  $res.Check()

  Write-Host "✅ Upload terminé → $RemotePath" -ForegroundColor Green
}
finally {
  $session.Dispose()
  try { Remove-Item $Work -Recurse -Force -ErrorAction SilentlyContinue } catch {}
}

$u1 = "$TempUrlBase/pinapp-staging/assets/variables.css"
$u2 = "$TempUrlBase/pinapp-staging/sw.js"
$u3 = "$TempUrlBase/pinapp-staging/"

Write-Host ""
Write-Host "Tests (copier/coller) :" -ForegroundColor Cyan
Write-Host $u1
Write-Host $u2
Write-Host $u3

Write-Host ""
Write-Host "📱 Téléphone: ouvre /pinapp-staging/?v=1 puis recharge 2 fois." -ForegroundColor Yellow

