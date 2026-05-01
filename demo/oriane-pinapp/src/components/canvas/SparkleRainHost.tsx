'use client';

import { useGpuSparkleSettings } from '../../hooks/useGpuSparkleSettings';
import { useScrollVelocityRef } from '../../hooks/useScrollVelocity';
import { SparkleRain } from './SparkleRain';

/** Monte la pluie globale + hook scroll (sans re-render à chaque frame). */
export function SparkleRainHost() {
  const scrollVelocityRef = useScrollVelocityRef();
  const { sparkleCount, isMobile } = useGpuSparkleSettings();

  return (
    <div
      className="sparkle-rain-host"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        zIndex: 5,
        pointerEvents: 'none',
        margin: 0,
        padding: 0,
      }}
    >
      <SparkleRain
        scrollVelocityRef={scrollVelocityRef}
        sparkleCount={sparkleCount}
        isMobile={isMobile}
      />
    </div>
  );
}
