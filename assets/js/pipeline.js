/* =====================================================
   PIPELINE SIMULATION — Ce qui se passe sans vous
   Pinapp Studio · Avril 2026
   ===================================================== */

const Pipeline = {
  nodes: [
    { icon: '•', label: 'Prospect', tip: 'Un artisan remplit le formulaire à 23h' },
    { icon: '•', label: 'Aurora analyse', tip: 'Type · score · résumé en 2 secondes' },
    { icon: '•', label: 'Notion', tip: 'Fiche prospect créée automatiquement' },
    { icon: '•', label: 'Email', tip: 'Confirmation envoyée immédiatement' },
    { icon: '•', label: 'WhatsApp', tip: 'Notification Lauralie' },
    { icon: '•', label: 'Devis auto', tip: 'Généré et envoyé avec lien Stripe' },
    { icon: '•', label: 'Signature', tip: 'Le client signe en ligne' },
    { icon: '•', label: 'Paiement', tip: 'Stripe reçoit · Notion mis à jour' },
    { icon: '•', label: 'Site généré', tip: 'Cursor construit · Netlify déploie' },
    { icon: '•', label: 'Livraison', tip: 'Email client + rapport Lauralie' },
  ],

  _animInterval: null,
  _running: false,

  init() {
    const track = document.getElementById('pipeline-track');
    if (!track) return;

    // Générer les nœuds
    this.nodes.forEach((n, i) => {
      const node = document.createElement('div');
      node.className = 'pipeline-node';
      node.dataset.index = i;
      node.innerHTML = `
        <div class="pipeline-circle" role="img" aria-label="${n.label}: ${n.tip}">
          <span class="pipeline-icon" aria-hidden="true">${n.icon}</span>
          <div class="pipeline-tooltip" aria-hidden="true">${n.tip}</div>
        </div>
        <span class="pipeline-label">${n.label}</span>
        ${i < this.nodes.length - 1 ? '<div class="pipeline-line" aria-hidden="true"></div>' : ''}`;
      track.appendChild(node);
    });

    // Pas d'IntersectionObserver (pinapp-zero-scroll.mdc) : animation au chargement
    // (et respect prefers-reduced-motion via CSS / styles).
    this.animate();
  },

  animate() {
    if (this._running) return;
    this._running = true;

    const circles = document.querySelectorAll('.pipeline-circle');
    const lines = document.querySelectorAll('.pipeline-line');

    // Activer nœud par nœud
    circles.forEach((c, i) => {
      setTimeout(() => {
        c.classList.add('active');
        if (lines[i]) lines[i].classList.add('active');
      }, i * 1400);
    });

    // Boucle infinie après completion
    const total = this.nodes.length * 1400 + 2500;
    setTimeout(() => {
      circles.forEach((c) => c.classList.remove('active'));
      lines.forEach((l) => l.classList.remove('active'));
      this._running = false;
      setTimeout(() => this.animate(), 800);
    }, total);
  },
};

document.addEventListener('DOMContentLoaded', () => Pipeline.init());
