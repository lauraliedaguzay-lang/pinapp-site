# =============================================================
#  pandora-audit-fix.ps1 — Pinapp Studio
#  Corrections marketing + copy + justification + formations
#  A executer depuis la RACINE du repo dans Cursor
#
#  Deploy : .\pandora-audit-fix.ps1 -SkipDeploy
#           ou $env:PINAPP_SKIP_DEPLOY = '1'
# =============================================================

param(
    [switch]$SkipDeploy
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ROOT   = Split-Path $PSScriptRoot -Parent
$INDEX  = Join-Path $ROOT "index.html"
$DATE   = Get-Date -Format "yyyyMMdd-HHmm"
$BACKUP = Join-Path $ROOT "index.backup.$DATE.html"

Write-Host "`n[PINAPP] AUDIT FIX — Copy + Marketing + Formations" -ForegroundColor Cyan
Write-Host "────────────────────────────────────────────────────" -ForegroundColor DarkGray

if (-not (Test-Path $INDEX)) {
    Write-Host "ERREUR : index.html introuvable a la racine." -ForegroundColor Red
    exit 1
}

# Backup
Copy-Item $INDEX $BACKUP -Force
Write-Host "OK Backup : index.backup.$DATE.html" -ForegroundColor Green

$html = [System.IO.File]::ReadAllText($INDEX, [System.Text.Encoding]::UTF8)
$original = $html

# =============================================================
# 1. HERO — retrait Auralis RH + baseline concrete + aiguilleur
# =============================================================
Write-Host "... Hero : baseline + retrait Auralis RH + aiguilleur" -ForegroundColor Cyan

# Whisper : retirer "Bienvenue dans Pinapp Studio"
$html = $html -replace '<p class="hero-2026__whisper[^"]*"[^>]*>Bienvenue dans Pinapp Studio\.</p>',
    '<p class="hero-2026__whisper anim-fade-hero" style="--delay: 200ms">Pinapp Studio · Nouvelle-Aquitaine · France entiere a distance</p>'

# Baseline : remplacer la ligne poetique par benefice concret
$html = $html -replace '<p class="hero-2026__baseline[^"]*"[^>]*>[\s\S]*?</p>',
    '<p class="hero-2026__baseline anim-fade-hero" style="--delay: 700ms">Site, automatisation, image : un systeme complet livre en 6 semaines.</p>'

# Sous-titre : ajouter garantie
$html = $html -replace '(<p class="hero-2026__sub[^"]*"[^>]*>)[\s\S]*?(</p>)',
    '$1Pas de jargon. Pas d&apos;intermediaire. Lauralie concoit et deploie elle-meme &mdash; Micha cree les visuels. Resultat mesurable ou rembourse 30 jours.$2'

# Bio : retirer mention Auralis RH
$html = $html -replace '<p class="hero-2026__bio[^"]*"[^>]*>[\s\S]*?</p>',
    '<p class="hero-2026__bio anim-fade-hero" style="--delay: 850ms">Lauralie &amp; Micha &mdash; Pinapp Studio &middot; Nouvelle-Aquitaine</p>'

# Aiguilleur : injecter apres hero__ctas
$AIGUILLEUR = @'
<div class="hero-2026__aiguilleur anim-fade-hero" style="--delay: 1100ms" aria-label="Choisissez votre besoin">
  <p class="hero-2026__aiguilleur-label">Quel est votre besoin ?</p>
  <div class="hero-2026__aiguilleur-btns">
    <a href="#services" class="aiguilleur-btn">
      <span class="aiguilleur-btn__icon">&#128187;</span>
      <span class="aiguilleur-btn__label">Un site web</span>
      <span class="aiguilleur-btn__sub">ou automatisation IA</span>
    </a>
    <a href="#studio-micha" class="aiguilleur-btn">
      <span class="aiguilleur-btn__icon">&#127917;</span>
      <span class="aiguilleur-btn__label">Des visuels</span>
      <span class="aiguilleur-btn__sub">photo, video, branding</span>
    </a>
    <a href="#formations" class="aiguilleur-btn">
      <span class="aiguilleur-btn__icon">&#127891;</span>
      <span class="aiguilleur-btn__label">Me former</span>
      <span class="aiguilleur-btn__sub">IA et automatisation</span>
    </a>
  </div>
</div>
'@

$html = $html -replace '(<div class="hero-2026__scroll")', "$AIGUILLEUR`n`$1"

Write-Host "OK Hero corrige" -ForegroundColor Green

# =============================================================
# 2. CARDS SERVICES — prix + justification + garantie
# =============================================================
Write-Host "... Cards services : prix + livrables + garantie 30j" -ForegroundColor Cyan

# --- Card 1 : Sites ---
$OLD_CARD1 = '<span class="label-2026">Sites &amp; landing pages</span>
                <h3>Un site qui convertit avant même que vous parliez.</h3>
                <p>
                  Design sur-mesure mobile et desktop. Votre meilleur commercial travaille pendant que vous dormez.
                </p>
                <ul class="checklist-2026">
                  <li>Design sur-mesure mobile + desktop</li>
                  <li>Copywriting inclus</li>
                  <li>SEO + mise en ligne</li>
                  <li>Formation 1 h incluse</li>
                  <li>Mode nuit / jour auto</li>
                </ul>
                <p class="card-2026__eco">&lt; 400 Ko · hébergé UE · zéro tracker</p>
                <div class="card-2026__footer">
                  <strong class="card-2026__price">À partir de 800 € HT</strong>
                  <a href="offres/index.html#sites" class="link-arrow-2026">En savoir plus →</a>
                </div>'

$NEW_CARD1 = '<span class="label-2026">Sites &amp; landing pages</span>
                <h3>Un site qui convertit avant meme que vous parliez.</h3>
                <p class="card-2026__roi-line">&#128200; Une agence classique facture 2 000-5 000&euro; pour le meme resultat. Vous l&apos;avez pour 800&euro; HT, livre en 3 semaines.</p>
                <ul class="checklist-2026">
                  <li>Design sur-mesure mobile + desktop</li>
                  <li>Copywriting complet inclus</li>
                  <li>SEO technique + mise en ligne</li>
                  <li>Formation 1h incluse</li>
                  <li>Mode nuit / jour automatique</li>
                  <li>Hebergement UE &lt; 400 Ko &middot; zero tracker</li>
                </ul>
                <div class="card-2026__meta">
                  <span class="card-2026__delai">&#128336; Livre en 3 semaines</span>
                  <span class="card-2026__garantie">&#10003; Satisfait ou rembourse 30 jours</span>
                </div>
                <div class="card-2026__footer">
                  <div>
                    <strong class="card-2026__price">A partir de 800&euro; HT</strong>
                    <span class="card-2026__price-why">design + copy + SEO + formation inclus</span>
                  </div>
                  <a href="diagnostic/index.html" class="link-arrow-2026">Demarrer &#8594;</a>
                </div>'

$html = $html.Replace($OLD_CARD1, $NEW_CARD1)

# --- Card 2 : Automatisation ---
$OLD_CARD2 = '<span class="label-2026">Automatisation n8n</span>
                <h3>Vos tâches répétitives disparaissent. Votre temps revient.</h3>
                <p>Je connecte vos outils et programme les actions à votre place. Vous ne touchez à rien.</p>
                <ul class="checklist-2026">
                  <li>Audit process 1 h</li>
                  <li>Workflow n8n complet</li>
                  <li>Connexion 5 outils</li>
                  <li>Tests + documentation</li>
                </ul>
                <p class="card-2026__roi">Rentabilisé en ~6 semaines</p>
                <p class="card-2026__eco">~47 interactions automatisées / mois</p>
                <div class="card-2026__footer">
                  <strong class="card-2026__price">À partir de 500 € HT</strong>
                  <a href="offres/index.html#automatisation" class="link-arrow-2026">En savoir plus →</a>
                </div>'

$NEW_CARD2 = '<span class="label-2026">Automatisation n8n</span>
                <h3>Vos taches repetitives disparaissent. Votre temps revient.</h3>
                <p class="card-2026__roi-line">&#128200; 8h recuperees par mois en moyenne sur relances, devis et factures. A 50&euro;/h, ca vaut 400&euro;/mois &mdash; rembourse en 2 mois.</p>
                <ul class="checklist-2026">
                  <li>Audit process 1h &mdash; on identifie ce qui vous coute du temps</li>
                  <li>Workflow n8n complet sur-mesure</li>
                  <li>Connexion jusqu&apos;a 5 outils existants</li>
                  <li>Tests + documentation livree</li>
                  <li>3 mois de support inclus</li>
                </ul>
                <div class="card-2026__meta">
                  <span class="card-2026__delai">&#128336; Operationnel en 2 semaines</span>
                  <span class="card-2026__garantie">&#10003; Satisfait ou rembourse 30 jours</span>
                </div>
                <div class="card-2026__footer">
                  <div>
                    <strong class="card-2026__price">A partir de 800&euro; HT</strong>
                    <span class="card-2026__price-why">audit + workflow + support 3 mois inclus</span>
                  </div>
                  <a href="diagnostic/index.html" class="link-arrow-2026">Demarrer &#8594;</a>
                </div>'

$html = $html.Replace($OLD_CARD2, $NEW_CARD2)

# --- Card 3 : IA ---
$OLD_CARD3 = '<span class="label-2026">Intelligence artificielle</span>
                <h3>L''IA formée sur votre métier. Opérationnelle en 48 h.</h3>
                <p>
                  Un assistant qui connaît votre activité, parle à vos clients et travaille pendant que vous dormez.
                </p>
                <ul class="checklist-2026">
                  <li>Formé sur vos documents</li>
                  <li>Intégré sur votre site</li>
                  <li>Tests 50 scénarios</li>
                  <li>Dashboard inclus</li>
                </ul>
                <p class="card-2026__eco">IA sobre · zéro surconsommation</p>
                <div class="card-2026__footer">
                  <strong class="card-2026__price">À partir de 600 € HT</strong>
                  <a href="offres/index.html#ia" class="link-arrow-2026">En savoir plus →</a>
                </div>'

$NEW_CARD3 = '<span class="label-2026">Intelligence artificielle</span>
                <h3>L&apos;IA formee sur votre metier. Operationnelle en 48h.</h3>
                <p class="card-2026__roi-line">&#128200; Equivalent de 3 jours de conseil IA senior (450&euro;/jour). Vous l&apos;avez integree sur votre site pour 1 200&euro; HT &mdash; avec mise a jour 6 mois incluse.</p>
                <ul class="checklist-2026">
                  <li>Formee sur vos documents metier</li>
                  <li>Integree sur votre site en 48h</li>
                  <li>Testee sur 50 scenarios reels</li>
                  <li>Dashboard de suivi inclus</li>
                  <li>Mises a jour pendant 6 mois</li>
                  <li>IA sobre &middot; zero surconsommation</li>
                </ul>
                <div class="card-2026__meta">
                  <span class="card-2026__delai">&#128336; Integree en 48h</span>
                  <span class="card-2026__garantie">&#10003; Satisfait ou rembourse 30 jours</span>
                </div>
                <div class="card-2026__footer">
                  <div>
                    <strong class="card-2026__price">A partir de 1 200&euro; HT</strong>
                    <span class="card-2026__price-why">formation + integration + suivi 6 mois</span>
                  </div>
                  <a href="diagnostic/index.html" class="link-arrow-2026">Demarrer &#8594;</a>
                </div>'

$html = $html.Replace($OLD_CARD3, $NEW_CARD3)

# --- Card 4 : Micha ---
$OLD_CARD4 = '<span class="label-2026">Imagerie &amp; direction artistique</span>
                <h3>Des visuels qui font ressentir ce que les mots ne peuvent pas dire.</h3>
                <p>
                  Photo, vidéo, restauration, branding Adobe et IA générative. Depuis son studio ou chez vous en
                  Nouvelle-Aquitaine.
                </p>
                <ul class="checklist-2026">
                  <li>Photo &amp; vidéo pro</li>
                  <li>Restauration highfield</li>
                  <li>Branding Adobe complet</li>
                  <li>IA générative dirigée</li>
                </ul>
                <p class="card-2026__distance">100 % faisable à distance</p>
                <div class="card-2026__footer">
                  <strong class="card-2026__price">À partir de 300 € HT</strong>
                  <a href="offres/index.html#imagerie" class="link-arrow-2026">En savoir plus →</a>
                </div>'

$NEW_CARD4 = '<span class="label-2026">Imagerie &amp; direction artistique &mdash; Micha</span>
                <h3>Des visuels qui font ressentir ce que les mots ne peuvent pas dire.</h3>
                <p class="card-2026__roi-line">&#128200; Un studio photo professionnel facture 600-1 500&euro; la demi-journee. Micha intervient a partir de 300&euro; HT &mdash; livraison 48h, droits cedes.</p>
                <ul class="checklist-2026">
                  <li>Photo &amp; video professionnelles</li>
                  <li>Restauration numerique haute fidelite</li>
                  <li>Branding Adobe complet</li>
                  <li>Direction artistique IA generative</li>
                  <li>Droits cedes inclus dans chaque devis</li>
                  <li>Retouches incluses &middot; livraison 48h</li>
                </ul>
                <div class="card-2026__meta">
                  <span class="card-2026__delai">&#128336; Livraison 48h</span>
                  <span class="card-2026__garantie">&#10003; Satisfait ou rembourse 30 jours</span>
                </div>
                <p class="card-2026__distance">Nouvelle-Aquitaine &middot; France entiere a distance</p>
                <div class="card-2026__footer">
                  <div>
                    <strong class="card-2026__price">A partir de 300&euro; HT</strong>
                    <span class="card-2026__price-why">droits + retouches + livraison 48h inclus</span>
                  </div>
                  <a href="https://wa.me/33659882015?text=Bonjour%20Micha%2C%20je%20souhaite%20un%20devis%20pour%20" class="link-arrow-2026" target="_blank" rel="noopener noreferrer">Contacter Micha &#8594;</a>
                </div>'

$html = $html.Replace($OLD_CARD4, $NEW_CARD4)

Write-Host "OK Cards services corriges (prix auto 800 / IA 1200 / garanties)" -ForegroundColor Green

# =============================================================
# 3. STATS SECTION MENTAL — reformuler sans chiffres nus
# =============================================================
Write-Host "... Section Mental : stats reformulees" -ForegroundColor Cyan

$html = $html -replace '<span class="mental-2026__source">\(ordre de grandeur, neuroscience cognitive\)</span>',
    '<span class="mental-2026__source">estimation neurosciences cognitives</span>'

$html = $html -replace '<span class="mental-2026__source">\(études terrain PME\)</span>',
    '<span class="mental-2026__source">barometre terrain dirigeants TPE/PME</span>'

$html = $html -replace '<span class="mental-2026__source">\(baromètres dirigeants\)</span>',
    '<span class="mental-2026__source">barometre dirigeants PME independants</span>'

Write-Host "OK Stats reformulees" -ForegroundColor Green

# =============================================================
# 4. DEMOS → REALISATIONS partout
# =============================================================
Write-Host "... Demos -> Realisations" -ForegroundColor Cyan

$html = $html -replace 'Nos réalisations démo', 'Nos realisations'
$html = $html -replace 'réalisations démo', 'realisations'
$html = $html -replace 'Onze secteurs\. Onze démonstrations vivantes de ce que nous construisons\.',
    'Onze secteurs. Onze realisations concretes &mdash; ce que nous construisons pour nos clients.'
$html = $html -replace 'Démos live', 'Realisations live'
$html = $html -replace 'Voir la démo live →', 'Voir la realisation →'
$html = $html -replace 'demos-title', 'realisations-title'

Write-Host "OK Demos -> Realisations" -ForegroundColor Green

# =============================================================
# 5. SECTION STUDIO MICHA — CTA WhatsApp dedié + ancre
# =============================================================
Write-Host "... Section Micha : ancre + CTA WhatsApp" -ForegroundColor Cyan

$html = $html -replace '<section class="section-2026 studio-2026" id="studio">',
    '<section class="section-2026 studio-2026" id="studio-micha">'

# Ajouter CTA WhatsApp sous la section membre Micha
$OLD_MICHA_ROLE = '<p class="studio-2026__role" style="margin-top: 12px">
            Nouvelle-Aquitaine · France entière à distance
          </p>'

$NEW_MICHA_ROLE = '<p class="studio-2026__role" style="margin-top: 12px">
            Nouvelle-Aquitaine &middot; France entiere a distance
          </p>
          <a href="https://wa.me/33659882015?text=Bonjour%20Micha%2C%20je%20souhaite%20vous%20contacter%20pour%20un%20projet%20visuel." class="btn-micha-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="Contacter Micha sur WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contacter Micha sur WhatsApp
          </a>'

$html = $html.Replace($OLD_MICHA_ROLE, $NEW_MICHA_ROLE)

Write-Host "OK Section Micha : ancre studio-micha + CTA WhatsApp" -ForegroundColor Green

# =============================================================
# 6. FORMATIONS — reorder + liste d attente + justification
# =============================================================
Write-Host "... Formations : reorder + liste d attente + justification" -ForegroundColor Cyan

# Remplacer toute la grille formations
$OLD_GRID_START = '<div class="formations-2026__grid">'

$NEW_FORMATIONS_GRID = '<p class="formations-2026__coming-soon">
          &#128197; Les formations sont en cours de production &mdash; inscrivez-vous pour etre notifie(e) en premier.
        </p>
        <div class="formations-2026__grid">'

$html = $html.Replace($OLD_GRID_START, $NEW_FORMATIONS_GRID)

# Card 1 (397€ — mise en premier dans le nouveau HTML via JS reorder)
# On patche chaque card avec justification + liste d'attente

# Card autonomie 47€
$OLD_F1 = '<article class="formations-2026__card formations-2026__reveal" style="--fdelay: 0ms">
              <span class="formations-2026__badge">Autonomie</span>
              <h3 class="formations-2026__card-title">Récupère 5h par semaine</h3>
              <p class="formations-2026__body">
                Automatise tes tâches répétitives avec n8n.<br />
                5 modules. Cas pratiques réels. Zéro code.
              </p>
              <p class="formations-2026__format">PDF interactif + vidéos &lt; 10min</p>
              <p class="formations-2026__price">47€</p>
              <div class="formations-2026__fill" aria-hidden="true"></div>
              <a href="offres/formation/index.html" class="formations-2026__cta formations-2026__cta--outline"
                >Je veux cette formation</a
              >
            </article>'

$NEW_F1 = '<article class="formations-2026__card formations-2026__reveal" style="--fdelay: 160ms">
              <span class="formations-2026__badge">Autonomie</span>
              <h3 class="formations-2026__card-title">Recupere 5h par semaine</h3>
              <p class="formations-2026__roi">&#128200; 5h x 52 semaines = 260h/an. Au cout horaire moyen, ca vaut 10x le prix de la formation.</p>
              <p class="formations-2026__body">
                Automatise tes taches repetitives avec n8n.<br />
                5 modules. Cas pratiques reels. Zero code requis.<br />
                <strong>Niveau :</strong> aucune competence technique &mdash; si tu sais utiliser Excel, tu peux suivre.
              </p>
              <p class="formations-2026__format">PDF interactif + videos &lt; 10min + 3 workflows prets a l&apos;emploi</p>
              <p class="formations-2026__delai-f">Applicable des la semaine 1</p>
              <p class="formations-2026__price">47&euro;</p>
              <p class="formations-2026__garantie-f">&#10003; Rembourse 30 jours si vous n&apos;avez pas automatise 1 tache</p>
              <div class="formations-2026__fill" aria-hidden="true"></div>
              <a href="https://tally.so/r/PINAPP-AUTO" class="formations-2026__cta formations-2026__cta--outline" target="_blank" rel="noopener noreferrer"
                >&#128231; Me notifier a la sortie</a
              >
            </article>'

$html = $html.Replace($OLD_F1, $NEW_F1)

# Card site 147€
$OLD_F2 = '<article class="formations-2026__card formations-2026__reveal" style="--fdelay: 80ms">
              <span class="formations-2026__badge">Création</span>
              <h3 class="formations-2026__card-title">Ton site pro en 7 jours</h3>
              <p class="formations-2026__body">
                De zéro à un site premium livré sur Hostinger.<br />
                7 modules. Cursor, SFTP, copywriting inclus.
              </p>
              <p class="formations-2026__format">Parcours asynchrone + checklist PDF</p>
              <p class="formations-2026__price">147€</p>
              <div class="formations-2026__fill" aria-hidden="true"></div>
              <a href="offres/formation/index.html" class="formations-2026__cta formations-2026__cta--outline"
                >Je veux cette formation</a
              >
            </article>'

$NEW_F2 = '<article class="formations-2026__card formations-2026__reveal" style="--fdelay: 80ms">
              <span class="formations-2026__badge">Creation</span>
              <h3 class="formations-2026__card-title">Ton site pro en 7 jours</h3>
              <p class="formations-2026__roi">&#128200; Une agence facture 1 500&euro; minimum. Tu le fais toi-meme pour 147&euro; &mdash; et tu gardes la main dessus.</p>
              <p class="formations-2026__body">
                De zero a un site premium livre sur Hostinger.<br />
                7 modules. Cursor, SFTP, copywriting inclus.<br />
                <strong>Niveau :</strong> debutant complet accepte &mdash; pas de code.
              </p>
              <p class="formations-2026__format">Parcours asynchrone + checklist PDF + 1h suivi incluse</p>
              <p class="formations-2026__delai-f">Site en ligne en 7 jours ou rembourse</p>
              <p class="formations-2026__price">147&euro;</p>
              <p class="formations-2026__garantie-f">&#10003; Rembourse si votre site n&apos;est pas en ligne a J+7</p>
              <div class="formations-2026__fill" aria-hidden="true"></div>
              <a href="https://tally.so/r/PINAPP-SITE" class="formations-2026__cta formations-2026__cta--outline" target="_blank" rel="noopener noreferrer"
                >&#128231; Me notifier a la sortie</a
              >
            </article>'

$html = $html.Replace($OLD_F2, $NEW_F2)

# Card IA 397€ — mise en premier ordre via CSS order
$OLD_F3 = '<article class="formations-2026__card formations-2026__reveal" style="--fdelay: 160ms">
              <span class="formations-2026__badge">Transformation</span>
              <h3 class="formations-2026__card-title">L''IA au travail pour toi</h3>
              <p class="formations-2026__body">
                Chatbot, automatisation avancée, prompt engineering.<br />
                10 modules. Co-produit avec Michaël Bouilhac, vidéaste expert.
              </p>
              <p class="formations-2026__format">Vidéos HD + replay + ressources Notion</p>
              <p class="formations-2026__price">397€</p>
              <div class="formations-2026__fill" aria-hidden="true"></div>
              <a href="offres/formation/index.html" class="formations-2026__cta formations-2026__cta--outline"
                >Je veux cette formation</a
              >
              <p class="formations-2026__note">Production vidéo : Michaël Bouilhac — Mémoire &amp; Présence</p>
            </article>'

$NEW_F3 = '<article class="formations-2026__card formations-2026__card--featured formations-2026__reveal" style="--fdelay: 0ms; order: -1;">
              <span class="formations-2026__badge">Transformation &mdash; La plus complete</span>
              <h3 class="formations-2026__card-title formations-2026__card-title--featured">L&apos;IA au travail pour toi</h3>
              <p class="formations-2026__roi">&#128200; Equivalent de 3 jours de conseil IA a 150&euro;/jour. Acces a vie pour 397&euro; &mdash; avec production video professionnelle.</p>
              <p class="formations-2026__body">
                Chatbot, automatisation avancee, prompt engineering.<br />
                10 modules. Production video HD par Micha, realisateur professionnel.<br />
                <strong>Niveau :</strong> intermediaire &mdash; avoir deja utilise ChatGPT est un plus.
              </p>
              <p class="formations-2026__format">Videos HD + replay a vie + ressources Notion + acces communaute</p>
              <p class="formations-2026__delai-f">Acces immediat a l&apos;achat</p>
              <p class="formations-2026__price">397&euro;</p>
              <p class="formations-2026__garantie-f">&#10003; Rembourse 30 jours sans condition</p>
              <div class="formations-2026__fill" aria-hidden="true"></div>
              <a href="https://tally.so/r/PINAPP-IA" class="formations-2026__cta formations-2026__cta--solid" target="_blank" rel="noopener noreferrer"
                >&#128231; Me notifier en premier</a
              >
              <p class="formations-2026__note">Production video : Micha &mdash; realisateur professionnel, Nouvelle-Aquitaine &middot; <a href="https://memoireetpresence.fr" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">memoireetpresence.fr</a></p>
            </article>'

$html = $html.Replace($OLD_F3, $NEW_F3)

# Card pack prompts 97€
$OLD_F4 = '<article
              class="formations-2026__card formations-2026__card--featured formations-2026__reveal"
              style="--fdelay: 240ms">
              <span class="formations-2026__badge">Exclusif</span>
              <h3 class="formations-2026__card-title formations-2026__card-title--featured">
                Pack Prompting Pinapp × Mémoire &amp; Présence
              </h3>
              <p class="formations-2026__body">
                Les prompts qu&apos;on utilise vraiment. IA, automatisation, web, vidéo, créatif.
              </p>
              <div class="formations-2026__highlights">
                <p class="formations-2026__highlight">→ 50+ prompts opérationnels classés par usage</p>
                <p class="formations-2026__highlight">→ Prompts Pinapp : web, IA, automatisation, onboarding</p>
                <p class="formations-2026__highlight">→ Prompts M&amp;P : vidéo, narration, hommages, créatif</p>
              </div>
              <p class="formations-2026__price">97€</p>
              <p class="formations-2026__price-note">Inclus dans la formation à 397€</p>
              <div class="formations-2026__fill" aria-hidden="true"></div>
              <a href="offres/formation/index.html" class="formations-2026__cta formations-2026__cta--solid"
                >Obtenir le pack</a
              >
            </article>'

$NEW_F4 = '<article class="formations-2026__card formations-2026__reveal" style="--fdelay: 240ms">
              <span class="formations-2026__badge">Exclusif &mdash; Pour les deja formes</span>
              <h3 class="formations-2026__card-title">
                Pack Prompts Pinapp &times; Micha
              </h3>
              <p class="formations-2026__roi">&#128200; Pas besoin de la formation complete ? Juste les prompts qu&apos;on utilise vraiment chaque jour &mdash; operationnels, classes, mis a jour.</p>
              <p class="formations-2026__body">
                Pour les freelances et dirigeants deja a l&apos;aise avec l&apos;IA &mdash; qui veulent gagner du temps sans repartir de zero.
              </p>
              <div class="formations-2026__highlights">
                <p class="formations-2026__highlight">&#8594; 50+ prompts operationnels classes par usage</p>
                <p class="formations-2026__highlight">&#8594; Pinapp : web, IA, automatisation, onboarding client</p>
                <p class="formations-2026__highlight">&#8594; Micha : video, narration, direction artistique, creatif</p>
                <p class="formations-2026__highlight">&#8594; Mis a jour trimestriellement &middot; acces Notion partage</p>
              </div>
              <p class="formations-2026__price">97&euro;</p>
              <p class="formations-2026__price-note">Inclus dans la formation a 397&euro; &mdash; achetez le pack si vous n&apos;avez pas besoin du reste.</p>
              <p class="formations-2026__garantie-f">&#10003; Rembourse 30 jours</p>
              <div class="formations-2026__fill" aria-hidden="true"></div>
              <a href="https://tally.so/r/PINAPP-PROMPTS" class="formations-2026__cta formations-2026__cta--outline" target="_blank" rel="noopener noreferrer"
                >&#128231; Me notifier a la sortie</a
              >
            </article>'

$html = $html.Replace($OLD_F4, $NEW_F4)

Write-Host "OK Formations corrigees (liste d attente + justification + reorder)" -ForegroundColor Green

# =============================================================
# 7. CSS ADDITIONS — aiguilleur + card meta + formations extras
# =============================================================
Write-Host "... Injection CSS complementaire (aiguilleur + meta cards)" -ForegroundColor Cyan

$CSS_ADD = @'
<style id="pandora-audit-fix">
/* Aiguilleur hero */
.hero-2026__aiguilleur { margin-top: 2rem; }
.hero-2026__aiguilleur-label { font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-dim); margin-bottom: .75rem; }
.hero-2026__aiguilleur-btns { display: flex; gap: .75rem; flex-wrap: wrap; }
.aiguilleur-btn { display: flex; flex-direction: column; align-items: flex-start; gap: .15rem; padding: .75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-card); text-decoration: none; transition: all var(--t); min-width: 130px; }
.aiguilleur-btn:hover { border-color: var(--border-accent); background: var(--bg-card-hover); transform: translateY(-2px); }
.aiguilleur-btn__icon { font-size: 1.2rem; }
.aiguilleur-btn__label { font-size: .85rem; font-weight: 600; color: var(--text); }
.aiguilleur-btn__sub { font-size: .7rem; color: var(--text-muted); }

