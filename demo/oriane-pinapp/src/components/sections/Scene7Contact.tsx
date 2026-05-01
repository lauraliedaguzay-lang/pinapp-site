'use client';

export function Scene7Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-noir-profond px-[6vw] py-[18vh] text-center"
    >
      <div className="relative z-[10] max-w-[640px]">
        <p className="mb-6 font-body text-[0.7rem] font-extralight uppercase tracking-[0.5em] text-or-pur" style={{ fontWeight: 200 }}>
          — Sur devis exclusif
        </p>
        <h2 className="mb-8 font-display text-[clamp(2.2rem,5vw,4rem)] font-light italic leading-tight text-ivoire-chaud [text-shadow:0_0_28px_rgba(244,201,119,0.1)]">
          Composer une fragrance privée.
        </h2>
        <p className="mb-12 font-body text-[1.05rem] font-light leading-relaxed text-ivoire-soft">
          Maison ORIANE accompagne quelques projets par an.
        </p>
        <a
          href="mailto:contact@maisonoriane.example?subject=Cr%C3%A9ation%20fragrance%20priv%C3%A9e&body=Bonjour%2C%0A%0AJe%20souhaite%20explorer%20la%20cr%C3%A9ation%20d%27une%20fragrance%20priv%C3%A9e%20avec%20Maison%20ORIANE.%0A%0AVoici%20mon%20projet%20%3A%0A%0A"
          className="inline-flex min-w-[min(100%,20rem)] items-center justify-center border border-or-pur px-12 py-6 font-body text-[0.8rem] font-extralight uppercase tracking-[0.5em] text-or-pur no-underline transition-colors duration-300 hover:bg-bordeaux hover:text-ivoire-chaud"
          rel="noopener"
          style={{ fontWeight: 200 }}
        >
          Prendre contact →
        </a>
        <p className="mt-8 font-display text-base font-light italic text-or-pale">À partir de 8 000 € HT</p>
      </div>
    </section>
  );
}
