Tu es un developpeur senior full-stack travaillant sur pinapp.fr.
Applique TOUT ce qui suit sur TOUS les fichiers HTML/CSS/JS du projet.
Ne saute aucune etape. Commence par lister tous les fichiers puis applique dans l'ordre.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 1 -- PALETTE PANDORA -- OBLIGATOIRE PARTOUT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Ajoute data-theme="dark" sur TOUTES les balises <html> de tous les fichiers HTML.
Dark = defaut absolu. Le toggle jour/nuit reste disponible mais dark est le defaut.

Variables CSS a definir dans :root[data-theme="dark"] :
--bg: #050A14
--bg-card: #0A1628
--bg-card-2: #0D1E35
--text: #E8F4F8
--text-muted: rgba(232,244,248,0.6)
--teal: #00E5CC
--violet: #7B4FE8
--green: #39E075
--blue: #4FC3F7
--glow: rgba(0,229,204,0.08)
--glow-green: rgba(57,224,117,0.3)
--border: rgba(0,229,204,0.12)
--shadow: 0 0 40px rgba(0,229,204,0.08), 0 2px 8px rgba(0,0,0,0.4)

Variables CSS a definir dans :root[data-theme="light"] :
--bg: #FDF0F3
--bg-card: #FFF5F7
--bg-card-2: #EEF0FF
--text: #0D1B3E
--text-muted: rgba(13,27,62,0.6)
--teal: #00B4A6
--violet: #5B4FE8
--green: #2EAF6B
--blue: #3B82F6
--glow: rgba(0,180,166,0.06)
--glow-green: rgba(46,175,107,0.2)
--border: rgba(91,79,232,0.15)
--shadow: 0 2px 20px rgba(13,27,62,0.08)

Fond body nuit : background: var(--bg)
Grain noise double couche sur body::before :
position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.03;
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 2 -- TYPOGRAPHIE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Preload dans <head> de tous les HTML :

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">

Regles typographiques :

- Titres h1 h2 h3 : font-family Georgia serif; letter-spacing: -0.02em
- Corps : font-family: Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif
- font-display: swap sur toutes les fonts
- Tailles rem uniquement -- jamais px sur les fonts
- Hero h1 desktop : font-size: clamp(3rem, 8vw, 6rem); letter-spacing: -0.03em
- Hero h1 mobile 390px : font-size: clamp(2rem, 7vw, 3.5rem)
- Sections h2 : font-size: clamp(1.75rem, 4vw, 3rem)
- Corps : font-size: 1rem; line-height: 1.7
- Labels uppercase : font-size: 0.688rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal)
- Max 45ch par ligne sur mobile; 65ch sur desktop

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 3 -- TOUTES LES BARRES DE PROGRESSION
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Chaque barre progress loading scroll indicator :
background: linear-gradient(90deg, var(--green), var(--teal));
border-radius: 100px;
height: 3px;
box-shadow: 0 0 12px var(--glow-green);

Animation fill :
@keyframes progressFill { from { width: 0 } to { width: 100% } }
animation: progressFill 300ms cubic-bezier(0.25,0.1,0.25,1) forwards;

Barre scroll progress en haut de page :
position: fixed; top: 0; left: 0; height: 2px; z-index: 9999;
background: linear-gradient(90deg, var(--green), var(--teal));
width: 0%; transition: width 100ms linear;
JS : window.addEventListener('scroll', () => { const p = window.scrollY / (document.body.scrollHeight - window.innerHeight); document.getElementById('scroll-bar').style.width = (p\*100)+'%'; });

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 4 -- NAVIGATION DESKTOP
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Supprimer TOUTES les navbars existantes. En creer une seule.
height: 64px; position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
background: rgba(5,10,20,0.85) en dark / rgba(253,240,243,0.85) en light;
backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
border-bottom: 1px solid var(--border);

Contenu nav desktop :

- Gauche : logo Pinapp officiel (favicon.svg / pinapp-logo.png + wordmark Inter 300)
- Centre : 4 liens uniquement : Services - Demos - Auralis - Contact
  font-size: 0.875rem; color: var(--text-muted); letter-spacing: 0.02em
  Underline teal qui se dessine gauche-droite au hover (200ms)
- Droite : bouton pill "Diagnostic offert -- 30 min"
  background: var(--violet); color: white; border-radius: 100px;
  padding: 0.5rem 1.25rem; font-size: 0.813rem; font-weight: 500

Comportement scroll :

