#requires -Version 5.1
<#
.SYNOPSIS
  Rappel : formulaire diagnostic natif (sans Tally) integre au depot.

.DESCRIPTION
  Le HTML/CSS/JS vivent dans :
    - diagnostic/index.html
    - assets/css/diagnostic-native.css
    - assets/js/diagnostic-native.js

  Webhook n8n (W1) : dans diagnostic/index.html, script __PINAPP__.WEBHOOK_N8N
  (meme cle que sur l'accueil). Payload JSON plat : besoin, structure, delai,
  budget, prenom, email, telephone, message, source, date.

.EXAMPLE
  Set-Location $env:USERPROFILE\Projects\pinapp-site
  .\pinapp-formulaire-diagnostic.ps1
#>
Write-Host ""
Write-Host "PINAPP — Formulaire diagnostic natif" -ForegroundColor Cyan
Write-Host "  Page : diagnostic/index.html" -ForegroundColor White
Write-Host "  Styles : assets/css/diagnostic-native.css" -ForegroundColor White
Write-Host "  Script : assets/js/diagnostic-native.js" -ForegroundColor White
Write-Host ""
Write-Host "Configurer WEBHOOK_N8N dans le <script> __PINAPP__ du fichier diagnostic/index.html," -ForegroundColor Yellow
Write-Host "puis adapter le workflow n8n W1 au JSON envoye (plus le format Tally)." -ForegroundColor Yellow
Write-Host ""
