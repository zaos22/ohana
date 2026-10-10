'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown, Sparkles } from 'lucide-react';
import { TEXTOS } from '../../data/textos';
import { FOTOS } from '../../data/fotos';

interface TextScenesLayerProps {
  progreso: number; // 0.0 a 1.0 del hero
  onScrollToNext?: (id: string) => void;
}

export const TextScenesLayer: React.FC<TextScenesLayerProps> = ({ progreso, onScrollToNext }) => {
  // ESCENA I: 0.00 a 0.08
  const visibleEscena1 = progreso <= 0.08;
  const opacidad1 = visibleEscena1 ? 1 - progreso / 0.08 : 0;

  // ESCENA II: 0.08 a 0.18
  const visibleEscena2 = progreso >= 0.07 && progreso <= 0.18;
  let opacidad2 = 0;
  if (progreso >= 0.07 && progreso < 0.11) {
    opacidad2 = (progreso - 0.07) / 0.04;
  } else if (progreso >= 0.11 && progreso <= 0.15) {
    opacidad2 = 1;
  } else if (progreso > 0.15 && progreso <= 0.18) {
    opacidad2 = 1 - (progreso - 0.15) / 0.03;
  }

  // ESCENA V: 0.50 a 0.68
  const visibleEscena5 = progreso >= 0.50 && progreso <= 0.67;
  let opacidad5 = 0;
  if (progreso >= 0.50 && progreso < 0.54) {
    opacidad5 = (progreso - 0.50) / 0.04;
  } else if (progreso >= 0.54 && progreso <= 0.63) {
    opacidad5 = 1;
  } else if (progreso > 0.63 && progreso <= 0.67) {
    opacidad5 = 1 - (progreso - 0.63) / 0.04;
  }

  // ESCENA VI: 0.68 a 0.88 (El Clímax / Explosión)
  const visibleEscena6 = progreso >= 0.67 && progreso <= 0.87;
  let opacidad6 = 0;
  if (progreso >= 0.67 && progreso < 0.72) {
    opacidad6 = (progreso - 0.67) / 0.05;
  } else if (progreso >= 0.72 && progreso <= 0.82) {
    opacidad6 = 1;
  } else if (progreso > 0.82 && progreso <= 0.87) {
    opacidad6 = 1 - (progreso - 0.82) / 0.05;
  }

  // Destello cálido breve y sacudida sutil en el fotograma 76 (~0.68 a 0.73)
  const isFlashActive = progreso >= 0.675 && progreso <= 0.725;
  const flashIntensity = isFlashActive
    ? Math.sin(((progreso - 0.675) / 0.05) * Math.PI)
    : 0;

  // ESCENA VII: 0.88 a 1.00 (Somos Ohana)
  const visibleEscena7 = progreso >= 0.86;
  const opacidad7 = visibleEscena7 ? Math.min(1, (progreso - 0.86) / 0.07) : 0;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-hidden">
      {/* Destello cálido envolvente de la explosión */}
      {flashIntensity > 0.01 && (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,230,190,0.5)_0%,_rgba(205,198,184,0.2)_40%,_transparent_75%)] pointer-events-none mix-blend-screen transition-opacity duration-150"
          style={{ opacity: flashIntensity }}
          aria-hidden="true"
        />
      )}

      {/* ================= ESCENA I: GÉNESIS (0 - 8%) ================= */}
      {visibleEscena1 && opacidad1 > 0.01 && (
        <section
          id="escena-1"
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-300 pointer-events-none"
          style={{
            opacity: opacidad1,
            transform: `translateY(${(1 - opacidad1) * -30}px)`
          }}
          aria-label="Escena I: Apertura"
        >
          {/* Sutil viñeta para legibilidad sin oscurecer la foto de portada */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40 pointer-events-none -z-10" />

          <div className="mb-8 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-white/20" />
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-[var(--color-crema-dim)]">
              {TEXTOS.escena1.badge}
            </span>
            <span className="w-8 h-[1px] bg-white/20" />
          </div>

          <div className="max-w-4xl mx-auto flex flex-col items-center space-y-2">
            <h1 className="font-playfair text-[38px] sm:text-[54px] lg:text-[68px] text-[var(--color-crema)] font-semibold tracking-tight leading-[1.08]">
              {TEXTOS.escena1.linea1}
            </h1>
            <h2 className="font-playfair text-[34px] sm:text-[48px] lg:text-[60px] text-[var(--color-crema-muted)] italic font-normal tracking-tight leading-[1.08]">
              {TEXTOS.escena1.linea2}
            </h2>
            <p className="font-caveat text-[30px] sm:text-[42px] lg:text-[48px] text-[var(--color-crema-dim)] font-normal tracking-wide mt-6 leading-none drop-shadow-sm">
              {TEXTOS.escena1.citaManuscrita}
            </p>
          </div>

          <div className="absolute bottom-10 flex flex-col items-center gap-3 text-[var(--color-crema-dim)] animate-pulse">
            <span className="font-jakarta text-[11px] uppercase tracking-[0.2em] text-[var(--text-subtle)]">
              {TEXTOS.escena1.indicadorScroll}
            </span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent" />
            <ArrowDown size={16} className="-mt-1" />
          </div>
        </section>
      )}

      {/* ================= ESCENA II: EL DESPERTAR (8 - 18%) ================= */}
      {visibleEscena2 && opacidad2 > 0.01 && (
        <section
          id="escena-2"
          className="absolute inset-0 flex flex-col items-center justify-end pb-20 sm:pb-24 px-6 text-center transition-all duration-300 pointer-events-none"
          style={{
            opacity: opacidad2,
            transform: `translateY(${(1 - opacidad2) * 20}px)`
          }}
          aria-label="Escena II: El Despertar"
        >
          {/* Degradado oscuro detrás del texto para contraste */}
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none -z-10" />

          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-4">
            <span className="font-jakarta text-[11px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
              {TEXTOS.escena2.badge}
            </span>
            <h2 className="font-playfair italic text-[24px] sm:text-[32px] text-[var(--color-crema)] tracking-wide font-light">
              {TEXTOS.escena2.titulo}
            </h2>
            <button
              onClick={() => onScrollToNext && onScrollToNext('escena-3')}
              className="inline-flex items-center gap-2 text-[var(--text-subtle)] hover:text-white font-jakarta text-[11px] uppercase tracking-widest transition-colors pt-2 cursor-pointer pointer-events-auto"
            >
              <span>{TEXTOS.escena2.botonContinuar}</span>
              <ArrowDown size={14} />
            </button>
          </div>
        </section>
      )}

      {/* ================= ESCENA V: VÓRTICE (50 - 68%) ================= */}
      {visibleEscena5 && opacidad5 > 0.01 && (
        <section
          id="escena-5"
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-all duration-300 pointer-events-none"
          style={{
            opacity: opacidad5,
            transform: `translateY(${(1 - opacidad5) * 20}px)`
          }}
          aria-label="Escena V: Vórtice"
        >
          {/* Halo sutil de fondo */}
          <div className="absolute w-96 h-96 rounded-full bg-[var(--color-zafiro)]/15 blur-[120px] pointer-events-none -z-10" />
          <div className="bg-black/60 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-white/5 max-w-2xl mx-auto flex flex-col items-center space-y-4 shadow-2xl">
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-[var(--color-botanico)]">
              {TEXTOS.escena5.badge}
            </span>
            <h3 className="font-playfair text-[26px] sm:text-[36px] text-[var(--color-crema)] font-medium leading-tight">
              {TEXTOS.escena5.linea1}
            </h3>
            <p className="font-playfair italic text-[18px] sm:text-[22px] text-[var(--color-crema-muted)] font-normal">
              {TEXTOS.escena5.linea2}
            </p>
            <span className="font-jakarta text-[10px] uppercase tracking-widest text-[var(--text-subtle)] pt-2">
              Los granos convergen en la extracción
            </span>
          </div>
        </section>
      )}

      {/* ================= ESCENA VI: EL CLÍMAX (68 - 88%) ================= */}
      {visibleEscena6 && opacidad6 > 0.01 && (
        <section
          id="escena-6"
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-all duration-300 pointer-events-none"
          style={{
            opacity: opacidad6,
            transform: `translateY(${(1 - opacidad6) * 20}px)`
          }}
          aria-label="Escena VI: El Clímax"
        >
          <div className="bg-black/70 backdrop-blur-md p-8 sm:p-14 rounded-3xl border border-white/10 max-w-2xl mx-auto flex flex-col items-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[var(--color-zafiro)] flex items-center justify-center shadow-[0_0_36px_rgba(47,62,158,0.7)] text-[var(--color-crema)]">
              <Sparkles size={26} />
            </div>
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-[var(--color-crema-dim)]">
              {TEXTOS.escena6.badge}
            </span>
            <h2 className="font-playfair text-[34px] sm:text-[46px] lg:text-[54px] text-[var(--color-crema)] font-semibold leading-tight">
              {TEXTOS.escena6.linea1}
            </h2>
            <p className="font-playfair italic text-[20px] sm:text-[26px] text-[var(--color-crema-muted)]">
              {TEXTOS.escena6.linea2}
            </p>
            <button
              onClick={() => onScrollToNext && onScrollToNext('escena-8')}
              className="mt-4 px-6 py-3 rounded-full bg-[var(--color-zafiro)] hover:bg-[var(--color-zafiro-hover)] text-[var(--color-crema)] font-jakarta text-[12px] font-semibold uppercase tracking-wider transition-all shadow-lg hover:scale-105 cursor-pointer pointer-events-auto flex items-center gap-2"
            >
              <span>{TEXTOS.escena6.botonContinuar}</span>
              <ArrowDown size={14} />
            </button>
          </div>
        </section>
      )}

      {/* ================= ESCENA VII: IDENTIDAD (88 - 100%) ================= */}
      {visibleEscena7 && opacidad7 > 0.01 && (
        <section
          id="escena-7"
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-all duration-500 pointer-events-none"
          style={{
            opacity: opacidad7,
            transform: `translateY(${(1 - opacidad7) * 30}px)`
          }}
          aria-label="Escena VII: Identidad Ohana"
        >
          {/* Degradado oscuro detrás para contraste óptimo */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none -z-10" />

          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto space-y-6">
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-[var(--color-botanico)]">
              {TEXTOS.escena7.badge}
            </span>

            {/* Sello circular oficial con gema de zafiro */}
            <div className="relative group my-2">
              <div className="absolute -inset-3 bg-[var(--color-zafiro)]/40 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border border-white/20 shadow-[0_12px_48px_-8px_rgba(47,62,158,0.5)]">
                <Image
                  src={FOTOS.logo.src}
                  alt={FOTOS.logo.alt}
                  fill
                  sizes="224px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Monumental Title */}
            <h2 className="font-playfair text-[36px] sm:text-[52px] lg:text-[64px] text-[var(--color-crema)] font-semibold tracking-tight leading-tight">
              Somos <span className="italic font-normal text-[var(--color-crema-muted)]">Ohana</span>, bienvenido
            </h2>

            {/* Cita en manuscrita Caveat */}
            <p className="font-caveat text-[26px] sm:text-[34px] lg:text-[38px] text-[var(--color-crema-dim)] font-normal max-w-2xl leading-snug">
              {TEXTOS.escena7.fraseMarca}
            </p>

            <button
              onClick={() => onScrollToNext && onScrollToNext('escena-8')}
              className="mt-6 px-6 py-3 rounded-full bg-white/10 hover:bg-[var(--color-zafiro)] text-[var(--color-crema)] font-jakarta text-[11px] uppercase tracking-widest transition-all shadow-md flex items-center gap-2 cursor-pointer pointer-events-auto"
            >
              <span>{TEXTOS.escena7.indicadorScroll}</span>
              <ArrowDown size={14} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
