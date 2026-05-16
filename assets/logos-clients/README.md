# Logos clients (bandeau hero)

## Remplacement des placeholders

Quand les vrais logos animés MP4 sont disponibles :

1. Déposer 5 fichiers `.mp4` dans ce dossier, nommés :

   - `client-1.mp4`
   - `client-2.mp4`
   - `client-3.mp4`
   - `client-4.mp4`
   - `client-5.mp4`

   (Ou tout autre nom — adapter le HTML en conséquence.)

2. Dans `index.html` et `voyage-v9/index.html`, éditer le bloc `.hero-logos-marquee` : la liste `.hero-logos-grid` contient **10 entrées** (5 logos + 5 dupliqués pour le marquee). Remplacer chaque placeholder par une paire `<li class="hero-logo">` + `<video>` comme ci-dessous (répliquer la séquence deux fois pour conserver la boucle).

   Ancien exemple :

   `<li class="hero-logo-placeholder" data-logo="N"></li>`

   Remplacement :

   ```html
   <li class="hero-logo">
     <video autoplay loop muted playsinline preload="metadata" aria-label="Logo client N">
       <source src="/assets/logos-clients/client-N.mp4" type="video/mp4" />
     </video>
   </li>
   ```

3. Ajouter dans `assets/css/hero-logos-bandeau.css` :

   ```css
   .hero-logo video {
     width: 80px;
     height: 40px;
     object-fit: contain;
   }
   @media (max-width: 768px) {
     .hero-logo video {
       width: 60px;
       height: 30px;
     }
   }
   ```

## Optimisation MP4

Format recommandé :

- Codec : H.264 baseline
- Résolution : 240×120 (2× les dimensions affichées pour retina)
- Bitrate : 500 kbps max
- Durée : 3–5 secondes en boucle
- Audio : aucun (`muted` obligatoire)
- Taille fichier max : 200 ko par logo

Conversion WebM en complément pour Firefox / Chrome :

```bash
ffmpeg -i client-N.mp4 -c:v libvpx-vp9 -crf 30 -an client-N.webm
```
