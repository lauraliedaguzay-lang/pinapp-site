'use client';

import { fragrances } from '../../data/fragrances';

export function Scene6Collection() {
  return (
    <section id="collection" className="bg-noir-profond px-[6vw] py-[16vh] [clip-path:polygon(0_4%,100%_0,100%_100%,0_100%)]">
      <div className="relative z-[10] mx-auto max-w-[520px]">
        <p className="mb-4 font-body text-[0.7rem] font-extralight uppercase tracking-[0.45em] text-or-pur" style={{ fontWeight: 200 }}>
          — La Collection
        </p>
        <h2 className="mb-12 font-display text-[clamp(2rem,4vw,3rem)] font-light italic text-ivoire-chaud">
          Trois fragrances, un trajet de jour.
        </h2>
        <div className="flex flex-col gap-8">
          {fragrances.map((f) => (
            <article
              key={f.id}
              className="group relative overflow-hidden rounded-sm border border-or-pur/50 transition-[border-color,transform] duration-500 hover:-translate-x-2 hover:border-or-liquide hover:shadow-[0_24px_48px_-16px_rgba(244,201,119,0.15)]"
            >
              <div
                className="aspect-[3/4] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${f.photoUrl})` }}
                role="img"
                aria-label={f.photoAlt}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,8,5,0.88)] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative border-t border-or-pur/30 bg-noir-velours/95 p-5">
                <h3 className="font-display text-xl font-light italic text-ivoire-chaud">{f.nom}</h3>
                <p className="mt-1 font-body text-[0.65rem] font-extralight uppercase tracking-[0.35em] text-or-pur">{f.heure}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
