# PATCH FIX VIDEOS · 3 corrections live (commit 8505623)

> 3 problèmes signalés par Lauralie sur https://pinapp.fr/voyage-v9/?v=8505623
> Patch ciblé · 1 fichier · `voyage-v9/index.html` uniquement

---

## 🐛 Problèmes

1. **Bandes noires** sur les cards Vimeo (s02b teaser SW, s04 Walker, s05c Resident Evil/M&P, s11 climax)
   → cards en `aspect-ratio:16/10`, vidéos Vimeo en **16/9** strict → letterbox horizontal

2. **Placeholder vidéo présentation s01** (Pinapp 60s) **invisible par défaut**
   → existe en HTML (l.789-792) mais classé `.placeholder-asset` → caché tant que `body.draft-mode` n'est pas activé (Ctrl+D)
   → un visiteur lambda ne le voit jamais

3. **Placeholder vidéo clip** (Lauralie chante 100% IA) **absent du site**
   → seul le climax Star Wars 3min est visible · le clip CGI Pinapp n'apparaît nulle part

---

## ✅ FIX 1 · Bandes noires sur les Vimeo (CSS)

Dans le `<style>` du `<head>` de `voyage-v9/index.html`, **remplacer** :

```css
.port__media{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--nuit)}
.port--hero .port__media{aspect-ratio:16/9}
```

**par** :

```css
.port__media{position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--nuit)}
.port--hero .port__media{aspect-ratio:16/9}
.port__media iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
```

Tous les posters Vimeo (vumbnail) sont **nativement 16/9** → en alignant les cards sur 16/9, plus de bandes noires ni au poster ni à l'iframe après click.

---

## ✅ FIX 2 · Placeholder vidéo présentation s01 visible par défaut

Dans `voyage-v9/index.html`, remplacer le bloc actuel (l.789-792) :

```html
<div class="placeholder-asset" aria-hidden="true" style="margin-top:var(--space-4);max-width:42rem">
  <p class="placeholder-asset__label">01 · Vidéo présentation Pinapp (Vimeo)</p>
  <p class="placeholder-asset__specs">Teaser 45–60&nbsp;s · intégration lecteur sous le hero quand le fichier est prêt · hero-1 reste l'image de fond stage</p>
</div>
```

**par** un encart "soft" toujours visible (style card pro avec poster placeholder) :

```html
<article class="port port--hero port--soon" data-soon="presentation" style="margin-top:var(--space-5);max-width:42rem">
  <div class="port__media">
    <div class="port__poster port__poster--soon" aria-hidden="true">
      <svg viewBox="0 0 64 64" class="port__soon-icon" aria-hidden="true">
        <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/>
        <path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/>
      </svg>
    </div>
    <span class="port__soon-badge">Bientôt</span>
  </div>
  <div class="port__body">
    <span class="port__tag" style="background:var(--or);color:var(--nuit)">PRÉSENTATION · 60&nbsp;s</span>
    <h3 class="port__title">Pinapp en <em>60 secondes</em></h3>
    <p class="port__sub">Lauralie &amp; Micha · duo face caméra · à venir</p>
  </div>
</article>
```

Et **ajouter dans le CSS** :

```css
.port--soon{cursor:default;border:1px dashed var(--or)}
.port--soon:hover{transform:none}
.port__poster--soon{display:grid;place-items:center;background:linear-gradient(135deg,rgba(10,20,32,.95),rgba(20,30,42,.9));color:var(--or);width:100%;height:100%}
.port__soon-icon{width:72px;height:72px;opacity:.55}
.port__soon-badge{position:absolute;top:.75rem;right:.75rem;padding:.25rem .75rem;background:var(--or);color:var(--nuit);font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;border-radius:2px}
```

Résultat : le visiteur voit **un vrai poster pro** avec play button et badge "Bientôt", pas un encart placeholder de chantier.

---

## ✅ FIX 3 · Ajouter placeholder vidéo clip Lauralie chante

Dans `voyage-v9/index.html`, **après** le bloc `<section class="scene scene--13b" id="s13b" …>` (FAQ, vers la l.1547) et **avant** `<section class="scene scene--14" id="s14" …>` (Contact, vers la l.1593), **insérer** une nouvelle section `s11b` ?

