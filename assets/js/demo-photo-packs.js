/**
 * PINAPP — visuels démo (Unsplash, format cohérent)
 * Fusion : Object.assign(PINAPP_DEMO_SITE, PINAPP_DEMO_PHOTO_PACKS.xxx)
 */
(function (g) {
  'use strict';
  var q = '?auto=format&fit=crop&w=1600&q=82';
  var qM = '?auto=format&fit=crop&w=1000&q=82';
  var qS = '?auto=format&fit=crop&w=640&q=80';
  var U = 'https://images.unsplash.com/photo-';

  function img(id, tail) {
    return U + id + (tail || q);
  }

  g.PINAPP_DEMO_PHOTO_PACKS = {
    artisan: {
      photoHero: img('1581094794329-c8112a89af12'),
      galerieTitle: 'Chantiers & savoir-faire',
      galerie: [
        { src: img('1503389152951-9f343605f61e', qM), alt: 'Rénovation', caption: 'Pièce à vivre' },
        { src: img('1621905252507-b35492cc74b4', qM), alt: 'Plomberie', caption: 'Installation propre' },
        { src: img('1581578731548-c64695cc6952', qM), alt: 'Électricité', caption: 'Mise aux normes' },
        { src: img('1600585154340-be6161a56a0c', qM), alt: 'Façade', caption: 'Isolation' },
        { src: img('1600607687939-ce8a6c25118c', qM), alt: 'Cuisine', caption: 'Finitions' },
        { src: img('1600566753190-17f0baa2a6c3', qM), alt: 'Outils', caption: 'Matériel pro' }
      ],
      serviceImages: [
        img('1621905251189-3b9a990a93fd', qS),
        img('1600585154526-990dced4db0d', qS),
        img('1581092160562-40aa08f66857', qS)
      ],
      apropos: {
        titre: 'Une équipe sur le terrain',
        texte:
          'Artisans RGE, devis clairs, chantiers tenus dans les temps. Nous intervenons en Île-de-France avec la même exigence sur la finition que sur la sécurité.',
        photo: img('1504307651254-35680f356dfd', qM)
      },
      preuvePhoto: img('1573496359142-b8d87734a5a2', qS)
    },

    restaurant: {
      photoHero: img('1414235077428-338989a2e8c0'),
      galerieTitle: 'Ambiance & assiettes',
      galerie: [
        { src: img('1555396273-367ea4eb4db5', qM), alt: 'Salle', caption: 'Accueil' },
        { src: img('1551218808-94e220e217d5', qM), alt: 'Cuisine', caption: 'Au feu' },
        { src: img('1540189549336-e6e99c3679fe', qM), alt: 'Plat', caption: 'Saison' },
        { src: img('1466978913421-dad2ebd01d17', qM), alt: 'Bar', caption: 'Cocktails' },
        { src: img('1517248135467-4c7edcad34c4', qM), alt: 'Table', caption: 'Dressage' },
        { src: img('1559339352-11d035aa65de', qM), alt: 'Dessert', caption: 'Maison' }
      ],
      serviceImages: [
        img('1559339352-11d035aa65de', qS),
        img('1544025162-d76694265947', qS),
        img('1424847657312-8e1b5de75a2a', qS)
      ],
      apropos: {
        titre: 'Notre maison, votre table',
        texte:
          'Cuisine japonaise contemporaine, produits sourcés, équipe soudée. Réservations en ligne et accueil personnalisé.',
        photo: img('1552566626-52a8f8283a9e', qM)
      },
      preuvePhoto: img('1438761681033-6461ffad8d80', qS)
    },

    coach: {
      photoHero: img('1544367567-0f2fcb009e0b'),
      galerieTitle: 'Accompagnement & transformation',
      galerie: [
        { src: img('1571019613454-1cb2f99b2d8b', qM), alt: 'Séance', caption: 'Coaching' },
        { src: img('1506126613408-eca07ce68773', qM), alt: 'Focus', caption: 'Objectifs' },
        { src: img('1522202176988-66273c2fd55f', qM), alt: 'Groupe', caption: 'Atelier' },
        { src: img('1522071820081-009f0129c71c', qM), alt: 'Équipe', caption: 'Entreprise' },
        { src: img('1493836512294-502baa1986fc', qM), alt: 'Nature', caption: 'Ressourcement' },
        { src: img('1516321318421-f621f2f503d4', qM), alt: 'Carnet', caption: 'Méthode' }
      ],
      serviceImages: [
        img('1571019613454-1cb2f99b2d8b', qS),
        img('1506126613408-eca07ce68773', qS),
        img('1522202176988-66273c2fd55f', qS)
      ],
      apropos: {
        titre: 'Certifiée, à votre écoute',
        texte:
          'ICF, bilans CPF, séances sur mesure. Un cadre bienveillant pour dépasser vos blocages et structurer votre projet.',
        photo: img('1552664730-d307ca884978', qM)
      },
      preuvePhoto: img('1494790108377-be9c29b29330', qS)
    },

    trainer: {
      photoHero: img('1534438327276-14e5300c3a48'),
      galerieTitle: 'Performance & récupération',
      galerie: [
        { src: img('1571019614242-c3450a2ad572', qM), alt: 'Musculation', caption: 'Force' },
        { src: img('1517836357463-d25dfeac3c3e', qM), alt: 'Cardio', caption: 'Endurance' },
        { src: img('1593079836568-3241c29412c9', qM), alt: 'Étirements', caption: 'Mobilité' },
        { src: img('1518611012118-696072aa345a', qM), alt: 'Coach', caption: 'Suivi' },
        { src: img('1540497074882-28dc02a8c7e5', qM), alt: 'Nutrition', caption: 'Plateau repas' },
        { src: img('1583454110551-21f2fa2afe61', qM), alt: 'Haltères', caption: 'Salle' }
      ],
      serviceImages: [
        img('1571019614242-c3450a2ad572', qS),
        img('1517836357463-d25dfeac3c3e', qS),
        img('1593079836568-3241c29412c9', qS)
      ],
      apropos: {
        titre: 'Votre corps, votre plan',
        texte:
          'Prépa physique, perte de poids, remise en forme durable. Séances en salle et suivi WhatsApp entre les cours.',
        photo: img('1581009148645-bfd3e74556ec', qM)
      },
      preuvePhoto: img('1568602471126-139295fcc3ee', qS)
    },

    tatoueuse: {
      photoHero: img('1611501279641-e541992fc7e4'),
      galerieTitle: 'Flash & projets sur mesure',
      galerie: [
        { src: img('1590246814883-57b34b9d0b40', qM), alt: 'Ligne', caption: 'Dessin' },
        { src: img('1565053396441-9d40e534e09e', qM), alt: 'Machine', caption: 'Hygiène' },
        { src: img('1611501279641-e541992fc7e4', qM), alt: 'Studio', caption: 'Ambiance' },
        { src: img('1457975460783-eacfce701117', qM), alt: 'Encre', caption: 'Palette' },
        { src: img('1507003211169-0a1dd7228f2d', qM), alt: 'Portrait', caption: 'Artiste' },
        { src: img('1513364776144-60967b0f800f', qM), alt: 'Détail', caption: 'Finition' }
      ],
      serviceImages: [
        img('1590246814883-57b34b9d0b40', qS),
        img('1565053396441-9d40e534e09e', qS),
        img('1611501279641-e541992fc7e4', qS)
      ],
      apropos: {
        titre: 'L’art dans la peau',
        texte:
          'Hygiène irréprochable, projet personnalisé, consentement et repos. Paris — premiers échanges par message.',
        photo: img('1507003211169-0a1dd7228f2d', qM)
      },
      preuvePhoto: img('1438761681033-6461ffad8d80', qS)
    },

    ongles: {
      photoHero: img('1522337360788-8b13dee7a37e'),
      galerieTitle: 'Nail art & soins',
      galerie: [
        { src: img('1604654894610-df63bc536371', qM), alt: 'Manucure', caption: 'Pose gel' },
        { src: img('1516975080914-ae6841e37f29', qM), alt: 'Couleurs', caption: 'Nuancier' },
        { src: img('1522337360788-8b13dee7a37e', qM), alt: 'Salon', caption: 'Espace' },
        { src: img('1616394587893-d4b4c237d8d0', qM), alt: 'Détail', caption: 'Décoration' },
        { src: img('1519415943484-f9b3d5d702bf', qM), alt: 'Soin', caption: 'Repos' },
        { src: img('1596462502278-27bfdc403348', qM), alt: 'Outils', caption: 'Stérilisation' }
      ],
      serviceImages: [
        img('1604654894610-df63bc536371', qS),
        img('1516975080914-ae6841e37f29', qS),
        img('1616394587893-d4b4c237d8d0', qS)
      ],
      apropos: {
        titre: 'Des mains soignées',
        texte:
          'Pose américaine, nail art, réparation. Cabine lumineuse, produits sélectionnés, réservation en ligne.',
        photo: img('1560066984-138d3534f6d9', qM)
      },
      preuvePhoto: img('1544005313-94ddf0286df2', qS)
    },

    estheticienne: {
      photoHero: img('1570172618684-dfd03ed5d881'),
      galerieTitle: 'Soins & détente',
      galerie: [
        { src: img('1515377902960-4688d4d4c5c4', qM), alt: 'Massage', caption: 'Relaxation' },
        { src: img('1570172618684-dfd03ed5d881', qM), alt: 'Soin visage', caption: 'Éclat' },
        { src: img('1522335780753-8ca7b8c0c34c', qM), alt: 'Cabine', caption: 'Calme' },
        { src: img('1540555700475-27d9b8f5a1b8', qM), alt: 'Produits', caption: 'Bio' },
        { src: img('1519823551272-7098fc693ce3', qM), alt: 'Epilation', caption: 'Douceur' },
        { src: img('1507652313519-d4d9174bcddc', qM), alt: 'Ambiance', caption: 'Lumière tamisée' }
      ],
      serviceImages: [
        img('1515377902960-4688d4d4c5c4', qS),
        img('1570172618684-dfd03ed5d881', qS),
        img('1522335780753-8ca7b8c0c34c', qS)
      ],
      apropos: {
        titre: 'Votre peau, notre métier',
        texte:
          'Soins sur mesure, protocoles doux, confidentialité. Un moment rien que pour vous entre deux journées chargées.',
        photo: img('1522335780753-8ca7b8c0c34c', qM)
      },
      preuvePhoto: img('1534528741775-53994a69daeb', qS)
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
        { src: img('1560066984-138d3534f6d9', qM), alt: 'Miroir', caption: 'Avant / après' }
      ],
      serviceImages: [
        img('1521590834227-7bcfd46fbd9d', qS),
        img('1633681738845-a5e52e44e475', qS),
        img('1503951914875-452612b0f003', qS)
      ],
      apropos: {
        titre: 'Salon indépendant',
        texte:
          'Écoute, conseil couleur, finitions nettes. RDV en ligne, rappels automatiques — vous profitez du fauteuil.',
        photo: img('1562320342-44ef4452d781', qM)
      },
      preuvePhoto: img('1507003211169-0a1dd7228f2d', qS)
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
        { src: img('1604654894610-df63bc536371', qM), alt: 'Pose complète', caption: 'Rendu' }
      ],
      serviceImages: [
        img('1516975080914-ae6841e37f29', qS),
        img('1596462502278-27bfdc403348', qS),
        img('1616394587893-d4b4c237d8d0', qS)
      ],
      apropos: {
        titre: 'Le regard qui change tout',
        texte:
          'Extensions pose à pose, remplissages réguliers, hygiène irréprochable. Spécialiste regard depuis 8 ans.',
        photo: img('1522335780753-8ca7b8c0c34c', qM)
      },
      preuvePhoto: img('1544005313-94ddf0286df2', qS)
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
        { src: img('1486427946849-63653e372ffa', qM), alt: 'Équipe', caption: 'Accueil' }
      ],
      serviceImages: [
        img('1509440157566-624c7a7d2fc8', qS),
        img('1555507036-ab1f4038808a', qS),
        img('1608195210378-c9e892f37ef8', qS)
      ],
      apropos: {
        titre: 'Farine, levain, passion',
        texte:
          'Boulangerie de quartier : commandes le week-end, retrait sans file d’attente grâce au site. Votre pain est prêt quand vous arrivez.',
        photo: img('1586444248900-2f6ed64b2dbb', qM)
      },
      preuvePhoto: img('1438761681033-6461ffad8d80', qS)
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
        { src: img('1562320342-44ef4452d781', qM), alt: 'Shop', caption: 'Ambiance' }
      ],
      serviceImages: [
        img('1503951914875-452612b0f003', qS),
        img('1621605814071-39b2a3035c42', qS),
        img('1585747860715-2baadb605fc3', qS)
      ],
      apropos: {
        titre: 'Barbershop authentique',
        texte:
          'Coupe classique, fade, barbe sculptée. Bière ou café offert, musique sélectionnée — le rendez-vous devient un rituel.',
        photo: img('1585747860715-2baadb605fc3', qM)
      },
      preuvePhoto: img('1568602471126-139295fcc3ee', qS)
    },

    avocat: {
      photoHero: img('1589829540833-527e0e87d48a'),
      galerieTitle: 'Cabinet & sérieux',
      galerie: [
        { src: img('1589829540833-527e0e87d48a', qM), alt: 'Bibliothèque', caption: 'Documentation' },
        { src: img('1450101499163-c8848c66ca85', qM), alt: 'Bureau', caption: 'Entretien' },
        { src: img('1454165208754-3aa398191a59', qM), alt: 'Contrat', caption: 'Conseil' },
        { src: img('1507679799987-c73779587ccf', qM), alt: 'Justice', caption: 'Engagement' },
        { src: img('1521791059606-8242b1a0b31d', qM), alt: 'Réunion', caption: 'Équipe' },
        { src: img('1486406146926-c627a92ad1ab', qM), alt: 'Immeuble', caption: 'Paris' }
      ],
      serviceImages: [
        img('1450101499163-c8848c66ca85', qS),
        img('1454165208754-3aa398191a59', qS),
        img('1507679799987-c73779587ccf', qS)
      ],
      apropos: {
        titre: 'Écoute, rigueur, discrétion',
        texte:
          'Droit des affaires et des particuliers. Première analyse par écrit, dossiers structurés, pas de surprise sur les honoraires.',
        photo: img('1521791059606-8242b1a0b31d', qM)
      },
      preuvePhoto: img('1472094153963-57d48124d846', qS)
    },

    /* Démo « sur-mesure » : site très riche type vitrine premium (hommage, lieu, ou marque haut de gamme) */
    surmesure: {
      photoHero: img('1464822758483-df1963d3e9e0', q),
      galerieTitle: 'Moments, lieux, détails',
      galerie: [
        { src: img('1465146349255-7e60800f6453', qM), alt: 'Lumière naturelle', caption: 'Accueil' },
        { src: img('1519741497674-61162186352c', qM), alt: 'Fleurs blanches', caption: 'Composition' },
        { src: img('1519225429380-bcc0a7c65f7c', qM), alt: 'Allée', caption: 'Lieu de recueillement' },
        { src: img('1520768224289-229f26c7686e', qM), alt: 'Textile', caption: 'Matières nobles' },
        { src: img('1490750967868-88aa4486c946', qM), alt: 'Bougie', caption: 'Douceur' },
        { src: img('1506905925346-21bda4d32df4', qM), alt: 'Forêt', caption: 'Sérénité' },
        { src: img('1441974231531-c6227db76b6e', qM), alt: 'Chemin', caption: 'Nature' },
        { src: img('1470240731273-7821a6eeb6bd', qM), alt: 'Brume', caption: 'Matin' },
        { src: img('1502086221113-b1a222e0229b', qM), alt: 'Architecture', caption: 'Lieu d’exception' },
        { src: img('1513506003901-1e6ad229e2d7', qM), alt: 'Calligraphie', caption: 'Texte personnalisé' },
        { src: img('1528164344705-43141460b5a0', qM), alt: 'Pierre', caption: 'Matériaux' },
        { src: img('1518173946689-a3cbd97ed1cc', qM), alt: 'Ciel', caption: 'Apaisement' },
        { src: img('1499205476559-cfbe5462ee7d', qM), alt: 'Main', caption: 'Accompagnement' },
        { src: img('1500530854321-586ed83d5d26', qM), alt: 'Eau', caption: 'Pur' },
        { src: img('1519681393784-d120267933ba', qM), alt: 'Montagne', caption: 'Horizon' }
      ],
      serviceImages: [
        img('1519741497674-61162186352c', qS),
        img('1490750967868-88aa4486c946', qS),
        img('1520768224289-229f26c7686e', qS)
      ],
      apropos: {
        titre: 'Chaque histoire mérite une présence digne',
        texte:
          'Exemple de site sur-mesure Pinapp : plusieurs sections plein écran, galerie dense, témoignages, formulaire détaillé — le même niveau d’exigence éditorial et visuel que pour un projet « Mémoire & Présence ». Textes, photos et parcours sont adaptés à votre univers ; ici, illustration avec visuels Unsplash.',
        photo: img('1513506003901-1e6ad229e2d7', qM)
      },
      preuvePhoto: img('1544005313-94ddf0286df2', qS),
      contactRichTitle: 'Écrire un message confidentiel',
      contactRichIntro:
        'Prénom, email et message : tout reste sur cette démo (aucun envoi réel). Sur un site livré, ce bloc part vers votre boîte ou votre CRM.'
    }
  };
})(typeof window !== 'undefined' ? window : this);