/* Card meta (delai + garantie) */
.card-2026__meta { display: flex; flex-direction: column; gap: .3rem; margin-bottom: .75rem; }
.card-2026__delai { font-size: .75rem; color: var(--text-muted); }
.card-2026__garantie { font-size: .75rem; color: var(--accent); font-weight: 600; }
.card-2026__price-why { display: block; font-size: .68rem; color: var(--text-dim); margin-top: .15rem; font-style: italic; }
.card-2026__roi-line { font-size: .8rem; color: var(--accent); background: var(--accent-glow); border-radius: var(--radius-sm); padding: .5rem .75rem; margin-bottom: .75rem; line-height: 1.5; }

/* Bouton WhatsApp Micha */
.btn-micha-whatsapp { display: inline-flex; align-items: center; gap: .5rem; margin-top: 1rem; padding: .65rem 1.1rem; border-radius: var(--radius-sm); background: #25D366; color: #fff; font-size: .85rem; font-weight: 600; text-decoration: none; transition: opacity var(--t), box-shadow var(--t); }
.btn-micha-whatsapp:hover { opacity: .88; box-shadow: 0 0 20px rgba(37,211,102,.3); }

/* Formations extras */
.formations-2026__coming-soon { font-size: .875rem; color: var(--accent); background: var(--accent-glow); border: 1px solid var(--border-accent); border-radius: var(--radius); padding: .75rem 1rem; margin-bottom: 1.5rem; text-align: center; }
.formations-2026__roi { font-size: .78rem; color: var(--accent); background: var(--accent-glow); border-radius: var(--radius-sm); padding: .4rem .65rem; margin-bottom: .65rem; line-height: 1.5; }
.formations-2026__delai-f { font-size: .72rem; color: var(--text-muted); margin-bottom: .3rem; }
.formations-2026__garantie-f { font-size: .72rem; color: var(--accent); font-weight: 600; margin-bottom: .75rem; }
</style>
'@

$html = $html -replace '(</head>)', "$CSS_ADD`n`$1"

Write-Host "OK CSS complementaire injecte" -ForegroundColor Green

# =============================================================
# 8. GLOBAL — "Nous" partout + zone geo Lauralie
# =============================================================
Write-Host "... Coherence Nous + zone geo Lauralie" -ForegroundColor Cyan

$html = $html -replace 'Je connecte vos outils et programme les actions à votre place\. Vous ne touchez à rien\.',
    'Nous connectons vos outils et programmons les actions a votre place. Vous ne touchez a rien.'

$html = $html -replace 'Je conçois les systèmes, j&apos;écris les specs et je les déploie moi-même\. De l&apos;architecture à l&apos;exécution — sans intermédiaire\.',
    'Lauralie concoit les systemes, ecrit les specs et les deploie elle-meme depuis la Nouvelle-Aquitaine. De l&apos;architecture a l&apos;execution &mdash; sans intermediaire.'

Write-Host "OK Coherence Nous + zone geo" -ForegroundColor Green

# =============================================================
# 9. TITRE PAGE — mise a jour
# =============================================================
$html = $html -replace '<title>Pinapp Studio — Systèmes intelligents sur-mesure</title>',
    '<title>Pinapp Studio &mdash; Site, automatisation IA et visuels pour TPE/PME &mdash; Nouvelle-Aquitaine</title>'

$html = $html -replace 'content="Sites premium, automatisations n8n et IA sur-mesure pour TPE et PME françaises\."',
    'content="Pinapp Studio : site web premium, automatisation n8n et IA sur-mesure pour TPE/PME. Satisfait ou rembourse 30 jours. Nouvelle-Aquitaine, France entiere."'

Write-Host "OK SEO title + meta description" -ForegroundColor Green

# =============================================================
# 10. ECRITURE + VERIFICATION
# =============================================================
if ($html -eq $original) {
    Write-Host "`nATTENTION : aucune modification appliquee. Verifiez que le HTML correspond exactement au repo GitHub." -ForegroundColor Yellow
} else {
    [System.IO.File]::WriteAllText($INDEX, $html, [System.Text.Encoding]::UTF8)
    $nbCorr = ($html.Length - $original.Length)
    Write-Host "OK index.html ecrit ($nbCorr caracteres de difference vs backup)" -ForegroundColor Green
}

# =============================================================
# 11. DEPLOY SFTP
# =============================================================
$skipDeploy = $SkipDeploy -or ($env:PINAPP_SKIP_DEPLOY -match '^(1|true|yes)$')
if ($skipDeploy) {
    Write-Host "`n... DEPLOY Hostinger [SKIP] (-SkipDeploy ou PINAPP_SKIP_DEPLOY=1)" -ForegroundColor Yellow
    Write-Host '   Local : index.html' -ForegroundColor DarkGray
    Write-Host '   Pour SFTP : relancer sans skip, ou WinSCP manuel / Hostinger File Manager.' -ForegroundColor DarkGray
} else {
    Write-Host "`n... DEPLOY Hostinger" -ForegroundColor Cyan

    $ENV_FILE = Join-Path $env:USERPROFILE ".pinapp-fr-env.ps1"
    $H = $null; $U = $null; $PW = $null; $RP = "/public_html"

    if (Test-Path $ENV_FILE) {
        Write-Host "OK Credentials trouves" -ForegroundColor Green
        . $ENV_FILE
        foreach ($n in 'SFTP_HOST','FTP_HOST','HOSTINGER_HOST') { $v = Get-Variable $n -EA SilentlyContinue; if ($v) { $H = $v.Value; break } }
        foreach ($n in 'SFTP_USER','FTP_USER','HOSTINGER_USER') { $v = Get-Variable $n -EA SilentlyContinue; if ($v) { $U = $v.Value; break } }
        foreach ($n in 'SFTP_PASS','FTP_PASS','HOSTINGER_PASS') { $v = Get-Variable $n -EA SilentlyContinue; if ($v) { $PW = $v.Value; break } }
        foreach ($n in 'SFTP_PATH','REMOTE_PATH','FTP_PATH')    { $v = Get-Variable $n -EA SilentlyContinue; if ($v) { $RP = $v.Value; break } }
    } else {
        Write-Host "i Saisie manuelle des credentials" -ForegroundColor Yellow
    }

    if (-not $H)  { $H  = Read-Host "  Hote SFTP Hostinger" }
    if (-not $U)  { $U  = Read-Host "  Utilisateur SFTP" }
    if (-not $PW) {
        $sec = Read-Host "  Mot de passe SFTP" -AsSecureString
        $PW = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
    }

    if (-not (Test-Path $ENV_FILE)) {
        $save = Read-Host "  Sauvegarder credentials ? (o/n)"
        if ($save -eq 'o') {
            @"
`$SFTP_HOST='$H'
`$SFTP_USER='$U'
`$SFTP_PASS='$PW'
`$SFTP_PATH='$RP'
"@ | Set-Content $ENV_FILE -Encoding UTF8
            Write-Host "OK Credentials sauvegardes" -ForegroundColor Green
        }
    }

    $WINSCP = @(
        "C:\Program Files (x86)\WinSCP\WinSCP.com",
        "C:\Program Files\WinSCP\WinSCP.com",
        "$env:LOCALAPPDATA\Programs\WinSCP\WinSCP.com"
    ) | Where-Object { Test-Path $_ } | Select-Object -First 1

    if ($WINSCP) {
        Write-Host "OK WinSCP trouve - upload index.html (log diagnostic)..." -ForegroundColor Green
        $TMP = Join-Path $env:TEMP "audit-fix-deploy.txt"
        $WLOG = Join-Path $env:TEMP ("winscp-pandora-audit-fix-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))
        $winScpScript = @"
option batch abort
option confirm off
open sftp://${U}:${PW}@${H}/ -hostkey=*
put `"$INDEX`" `"${RP}/index.html`"
exit
"@
        $winScpScript | Set-Content $TMP -Encoding UTF8
        & $WINSCP @("/log=$WLOG", "/script=$TMP")
        Remove-Item $TMP -Force
        Write-Host "   Log WinSCP : $WLOG" -ForegroundColor DarkGray
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nOK Deploy reussi ! -> https://pinapp.fr" -ForegroundColor Green
        } else {
            Write-Host "`nERREUR WinSCP ($LASTEXITCODE) - voir le log WinSCP ci-dessus." -ForegroundColor Red
        }
    } else {
        $PS1 = Join-Path $ROOT "pinapp.ps1"
        if (Test-Path $PS1) {
            Write-Host "i WinSCP absent - tentative pinapp.ps1 fr-auto" -ForegroundColor Yellow
            & powershell -NoProfile -ExecutionPolicy Bypass -File $PS1 fr-auto
        } else {
            Write-Host @"

WARN WinSCP non trouve. Installer : https://winscp.net/eng/download.php
     Puis relancer ce script.
     Ou uploader manuellement index.html via Hostinger File Manager.
"@ -ForegroundColor Yellow
        }
    }
}

Write-Host "`nOK AUDIT FIX TERMINE" -ForegroundColor Cyan
Write-Host "   Backup     : index.backup.$DATE.html" -ForegroundColor DarkGray
Write-Host "   Rollback   : Copy-Item index.backup.$DATE.html index.html" -ForegroundColor DarkGray
Write-Host "`n   TODO apres deploy :" -ForegroundColor Yellow
Write-Host "   [ ] Creer 4 Tally Forms et remplacer les URLs PINAPP-AUTO / PINAPP-SITE / PINAPP-IA / PINAPP-PROMPTS" -ForegroundColor Yellow
Write-Host "   [ ] Valider WhatsApp Micha : wa.me/33659882015" -ForegroundColor Yellow
Write-Host "   [ ] Ajouter temoignages clients quand disponibles`n" -ForegroundColor Yellow
