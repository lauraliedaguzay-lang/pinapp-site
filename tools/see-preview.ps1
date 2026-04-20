#Requires -Version 5.1
<#
.SYNOPSIS
  Ouvre la preview Netlify PR #39 (V2.4 DREAM) dans le navigateur par défaut.
#>
$NetlifyPreviewUrl = 'https://deploy-preview-39--stellular-liger-a492db.netlify.app/'
Write-Host "Ouverture : $NetlifyPreviewUrl" -ForegroundColor Cyan
Start-Process $NetlifyPreviewUrl
