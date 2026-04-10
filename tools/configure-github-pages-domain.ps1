# Déclare pinapp.fr comme domaine personnalisé GitHub Pages (API GitHub).
# Prérequis : Personal Access Token (classic) avec scope "repo", ou token fine-grained avec "Pages: write".
#
# Usage :
#   $env:GITHUB_TOKEN = "ghp_xxxxxxxx"
#   .\tools\configure-github-pages-domain.ps1
#
# Ou avec gh connecté : gh auth token | ForEach-Object { $env:GITHUB_TOKEN = $_ ; .\tools\configure-github-pages-domain.ps1 }

param(
    [string]$Owner = 'lauraliedaguzay-lang',
    [string]$Repo = 'pinapp-site',
    [string]$Domain = 'pinapp.fr'
)

$ErrorActionPreference = 'Stop'
$token = $env:GITHUB_TOKEN
if (-not $token) {
    Write-Error 'Définissez la variable d''environnement GITHUB_TOKEN (PAT avec accès au dépôt).'
}

$uri = "https://api.github.com/repos/$Owner/$Repo/pages"
$headers = @{
    Authorization          = "Bearer $token"
    Accept                 = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
}
# Ne pas envoyer build_type : l’API conserve le déploiement GitHub Actions existant.
$body = @{
    cname          = $Domain
    https_enforced = $true
} | ConvertTo-Json

try {
    Invoke-RestMethod -Method Put -Uri $uri -Headers $headers -Body $body -ContentType 'application/json'
    Write-Host "OK : domaine $Domain enregistré sur GitHub Pages (build workflow)." -ForegroundColor Green
    Write-Host "Étape suivante : DNS chez Hostinger (voir tools/dns-hostinger-pinapp-fr.txt)." -ForegroundColor Cyan
} catch {
    $err = $_.ErrorDetails.Message
    if (-not $err) { $err = $_.Exception.Message }
    Write-Error "Échec API GitHub : $err"
}