Mieux : **insérer dans s11 MANIFESTE** juste **avant** le bloc `<div class="manifesto-climax">` (vers la l.1433), un encart "soft" pour le clip IA Lauralie chante.

```html
<!-- Encart Clip IA Lauralie · disponible été 2026 -->
<article class="port port--hero port--soon port--clip-ia" data-soon="clip-ia" style="margin-top:var(--space-5);max-width:46rem;margin-inline:auto">
  <div class="port__media">
    <div class="port__poster port__poster--soon port__poster--clip" aria-hidden="true">
      <svg viewBox="0 0 64 64" class="port__soon-icon" aria-hidden="true">
        <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" fill="rgba(5,11,20,.4)"/>
        <path d="M26 22 L44 32 L26 42 Z" fill="currentColor"/>
      </svg>
    </div>
    <span class="port__soon-badge">En production</span>
  </div>
  <div class="port__body">
    <span class="port__tag" style="background:linear-gradient(135deg,#3ef5e0,#e6b973);color:#050b14">CLIP 100&nbsp;% IA · 1m20</span>
    <h3 class="port__title">Lauralie <em>chante</em> — clip 100&nbsp;% IA</h3>
    <p class="port__sub">
      ✦ Voix synthétisée IA &nbsp;·&nbsp; ✦ Univers visuel cinéma génération IA &nbsp;·&nbsp; ✦ Montage assisté IA<br>
      Disponible été 2026 — démo Pinapp pour les créateurs qui veulent un clip CGI sans le budget studio.
    </p>
  </div>
</article>
```

Et **ajouter au CSS** (en plus du fix 2) :

```css
.port__poster--clip{background:linear-gradient(135deg,rgba(62,245,224,.18),rgba(230,185,115,.12),rgba(20,30,42,.95))}
.port--clip-ia .port__soon-badge{background:linear-gradient(135deg,#3ef5e0,#e6b973);color:#050b14}
```

---

## 🚢 COMMIT + PUSH

```bash
cd C:\Users\Lauralie\Projects\pinapp-site
git checkout main
git pull origin main
# Tu appliques les 3 fixes ci-dessus dans voyage-v9/index.html
git add voyage-v9/index.html
git commit -m "voyage-v9 fix · vidéos 16/9 sans bandes noires + soft placeholder vidéo présentation s01 + soft placeholder clip IA s11"
git push origin main
```

GitHub Pages redéploie auto.
URL après push : `https://pinapp.fr/voyage-v9/?v=<nouveau-hash>` (force-reload Ctrl+F5)

---

## ✅ CHECKLIST POST-DEPLOY

```
□ s01 · poster "Pinapp en 60 secondes" visible avec badge "Bientôt"
□ s02b · teaser SW Vimeo : zéro bande noire (16/9 strict)
□ s04 · Walker poster + Atelier Rivage : zéro bande noire
□ s05c · Resident Evil + M&P clip : zéro bande noire
□ s11 · NOUVEAU · poster "Lauralie chante — clip 100% IA" avec badge "En production"
□ s11 · climax SW 3min : iframe Vimeo en 16/9 sans letterbox
□ Mode draft (Ctrl+D) toujours fonctionnel pour les autres placeholders
□ Touch ≥ 44px sur mobile (poster Vimeo cliquable)
□ Lighthouse perf inchangé (pas de nouveau script ajouté)
```

---

## 💡 SI CURSOR DOIT GÉRER

Tu peux ouvrir Cursor et `@PATCH-FIX-VIDEOS.md` puis :

```
Lis ce patch. Applique les 3 fixes sur voyage-v9/index.html :
1. Bandes noires Vimeo : passer .port__media en 16/9 strict + style iframe
2. Soft placeholder vidéo présentation s01 visible par défaut (remplacer le placeholder-asset existant)
3. Soft placeholder clip IA Lauralie chante dans s11 (avant le climax Star Wars)

Commit + push sur main pour déploiement immédiat.
```

---

*Patch fix-videos · prêt à appliquer · ne touche à aucun autre élément du site*
