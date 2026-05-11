'use client';

interface Props {
  progress: number; // 0-1, scroll progress de la scène
}

export function FlaconSVGIllustration({ progress }: Props) {
  // Draw-on stroke effect : 0 → 0.15 du scroll
  const strokeProgress = Math.min(1, progress / 0.15);
  const dashOffset = (1 - strokeProgress) * 1000;

  return (
    <svg
      width="320"
      height="500"
      viewBox="0 0 320 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 30px rgba(244, 201, 119, 0.3))' }}
    >
      {/* Capuchon */}
      <path
        d="M 130 30 L 190 30 Q 195 30 195 35 L 195 100 L 125 100 L 125 35 Q 125 30 130 30 Z"
        stroke="#D4A574"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="1000"
        strokeDashoffset={dashOffset}
      />

      {/* Goulot */}
      <path
        d="M 145 100 L 145 130 L 175 130 L 175 100"
        stroke="#D4A574"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="1000"
        strokeDashoffset={dashOffset}
      />

      {/* Corps du flacon — courbes élégantes */}
      <path
        d="M 130 130 Q 100 140 95 200 L 95 420 Q 95 450 125 450 L 195 450 Q 225 450 225 420 L 225 200 Q 220 140 190 130 Z"
        stroke="#F4C977"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="1000"
        strokeDashoffset={dashOffset}
      />

      {/* Liquide intérieur */}
      <path
        d={`M 100 ${250 - progress * 30} L 220 ${250 - progress * 30} L 220 445 Q 220 448 217 448 L 103 448 Q 100 448 100 445 Z`}
        fill="url(#liquidGradient)"
        opacity={0.5}
      />

      {/* Étiquette ORIANE */}
      <text
        x="160"
        y="320"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontSize="24"
        fill="#F4E4C1"
        opacity={Math.min(1, Math.max(0, (progress - 0.05) * 4))}
      >
        ORIANE
      </text>
      <line
        x1="120" y1="335" x2="200" y2="335"
        stroke="#D4A574"
        strokeWidth="0.5"
        opacity={Math.min(1, Math.max(0, (progress - 0.05) * 4))}
      />
      <text
        x="160"
        y="358"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="9"
        letterSpacing="3"
        fill="#D4A574"
        opacity={Math.min(1, Math.max(0, (progress - 0.08) * 4))}
      >
        EAU DE PARFUM
      </text>

      {/* Reflet sur le verre */}
      <path
        d="M 110 200 Q 105 280 110 380"
        stroke="#F4E4C1"
        strokeWidth="1"
        fill="none"
        opacity={0.3}
        strokeDasharray="1000"
        strokeDashoffset={dashOffset}
      />

      <defs>
        <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F4C977" stopOpacity="0.6" />
          <stop offset="50%"  stopColor="#D4A574" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4A1F1F" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
