/**
 * PINAPP — visuels démo (assets/images, local)
 * Fusion : Object.assign(PINAPP_DEMO_SITE, PINAPP_DEMO_PHOTO_PACKS.xxx)
 *
 * Chaque pack peut inclure servicesTitle, servicesSubtitle, bookingSub, confirmSub
 * (textes de section uniques — vitrine sur mesure, pas thème clé en main).
 */
(function (g) {
  'use strict';
  /**
   * Convention de fichiers (à déposer dans assets/images/)
   * - demo-<slug>-hero.webp
   * - demo-<slug>-01.webp .. demo-<slug>-06.webp (galerie)
   * - demo-<slug>-svc-01.webp .. demo-<slug>-svc-03.webp (services)
   * - demo-<slug>-apropos.webp
   * - demo-<slug>-preuve.webp
   *
   * Tant que ces fichiers ne sont pas présents, `demo-sector.js` applique un fallback local.
   */
  function demo(slug, name) {
    return 'demo-' + slug + '-' + name + '.webp';
  }

  g.PINAPP_DEMO_PHOTO_PACKS = {
    artisan: {
      photoHero: demo('artisan', 'hero'),
      galerieTitle: 'Chantiers & savoir-faire',
      galerie: [
        { src: demo('artisan', '01'), alt: 'Rénovation', caption: 'Pièce à vivre' },
        { src: demo('artisan', '02'), alt: 'Plomberie', caption: 'Installation propre' },
        { src: demo('artisan', '03'), alt: 'Électricité', caption: 'Mise aux normes' },
        { src: demo('artisan', '04'), alt: 'Façade', caption: 'Isolation' },
        { src: demo('artisan', '05'), alt: 'Cuisine', caption: 'Finitions' },
        { src: demo('artisan', '06'), alt: 'Outils', caption: 'Matériel pro' },
      ],
      serviceImages: [
        demo('artisan', 'svc-01'),
        demo('artisan', 'svc-02'),
        demo('artisan', 'svc-03'),
      ],
      apropos: {
        titre: 'Une équipe sur le terrain',
        texte:
          'Artisans RGE, devis clairs, chantiers tenus dans les temps. Nous intervenons en Île-de-France avec la même exigence sur la finition que sur la sécurité.',
        photo: demo('artisan', 'apropos'),
      },
      servicesTitle: 'Interventions',
      servicesSubtitle:
        'Parcours et textes calibrés pour ce métier — vitrine sur mesure Pinapp, pas un thème générique revendu à la chaîne.',
      bookingSub: 'Trois réponses pour cadrer l’urgence et la zone (démo : rien n’est transmis).',
      confirmSub: 'Exemple : premier retour par message sous 2 h ouvrées.',
      preuvePhoto: demo('artisan', 'preuve'),
    },

    restaurant: {
      photoHero: demo('restaurant', 'hero'),
      galerieTitle: 'Ambiance & assiettes',
      galerie: [
        { src: demo('restaurant', '01'), alt: 'Salle', caption: 'Accueil' },
        { src: demo('restaurant', '02'), alt: 'Cuisine', caption: 'Au feu' },
        { src: demo('restaurant', '03'), alt: 'Plat', caption: 'Saison' },
        { src: demo('restaurant', '04'), alt: 'Bar', caption: 'Cocktails' },
        { src: demo('restaurant', '05'), alt: 'Table', caption: 'Dressage' },
        { src: demo('restaurant', '06'), alt: 'Dessert', caption: 'Maison' },
      ],
      serviceImages: [
        demo('restaurant', 'svc-01'),
        demo('restaurant', 'svc-02'),
        demo('restaurant', 'svc-03'),
      ],
      apropos: {
        titre: 'Notre maison, votre table',
        texte:
          'Cuisine japonaise contemporaine, produits sourcés, équipe soudée. Réservations en ligne et accueil personnalisé.',
        photo: demo('restaurant', 'apropos'),
      },
      servicesTitle: 'Carte & expériences',
      servicesSubtitle:
        'Mise en scène, menus et réservation pensés pour Ōkami — exemple de site fabriqué pour une seule adresse.',
      bookingSub: 'Quatre choix pour préparer votre table (démo).',
      confirmSub:
        'Exemple : confirmation affichée ici ; en réel, lien vers votre logiciel ou votre boîte mail.',
      preuvePhoto: demo('restaurant', 'preuve'),
    },

    coach: {
      photoHero: demo('coach', 'hero'),
      galerieTitle: 'Accompagnement & transformation',
      galerie: [
        { src: demo('coach', '01'), alt: 'Séance', caption: 'Coaching' },
        { src: demo('coach', '02'), alt: 'Focus', caption: 'Objectifs' },
        { src: demo('coach', '03'), alt: 'Groupe', caption: 'Atelier' },
        { src: demo('coach', '04'), alt: 'Équipe', caption: 'Entreprise' },
        { src: demo('coach', '05'), alt: 'Nature', caption: 'Ressourcement' },
        { src: demo('coach', '06'), alt: 'Carnet', caption: 'Méthode' },
      ],
      serviceImages: [demo('coach', 'svc-01'), demo('coach', 'svc-02'), demo('coach', 'svc-03')],
      apropos: {
        titre: 'Certifiée, à votre écoute',
        texte:
          'ICF, bilans CPF, séances sur mesure. Un cadre bienveillant pour dépasser vos blocages et structurer votre projet.',
        photo: demo('coach', 'apropos'),
      },
      servicesTitle: 'Accompagnements',
      servicesSubtitle:
        'Offres et ton adaptés au coaching — page conçue comme un vrai site pro, pas un gabarit « coach » figé.',
      bookingSub: 'Premier cadrage par écrit, sans appel imposé (démo).',
      confirmSub: 'Exemple : réponse personnalisée sous 24 h sur un site livré.',
      preuvePhoto: demo('coach', 'preuve'),
    },

    trainer: {
      photoHero: demo('trainer', 'hero'),
      galerieTitle: 'Performance & récupération',
      galerie: [
        { src: demo('trainer', '01'), alt: 'Musculation', caption: 'Force' },
        { src: demo('trainer', '02'), alt: 'Cardio', caption: 'Endurance' },
        { src: demo('trainer', '03'), alt: 'Étirements', caption: 'Mobilité' },
        { src: demo('trainer', '04'), alt: 'Coach', caption: 'Suivi' },
        { src: demo('trainer', '05'), alt: 'Nutrition', caption: 'Plateau repas' },
        { src: demo('trainer', '06'), alt: 'Haltères', caption: 'Salle' },
      ],
      serviceImages: [
        demo('trainer', 'svc-01'),
        demo('trainer', 'svc-02'),
        demo('trainer', 'svc-03'),
      ],
      apropos: {
        titre: 'Votre corps, votre plan',
        texte:
          'Prépa physique, perte de poids, remise en forme durable. Séances en salle et suivi WhatsApp entre les cours.',
        photo: demo('trainer', 'apropos'),
      },
      servicesTitle: 'Programmes & suivi',
      servicesSubtitle:
        'Structure et preuves sociales calibrées sport — identité visuelle et parcours uniques à chaque commande Pinapp.',
      bookingSub: 'Objectifs et créneaux en quelques clics (démo).',
      confirmSub: 'Exemple : rappel ou message selon votre stack sur le site final.',
      preuvePhoto: demo('trainer', 'preuve'),
    },

    tatoueuse: {
      photoHero: demo('tatoueuse', 'hero'),
      galerieTitle: 'Flash & projets sur mesure',
      galerie: [
        { src: demo('tatoueuse', '01'), alt: 'Ligne', caption: 'Dessin' },
        { src: demo('tatoueuse', '02'), alt: 'Machine', caption: 'Hygiène' },
        { src: demo('tatoueuse', '03'), alt: 'Studio', caption: 'Ambiance' },
        { src: demo('tatoueuse', '04'), alt: 'Encre', caption: 'Palette' },
        { src: demo('tatoueuse', '05'), alt: 'Portrait', caption: 'Artiste' },
        { src: demo('tatoueuse', '06'), alt: 'Détail', caption: 'Finition' },
      ],
      serviceImages: [
        demo('tatoueuse', 'svc-01'),
        demo('tatoueuse', 'svc-02'),
        demo('tatoueuse', 'svc-03'),
      ],
      apropos: {
        titre: 'L’art dans la peau',
        texte:
          'Hygiène irréprochable, projet personnalisé, consentement et repos. Paris — premiers échanges par message.',
        photo: demo('tatoueuse', 'apropos'),
      },
      servicesTitle: 'Création & soin de la peau',
      servicesSubtitle:
        'Galerie et parcours pensés pour un studio réel — pas une landing tatouage copiée-collée.',
      bookingSub: 'Projet, zone, disponibilités : cadrage rapide (démo).',
      confirmSub: 'Exemple : prise de contact par message sécurisé sur site livré.',
      preuvePhoto: demo('tatoueuse', 'preuve'),
    },

    ongles: {
      photoHero: demo('ongles', 'hero'),
      galerieTitle: 'Nail art & soins',
      galerie: [
        { src: demo('ongles', '01'), alt: 'Manucure', caption: 'Pose gel' },
        { src: demo('ongles', '02'), alt: 'Couleurs', caption: 'Nuancier' },
        { src: demo('ongles', '03'), alt: 'Salon', caption: 'Espace' },
        { src: demo('ongles', '04'), alt: 'Détail', caption: 'Décoration' },
        { src: demo('ongles', '05'), alt: 'Soin', caption: 'Repos' },
        { src: demo('ongles', '06'), alt: 'Outils', caption: 'Stérilisation' },
      ],
      serviceImages: [demo('ongles', 'svc-01'), demo('ongles', 'svc-02'), demo('ongles', 'svc-03')],
      apropos: {
        titre: 'Des mains soignées',
        texte:
          'Pose américaine, nail art, réparation. Cabine lumineuse, produits sélectionnés, réservation en ligne.',
        photo: demo('ongles', 'apropos'),
      },
      servicesTitle: 'Prestations mains',
      servicesSubtitle:
        'Cartes et images alignées sur votre salon — chaque client Pinapp a sa propre hiérarchie et ses propres mots.',
      bookingSub: 'Type de pose et créneau en trois étapes (démo).',
      confirmSub: 'Exemple : confirmation de créneau côté outil que vous choisissez.',
      preuvePhoto: demo('ongles', 'preuve'),
    },

    estheticienne: {
      photoHero: demo('estheticienne', 'hero'),
      galerieTitle: 'Soins & détente',
      galerie: [
        { src: demo('estheticienne', '01'), alt: 'Massage', caption: 'Relaxation' },
        { src: demo('estheticienne', '02'), alt: 'Soin visage', caption: 'Éclat' },
        { src: demo('estheticienne', '03'), alt: 'Cabine', caption: 'Calme' },
        { src: demo('estheticienne', '04'), alt: 'Produits', caption: 'Bio' },
        { src: demo('estheticienne', '05'), alt: 'Epilation', caption: 'Douceur' },
        { src: demo('estheticienne', '06'), alt: 'Ambiance', caption: 'Lumière tamisée' },
      ],
      serviceImages: [
        demo('estheticienne', 'svc-01'),
        demo('estheticienne', 'svc-02'),
        demo('estheticienne', 'svc-03'),
      ],
      apropos: {
        titre: 'Votre peau, notre métier',
        texte:
          'Soins sur mesure, protocoles doux, confidentialité. Un moment rien que pour vous entre deux journées chargées.',
        photo: demo('estheticienne', 'apropos'),
      },
      servicesTitle: 'Rituels & soins',
      servicesSubtitle:
        'Ambiance spa et parcours réservation cohérents avec votre cabine — site sur mesure, zero catalogue de thème.',
      bookingSub: 'Besoin et disponibilité sans friction (démo).',
      confirmSub: 'Exemple : rappel ou SMS selon votre automatisation.',
      preuvePhoto: demo('estheticienne', 'preuve'),
    },

    coiffeur: {
      photoHero: img('1562320342-44ef4452d781'),
      galerieTitle: 'Coupes & colorations',
      galerie: [
        { src: img('1562320342-44ef4452d781', qM), alt: 'Salon', caption: 'Fauteuils' },
        { src: img('1521590834227-7bcfd46fbd9d', qM), alt: 'Coupe', caption: 'Styling' },
        { src: img('1633681738845-a5e52e44e475', qM), alt: 'Couleur', caption: 'Balayage' },
        { src: img('1503951914875-452612b0f003', qM), alt: 'Barbier', caption: 'Taille de barbe' },
        { src: img('1522338140842-4fe909a4322e', qM), alt: 'Produits', caption: 'Soins' },
        { src: img('1560066984-138d3534f6d9', qM), alt: 'Miroir', caption: 'Avant / après' },
      ],
      serviceImages: [
        img('1521590834227-7bcfd46fbd9d', qS),
        img('1633681738845-a5e52e44e475', qS),
        img('1503951914875-452612b0f003', qS),
      ],
      apropos: {
        titre: 'Salon indépendant',
        texte:
          'Écoute, conseil couleur, finitions nettes. RDV en ligne, rappels automatiques — vous profitez du fauteuil.',
        photo: img('1562320342-44ef4452d781', qM),
      },
      servicesTitle: 'Coupes, couleurs, barbe',
      servicesSubtitle:
        'Mise en avant des services qui vous rapportent — parcours écrit pour ce salon, pas pour « n’importe quel coiffeur ».',
      bookingSub: 'Prestation et horaire en trois choix (démo).',
      confirmSub: 'Exemple : agenda synchronisé sur le site livré.',
      preuvePhoto: img('1507003211169-0a1dd7228f2d', qS),
    },

    cils: {
      photoHero: img('1516975080914-ae6841e37f29'),
      galerieTitle: 'Regard & extensions',
      galerie: [
        { src: img('1516975080914-ae6841e37f29', qM), alt: 'Pose', caption: 'Volume' },
        { src: img('1522335780753-8ca7b8c0c34c', qM), alt: 'Détail', caption: 'Courbe' },
        { src: img('1596462502278-27bfdc403348', qM), alt: 'Matériel', caption: 'Précision' },
        { src: img('1616394587893-d4b4c237d8d0', qM), alt: 'Regard', caption: 'Naturel' },
        { src: img('1522337360788-8b13dee7a37e', qM), alt: 'Salon', caption: 'Lumière' },
        { src: img('1604654894610-df63bc536371', qM), alt: 'Pose complète', caption: 'Rendu' },
      ],
      serviceImages: [
        img('1516975080914-ae6841e37f29', qS),
        img('1596462502278-27bfdc403348', qS),
        img('1616394587893-d4b4c237d8d0', qS),
      ],
      apropos: {
        titre: 'Le regard qui change tout',
        texte:
          'Extensions pose à pose, remplissages réguliers, hygiène irréprochable. Spécialiste regard depuis 8 ans.',
        photo: img('1522335780753-8ca7b8c0c34c', qM),
      },
      servicesTitle: 'Extensions & entretien',
      servicesSubtitle:
        'Détails techniques et photos pro pour rassurer — vitrine unique, pas une page cils toute faite.',
      bookingSub: 'Type de pose et suivi en trois questions (démo).',
      confirmSub: 'Exemple : rappel de rendez-vous automatisé chez vous.',
      preuvePhoto: img('1544005313-94ddf0286df2', qS),
    },

    boulangerie: {
      photoHero: img('1509440157566-624c7a7d2fc8'),
      galerieTitle: 'Four & vitrine',
      galerie: [
        { src: img('1509440157566-624c7a7d2fc8', qM), alt: 'Pain', caption: 'Meule' },
        { src: img('1555507036-ab1f4038808a', qM), alt: 'Viennoiseries', caption: 'Matin' },
        { src: img('1608195210378-c9e892f37ef8', qM), alt: 'Farine', caption: 'Artisan' },
        { src: img('1586444248900-2f6ed64b2dbb', qM), alt: 'Four', caption: 'Cuisson' },
        { src: img('1565299624946-b28f40e0ae38', qM), alt: 'Pizza', caption: 'Spécialité' },
        { src: img('1486427946849-63653e372ffa', qM), alt: 'Équipe', caption: 'Accueil' },
      ],
      serviceImages: [
        img('1509440157566-624c7a7d2fc8', qS),
        img('1555507036-ab1f4038808a', qS),
        img('1608195210378-c9e892f37ef8', qS),
      ],
      apropos: {
        titre: 'Farine, levain, passion',
        texte:
          'Boulangerie de quartier : commandes le week-end, retrait sans file d’attente grâce au site. Votre pain est prêt quand vous arrivez.',
        photo: img('1586444248900-2f6ed64b2dbb', qM),
      },
      servicesTitle: 'Viennoiseries & commandes',
      servicesSubtitle:
        'Horaires, retrait et vitrine adaptés à votre fournil — développement sur mesure, pas un thème « bakery ».',
      bookingSub: 'Commande et créneau de retrait (démo).',
      confirmSub: 'Exemple : SMS « prêt à retirer » branché sur votre flux.',
      preuvePhoto: img('1438761681033-6461ffad8d80', qS),
    },

    barbier: {
      photoHero: img('1503951914875-452612b0f003'),
      galerieTitle: 'Style & tradition',
      galerie: [
        { src: img('1503951914875-452612b0f003', qM), alt: 'Taille', caption: 'Précision' },
        { src: img('1621605814071-39b2a3035c42', qM), alt: 'Rasoir', caption: 'Barbe' },
        { src: img('1585747860715-2baadb605fc3', qM), alt: 'Salon', caption: 'Fauteuil vintage' },
        { src: img('1507003211169-0a1dd7228f2d', qM), alt: 'Client', caption: 'Satisfaction' },
        { src: img('1522338140842-4fe909a4322e', qM), alt: 'Produits', caption: 'Finishing' },
        { src: img('1562320342-44ef4452d781', qM), alt: 'Shop', caption: 'Ambiance' },
      ],
      serviceImages: [
        img('1503951914875-452612b0f003', qS),
        img('1621605814071-39b2a3035c42', qS),
        img('1585747860715-2baadb605fc3', qS),
      ],
      apropos: {
        titre: 'Barbershop authentique',
        texte:
          'Coupe classique, fade, barbe sculptée. Bière ou café offert, musique sélectionnée — le rendez-vous devient un rituel.',
        photo: img('1585747860715-2baadb605fc3', qM),
      },
      servicesTitle: 'Coupes & barbe',
      servicesSubtitle:
        'Identité forte et réservation simple — le même squelette technique Pinapp, une présentation différente à chaque barbershop.',
      bookingSub: 'Service et disponibilité en trois taps (démo).',
      confirmSub: 'Exemple : créneau bloqué dans votre agenda.',
      preuvePhoto: img('1568602471126-139295fcc3ee', qS),
    },

    avocat: {
      photoHero: img('1589829540833-527e0e87d48a'),
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
      photoHero: img('1464822758483-df1963d3e9e0', q),
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
          'Vitrine sur-mesure au standard Pinapp : sections plein écran, galerie dense, témoignages, formulaire détaillé — même ligne éditoriale et visuelle qu’un projet type Mémoire & Présence. Sur un mandat réel, textes, photos et parcours sont les vôtres ; ici, scénario avec visuels Unsplash.',
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
