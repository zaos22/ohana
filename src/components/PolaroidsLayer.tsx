'use client';

import React from 'react';
import Image from 'next/image';
import { FOTOS } from '../../data/fotos';

interface PolaroidsLayerProps {
  progreso: number; // 0.0 a 1.0 del hero
}

interface PolaroidItem {
  id: string;
  foto: typeof FOTOS.espressoArtesanal;
  side: 'left' | 'right';
  rotation: number;
  // Entra entre inStart e inEnd, visible hasta outStart, sale en outEnd
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
  topPct: number;
  leftOrRightOffset: string; // ej: 'left-4 lg:left-12' o 'right-4 lg:right-16'
}

const POLAROIDS: PolaroidItem[] = [
  {
    id: 'cafe',
    foto: FOTOS.espressoArtesanal,
    side: 'left',
    rotation: -4,
    inStart: 0.14,
    inEnd: 0.18,
    outStart: 0.44,
    outEnd: 0.49,
    topPct: 8,
    leftOrRightOffset: 'left-4 lg:left-12'
  },
  {
    id: 'platano',
    foto: FOTOS.tostadaPlatano,
    side: 'left',
    rotation: 4,
    inStart: 0.18,
    inEnd: 0.23,
    outStart: 0.44,
    outEnd: 0.49,
    topPct: 50,
    leftOrRightOffset: 'left-8 lg:left-24'
  },
  {
    id: 'brie',
    foto: FOTOS.tostadaBrieMiel,
    side: 'right',
    rotation: 3,
    inStart: 0.15,
    inEnd: 0.20,
    outStart: 0.44,
    outEnd: 0.49,
    topPct: 6,
    leftOrRightOffset: 'right-4 lg:right-16'
  },
  {
    id: 'vitrina',
    foto: FOTOS.bolleriaVitrina,
    side: 'right',
    rotation: -5,
    inStart: 0.19,
    inEnd: 0.24,
    outStart: 0.44,
    outEnd: 0.49,
    topPct: 38,
    leftOrRightOffset: 'right-12 lg:right-32'
  },
  {
    id: 'smoothies',
    foto: FOTOS.smoothiesNaturales,
    side: 'right',
    rotation: 2,
    inStart: 0.21,
    inEnd: 0.26,
    outStart: 0.44,
    outEnd: 0.49,
    topPct: 64,
    leftOrRightOffset: 'right-6 lg:right-20'
  }
];

export const PolaroidsLayer: React.FC<PolaroidsLayerProps> = ({ progreso }) => {
  // Se renderiza de forma activa entre 0.13 y 0.52
  const isActive = progreso >= 0.13 && progreso <= 0.52;

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!isActive}
    >
      <div className="relative w-full h-full max-w-[1440px] mx-auto overflow-hidden">
        {/* Barra superior de Escena III */}
        <div
          className={`absolute top-24 left-6 right-6 lg:left-12 lg:right-12 z-20 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-3 transition-opacity duration-300 ${
            progreso >= 0.18 && progreso <= 0.46 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-jakarta text-[11px] uppercase tracking-[0.2em] text-[var(--color-crema-dim)]">
              Escena III
            </span>
            <span className="text-white/20">/</span>
            <span className="font-playfair text-[20px] text-[var(--color-crema)] font-normal">
              Lluvia de Granos & Memorias
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-jakarta text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">
            <span>Pasa el cursor por las polaroids para interactuar · Desliza para continuar</span>
          </div>
        </div>

        {/* 5 Polaroids orquestadas */}
        {POLAROIDS.map((p) => {
          let opacity = 0;
          let translateY = 40;
          let scale = 0.95;

          if (progreso < p.inStart) {
            opacity = 0;
            translateY = 40;
          } else if (progreso >= p.inStart && progreso < p.inEnd) {
            const t = (progreso - p.inStart) / (p.inEnd - p.inStart);
            opacity = t;
            translateY = 40 * (1 - t);
            scale = 0.95 + 0.05 * t;
          } else if (progreso >= p.inEnd && progreso <= p.outStart) {
            // Cuando los mini heroes están en pantalla completa (0.24 - 0.46), atenuar las polaroids laterales
            if (progreso >= 0.24 && progreso <= 0.44) {
              opacity = 0.35;
            } else {
              opacity = 1;
            }
            translateY = 0;
            scale = 1;
          } else if (progreso > p.outStart && progreso <= p.outEnd) {
            const t = (progreso - p.outStart) / (p.outEnd - p.outStart);
            opacity = (1 - t) * 0.35;
            translateY = -40 * t;
            scale = 1 - 0.05 * t;
          } else {
            opacity = 0;
          }

          if (opacity <= 0.01) return null;

          return (
            <div
              key={p.id}
              className={`absolute ${p.leftOrRightOffset} z-20 pointer-events-auto transition-transform duration-300 group`}
              style={{
                top: `${p.topPct}%`,
                opacity,
                transform: `translateY(${translateY}px) rotate(${p.rotation}deg) scale(${scale})`
              }}
            >
              <div className="polaroid-frame p-2.5 pb-4 lg:p-3 lg:pb-5 rounded-[3px] w-[170px] sm:w-[220px] lg:w-[260px] group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative aspect-square w-full overflow-hidden bg-black/10 rounded-[2px]">
                  <Image
                    src={p.foto.src}
                    alt={p.foto.alt}
                    fill
                    sizes="(max-width: 640px) 170px, (max-width: 1024px) 220px, 260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="pt-2 lg:pt-3 text-center">
                  <span className="font-caveat text-[20px] sm:text-[24px] lg:text-[26px] font-bold text-[#1E1713] tracking-wide block leading-none">
                    {p.foto.titulo}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
