'use client';

/**
 * Flacon croquis parfumeur — line art SVG, stroke-dash reveal.
 */
export function FlaconLineArt({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <style>{`
          .flacon-line-art-path {
            stroke: #1A1614;
            stroke-width: 1.35;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
            stroke-dasharray: 520;
            stroke-dashoffset: 520;
            animation: flaconLineDraw 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .flacon-line-art-path {
              animation: none;
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </defs>
      <path
        className="flacon-line-art-path"
        d="M 100 32 C 128 32 148 48 152 72 L 156 118 C 158 142 168 168 168 198 C 168 232 142 252 100 252 C 58 252 32 232 32 198 C 32 168 42 142 44 118 L 48 72 C 52 48 72 32 100 32 Z"
      />
      <path
        className="flacon-line-art-path"
        style={{ animationDelay: '0.12s' }}
        d="M 100 32 L 100 18 M 78 18 L 122 18 Q 130 18 130 26 L 130 32"
      />
      <path
        className="flacon-line-art-path"
        style={{ animationDelay: '0.22s' }}
        d="M 52 118 Q 100 128 148 118"
      />
    </svg>
  );
}
