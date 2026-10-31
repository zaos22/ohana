'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TOTAL_FRAMES, mapearProgresoAFotograma } from '../../data/hero';

interface HeroCanvasProps {
  progreso: number; // 0.0 a 1.0
  onFrameChange?: (frameIndex: number) => void;
  onLoadProgress?: (loaded: number, total: number) => void;
  onLoadComplete?: () => void;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  progreso,
  onFrameChange,
  onLoadProgress,
  onLoadComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVertical, setIsVertical] = useState<boolean>(false);

  // Cache de Blobs en memoria para los 109 fotogramas (~15-25 MB total) para evitar re-descargas de red
  const blobCache = useRef<Map<string, Blob>>(new Map());
  // Sliding window memory cache de ImageBitmaps decodificados en GPU: frameNum -> ImageBitmap
  const bitmapCache = useRef<Map<number, ImageBitmap>>(new Map());
  const loadingPromises = useRef<Map<number, Promise<ImageBitmap | null>>>(new Map());
  const lastRenderedFrame = useRef<number>(-1);
  const isReducedMotion = useRef<boolean>(false);
  const initialFolderRef = useRef<'desktop' | 'mobile' | null>(null);

  const onLoadProgressRef = useRef(onLoadProgress);
  onLoadProgressRef.current = onLoadProgress;
  const onLoadCompleteRef = useRef(onLoadComplete);
  onLoadCompleteRef.current = onLoadComplete;

  // Check orientation and screen aspect ratio
  const checkOrientation = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const vertical = window.innerHeight > window.innerWidth;
    setIsVertical(vertical);
    return vertical;
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
    const currentBlobs = blobCache.current;
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
      currentBlobs.clear();
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
      const blobKey = `${folder}_${frameNum}`;
      const url = `/frames/${folder}/frame_${numStr}.webp`;

      const promise = (async () => {
        try {
          let blob = blobCache.current.get(blobKey);
          if (!blob) {
            const res = await fetch(url, { cache: 'force-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            blob = await res.blob();
            blobCache.current.set(blobKey, blob);
          }

          const bitmap = await createImageBitmap(blob);
          bitmapCache.current.set(frameNum, bitmap);

          // En escritorio mantenemos los 109 frames decodificados; en móvil una ventana amplia de 55 frames
          const MAX_CACHE_SIZE = folder === 'desktop' ? TOTAL_FRAMES : 55;
          if (bitmapCache.current.size > MAX_CACHE_SIZE) {
            const keys = Array.from(bitmapCache.current.keys()).filter((k) => k !== 1);
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
      const aheadCount = 12;
      const behindCount = 4;

      for (let i = 1; i <= aheadCount; i++) {
        const next = currentFrame + i * (direction >= 0 ? 1 : -1);
        if (next >= 1 && next <= TOTAL_FRAMES && !bitmapCache.current.has(next)) {
          loadFrameBitmap(next, folder);
        }
      }

      for (let i = 1; i <= behindCount; i++) {
        const prev = currentFrame - i * (direction >= 0 ? 1 : -1);
        if (prev >= 1 && prev <= TOTAL_FRAMES && !bitmapCache.current.has(prev)) {
          loadFrameBitmap(prev, folder);
        }
      }
    },
    [loadFrameBitmap]
  );

  const progresoRef = useRef<number>(progreso);
  progresoRef.current = progreso;

  // Draw current frame on canvas with 'cover' fitting
  const renderFrame = useCallback(
    async (frameNum: number, explicitFolder?: 'desktop' | 'mobile') => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const folder: 'desktop' | 'mobile' = explicitFolder ?? (isVertical ? 'mobile' : 'desktop');

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
          const portadaAlpha = Math.max(0, 1 - p / 0.025);
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

  // Precarga completa de los 109 fotogramas del Hero al iniciar (ejecución única al montar)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vertical = window.innerHeight > window.innerWidth;
    const folder: 'desktop' | 'mobile' = vertical ? 'mobile' : 'desktop';
    initialFolderRef.current = folder;

    let cancelled = false;
    let loadedCount = 0;

    const notifyProgress = () => {
      if (cancelled) return;
      loadedCount += 1;
      if (onLoadProgressRef.current) {
        onLoadProgressRef.current(loadedCount, TOTAL_FRAMES);
      }
      if (loadedCount >= TOTAL_FRAMES && onLoadCompleteRef.current) {
        onLoadCompleteRef.current();
      }
    };

    const preloadSingleFrame = async (frameNum: number) => {
      const numStr = String(frameNum).padStart(4, '0');
      const blobKey = `${folder}_${frameNum}`;
      const url = `/frames/${folder}/frame_${numStr}.webp`;

      try {
        let blob = blobCache.current.get(blobKey);
        if (!blob) {
          const res = await fetch(url, { cache: 'force-cache' });
          if (res.ok) {
            blob = await res.blob();
            blobCache.current.set(blobKey, blob);
          }
        }

        // Decodificar en ImageBitmap todos en desktop o los primeros 40 en móvil para respuesta inmediata
        if (blob && (folder === 'desktop' || frameNum <= 40)) {
          if (!bitmapCache.current.has(frameNum)) {
            const bitmap = await createImageBitmap(blob);
            bitmapCache.current.set(frameNum, bitmap);
          }
        }

        if (frameNum === 1 && !cancelled) {
          renderFrame(1, folder);
        }
      } catch (err) {
        console.warn(`Preload warning on frame ${frameNum}:`, err);
      } finally {
        notifyProgress();
      }
    };

    const runFullPreload = async () => {
      // Cargar primero el fotograma 1 para pintar el lienzo de inmediato
      await preloadSingleFrame(1);

      // Cola concurrente (10 workers en paralelo) para los fotogramas 2..109
      const queue: number[] = [];
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        queue.push(i);
      }

      const CONCURRENCY = 10;
      const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (queue.length > 0 && !cancelled) {
          const nextFrame = queue.shift();
          if (nextFrame !== undefined) {
            await preloadSingleFrame(nextFrame);
          }
        }
      });

      await Promise.all(workers);
    };

    runFullPreload();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si cambia la orientación tras el montaje inicial, limpiar caché de bitmaps y re-renderizar
  useEffect(() => {
    const folder: 'desktop' | 'mobile' = isVertical ? 'mobile' : 'desktop';
    if (initialFolderRef.current && initialFolderRef.current !== folder) {
      initialFolderRef.current = folder;
      bitmapCache.current.forEach((bm) => {
        try {
          bm.close();
        } catch {}
      });
      bitmapCache.current.clear();
      const currentTarget = mapearProgresoAFotograma(progresoRef.current);
      loadFrameBitmap(currentTarget, folder).then(() => {
        renderFrame(currentTarget, folder);
      });
    }
  }, [isVertical, loadFrameBitmap, renderFrame]);

  // Reactive scroll update
  useEffect(() => {
    const targetFrame = mapearProgresoAFotograma(progreso);
    const folder: 'desktop' | 'mobile' = isVertical ? 'mobile' : 'desktop';

    if (targetFrame !== lastRenderedFrame.current || progreso < 0.03) {
      const direction = targetFrame > lastRenderedFrame.current ? 1 : -1;
      renderFrame(targetFrame, folder);
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
