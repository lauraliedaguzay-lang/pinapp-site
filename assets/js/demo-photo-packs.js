/**
 * PINAPP — visuels démo (Unsplash, format cohérent)
 * Fusion : Object.assign(PINAPP_DEMO_SITE, PINAPP_DEMO_PHOTO_PACKS.xxx)
 *
 * Chaque pack peut inclure servicesTitle, servicesSubtitle, bookingSub, confirmSub
 * (textes de section uniques — vitrine sur mesure, pas thème clé en main).
 */
(function (g) {
  'use strict';
  function pack(secteur, file) {
    return '../../assets/images/demo-pack/' + secteur + '/' + file;
  }

  g.PINAPP_DEMO_PHOTO_PACKS = {
    artisan: {
      photoHero: 'demo-artisan-hero.webp',
      galerieTitle: 'Chantiers & savoir-faire',
      galerie: [
        { src: pack('artisan', 'gal-1.webp'), alt: 'Rénovation', caption: 'Pièce à vivre' },
        { src: pack('artisan', 'gal-2.webp'), alt: 'Plomberie', caption: 'Installation propre' },
        { src: pack('artisan', 'gal-3.webp'), alt: 'Électricité', caption: 'Mise aux normes' },
        { src: pack('artisan', 'gal-4.webp'), alt: 'Façade', caption: 'Isolation' },
        { src: pack('artisan', 'gal-5.webp'), alt: 'Cuisine', caption: 'Finitions' },
        { src: pack('artisan', 'gal-6.webp'), alt: 'Outils', caption: 'Matériel pro' },
      ],
      serviceImages: [
        pack('artisan', 'gal-1.webp'),
        pack('artisan', 'gal-2.webp'),
        pack('artisan', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Une équipe sur le terrain',
        texte:
          'Artisans RGE, devis clairs, chantiers tenus dans les temps. Nous intervenons en Île-de-France avec la même exigence sur la finition que sur la sécurité.',
        photo: pack('artisan', 'hero-desktop.webp'),
      },
      servicesTitle: 'Interventions',
      servicesSubtitle:
        'Parcours et textes calibrés pour ce métier — vitrine sur mesure Pinapp, pas un thème générique revendu à la chaîne.',
      bookingSub: 'Trois réponses pour cadrer l’urgence et la zone (démo : rien n’est transmis).',
      confirmSub: 'Exemple : premier retour par message sous 2 h ouvrées.',
      preuvePhoto: pack('artisan', 'proof.webp'),
    },

    restaurant: {
      photoHero: 'demo-restaurant-hero.webp',
      galerieTitle: 'Ambiance & assiettes',
      galerie: [
        { src: pack('restaurant', 'gal-1.webp'), alt: 'Salle', caption: 'Accueil' },
        { src: pack('restaurant', 'gal-2.webp'), alt: 'Cuisine', caption: 'Au feu' },
        { src: pack('restaurant', 'gal-3.webp'), alt: 'Plat', caption: 'Saison' },
        { src: pack('restaurant', 'gal-4.webp'), alt: 'Bar', caption: 'Cocktails' },
        { src: pack('restaurant', 'gal-5.webp'), alt: 'Table', caption: 'Dressage' },
        { src: pack('restaurant', 'gal-6.webp'), alt: 'Dessert', caption: 'Maison' },
      ],
      serviceImages: [
        pack('restaurant', 'gal-1.webp'),
        pack('restaurant', 'gal-2.webp'),
        pack('restaurant', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Notre maison, votre table',
        texte:
          'Cuisine japonaise contemporaine, produits sourcés, équipe soudée. Réservations en ligne et accueil personnalisé.',
        photo: pack('restaurant', 'hero-desktop.webp'),
      },
      servicesTitle: 'Carte & expériences',
      servicesSubtitle:
        'Mise en scène, menus et réservation pensés pour Ōkami — exemple de site fabriqué pour une seule adresse.',
      bookingSub: 'Quatre choix pour préparer votre table (démo).',
      confirmSub:
        'Exemple : confirmation affichée ici ; en réel, lien vers votre logiciel ou votre boîte mail.',
      preuvePhoto: pack('restaurant', 'proof.webp'),
    },

    coach: {
      photoHero: 'demo-coach-hero.webp',
      galerieTitle: 'Accompagnement & transformation',
      galerie: [
        { src: pack('coach', 'gal-1.webp'), alt: 'Séance', caption: 'Coaching' },
        { src: pack('coach', 'gal-2.webp'), alt: 'Focus', caption: 'Objectifs' },
        { src: pack('coach', 'gal-3.webp'), alt: 'Groupe', caption: 'Atelier' },
        { src: pack('coach', 'gal-4.webp'), alt: 'Équipe', caption: 'Entreprise' },
        { src: pack('coach', 'gal-5.webp'), alt: 'Nature', caption: 'Ressourcement' },
        { src: pack('coach', 'gal-6.webp'), alt: 'Carnet', caption: 'Méthode' },
      ],
      serviceImages: [
        pack('coach', 'gal-1.webp'),
        pack('coach', 'gal-2.webp'),
        pack('coach', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Certifiée, à votre écoute',
        texte:
          'ICF, bilans CPF, séances sur mesure. Un cadre bienveillant pour dépasser vos blocages et structurer votre projet.',
        photo: pack('coach', 'hero-desktop.webp'),
      },
      servicesTitle: 'Accompagnements',
      servicesSubtitle:
        'Offres et ton adaptés au coaching — page conçue comme un vrai site pro, pas un gabarit « coach » figé.',
      bookingSub: 'Premier cadrage par écrit, sans appel imposé (démo).',
      confirmSub: 'Exemple : réponse personnalisée sous 24 h sur un site livré.',
      preuvePhoto: pack('coach', 'proof.webp'),
    },

    trainer: {
      photoHero: 'demo-trainer-hero.webp',
      galerieTitle: 'Performance & récupération',
      galerie: [
        { src: pack('trainer', 'gal-1.webp'), alt: 'Musculation', caption: 'Force' },
        { src: pack('trainer', 'gal-2.webp'), alt: 'Cardio', caption: 'Endurance' },
        { src: pack('trainer', 'gal-3.webp'), alt: 'Étirements', caption: 'Mobilité' },
        { src: pack('trainer', 'gal-4.webp'), alt: 'Coach', caption: 'Suivi' },
        { src: pack('trainer', 'gal-5.webp'), alt: 'Nutrition', caption: 'Plateau repas' },
        { src: pack('trainer', 'gal-6.webp'), alt: 'Haltères', caption: 'Salle' },
      ],
      serviceImages: [
        pack('trainer', 'gal-1.webp'),
        pack('trainer', 'gal-2.webp'),
        pack('trainer', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Votre corps, votre plan',
        texte:
          'Prépa physique, perte de poids, remise en forme durable. Séances en salle et suivi WhatsApp entre les cours.',
        photo: pack('trainer', 'hero-desktop.webp'),
      },
      servicesTitle: 'Programmes & suivi',
      servicesSubtitle:
        'Structure et preuves sociales calibrées sport — identité visuelle et parcours uniques à chaque commande Pinapp.',
      bookingSub: 'Objectifs et créneaux en quelques clics (démo).',
      confirmSub: 'Exemple : rappel ou message selon vos outils sur le site final.',
      preuvePhoto: pack('trainer', 'proof.webp'),
    },

    tatoueuse: {
      photoHero: 'demo-tatoueuse-hero.webp',
      galerieTitle: 'Flash & projets sur mesure',
      galerie: [
        { src: pack('tatoueuse', 'gal-1.webp'), alt: 'Ligne', caption: 'Dessin' },
        { src: pack('tatoueuse', 'gal-2.webp'), alt: 'Machine', caption: 'Hygiène' },
        { src: pack('tatoueuse', 'gal-3.webp'), alt: 'Studio', caption: 'Ambiance' },
        { src: pack('tatoueuse', 'gal-4.webp'), alt: 'Encre', caption: 'Palette' },
        { src: pack('tatoueuse', 'gal-5.webp'), alt: 'Portrait', caption: 'Artiste' },
        { src: pack('tatoueuse', 'gal-6.webp'), alt: 'Détail', caption: 'Finition' },
      ],
      serviceImages: [
        pack('tatoueuse', 'gal-1.webp'),
        pack('tatoueuse', 'gal-2.webp'),
        pack('tatoueuse', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'L’art dans la peau',
        texte:
          'Hygiène irréprochable, projet personnalisé, consentement et repos. Paris — premiers échanges par message.',
        photo: pack('tatoueuse', 'hero-desktop.webp'),
      },
      servicesTitle: 'Création & soin de la peau',
      servicesSubtitle:
        'Galerie et parcours pensés pour un studio réel — pas une landing tatouage copiée-collée.',
      bookingSub: 'Projet, zone, disponibilités : cadrage rapide (démo).',
      confirmSub: 'Exemple : prise de contact par message sécurisé sur site livré.',
      preuvePhoto: pack('tatoueuse', 'proof.webp'),
    },

    ongles: {
      photoHero: 'demo-ongles-hero.webp',
      galerieTitle: 'Nail art & soins',
      galerie: [
        { src: pack('ongles', 'gal-1.webp'), alt: 'Manucure', caption: 'Pose gel' },
        { src: pack('ongles', 'gal-2.webp'), alt: 'Couleurs', caption: 'Nuancier' },
        { src: pack('ongles', 'gal-3.webp'), alt: 'Salon', caption: 'Espace' },
        { src: pack('ongles', 'gal-4.webp'), alt: 'Détail', caption: 'Décoration' },
        { src: pack('ongles', 'gal-5.webp'), alt: 'Soin', caption: 'Repos' },
        { src: pack('ongles', 'gal-6.webp'), alt: 'Outils', caption: 'Stérilisation' },
      ],
      serviceImages: [
        pack('ongles', 'gal-1.webp'),
        pack('ongles', 'gal-2.webp'),
        pack('ongles', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Des mains soignées',
        texte:
          'Pose américaine, nail art, réparation. Cabine lumineuse, produits sélectionnés, réservation en ligne.',
        photo: pack('ongles', 'hero-desktop.webp'),
      },
      servicesTitle: 'Prestations mains',
      servicesSubtitle:
        'Cartes et images alignées sur votre salon — chaque client Pinapp a sa propre hiérarchie et ses propres mots.',
      bookingSub: 'Type de pose et créneau en trois étapes (démo).',
      confirmSub: 'Exemple : confirmation de créneau côté outil que vous choisissez.',
      preuvePhoto: pack('ongles', 'proof.webp'),
    },

    estheticienne: {
      photoHero: 'demo-estheticienne-hero.webp',
      galerieTitle: 'Soins & détente',
      galerie: [
        { src: pack('estheticienne', 'gal-1.webp'), alt: 'Massage', caption: 'Relaxation' },
        { src: pack('estheticienne', 'gal-2.webp'), alt: 'Soin visage', caption: 'Éclat' },
        { src: pack('estheticienne', 'gal-3.webp'), alt: 'Cabine', caption: 'Calme' },
        { src: pack('estheticienne', 'gal-4.webp'), alt: 'Produits', caption: 'Bio' },
        { src: pack('estheticienne', 'gal-5.webp'), alt: 'Epilation', caption: 'Douceur' },
        { src: pack('estheticienne', 'gal-6.webp'), alt: 'Ambiance', caption: 'Lumière tamisée' },
      ],
      serviceImages: [
        pack('estheticienne', 'gal-1.webp'),
        pack('estheticienne', 'gal-2.webp'),
        pack('estheticienne', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Votre peau, notre métier',
        texte:
          'Soins sur mesure, protocoles doux, confidentialité. Un moment rien que pour vous entre deux journées chargées.',
        photo: pack('estheticienne', 'hero-desktop.webp'),
      },
      servicesTitle: 'Rituels & soins',
      servicesSubtitle:
        'Ambiance spa et parcours réservation cohérents avec votre cabine — site sur mesure, zero catalogue de thème.',
      bookingSub: 'Besoin et disponibilité sans friction (démo).',
      confirmSub: 'Exemple : rappel ou SMS selon votre automatisation.',
      preuvePhoto: pack('estheticienne', 'proof.webp'),
    },

    coiffeur: {
      photoHero: 'demo-coiffeur-hero.webp',
      galerieTitle: 'Coupes & colorations',
      galerie: [
        { src: pack('coiffeur', 'gal-1.webp'), alt: 'Salon', caption: 'Fauteuils' },
        { src: pack('coiffeur', 'gal-2.webp'), alt: 'Coupe', caption: 'Styling' },
        { src: pack('coiffeur', 'gal-3.webp'), alt: 'Couleur', caption: 'Balayage' },
        { src: pack('coiffeur', 'gal-4.webp'), alt: 'Barbier', caption: 'Taille de barbe' },
        { src: pack('coiffeur', 'gal-5.webp'), alt: 'Produits', caption: 'Soins' },
        { src: pack('coiffeur', 'gal-6.webp'), alt: 'Miroir', caption: 'Avant / après' },
      ],
      serviceImages: [
        pack('coiffeur', 'gal-1.webp'),
        pack('coiffeur', 'gal-2.webp'),
        pack('coiffeur', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Salon indépendant',
        texte:
          'Écoute, conseil couleur, finitions nettes. RDV en ligne, rappels automatiques — vous profitez du fauteuil.',
        photo: pack('coiffeur', 'hero-desktop.webp'),
      },
      servicesTitle: 'Coupes, couleurs, barbe',
      servicesSubtitle:
        'Mise en avant des services qui vous rapportent — parcours écrit pour ce salon, pas pour « n’importe quel coiffeur ».',
      bookingSub: 'Prestation et horaire en trois choix (démo).',
      confirmSub: 'Exemple : agenda synchronisé sur le site livré.',
      preuvePhoto: pack('coiffeur', 'proof.webp'),
    },

    cils: {
      photoHero: 'demo-cils-hero.webp',
      galerieTitle: 'Regard & extensions',
      galerie: [
        { src: pack('cils', 'gal-1.webp'), alt: 'Pose', caption: 'Volume' },
        { src: pack('cils', 'gal-2.webp'), alt: 'Détail', caption: 'Courbe' },
        { src: pack('cils', 'gal-3.webp'), alt: 'Matériel', caption: 'Précision' },
        { src: pack('cils', 'gal-4.webp'), alt: 'Regard', caption: 'Naturel' },
        { src: pack('cils', 'gal-5.webp'), alt: 'Salon', caption: 'Lumière' },
        { src: pack('cils', 'gal-6.webp'), alt: 'Pose complète', caption: 'Rendu' },
      ],
      serviceImages: [
        pack('cils', 'gal-1.webp'),
        pack('cils', 'gal-2.webp'),
        pack('cils', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Le regard qui change tout',
        texte:
          'Extensions pose à pose, remplissages réguliers, hygiène irréprochable. Spécialiste regard depuis 8 ans.',
        photo: pack('cils', 'hero-desktop.webp'),
      },
      servicesTitle: 'Extensions & entretien',
      servicesSubtitle:
        'Détails techniques et photos pro pour rassurer — vitrine unique, pas une page cils toute faite.',
      bookingSub: 'Type de pose et suivi en trois questions (démo).',
      confirmSub: 'Exemple : rappel de rendez-vous automatisé chez vous.',
      preuvePhoto: pack('cils', 'proof.webp'),
    },

    boulangerie: {
      photoHero: 'demo-boulangerie-hero.webp',
      galerieTitle: 'Four & vitrine',
      galerie: [
        { src: pack('boulangerie', 'gal-1.webp'), alt: 'Pain', caption: 'Meule' },
        { src: pack('boulangerie', 'gal-2.webp'), alt: 'Viennoiseries', caption: 'Matin' },
        { src: pack('boulangerie', 'gal-3.webp'), alt: 'Farine', caption: 'Artisan' },
        { src: pack('boulangerie', 'gal-4.webp'), alt: 'Four', caption: 'Cuisson' },
        { src: pack('boulangerie', 'gal-5.webp'), alt: 'Pizza', caption: 'Spécialité' },
        { src: pack('boulangerie', 'gal-6.webp'), alt: 'Équipe', caption: 'Accueil' },
      ],
      serviceImages: [
        pack('boulangerie', 'gal-1.webp'),
        pack('boulangerie', 'gal-2.webp'),
        pack('boulangerie', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Farine, levain, passion',
        texte:
          'Boulangerie de quartier : commandes le week-end, retrait sans file d’attente grâce au site. Votre pain est prêt quand vous arrivez.',
        photo: pack('boulangerie', 'hero-desktop.webp'),
      },
      servicesTitle: 'Viennoiseries & commandes',
      servicesSubtitle:
        'Horaires, retrait et vitrine adaptés à votre fournil — développement sur mesure, pas un thème « bakery ».',
      bookingSub: 'Commande et créneau de retrait (démo).',
      confirmSub: 'Exemple : SMS « prêt à retirer » branché sur votre flux.',
      preuvePhoto: pack('boulangerie', 'proof.webp'),
    },

    barbier: {
      photoHero: 'demo-barbier-hero.webp',
      galerieTitle: 'Style & tradition',
      galerie: [
        { src: pack('barbier', 'gal-1.webp'), alt: 'Taille', caption: 'Précision' },
        { src: pack('barbier', 'gal-2.webp'), alt: 'Rasoir', caption: 'Barbe' },
        { src: pack('barbier', 'gal-3.webp'), alt: 'Salon', caption: 'Fauteuil vintage' },
        { src: pack('barbier', 'gal-4.webp'), alt: 'Client', caption: 'Satisfaction' },
        { src: pack('barbier', 'gal-5.webp'), alt: 'Produits', caption: 'Finishing' },
        { src: pack('barbier', 'gal-6.webp'), alt: 'Shop', caption: 'Ambiance' },
      ],
      serviceImages: [
        pack('barbier', 'gal-1.webp'),
        pack('barbier', 'gal-2.webp'),
        pack('barbier', 'gal-3.webp'),
      ],
      apropos: {
        titre: 'Barbershop authentique',
        texte:
          'Coupe classique, fade, barbe sculptée. Bière ou café offert, musique sélectionnée — le rendez-vous devient un rituel.',
        photo: pack('barbier', 'hero-desktop.webp'),
      },
      servicesTitle: 'Coupes & barbe',
      servicesSubtitle:
        'Identité forte et réservation simple — le même squelette technique Pinapp, une présentation différente à chaque barbershop.',
      bookingSub: 'Service et disponibilité en trois taps (démo).',
      confirmSub: 'Exemple : créneau bloqué dans votre agenda.',
      preuvePhoto: pack('barbier', 'proof.webp'),
    },

    avocat: {
      photoHero: 'demo-avocat-hero.webp',
      galerieTitle: 'Cabinet & sérieux',
      galerie: [
        {
          src: img('1589829540833-527e0e87d48a', qM),
          alt: 'Bibliothèque',
          caption: 'Documentation',
        },
        { src: img('1450101499163-c8848c66ca85', qM), alt: 'Bureau', caption: 'Entretien' },
        { src: img('1454165208754-3aa398191a59', qM), alt: 'Contrat', caption: 'Conseil' },
        { src: img('1507679799987-c73779587ccf', qM), alt: 'Justice', caption: 'Engagement' },
        { src: img('1521791059606-8242b1a0b31d', qM), alt: 'Réunion', caption: 'Équipe' },
        { src: img('1486406146926-c627a92ad1ab', qM), alt: 'Immeuble', caption: 'Paris' },
      ],
      serviceImages: [
        img('1450101499163-c8848c66ca85', qS),
        img('1454165208754-3aa398191a59', qS),
        img('1507679799987-c73779587ccf', qS),
      ],
      apropos: {
        titre: 'Écoute, rigueur, discrétion',
        texte:
          'Droit des affaires et des particuliers. Première analyse par écrit, dossiers structurés, pas de surprise sur les honoraires.',
        photo: img('1521791059606-8242b1a0b31d', qM),
      },
      servicesTitle: 'Domaines d’intervention',
      servicesSubtitle:
        'Hiérarchie de l’information et ton adaptés au cabinet — site professionnel sur mesure, conformité déontologique comprise.',
      bookingSub: 'Nature du dossier et urgence, de façon structurée (démo).',
      confirmSub: 'Exemple : accusé de réception et proposition de créneau par écrit.',
      preuvePhoto: img('1472094153963-57d48124d846', qS),
    },

    /* Démo « sur-mesure » : site très riche type vitrine premium (hommage, lieu, ou marque haut de gamme) */
    surmesure: {
      photoHero: 'demo-sur-mesure-hero.webp',
      galerieTitle: 'Moments, lieux, détails',
      galerie: [
        {
          src: img('1465146349255-7e60800f6453', qM),
          alt: 'Lumière naturelle',
          caption: 'Accueil',
        },
        {
          src: img('1519741497674-61162186352c', qM),
          alt: 'Fleurs blanches',
          caption: 'Composition',
        },
        {
          src: img('1519225429380-bcc0a7c65f7c', qM),
          alt: 'Allée',
          caption: 'Lieu de recueillement',
        },
        { src: img('1520768224289-229f26c7686e', qM), alt: 'Textile', caption: 'Matières nobles' },
        { src: img('1490750967868-88aa4486c946', qM), alt: 'Bougie', caption: 'Douceur' },
        { src: img('1506905925346-21bda4d32df4', qM), alt: 'Forêt', caption: 'Sérénité' },
        { src: img('1441974231531-c6227db76b6e', qM), alt: 'Chemin', caption: 'Nature' },
        { src: img('1470240731273-7821a6eeb6bd', qM), alt: 'Brume', caption: 'Matin' },
        {
          src: img('1502086221113-b1a222e0229b', qM),
          alt: 'Architecture',
          caption: 'Lieu d’exception',
        },
        {
          src: img('1513506003901-1e6ad229e2d7', qM),
          alt: 'Calligraphie',
          caption: 'Texte personnalisé',
        },
        { src: img('1528164344705-43141460b5a0', qM), alt: 'Pierre', caption: 'Matériaux' },
        { src: img('1518173946689-a3cbd97ed1cc', qM), alt: 'Ciel', caption: 'Apaisement' },
        { src: img('1499205476559-cfbe5462ee7d', qM), alt: 'Main', caption: 'Accompagnement' },
        { src: img('1500530854321-586ed83d5d26', qM), alt: 'Eau', caption: 'Pur' },
        { src: img('1519681393784-d120267933ba', qM), alt: 'Montagne', caption: 'Horizon' },
      ],
      serviceImages: [
        img('1519741497674-61162186352c', qS),
        img('1490750967868-88aa4486c946', qS),
        img('1520768224289-229f26c7686e', qS),
      ],
      apropos: {
        titre: 'Chaque histoire mérite une présence digne',
        texte:
          'Exemple de site sur-mesure Pinapp : plusieurs sections plein écran, galerie dense, témoignages, formulaire détaillé — le même niveau d’exigence éditorial et visuel que pour un projet « Mémoire & Présence ». Textes, photos et parcours sont adaptés à votre univers ; ici, illustration avec visuels Unsplash.',
        photo: img('1513506003901-1e6ad229e2d7', qM),
      },
      servicesTitle: 'Ce que nous composons pour vous',
      servicesSubtitle:
        'Galerie, textes et parcours sont reconstruits pour chaque commande — ce n’est pas un kit « premium » à remplir.',
      bookingSub: 'Premier filtre pour comprendre votre besoin (démo).',
      confirmSub: 'Exemple : accusé de réception et suite par message sous 48 h.',
      preuvePhoto: img('1544005313-94ddf0286df2', qS),
      contactRichTitle: 'Écrire un message confidentiel',
      contactRichIntro:
        'Prénom, email et message : tout reste sur cette démo (aucun envoi réel). Sur un site livré, ce bloc part vers votre boîte ou votre CRM — interface conçue pour votre contexte, pas un formulaire générique.',
    },
  };
})(typeof window !== 'undefined' ? window : this);
