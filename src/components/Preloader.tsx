'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TOTAL_FRAMES } from '../../data/hero';
import { FOTOS } from '../../data/fotos';

interface PreloaderProps {
  loadedFrames: number;
  totalFrames?: number;
  isComplete: boolean;
  onExitComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  loadedFrames,
  totalFrames = TOTAL_FRAMES,
  isComplete,
  onExitComplete
}) => {
  const overlayRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lineFillRef = useRef<HTMLDivElement | null>(null);
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const animatedValueRef = useRef<{ val: number }>({ val: 0 });
  const hasTriggeredExitRef = useRef<boolean>(false);

  const rawPercent = Math.min(100, Math.round((loadedFrames / Math.max(1, totalFrames)) * 100));

  // Precargar en segundo plano las fotografías de las Polaroids mientras cargan los 109 fotogramas
  useEffect(() => {
    if (typeof window === 'undefined') return;
    Object.values(FOTOS).forEach((foto) => {
      const img = new window.Image();
      img.src = foto.src;
    });
  }, []);

  // Suavizar la interpolación del contador y de la línea fina de carga
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setDisplayPercent(rawPercent);
      if (lineFillRef.current) {
        lineFillRef.current.style.transform = `scaleX(${rawPercent / 100})`;
      }
      return;
    }

    gsap.to(animatedValueRef.current, {
      val: rawPercent,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        const current = Math.round(animatedValueRef.current.val);
        setDisplayPercent(current);
        if (lineFillRef.current) {
          lineFillRef.current.style.transform = `scaleX(${animatedValueRef.current.val / 100})`;
        }
      }
    });
  }, [rawPercent]);

  // Animación de salida editorial al completar los 109 fotogramas
  useEffect(() => {
    if (!isComplete || hasTriggeredExitRef.current) return;
    hasTriggeredExitRef.current = true;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      onExitComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onExitComplete();
      }
    });

    // Asegurar que llegue al 100% visualmente antes de levantar el telón editorial
    tl.to(animatedValueRef.current, {
      val: 100,
      duration: 0.25,
      ease: 'power2.out',
      onUpdate: () => {
        const current = Math.round(animatedValueRef.current.val);
        setDisplayPercent(current);
        if (lineFillRef.current) {
          lineFillRef.current.style.transform = `scaleX(${animatedValueRef.current.val / 100})`;
        }
      }
    });

    if (contentRef.current) {
      tl.to(
        contentRef.current,
        {
          y: -24,
          opacity: 0,
          duration: 0.55,
          ease: 'power3.inOut'
        },
        '+=0.15'
      );
    }

    if (overlayRef.current) {
      tl.to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: 'power4.inOut'
        },
        '-=0.3'
      );
    }
  }, [isComplete, onExitComplete]);

  // Frase editorial según el tramo de carga
  const getEditorialStage = (pct: number): string => {
    if (pct < 30) return 'Seleccionando el grano en origen';
    if (pct < 68) return 'Ajustando el punto de molienda';
    if (pct < 96) return 'Extrayendo la crema artesanal';
    return 'Experiencia lista para servir';
  };

  const formattedPercent = String(displayPercent).padStart(2, '0');
  const formattedFrames = `${String(Math.min(totalFrames, loadedFrames)).padStart(3, '0')} / ${String(
    totalFrames
  ).padStart(3, '0')}`;

  return (
    <section
      ref={overlayRef}
      role="status"
      aria-live="polite"
      aria-busy={!isComplete}
      aria-label="Cargando experiencia visual de Ohana Cafetería"
      className="fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-8 lg:p-12 select-none overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Sutil atmósfera editorial de fondo con variables CSS */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, var(--color-espresso-surface) 0%, var(--bg-primary) 70%)',
          opacity: 0.75
        }}
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
        style={{
          backgroundColor: 'var(--color-zafiro-glow)',
          opacity: 0.25
        }}
        aria-hidden="true"
      />

      {/* Cabecera editorial minimalista */}
      <header className="relative z-10 w-full max-w-[1440px] mx-auto flex items-center justify-between">
        <span
          className="font-jakarta text-[10px] sm:text-[11px] uppercase tracking-[0.24em]"
          style={{ color: 'var(--text-subtle)' }}
        >
          Ohana Cafetería
        </span>
        <span
          className="font-jakarta text-[10px] sm:text-[11px] uppercase tracking-[0.24em]"
          style={{ color: 'var(--text-subtle)' }}
        >
          Benicarló · Castelló
        </span>
      </header>

      {/* Bloque central: Tipografía Playfair / Caveat + Línea fina de carga */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center px-4"
      >
        <p
          className="font-jakarta text-[10px] uppercase tracking-[0.3em] mb-4"
          style={{ color: 'var(--text-subtle)' }}
        >
          Edición Sensorial · 01 — 08
        </p>

        <h1
          className="font-playfair text-[44px] sm:text-[60px] lg:text-[72px] font-normal tracking-tight leading-none"
          style={{ color: 'var(--color-crema)' }}
        >
          Ohana <span className="italic font-light" style={{ color: 'var(--color-crema-muted)' }}>Cafetería</span>
        </h1>

        <p
          className="font-caveat text-[28px] sm:text-[34px] mt-4 leading-none"
          style={{ color: 'var(--color-crema-dim)' }}
        >
          “cada sorbo es diferente”
        </p>

        {/* Línea fina editorial de progreso (1px) */}
        <div className="w-full mt-10 mb-4">
          <progress
            value={displayPercent}
            max={100}
            className="sr-only"
            aria-label="Porcentaje de fotogramas cargados"
          >
            {displayPercent}%
          </progress>

          <div
            className="relative w-full h-[1px] overflow-hidden"
            style={{ backgroundColor: 'var(--border-subtle)' }}
            aria-hidden="true"
          >
            <div
              ref={lineFillRef}
              className="h-full w-full origin-left"
              style={{
                backgroundColor: 'var(--color-crema)',
                boxShadow: '0 0 12px var(--color-zafiro-glow)',
                transform: 'scaleX(0)'
              }}
            />
          </div>
        </div>

        {/* Metadatos de progreso bajo la línea */}
        <div className="w-full flex items-baseline justify-between gap-4 mt-2">
          <span
            className="font-garamond italic text-[15px] sm:text-[17px] tracking-wide text-left"
            style={{ color: 'var(--text-muted)' }}
          >
            {getEditorialStage(displayPercent)}
          </span>

          <output
            className="font-playfair text-[20px] sm:text-[24px] tabular-nums tracking-tight shrink-0"
            style={{ color: 'var(--color-crema)' }}
          >
            {formattedPercent}
            <span
              className="text-[13px] ml-1 font-jakarta font-light"
              style={{ color: 'var(--text-subtle)' }}
            >
              %
            </span>
          </output>
        </div>
      </div>

      {/* Pie editorial minimalista con contador de fotogramas */}
      <footer className="relative z-10 w-full max-w-[1440px] mx-auto flex items-center justify-between">
        <span
          className="font-jakarta text-[10px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-subtle)' }}
        >
          Secuencia · {formattedFrames}
        </span>
        <span
          className="font-garamond italic text-[13px]"
          style={{ color: 'var(--text-subtle)' }}
        >
          Carrer del Cronista Viciana, 1
        </span>
      </footer>
    </section>
  );
};

