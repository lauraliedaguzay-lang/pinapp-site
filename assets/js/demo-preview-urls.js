/**
 * Aperçus photo pour le carrousel 3D /realisations/ — alignés sur demo-photo-packs.js
 */
(function (g) {
  'use strict';
  var q = '?auto=format&fit=crop&w=960&q=80';
  var U = 'https://images.unsplash.com/photo-';
  function img(id) {
    return U + id + q;
  }

  g.PINAPP_DEMO_PREVIEW_URLS = {
    artisan: img('1581094794329-c8112a89af12'),
    restaurant: img('1414235077428-338989a2e8c0'),
    coach: img('1544367567-0f2fcb009e0b'),
    avocat: img('1589829540833-527e0e87d48a'),
    estheticienne: img('1570172618684-dfd03ed5d881'),
    cils: img('1516975080914-ae6841e37f29'),
    ongles: img('1522337360788-8b13dee7a37e'),
    coiffeur: img('1562320342-44ef4452d781'),
    barbier: img('1503951914875-452612b0f003'),
    boulangerie: img('1509440157566-624c7a7d2fc8'),
    trainer: img('1534438327276-14e5300c3a48'),
    tatoueuse: img('1611501279641-e541992fc7e4'),
    surmesure: img('1464822758483-df1963d3e9e0'),
    universHeroes: '../assets/images/monde-super-heros.png',
    universKai: '../assets/images/monde-sakura-kai.png',
    universOracle: '../assets/images/monde-pixel-quest.png',
  };
})(typeof window !== 'undefined' ? window : this);
