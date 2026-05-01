'use client';

import { useEffect, useMemo, useState } from 'react';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

type Props = {
  text: string;
  delay: number;
  /** Classes sur le wrapper (typo + couleur finale héritée par les lettres révélées). */
  className?: string;
};

/** Déterministe SSR/client (évite mismatch hydration). */
function seededInt(seed: number, min: number, max: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  const r = x - Math.floor(x);
  return min + Math.floor(r * (max - min + 1));
}

function scrambleCharFromSeed(seed: number) {
  const i = seededInt(seed, 0, SCRAMBLE_CHARS.length - 1);
  return SCRAMBLE_CHARS[i] ?? '?';
}

export function ScrambleText({ text, delay, className = '' }: Props) {
  const schedules = useMemo(() => {
    return text.split('').map((ch, i) => {
      if (ch === ' ') return { isSpace: true, start: 0, end: 0 };
      const seed = i * 7919 + text.length * 31;
      const start = seededInt(seed, 0, 30);
      const end = start + seededInt(seed + 1, 0, 30);
      return { isSpace: false, start, end };
    });
  }, [text]);

  /** Premier paint identique SSR et client : texte final (pas de nbsp aléatoire). */
  const [chars, setChars] = useState<string[]>(() => text.split(''));

  useEffect(() => {
    setChars(text.split('').map((ch) => (ch === ' ' ? ' ' : '\u00A0')));
    let frame = 0;
    let rafId = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      frame += 1;
      const next = text.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        const s = schedules[i]!;
        if (s.isSpace) return ' ';
        if (frame < s.start) return '\u00A0';
        if (frame < s.end) return scrambleCharFromSeed(frame * 1000 + i);
        return ch;
      });
      setChars(next);

      const done = text.split('').every((ch, i) => {
        if (ch === ' ') return true;
        const s = schedules[i]!;
        return frame >= s.end;
      });
      if (!done) {
        rafId = requestAnimationFrame(step);
      }
    };

    const t = window.setTimeout(() => {
      if (!cancelled) rafId = requestAnimationFrame(step);
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      cancelAnimationFrame(rafId);
    };
  }, [text, delay, schedules]);

  return (
    <span className={`inline-block ${className}`.trim()}>
      {chars.map((ch, i) => {
        const target = text[i]!;
        if (target === ' ') {
          return <span key={i}> </span>;
        }
        const isPending = ch === '\u00A0';
        const isFinal = ch === target;
        const isScramble = !isPending && !isFinal;

        return (
          <span
            key={i}
            style={
              isScramble ? { color: 'rgba(212, 165, 116, 0.7)' } : undefined
            }
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}