- Scroll down > 100px : translateY(-100%) 300ms
- Scroll up : translateY(0) 300ms
  JS : let lastY = 0; window.addEventListener('scroll', () => { const nav = document.querySelector('nav'); if(window.scrollY > lastY && window.scrollY > 100) { nav.style.transform = 'translateY(-100%)'; } else { nav.style.transform = 'translateY(0)'; } lastY = window.scrollY; });

Toggle dark/light : icone soleil/lune top-right nav -- 32px -- outline

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 5 -- NAVIGATION MOBILE 390px
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Supprimer burger menu. Supprimer nav mobile existante.
Creer bottom bar fixe :
position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;
height: 64px;
padding-bottom: env(safe-area-inset-bottom);
background: rgba(5,10,20,0.95);
backdrop-filter: blur(20px);
border-top: 1px solid var(--border);
display: grid; grid-template-columns: repeat(4, 1fr);

4 icones SVG outline 24px -- min tap target 44x44px :

1. Accueil -- maison simple
2. Services -- eclair simple
3. Demos -- ecran simple
4. Contact -- enveloppe simple

Label sous chaque icone : font-size: 0.625rem; color: var(--text-muted)
Icone active : color: var(--teal)

Sur desktop : display: none
Sur mobile < 768px : afficher bottom bar, masquer nav desktop liens

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 6 -- HERO -- COPY EXACT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Section hero : min-height: 100vh; display: flex; align-items: center;
padding-top: 64px; position: relative; overflow: hidden;

Particules background : canvas id="particles" position absolute inset 0 z-index 0
JS particules :
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
const pts = Array.from({length:60},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3}));
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>canvas.width)p.vx*=-1;if(p.y<0||p.y>canvas.height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fillStyle='rgba(0,229,204,0.4)';ctx.fill();pts.forEach(p2=>{const d=Math.hypot(p.x-p2.x,p.y-p2.y);if(d<120){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);ctx.strokeStyle=`rgba(0,229,204,${0.04*(1-d/120)})`;ctx.stroke();}});});}
setInterval(draw,16);
Sur mobile : desactiver les particules (canvas display none sous 768px)

Contenu hero :

1. Label : "IA - AUTOMATISATION - DESIGN" (uppercase, 0.688rem, teal, letter-spacing 0.12em)
2. Titre h1 : "Votre business est pret pour des outils qui vous aident a avancer."
   Mot "pret" en couleur var(--teal) avec shimmer anime :
   @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.6} }
   animation: shimmer 3s ease-in-out infinite;
3. Baseline : "Nous pensons le systeme. Nous le construisons. Vous recoltez."
   font-size: 1.25rem; color: var(--text-muted); font-weight: 300
4. Sous-ligne : "30 minutes. 3 opportunites. Zero engagement."
   font-size: 0.875rem; color: var(--text-muted); letter-spacing: 0.04em
5. Micro-ligne : "Pinapp -- notre studio : Lauralie & Michaël · stratégie, code & image"
   font-size: 0.75rem; color: var(--text-muted); opacity: 0.6
6. CTAs :
   Principal : bouton pill fond var(--violet) "Diagnostic offert -- 30 min" -> /diagnostic/index.html
   Secondaire : lien texte teal "Demander un devis ->" -> mailto:lauralie.daguzay@pinapp.fr

Animations hero (une seule fois au chargement) :

- Label : opacity 0->1 200ms
- Titre mot par mot : chaque mot opacity 0->1 translateY(20px)->0, stagger 60ms, debut 200ms
- Baseline : opacity 0->1 400ms, debut 600ms
- Sous-ligne : opacity 0->1 300ms, debut 800ms
- CTAs : opacity 0->1 scale(0.96)->1, debut 1000ms

Scroll indicator : chevron anime bounce lent en bas, disparait apres 3s

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 7 -- SECTION SERVICES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Titre section : "Ce que nous construisons"
Label : "SERVICES"

3 cartes glassmorphism cote a cote desktop / stack mobile :
background: var(--bg-card);
border: 1px solid var(--border);
border-radius: 1.25rem;
box-shadow: var(--shadow);
padding: 2rem;
transition: transform 200ms cubic-bezier(0.25,0.1,0.25,1);

Carte 1 -- GAGNER DU TEMPS :
Icone SVG outline 24px : deux fleches circulaires (cycle) trait 1.5px couleur var(--teal)
Titre : "Gagner du temps"
Description : "Vos taches repetitives automatisees. Vous vous concentrez sur ce qui compte."
CTA : "Voir une automatisation ->" couleur var(--teal)

Carte 2 -- CONVAINCRE EN LIGNE :
Icone SVG outline 24px : rectangle arrondi ecran + trait dessous trait 1.5px var(--teal)
Titre : "Convaincre en ligne"
Description : "Un site premium qui reflete votre niveau. Concu pour convertir, pas pour decorer."
CTA : "Voir un site ->" couleur var(--teal)

