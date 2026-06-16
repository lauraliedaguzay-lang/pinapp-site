import { useEffect, useState } from 'react';

export type GpuSparkleSettings = {
  isLowEnd: boolean;
  isMobile: boolean;
  sparkleCount: number;
  latheSegments: number;
};

const defaultSettings: GpuSparkleSettings = {
  isLowEnd: false,
  isMobile: false,
  sparkleCount: 800,
  latheSegments: 64,
};

export function useGpuSparkleSettings(): GpuSparkleSettings {
  const [s, setS] = useState<GpuSparkleSettings>(defaultSettings);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mobile = window.innerWidth < 768;

    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    let renderer = '';
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
      }
    }
    const isLowEnd = /Intel UHD|Mali|Adreno [3-5]\d{2}/i.test(renderer);
    const base = isLowEnd ? 250 : 800;
    const count = mobile ? Math.min(300, base) : base;

    setS({
      isLowEnd,
      isMobile: mobile,
      sparkleCount: count,
      latheSegments: isLowEnd ? 32 : 64,
    });
  }, []);

  return s;
}
