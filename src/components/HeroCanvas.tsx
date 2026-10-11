'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TOTAL_FRAMES, mapearProgresoAFotograma } from '../../data/hero';

interface HeroCanvasProps {
  progreso: number; // 0.0 a 1.0
  onFrameChange?: (frameIndex: number) => void;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ progreso, onFrameChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVertical, setIsVertical] = useState<boolean>(false);

  // Sliding window memory cache: frameNum -> ImageBitmap
  const bitmapCache = useRef<Map<number, ImageBitmap>>(new Map());
  const loadingPromises = useRef<Map<number, Promise<ImageBitmap | null>>>(new Map());
  const lastRenderedFrame = useRef<number>(-1);
  const isReducedMotion = useRef<boolean>(false);

  // Check orientation and screen aspect ratio
  const checkOrientation = useCallback(() => {
    if (typeof window === 'undefined') return;
    const vertical = window.innerHeight > window.innerWidth;
    setIsVertical(vertical);
  }, []);

  useEffect(() => {
    checkOrientation();

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion.current = mediaQuery.matches;

    const handleMediaChange = (e: MediaQueryListEvent) => {
      isReducedMotion.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleResize = () => {
      checkOrientation();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const currentCache = bitmapCache.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      mediaQuery.removeEventListener('change', handleMediaChange);

      // Clean up all cached bitmaps on unmount
      currentCache.forEach((bitmap) => {
        try {
          bitmap.close();
        } catch {}
      });
      currentCache.clear();
    };
  }, [checkOrientation]);

  // Decode a single frame into ImageBitmap with sliding window cache
  const loadFrameBitmap = useCallback(
    async (frameNum: number, folder: 'desktop' | 'mobile'): Promise<ImageBitmap | null> => {
      if (bitmapCache.current.has(frameNum)) {
        return bitmapCache.current.get(frameNum)!;
      }

      if (loadingPromises.current.has(frameNum)) {
        return loadingPromises.current.get(frameNum)!;
      }

      const numStr = String(frameNum).padStart(4, '0');
      // Forzar recarga limpia del primer fotograma para evitar cache persistente del navegador
      const cacheBust = frameNum === 1 ? `?v=portada_${Date.now().toString().slice(0, 8)}` : '';
      const url = `/frames/${folder}/frame_${numStr}.webp${cacheBust}`;

      const promise = (async () => {
        try {
          const res = await fetch(url, { cache: frameNum === 1 ? 'no-cache' : 'force-cache' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          const bitmap = await createImageBitmap(blob);

          bitmapCache.current.set(frameNum, bitmap);

          // Clean up far frames (keep ~40 frames in sliding window)
          const MAX_CACHE_SIZE = 40;
          if (bitmapCache.current.size > MAX_CACHE_SIZE) {
            const keys = Array.from(bitmapCache.current.keys());
            // Sort by distance from current requested frame
            keys.sort((a, b) => Math.abs(b - frameNum) - Math.abs(a - frameNum));
            while (bitmapCache.current.size > MAX_CACHE_SIZE && keys.length > 0) {
              const farthest = keys.shift()!;
              const oldBm = bitmapCache.current.get(farthest);
              if (oldBm) {
                try {
                  oldBm.close();
                } catch {}
                bitmapCache.current.delete(farthest);
              }
            }
          }

          return bitmap;
        } catch (err) {
          console.warn(`Error loading frame ${frameNum}:`, err);
          return null;
        } finally {
          loadingPromises.current.delete(frameNum);
        }
      })();

      loadingPromises.current.set(frameNum, promise);
      return promise;
    },
    []
  );

  // Background preloader for upcoming frames in scroll direction
  const preloadNeighborFrames = useCallback(
    (currentFrame: number, folder: 'desktop' | 'mobile', direction: number = 1) => {
      // Preload 10 frames ahead, 4 behind
      const aheadCount = 10;
      const behindCount = 4;

      // Check Save-Data or slow connection
      const nav = navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } };
      const isSlow = nav.connection?.saveData || nav.connection?.effectiveType?.includes('2g');
      const step = isSlow ? 2 : 1;

      for (let i = 1; i <= aheadCount; i += step) {
        const next = currentFrame + i * (direction >= 0 ? 1 : -1);
        if (next >= 1 && next <= TOTAL_FRAMES && !bitmapCache.current.has(next)) {
          // Warm up HTTP cache with image element or fetch without decoding immediately
          const numStr = String(next).padStart(4, '0');
          const img = new Image();
          img.src = `/frames/${folder}/frame_${numStr}.webp`;
        }
      }

      for (let i = 1; i <= behindCount; i += step) {
        const prev = currentFrame - i * (direction >= 0 ? 1 : -1);
        if (prev >= 1 && prev <= TOTAL_FRAMES && !bitmapCache.current.has(prev)) {
          const numStr = String(prev).padStart(4, '0');
          const img = new Image();
          img.src = `/frames/${folder}/frame_${numStr}.webp`;
        }
      }
    },
    []
  );

  const progresoRef = useRef<number>(progreso);
  progresoRef.current = progreso;

  // Draw current frame on canvas with 'cover' fitting
  const renderFrame = useCallback(
    async (frameNum: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const folder: 'desktop' | 'mobile' = isVertical ? 'mobile' : 'desktop';

      let bitmap = bitmapCache.current.get(frameNum);
      if (!bitmap) {
        bitmap = (await loadFrameBitmap(frameNum, folder)) || undefined;
      }

      if (!bitmap || !canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Fill pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Cover logic
      const imgW = bitmap.width;
      const imgH = bitmap.height;
      const scale = Math.max(width / imgW, height / imgH);
      const scaledW = imgW * scale;
      const scaledH = imgH * scale;
      const offsetX = (width - scaledW) / 2;
      const offsetY = (height - scaledH) / 2;

      const p = progresoRef.current;
      // Transición suave muy breve y ligera (progreso entre 0.00 y 0.02)
      if (p > 0.001 && p < 0.025 && frameNum > 1) {
        const frame1Bitmap = bitmapCache.current.get(1);
        if (frame1Bitmap) {
          const portadaAlpha = Math.max(0, 1 - (p / 0.025));
          ctx.drawImage(bitmap, offsetX, offsetY, scaledW, scaledH);

          ctx.save();
          ctx.globalAlpha = portadaAlpha;
          const pImgW = frame1Bitmap.width;
          const pImgH = frame1Bitmap.height;
          const pScale = Math.max(width / pImgW, height / pImgH);
          const pScaledW = pImgW * pScale;
          const pScaledH = pImgH * pScale;
          const pOffsetX = (width - pScaledW) / 2;
          const pOffsetY = (height - pScaledH) / 2;
          ctx.drawImage(frame1Bitmap, pOffsetX, pOffsetY, pScaledW, pScaledH);
          ctx.restore();
        } else {
          ctx.drawImage(bitmap, offsetX, offsetY, scaledW, scaledH);
        }
      } else {
        ctx.drawImage(bitmap, offsetX, offsetY, scaledW, scaledH);
      }
      ctx.restore();

      lastRenderedFrame.current = frameNum;
      if (onFrameChange) onFrameChange(frameNum);
    },
    [isVertical, loadFrameBitmap, onFrameChange]
  );

  // Initial load of first frame
  useEffect(() => {
    const folder: 'desktop' | 'mobile' = isVertical ? 'mobile' : 'desktop';
    loadFrameBitmap(1, folder).then(() => {
      renderFrame(1);
      preloadNeighborFrames(1, folder, 1);
    });
  }, [isVertical, loadFrameBitmap, preloadNeighborFrames, renderFrame]);

  // Reactive scroll update
  useEffect(() => {
    const targetFrame = mapearProgresoAFotograma(progreso);
    const folder: 'desktop' | 'mobile' = isVertical ? 'mobile' : 'desktop';

    if (targetFrame !== lastRenderedFrame.current || progreso < 0.03) {
      const direction = targetFrame > lastRenderedFrame.current ? 1 : -1;
      renderFrame(targetFrame);
      preloadNeighborFrames(targetFrame, folder, direction);
    }
  }, [progreso, isVertical, renderFrame, preloadNeighborFrames]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block object-cover"
        style={{ backgroundColor: '#000000' }}
      />
    </div>
  );
};
