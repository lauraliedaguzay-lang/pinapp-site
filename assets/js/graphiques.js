/* =====================================================
   GRAPHIQUES VANILLA JS — SVG animés au scroll
   4 graphiques · zéro librairie · Pinapp Studio 2026
   ===================================================== */

/* ── BAR CHART — Temps récupéré par tâche ─────────── */
class BarChart {
  constructor(el, data) {
    this.el = el;
    this.data = data;
    this.done = false;
    this.render();
    this.observe();
  }

  render() {
    const max = Math.max(...this.data.map((d) => d.v));
    const W = 300,
      H = 180,
      pad = 30;
    const w = 32,
      gap = 18;

    const bars = this.data
      .map((d, i) => {
        const x = pad + i * (w + gap);
        const h = (d.v / max) * (H - pad - 20);
        const y = H - pad - h;
        return `
        <g>
          <rect x="${x}" y="${pad}" width="${w}"
            height="${H - pad - pad}" rx="4"
            fill="rgba(255,255,255,0.03)"/>
          <rect class="bar-fill"
            x="${x}" y="${H - pad}" width="${w}"
            height="0" rx="4"
            fill="url(#bar-grad-${this._id})"
            data-y="${y}" data-h="${h}"/>
          <text x="${x + w / 2}" y="${H - pad + 14}"
            text-anchor="middle"
            fill="rgba(238,248,255,0.45)"
            font-size="8" font-family="Inter,sans-serif">
            ${d.l}
          </text>
          <text class="bar-val"
            x="${x + w / 2}" y="${y - 4}"
            text-anchor="middle"
            fill="#00E5CC" font-size="9"
            font-family="Inter,sans-serif" opacity="0">
            ${d.v}h
          </text>
        </g>`;
      })
      .join('');

    this.el.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;overflow:visible">
        <defs>
          <linearGradient id="bar-grad-${this._id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#39E075"/>
            <stop offset="100%" stop-color="#00E5CC"/>
          </linearGradient>
        </defs>
        ${bars}
      </svg>`;
  }

  animate() {
    if (this.done) return;
    this.done = true;
    this.el.querySelectorAll('.bar-fill').forEach((r, i) => {
      setTimeout(() => {
        const y = r.dataset.y,
          h = r.dataset.h;
        r.style.transition = `y 700ms cubic-bezier(0.45,0.05,0.55,0.95),
           height 700ms cubic-bezier(0.45,0.05,0.55,0.95)`;
        r.setAttribute('y', y);
        r.setAttribute('height', h);
        const val = r.parentElement.querySelector('.bar-val');
        if (val) {
          val.style.transition = 'opacity 300ms ease 400ms';
          val.style.opacity = '1';
        }
      }, i * 130);
    });
  }

  observe() {
    // Pinapp: zéro reveal au scroll (pas d'IntersectionObserver)
    this.animate();
  }
}
BarChart.prototype._id = 'main';

/* ── LINE CHART — Interventions avant / après ─────── */
class LineChart {
  constructor(el, datasets) {
    this.el = el;
    this.datasets = datasets;
    this.done = false;
    this.render();
    this.observe();
  }

  pts(vals, W, H) {
    const max = Math.max(...vals);
    return vals.map((v, i) => ({
      x: (i / (vals.length - 1)) * (W - 40) + 20,
      y: H - 20 - (v / max) * (H - 40),
    }));
  }

  render() {
    const W = 300,
      H = 150;
    const paths = this.datasets
      .map((ds, i) => {
        const p = this.pts(ds.vals, W, H);
        const d = p
          .map((pt, j) => `${j ? 'L' : 'M'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
          .join(' ');
        return `<path d="${d}"
        stroke="${ds.color}" stroke-width="2.5"
        fill="none" stroke-linecap="round" stroke-linejoin="round"
        stroke-dasharray="400" stroke-dashoffset="400"
        style="transition:stroke-dashoffset 1200ms cubic-bezier(0.45,0.05,0.55,0.95) ${i * 200}ms"/>`;
      })
      .join('');

    // Légende
    const legend = this.datasets
      .map(
        (ds) =>
          `<tspan fill="${ds.color}" font-size="8" font-family="Inter,sans-serif">■ ${ds.label}  </tspan>`,
      )
      .join('');

    this.el.innerHTML = `
      <svg viewBox="0 0 ${W} ${H + 16}" style="width:100%">
        <text x="20" y="${H + 12}">${legend}</text>
        ${paths}
      </svg>`;
  }

  animate() {
    if (this.done) return;
    this.done = true;
    this.el.querySelectorAll('path').forEach((p) => {
      p.style.strokeDashoffset = '0';
    });
  }

  observe() {
    // Pinapp: zéro reveal au scroll (pas d'IntersectionObserver)
    this.animate();
  }
}

