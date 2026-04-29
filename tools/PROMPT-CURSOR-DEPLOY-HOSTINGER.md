# Prompt Cursor — déploiement Pinapp Hostinger (orchestration terminal)

Copie **uniquement** le bloc entre `▼ DÉBUT` et `▲ FIN` dans le chat Cursor (ou exécute les commandes dans le terminal intégré sur **Windows** avec PowerShell).

---

## TL;DR — 3 minutes

1. Place le **ZIP du site** dans `Téléchargements` (ou note son chemin absolu).
2. Depuis le dépôt `pinapp-site`, lance le script `tools/deploy-pinapp.ps1` (voir bloc ci-dessous).
3. Saisis **hôte SFTP**, **utilisateur**, **mot de passe** Hostinger quand demandé.
4. Après upload : **hPanel → Avancé → Cache → Vider le cache** (pas d’API) ou teste `https://pinapp.fr/?v=3`.

**Si Windows bloque l’exécution** (PowerShell admin une fois) :

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
```

**Credentials** : hPanel → ton site → Avancé → Comptes FTP — hôte (souvent `ftp.tondomaine.fr` ou IP), user `u…`, mot de passe, **port 22 SFTP**.

---

▼ DÉBUT — colle ceci dans Cursor (Windows, PowerShell)

```
Tu es sur Windows avec le dépôt pinapp-site ouvert.

1) Vérifie que le fichier existe :
   Test-Path "$PWD\tools\deploy-pinapp.ps1"

2) Lance le déploiement (ZIP le plus récent dans Downloads si tu n’as pas de -ZipPath) :
   powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\deploy-pinapp.ps1"

   Si le ZIP n’est pas dans Téléchargements, passe le chemin :
   powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\deploy-pinapp.ps1" -ZipPath "C:\Users\TON_USER\Downloads\mon-site.zip"

   Chemin distant personnalisé (optionnel) :
   ... -RemotePath "/public_html"

3) Quand le script demande hôte / user / mot de passe, l’utilisateur les saisit dans le terminal (ne pas coller de secrets dans le chat Cursor).

4) À la fin, rappelle : vider le cache Hostinger (hPanel) ou ouvrir pinapp.fr avec ?v= pour bypass cache.

5) Si WinSCP échoue : ouvre le chemin du log affiché en fin de script et résume l’erreur (sans recopier le mot de passe).
```

▲ FIN

---

## Fichiers du dépôt

| Fichier | Rôle |
|--------|------|
| `tools/deploy-pinapp.ps1` | Script autonome (double-clic ou ligne de commande) |
| `tools/PROMPT-CURSOR-DEPLOY-HOSTINGER.md` | Ce document + bloc à coller dans Cursor |

**Option profil** (sans mot de passe dans le fichier) : crée `%USERPROFILE%\.pinapp-deploy-env.ps1` avec par exemple :

```powershell
$PinappDeployHost = 'ftp.exemple.fr'
$PinappDeployUser = 'u123456789'
$PinappDeployRemotePath = '/public_html'
# $PinappDeployPass = '...'  # optionnel, déconseillé
```

---

## FTP port 21 au lieu de SFTP

Si Hostinger ne fournit que du FTP classique, le script actuel cible **SFTP (22)**. Indique-le en issue / demande d’adaptation : basculer `open sftp://…` vers `open ftp://…` et port 21.
