'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const drawer = (
    <div
      id="oriane-mobile-drawer"
      className={`fixed inset-0 z-[105] bg-noir-profond transition-[opacity,visibility] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        isOpen
          ? 'visible opacity-100 pointer-events-auto'
          : 'invisible opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      <nav
        className="flex h-full flex-col items-center justify-center gap-12"
        aria-label="Navigation mobile"
      >
        <a
          href="#manifesto"
          onClick={() => setIsOpen(false)}
          className={`font-display text-4xl font-light italic text-ivoire-chaud no-underline transition-all duration-700 ease-out hover:text-or-liquide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or-pur ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}
        >
          Manifeste
        </a>
        <a
          href="#collection"
          onClick={() => setIsOpen(false)}
          className={`font-display text-4xl font-light italic text-ivoire-chaud no-underline transition-all duration-700 ease-out hover:text-or-liquide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or-pur ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: isOpen ? '300ms' : '0ms' }}
        >
          Collection
        </a>
        <a
          href="#contact"
          onClick={() => setIsOpen(false)}
          className={`font-display text-4xl font-light italic text-ivoire-chaud no-underline transition-all duration-700 ease-out hover:text-or-liquide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or-pur ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: isOpen ? '400ms' : '0ms' }}
        >
          Contact
        </a>
        <div
          className={`absolute bottom-12 font-body text-[0.7rem] font-extralight uppercase tracking-[0.4em] text-or-pur transition-opacity duration-[600ms] ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontWeight: 200, transitionDelay: isOpen ? '600ms' : '0ms' }}
        >
          PINAPP STUDIO · BORDEAUX · 2026
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
        aria-controls="oriane-mobile-drawer"
        onClick={() => setIsOpen((o) => !o)}
        className="relative z-[110] flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-ivoire-chaud focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or-pur md:hidden touch-manipulation pointer-events-auto"
      >
        <span
          className={`absolute h-px w-6 bg-current transition-all duration-[400ms] ease-out ${
            isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[14px]'
          }`}
          aria-hidden
        />
        <span
          className={`absolute top-1/2 h-px w-6 -translate-y-1/2 bg-current transition-all duration-300 ease-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden
        />
        <span
          className={`absolute h-px w-6 bg-current transition-all duration-[400ms] ease-out ${
            isOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[26px]'
          }`}
          aria-hidden
        />
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