/* ── DONUT CHART — Répartition du temps gagné ─────── */
class DonutChart {
  constructor(el, segs) {
    this.el = el;
    this.segs = segs;
    this.done = false;
    this.render();
    this.observe();
  }

  render() {
    const R = 55,
      cx = 80,
      cy = 80,
      C = 2 * Math.PI * R;
    let off = 0;
    const arcs = this.segs
      .map((s, idx) => {
        const d = (s.v / 100) * C;
        const arc = `<circle cx="${cx}" cy="${cy}" r="${R}"
        fill="none" stroke="${s.c}" stroke-width="18"
        stroke-dasharray="0 ${C}"
        stroke-dashoffset="${-off}"
        transform="rotate(-90 ${cx} ${cy})"
        data-dash="${d} ${C}"
        style="transition:stroke-dasharray 800ms cubic-bezier(0.45,0.05,0.55,0.95) ${idx * 120}ms"
        title="${s.label || ''}"/>`;
        off += d;
        return arc;
      })
      .join('');

    const legend = this.segs
      .map(
        (s, i) =>
          `<text x="170" y="${14 + i * 18}"
         font-size="9" font-family="Inter,sans-serif"
         fill="rgba(238,248,255,0.65)">
        <tspan fill="${s.c}">■</tspan> ${s.label || s.v + '%'}
       </text>`,
      )
      .join('');

    this.el.innerHTML = `
      <svg viewBox="0 0 280 160" style="width:100%">
        <circle cx="${cx}" cy="${cy}" r="${R}"
          fill="none" stroke="rgba(255,255,255,0.06)"
          stroke-width="18"/>
        ${arcs}
        ${legend}
      </svg>`;
  }

  animate() {
    if (this.done) return;
    this.done = true;
    this.el.querySelectorAll('circle[data-dash]').forEach((c) => {
      c.style.strokeDasharray = c.dataset.dash;
    });
  }

  observe() {
    // Pinapp: zéro reveal au scroll (pas d'IntersectionObserver)
    this.animate();
  }
}

/* ── INIT — données adaptées au secteur détecté ───── */
document.addEventListener('DOMContentLoaded', () => {
  const secteur = (() => {
    try {
      return JSON.parse(localStorage.getItem('pinapp-intel') || '{}').secteur || 'default';
    } catch (e) {
      return 'default';
    }
  })();

  const dataBar = {
    beaute: [
      { l: 'RDV', v: 8 },
      { l: 'Relances', v: 5 },
      { l: 'Bilans', v: 4 },
      { l: 'Stocks', v: 3 },
    ],
    services: [
      { l: 'Devis', v: 8 },
      { l: 'Relances', v: 6 },
      { l: 'Rapports', v: 4 },
      { l: 'Factures', v: 4 },
    ],
    artisan: [
      { l: 'Devis', v: 9 },
      { l: 'Relances', v: 6 },
      { l: 'Planif.', v: 5 },
      { l: 'Factures', v: 4 },
    ],
    default: [
      { l: 'Relances', v: 8 },
      { l: 'Devis', v: 6 },
      { l: 'RDV', v: 5 },
      { l: 'Factures', v: 4 },
    ],
  };

  // Bar chart — heures récupérées
  const el1 = document.getElementById('chart-bar');
  if (el1) new BarChart(el1, dataBar[secteur] || dataBar.default);

  // Line chart — interventions avant/après
  const el2 = document.getElementById('chart-line');
  if (el2)
    new LineChart(el2, [
      {
        vals: [8, 9, 10, 8, 11, 10, 9, 11, 8, 10],
        color: 'rgba(220,38,38,0.55)',
        label: 'Avant',
      },
      {
        vals: [8, 6, 4, 3, 2, 1, 1, 1, 1, 0],
        color: '#00E5CC',
        label: 'Avec Pinapp',
      },
    ]);

  // Donut chart — répartition du temps gagné
  const el3 = document.getElementById('chart-donut');
  if (el3)
    new DonutChart(el3, [
      { v: 45, c: '#00E5CC', label: 'Relances (45%)' },
      { v: 30, c: '#7B4FE8', label: 'Devis (30%)' },
      { v: 15, c: '#39E075', label: 'RDV (15%)' },
      { v: 10, c: '#FFB830', label: 'Autres (10%)' },
    ]);
});
