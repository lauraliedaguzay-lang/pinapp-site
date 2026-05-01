'use client';

import { useGpuSparkleSettings } from '../../hooks/useGpuSparkleSettings';
import { useScrollVelocityRef } from '../../hooks/useScrollVelocity';
import { SparkleRain } from './SparkleRain';

/** Monte la pluie globale + hook scroll (sans re-render à chaque frame). */
export function SparkleRainHost() {
  const scrollVelocityRef = useScrollVelocityRef();
  const { sparkleCount, isMobile } = useGpuSparkleSettings();

  return (
    <SparkleRain
      scrollVelocityRef={scrollVelocityRef}
      sparkleCount={sparkleCount}
      isMobile={isMobile}
    />
  );
}