Carte 3 -- INTEGRER L'IA :
Icone SVG outline 24px : 3 points relies par 2 lignes (reseau neuronal minimal) trait 1.5px var(--teal)
Titre : "Integrer l'IA"
Description : "Un systeme intelligent forme sur votre metier. Operationnel. Sur-mesure. Sans jargon."
CTA : "Voir un systeme IA ->" couleur var(--teal)

Animation scroll (IntersectionObserver threshold 0.12) :
translateY(20px)->0, opacity 0->1, 300ms, stagger 120ms entre cartes

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 8 -- SECTION DEMOS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Titre : "Touchez. Testez. Decidez."
Label : "DEMOS"

3 onglets pills : "Automatisation" | "Site premium" | "Chatbot IA"
Onglet actif : fond var(--violet); inactif : transparent border var(--border)
Transition fade 200ms entre onglets

Label "DEMO LIVE" sur chaque demo :
point circulaire 6px var(--teal), animation pulse opacity 1->0.3->1 2s loop, texte 10px uppercase

DEMO 1 -- Pipeline automatisation :
5 blocs en cascade connectes par lignes :
"Nouveau lead detecte" -> "Qualification auto" -> "Email personnalise" -> "CRM mis a jour" -> "Notification recue"
Chaque bloc : fond var(--bg-card), border var(--border), border-radius 0.75rem, padding 1rem
Animation : au clic sur premier bloc, checkmark var(--green) apparait sur chaque bloc en cascade (800ms entre chaque)
Ligne de connexion entre blocs : trait 1px var(--teal) qui se dessine de haut en bas
Bouton "Rejouer ->" sous le pipeline

