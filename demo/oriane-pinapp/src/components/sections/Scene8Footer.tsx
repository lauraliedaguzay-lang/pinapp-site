'use client';

export function Scene8Footer() {
  return (
    <footer className="relative flex min-h-[50vh] flex-col items-center justify-center bg-noir-profond px-[6vw] py-16 text-center">
      <div className="font-display text-[3rem] font-light italic tracking-[0.15em] text-or-liquide md:text-[3.5rem]">
        M · O
      </div>
      <div className="mx-auto mt-6 h-px w-20 bg-or-pur" aria-hidden />
      <p className="mt-8 font-body text-[0.7rem] font-extralight uppercase tracking-[0.4em] text-or-pale" style={{ fontWeight: 200 }}>
        Production Pinapp Studio · Bordeaux 2026
      </p>
    </footer>
  );
}
