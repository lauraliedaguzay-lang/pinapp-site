'use client';

import { useEffect, useMemo, useState } from 'react';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

type Props = {
  text: string;
  delay: number;
  /** Classes sur le wrapper (typo + couleur finale héritée par les lettres révélées). */
  className?: string;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomScrambleChar() {
  return SCRAMBLE_CHARS[randomInt(0, SCRAMBLE_CHARS.length - 1)] ?? '?';
}

export function ScrambleText({ text, delay, className = '' }: Props) {
  const schedules = useMemo(() => {
    return text.split('').map((ch) => {
      if (ch === ' ') return { isSpace: true, start: 0, end: 0 };
      const start = randomInt(0, 30);
      const end = start + randomInt(0, 30);
      return { isSpace: false, start, end };
    });
  }, [text]);

  const [chars, setChars] = useState<string[]>(() =>
    text.split('').map((ch) => (ch === ' ' ? ' ' : '\u00A0')),
  );

  useEffect(() => {
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
        if (frame < s.end) return randomScrambleChar();
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
