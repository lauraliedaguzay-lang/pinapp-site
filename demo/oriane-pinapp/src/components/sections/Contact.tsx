'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { useIsInViewport } from '../../hooks/useIsInViewport';
import { ContactCanvas } from '../canvas/ContactCanvas';

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contactActive = useIsInViewport(sectionRef, { initialInViewport: false });

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-ivoire px-[6vw] py-[18vh] text-center"
    >
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-40">
        <Canvas className="h-full w-full" dpr={[1, 2]} gl={{ alpha: true }}>
          <Suspense fallback={null}>
            <ContactCanvas active={contactActive} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-[5] flex flex-col items-center">
        <div
          className="mb-6 font-body text-[0.7rem] font-extralight uppercase tracking-[0.5em] text-or-rose"
          style={{ fontWeight: 200 }}
        >
          — Sur devis exclusif
        </div>
        <h2 className="mb-8 max-w-[700px] font-display text-[clamp(2.5rem,5vw,4rem)] font-light italic leading-tight tracking-tight text-encre">
          Composer une fragrance privée.
        </h2>
        <p className="mb-12 max-w-[500px] font-body text-[1.1rem] font-light leading-relaxed text-encre-soft">
          Maison ORIANE accompagne quelques projets par an. Si vous souhaitez
          explorer une création sur mesure, écrivez-nous.
        </p>

        <a
          href="mailto:contact@maisonoriane.example?subject=Cr%C3%A9ation%20fragrance%20priv%C3%A9e&body=Bonjour%2C%0A%0AJe%20souhaite%20explorer%20la%20cr%C3%A9ation%20d%27une%20fragrance%20priv%C3%A9e%20avec%20Maison%20ORIANE.%0A%0AVoici%20mon%20projet%20%3A%0A%0A"
          className="contact-button group relative inline-flex items-center gap-4 overflow-hidden border border-encre px-[2.8rem] py-[1.4rem] font-body text-[0.7rem] font-light uppercase tracking-[0.4em] text-encre transition-colors duration-[400ms] hover:text-ivoire no-underline"
          rel="noopener"
          style={{ fontWeight: 300 }}
        >
          <div
            className="absolute inset-0 z-0 bg-encre translate-y-full transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
            aria-hidden
          />
          <span className="relative z-10">Prendre contact →</span>
        </a>

        <div
          className="mt-16 font-body text-[0.65rem] font-extralight uppercase tracking-[0.35em] text-or-rose"
          style={{ fontWeight: 200 }}
        >
          PINAPP STUDIO · BORDEAUX · 2026
        </div>
        <div className="mt-4 font-display text-[1.1rem] font-light italic text-encre-soft">
          À partir de 8 000 € HT
        </div>
      </div>
    </section>
  );
}
