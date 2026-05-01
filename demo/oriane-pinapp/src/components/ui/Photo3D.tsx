'use client';

import { memo, useEffect, useRef } from 'react';

type Props = {
  photoUrl: string;
  photoAlt: string;
  glowColor: string;
  filterCSS: string;
  index: number;
  /** Quand false : pas de boucle rAF (perf panneaux invisibles). */
  active: boolean;
};

const PI = Math.PI;

function Photo3DInner({
  photoUrl,
  photoAlt,
  glowColor,
  filterCSS,
  index,
  active,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const tiltTargetRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const gyroTargetRef = useRef({ x: 0, y: 0 });
  const gyroSmoothedRef = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const isMobileRef = useRef(false);
  const activeRef = useRef(active);

  activeRef.current = active;

  /** filterCSS du brief : 'none' = pas de filtre sur l’image. */
  const imgFilter = filterCSS === 'none' ? undefined : filterCSS;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      isMobileRef.current = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 768) return;
    if (typeof window.DeviceOrientationEvent === 'undefined') return;

    const DO = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
    };
    if (typeof DO.requestPermission === 'function') {
      console.warn(
        '[ORIANE Photo3D] DeviceOrientation sur iOS 13+ peut nécessiter une interaction utilisateur (requestPermission). Tap dédié = polish ultérieure.',
      );
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!activeRef.current) return;
      if (e.beta == null || e.gamma == null) return;
      const tiltY = Math.max(-15, Math.min(15, e.gamma));
      const tiltX = Math.max(-10, Math.min(10, (e.beta - 45) / 3));
      gyroTargetRef.current = { x: -tiltX, y: tiltY };
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () =>
      window.removeEventListener('deviceorientation', handleOrientation, true);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const photo = photoRef.current;
    if (!wrap || !photo) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rafRef.current = null;
      if (!activeRef.current) return;

      const t = performance.now() / 1000;
      const baseY = Math.sin(t + (index * PI) / 3) * 8;
      const baseX = Math.cos(t * 0.7 + (index * PI) / 3) * 4;

      const mobile = isMobileRef.current;
      let rx: number;
      let ry: number;

      if (mobile) {
        const gT = gyroTargetRef.current;
        const gS = gyroSmoothedRef.current;
        gS.x = lerp(gS.x, gT.x, 0.14);
        gS.y = lerp(gS.y, gT.y, 0.14);
        rx = baseX + gS.x;
        ry = baseY + gS.y;
      } else {
        const target = tiltTargetRef.current;
        const cur = tiltRef.current;
        const smooth = hoveringRef.current ? 0.18 : 0.12;
        cur.x = lerp(cur.x, target.x, smooth);
        cur.y = lerp(cur.y, target.y, smooth);
        rx = baseX + cur.x;
        ry = baseY + cur.y;
      }

      photo.style.transform = `translate3d(0,0,0) rotateX(${rx}deg) rotateY(${ry}deg)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      if (isMobileRef.current) return;
      if (!hoveringRef.current) return;
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      tiltTargetRef.current = { x: -ny * 40, y: nx * 40 };
    };

    const onEnter = () => {
      if (isMobileRef.current) return;
      hoveringRef.current = true;
    };

    const onLeave = () => {
      hoveringRef.current = false;
      tiltTargetRef.current = { x: 0, y: 0 };
    };

    wrap.addEventListener('pointerenter', onEnter);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('pointermove', onMove, { passive: true });

    if (active) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('pointermove', onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [active, index]);

  return (
    <div
      ref={wrapRef}
      className="photo-3d-wrap w-full touch-manipulation"
      style={{ perspective: '1500px' }}
    >
      <div
        ref={photoRef}
        className="photo-3d relative w-full will-change-transform [transform-style:preserve-3d] [aspect-ratio:3/4]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="pointer-events-none absolute inset-[-50px] -z-10 blur-[40px]"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
          }}
          aria-hidden
        />
        <div className="relative h-full w-full overflow-hidden shadow-[0_30px_80px_rgba(10,8,5,0.2)]">
          <img
            src={photoUrl}
            alt={photoAlt}
            data-gallery-index={index}
            className="block h-full w-full object-cover"
            style={imgFilter ? { filter: imgFilter } : undefined}
            loading="lazy"
            decoding="async"
            width={800}
            height={1067}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10, 8, 5, 0.4) 0%, rgba(10, 8, 5, 0.7) 100%)',
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

export const Photo3D = memo(Photo3DInner);
