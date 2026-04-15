Vidéo d’introduction — loader cinéma Pinapp
===========================================

À produire avec Micha : ambiance film futuriste + voix IA (dialogue dans la vidéo
ou piste audio synchronisée).

Fichiers attendus (même nom, racine web `/assets/video/`) :

  pinapp-loader-intro.webm   — prioritaire (léger, transparent possible)
  pinapp-loader-intro.mp4    — fallback Safari / iOS

Recommandations :
  — 1080p ou 720p, courte boucle (4–12 s), optimisée web (bitrate modéré)
  — Son : la page charge la vidéo en muted + autoplay (politique navigateur) ;
    la voix IA peut être intégrée dans la vidéo ; pour audio non muet, il faudra
    un geste utilisateur ou une évolution UX plus tard.
  — Poster : par défaut le loader utilise `/assets/images/bg-pandora-nuit.png`
    tant que la vidéo n’est pas là.

Sans ces fichiers, le loader affiche quand même le poster et l’animation « sci-fi ».

Guide complet (vidéos, photos, démos, checklist) : GUIDE-CONTENU.md à la racine du dépôt.
