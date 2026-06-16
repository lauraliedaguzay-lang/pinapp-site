export const fragrances = [
  {
    id: 'premiere-lumiere',
    numero: '01',
    nom: 'Première Lumière',
    heure: '06:00',
    sousTitre: 'Avant que le jour soit',
    description:
      "Le moment où la rosée tient encore. Une fragrance pour celles qui se réveillent avant le monde. Pivoine humide, soie tiède, lumière qui se devine plus qu'elle ne se voit.",
    notes: ['pivoine humide', 'rosée', 'soie tiède'],
    couleurAccent: '#E8C5C0', // blush
    couleurGlow: 'rgba(232, 197, 192, 0.5)',
    photoUrl:
      'https://images.unsplash.com/photo-1624613533305-28d421d70875?w=1600&q=85&auto=format&fit=crop',
    photoAlt: 'Première Lumière — flacon rose et or',
    photoCredit: 'Edwin Chen / Unsplash',
    filterCSS: 'none',
  },
  {
    id: 'lendemain-de-pluie',
    numero: '02',
    nom: 'Lendemain de Pluie',
    heure: '09:00',
    sousTitre: "Après l'averse",
    description:
      "L'air a été lavé. Les pétales gardent leurs gouttes. Une fragrance pour le moment exact où la lumière revient. Iris, vétiver doux, peau lavée par la pluie d'avant.",
    notes: ['iris', 'vétiver doux', 'peau lavée'],
    couleurAccent: '#B8A2C8', // mauve
    couleurGlow: 'rgba(184, 162, 200, 0.5)',
    photoUrl:
      'https://images.unsplash.com/photo-1623071282195-47184747defa?w=1600&q=85&auto=format&fit=crop',
    photoAlt: 'Lendemain de Pluie — flacon mauve pastel',
    photoCredit: 'Laura Chouette / Unsplash',
    filterCSS: 'hue-rotate(280deg) saturate(0.8)',
  },
  {
    id: 'heure-doree',
    numero: '03',
    nom: 'Heure Dorée',
    heure: '17:00',
    sousTitre: 'La soie tiède',
    description:
      "Quand la lumière devient miel. Une fragrance pour les fins d'après-midi qui durent. Ambre clair, néroli, miel d'acacia, soie qui tient encore la chaleur du jour.",
    notes: ['ambre clair', 'néroli', "miel d'acacia"],
    couleurAccent: '#D4A574', // or rosé
    couleurGlow: 'rgba(212, 165, 116, 0.6)',
    photoUrl:
      'https://images.unsplash.com/photo-1608721279136-cd41b752fa41?w=1600&q=85&auto=format&fit=crop',
    photoAlt: 'Heure Dorée — flacon or et lumière chaude',
    photoCredit: 'JC Media / Unsplash',
    filterCSS: 'hue-rotate(15deg) saturate(1.15) brightness(1.05)',
  },
] as const;