DEMO 2 -- Site Meridian dans mockup MacBook :
Mockup MacBook CSS pur (pas d'image) : cadre gris fonce, barre de titre avec 3 points couleurs, ecran
Dans l'ecran : mini landing page "Meridian -- Nous transformons vos equipes."
Fond sombre, typographie propre, un CTA
Badge "Contenu illustratif" en 9px sous le mockup

DEMO 3 -- Chatbot commercial dans mockup iPhone :
Mockup iPhone CSS pur : bords arrondis, notch, home indicator
Interface chat avec bulles :
Bot : "Bonjour, comment pouvons-nous vous aider ?"
User : "Je perds trop de temps a relancer mes clients"
Bot (apres typing indicator 800ms) : "Combien de relances faites-vous par semaine ?"
User : "Une vingtaine"
Bot (apres 800ms) : "Avec une automatisation simple, ces 20 relances partent seules. Voulez-vous voir comment ?"
Input text en bas avec placeholder "Ecrivez votre message..."
Typing indicator : 3 points qui pulsent

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 9 -- SECTION AURALIS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Label : "PRODUIT PINAPP"
Titre : "La preuve par l'exemple."

Carte large fond var(--bg-card-2) border var(--border) border-radius 1.5rem :
Gauche (desktop) : texte

- "Auralis RH -- concu par Pinapp."
- "Un assistant IA qui previent le burnout avant qu'il n'arrive."
- "Pinapp l'a pense, concu et structure."
- "Votre projet merite le meme niveau d'exigence."
- CTA discret : "En savoir plus ->" -> /auralis/index.html

Droite (desktop) : mockup iPhone avec apercu dashboard Auralis
Score ring SVG r=36 circumference=226 couleur var(--green)
Chiffres : 4 RDV / 2 devis / 420 encaisses

Sur mobile : texte seul, mockup en dessous

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 10 -- SECTION MEMOIRE ET PRESENCE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Label : "REALISATION PINAPP"
Titre : "MÃ©moire & PrÃ©sence"
Sous-titre : "Hommages digitaux & plaques QR personnalisees"

Carte realisation :
Image placeholder beige chaud (fond #E2D5BC, texte #3D6B4F)
Description : "Site multi-pages premium. Charte emotionnelle sur-mesure. Systeme de commande automatise."
Tags : "Vert foret" | "Cormorant Garamond" | "Automatisation complete"
CTA : "Voir le site ->" -> lien vers memoireetpresence.fr (target \_blank)

Micha Bouilhac mentionne comme partenaire video :
Photo : utiliser l'image assets/images/micha.jpg (a creer depuis la photo fournie)
"MichaÃ«l Bouilhac -- Videaste & monteur partenaire"
"06 59 88 20 15"

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 11 -- SECTION ONBOARDING 4 QUESTIONS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Remplacer le configurateur de prix actuel par ce formulaire.
Label : "VOTRE PROJET"
Titre : "Votre projet commence ici."
Intro : "Quelques secondes. Pas de formulaire interminable."

Barre progression verte 2px en haut (0% -> 25% -> 50% -> 75% -> 100%)

Q1 : "Vous avez besoin de ?"
4 pills cliquables : "Automatisation" | "Site premium" | "Systeme IA" | "Je ne sais pas encore"

Transition "Bien note." 400ms puis Q2 apparait

Q2 : "Votre structure ?"
4 pills : "Independant" | "PME" | "Startup" | "Grand compte"

Transition "Parfait." puis Q3

Q3 : "Votre delai ideal ?"
3 pills : "Urgent -- moins de 2 semaines" | "Rapide (1 mois)" | "Serein (+2 mois)"

Transition "On y est presque." puis Q4

Q4 : "Une idee du budget ?"
4 pills : "-1000" | "1000-3000" | "3000+" | "A definir ensemble"

Fin : "C'est tout. Nous vous repondons sous 24h." + checkmark SVG anime var(--green)
Envoi via fetch POST vers webhook Make (placeholder URL a remplacer) ou fallback mailto:lauralie.daguzay@pinapp.fr

Mention RGPD sous le formulaire 9px :
"Vos donnees sont utilisees uniquement pour repondre a votre demande. Aucun demarchage."

Pills style :
border: 1px solid var(--border); border-radius: 100px; padding: 0.625rem 1.25rem;
cursor: pointer; transition: all 200ms;
Au clic : background: var(--violet); border-color: var(--violet); color: white;

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 12 -- SECTION EQUIPE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Label : "L'EQUIPE"
Titre : "Deux expertises. Un standard."

Carte Lauralie :
Photo : assets/images/lauralie.png (existante)
"Lauralie Daguzay"
"Pinapp — notre studio : Lauralie & Michaël · stratégie, code & image"
"Strategie, ingenierie digitale, IA"

Carte Micha :
Photo : assets/images/micha.jpg (a creer depuis photo fournie)
"MichaÃ«l Bouilhac"
"Videaste & partenaire Memoire et Presence"
"Production video, montage, hommages digitaux"
SIRET : 523 884 898 00017

Style cartes equipe :
fond var(--bg-card), border var(--border), border-radius 1.25rem
Photo : border-radius 50%, width 120px, height 120px, object-fit cover
Centree au-dessus du texte

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 13 -- SECTION REALISATIONS / DEMOS SECTORIELLES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Grille de cartes cliquables. Chaque carte ouvre la demo en modal plein ecran.
Modal : fond rgba(0,0,0,0.95) blur background, fermeture ESC ou croix top-right

Cartes existantes a conserver + Memoire et Presence a ajouter :

- Artisan plombier -> /demo/artisan/index.html
- Restaurant japonais Okami -> /demo/restaurant/index.html
- Coach independant -> /demo/coach/index.html
- Vitrine complete -> /demo/sur-mesure/index.html
- Memoire et Presence -> memoireetpresence.fr (target \_blank)

Chaque carte demo sectorielle doit avoir badge "DEMONSTRATION PINAPP -- Contenu fictif illustratif" en 9px

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 14 -- FOOTER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Fond var(--bg-card); border-top: 1px solid var(--border); padding: 3rem 0 2rem

Structure :
Gauche : Logo Pinapp + baseline "Nous pensons le systeme. Nous le construisons. Vous recoltez."
Centre : Liens : Services - Demos - Auralis - Diagnostic
Droite : LinkedIn (https://linkedin.com/in/lauralie-daguzay-4a4542197/) + lauralie.daguzay@pinapp.fr

Ligne de separation 1px var(--border) puis ligne mentions :
"Pinapp (c) 2026 -- SIRET 523 884 898 00017"
Liens : Mentions legales | CGV | Confidentialite

Note : SIRET appartenait a Micha Bouilhac, partenaire officiel Pinapp.

Safe area bottom : padding-bottom: env(safe-area-inset-bottom)

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 15 -- CORRECTIONS URGENTES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

- Remplacer TOUTES les occurrences de "systere" par "systeme"
- Supprimer "meme niveau d'exigence que Memoire et Presence" du copy principal
- Remplacer les indicateurs "0h / 0% / 0min" par du contenu reel ou supprimer la section
- Supprimer TOUTES les mentions de burger menu
- Ajouter sur toutes les pages : <meta name="viewport" content="width=device-width, initial-scale=1">
- Ajouter overflow-x: hidden sur html et body
- Ajouter sur toutes les images : loading="lazy" decoding="async"
- Convertir tous les PNG en WebP dans les references HTML (si les fichiers WebP existent)
- Ajouter preconnect Google Fonts sur toutes les pages
- Supprimer les hover states sur elements tactiles (media hover: hover)
- Ajouter @media (prefers-reduced-motion: reduce) { \* { animation: none !important; transition: none !important; } }
- Tap targets minimum 44x44px sur tous les elements interactifs mobile
- Safe area : ajouter padding-bottom: env(safe-area-inset-bottom) sur bottom bar et footer

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 16 -- ANIMATIONS GLOBALES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Toutes les animations : cubic-bezier(0.25,0.1,0.25,1), max 400ms
Entrees scroll via IntersectionObserver threshold 0.12 rootMargin "0px 0px -60px 0px" :

- Titres : translateY(30px)->0, opacity 0->1, 400ms, delai 0ms
- Sous-titres : meme, delai 80ms
- Cartes : translateY(20px)->0, opacity 0->1, 300ms, stagger 120ms
- Labels : opacity 0->1, 200ms, delai 60ms

Tout contenu visible par defaut sans JS (progressive enhancement)

Cartes hover desktop uniquement (media hover: hover) :
transform: translateY(-4px); box-shadow: var(--shadow); 200ms

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 17 -- STORYBOARD TEMPLATES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Creer le fichier storyboard/pinapp-storyboard-template.html

FORMAT A -- Motion texte 20s LinkedIn :
Page HTML avec 5 slides 1080x1080px :
Slide 1 (2s) : fond #050A14, titre teal, label "IA - AUTOMATISATION - DESIGN"
Slide 2 (4s) : probleme en texte blanc, stat cle en vert
Slide 3 (4s) : solution, animation pipeline simplifie
Slide 4 (4s) : chiffre vert Pandora, preuve concrete
Slide 5 (6s) : CTA "Diagnostic offert -- 30 min" + logo Pinapp

FORMAT B -- Before/After 30s :
Split screen CSS :
Gauche : site generique (fond blanc, typographie basique, label "AVANT")
Droite : site Pinapp premium (fond #050A14, palette Pandora, label "APRES")
Wipe animation : ligne verticale var(--teal) qui se deplace gauche->droite

FORMAT D -- Template video hommage M&P (pour Micha) :
Page HTML guide de montage :

- 0-5s : Photo portrait fondu doux (fade in 1s)
- 5-20s : Photos succession lente (crossfade 500ms entre chaque)
- 20-40s : Moments famille -- note "ajouter musique douce"
- 40-60s : Citation ou message en texte
- 60-75s : QR code + URL page hommage
- 75-90s : Logo Memoire et Presence fondu
  Instructions pour Micha en francais simple sur chaque etape

Creer le fichier storyboard/memoire-presence-guide-micha.html
Guide simplifie pour Micha (pas technique) :

- Liste des etapes avec timing
- Ce qu'il doit filmer/photographier
- Comment envoyer les fichiers
- Contacts en cas de question

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BLOC 18 -- META ET SEO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Sur toutes les pages HTML dans <head> :

<meta name="description" content="Pinapp -- Automatisation IA, sites web premium et systemes intelligents sur-mesure pour TPE, PME et independants. Diagnostic offert en 30 minutes.">
<meta property="og:title" content="Pinapp -- IA, Automatisation, Design">
<meta property="og:description" content="Votre business merite des outils qui vous aident a avancer.">
<meta property="og:url" content="https://pinapp.fr">
<meta name="theme-color" content="#050A14">

H1 technique invisible SEO sur index.html (position absolute, clip, overflow hidden) :
"Automatisation IA Sites web premium Sur-mesure -- Pinapp"

Schema.org LocalBusiness en JSON-LD sur index.html :
{
"@context": "https://schema.org",
"@type": "LocalBusiness",
"name": "Pinapp",
"description": "Agence digitale IA, automatisation et sites web premium",
"url": "https://pinapp.fr",
"email": "lauralie.daguzay@pinapp.fr",
"founder": { "@type": "Person", "name": "Lauralie Daguzay" }
}

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
APRES TOUTES LES MODIFICATIONS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

1. Verifier que data-theme="dark" est sur TOUS les <html>
2. Verifier que la barre scroll verte est presente sur toutes les pages
3. Verifier que la bottom bar mobile est presente sur toutes les pages
4. Verifier que "systere" est corrige partout
5. Verifier que les indicateurs 0h/0%/0min sont supprimes
6. git add -A
7. git commit -m "refonte: palette Pandora dark, mobile-first, copy valide, M&P, Auralis, storyboards"
8. git push origin main
9. .\pinapp.ps1 auto
