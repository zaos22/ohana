'use client';

import React from 'react';
import Image from 'next/image';
import { FOTOS } from '../../data/fotos';
import { TEXTOS } from '../../data/textos';

interface MiniHeroesLayerProps {
  progreso: number; // 0.0 a 1.0 del hero
  onJumpToProgress?: (p: number) => void;
}

export const MiniHeroesLayer: React.FC<MiniHeroesLayerProps> = ({ progreso, onJumpToProgress }) => {
  // Escena IV transcurre entre 0.22 y 0.50
  // Puntos clave de expansión de cada variante:
  // Tab 0 (Café): ~0.24 (activo 0.22 - 0.29)
  // Tab 1 (Tostada de plátano): ~0.31 (activo 0.29 - 0.36)
  // Tab 2 (Smoothies naturales): ~0.38 (activo 0.36 - 0.43)
  // Tab 3 (Nuestro rincón): ~0.45 (activo 0.43 - 0.50)

  const isVisible = progreso >= 0.22 && progreso <= 0.50;

  let activeIndex = 0;
  if (progreso >= 0.43) {
    activeIndex = 3;
  } else if (progreso >= 0.36) {
    activeIndex = 2;
  } else if (progreso >= 0.29) {
    activeIndex = 1;
  } else {
    activeIndex = 0;
  }

  const items = [
    { id: 'cafe', foto: FOTOS.espressoArtesanal, tag: 'Especialidad de la casa', jump: 0.25 },
    { id: 'platano', foto: FOTOS.tostadaPlatano, tag: 'Desayuno artesano', jump: 0.32 },
    { id: 'smoothies', foto: FOTOS.smoothiesNaturales, tag: 'Frescura pura', jump: 0.39 },
    { id: 'rincon', foto: FOTOS.nuestroRincon, tag: 'Atmósfera acogedora', jump: 0.46 }
  ];

  const currentTab = TEXTOS.escena4.tabs[activeIndex];
  const currentItem = items[activeIndex];

  // Calcular opacidad y escala de entrada/salida general de la escena
  let containerOpacity = 1;
  if (progreso < 0.25) {
    containerOpacity = (progreso - 0.22) / 0.03;
  } else if (progreso > 0.47) {
    containerOpacity = Math.max(0, 1 - (progreso - 0.47) / 0.03);
  }

  if (!isVisible && containerOpacity <= 0) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 pointer-events-none z-30 transition-opacity duration-300"
      style={{ opacity: Math.max(0, Math.min(1, containerOpacity)) }}
      aria-hidden={!isVisible}
    >
      <div className="max-w-5xl w-full mx-auto relative pointer-events-auto flex flex-col items-center">
        {/* Cabecera de Escena IV */}
        <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="font-jakarta text-[11px] uppercase tracking-[0.2em] text-[var(--color-crema-dim)]">
              {TEXTOS.escena4.badge}
            </span>
            <span className="text-white/20">/</span>
            <span className="font-playfair text-[18px] sm:text-[20px] text-[var(--color-crema)] font-normal">
              {TEXTOS.escena4.titulo}
            </span>
          </div>
          <span className="font-jakarta text-[10px] uppercase tracking-widest text-[var(--text-subtle)] hidden sm:inline">
            {TEXTOS.escena4.subtitulo}
          </span>
        </div>

        {/* 4 Pestañas Clicables con Scroll Horizontal en móvil */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 overflow-x-auto max-w-full py-1 scrollbar-none">
          {TEXTOS.escena4.tabs.map((tab, idx) => {
            const isTabActive = idx === activeIndex;
            return (
              <button
                key={tab.id}
                onClick={() => onJumpToProgress && onJumpToProgress(items[idx].jump)}
                className={`px-4 sm:px-5 py-2 rounded-full font-jakarta text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isTabActive
                    ? 'bg-[var(--color-zafiro)] text-[var(--color-crema)] shadow-[0_4px_16px_rgba(47,62,158,0.5)] scale-105'
                    : 'bg-white/10 text-[var(--color-crema-dim)] hover:bg-white/15 hover:text-white'
                }`}
                aria-pressed={isTabActive}
              >
                {tab.etiqueta}
              </button>
            );
          })}
        </div>

        {/* Tarjeta Expandida Split (~60% viewport ancho) */}
        <div className="w-full bg-[var(--color-espresso-dark)]/90 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Foto con ratio armónico */}
            <div className="md:col-span-7 relative h-56 sm:h-72 lg:h-96 w-full rounded-xl overflow-hidden bg-black/40">
              <Image
                src={currentItem.foto.src}
                alt={currentItem.foto.alt}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>

            {/* Texto depurado (sin afirmaciones no verificadas) */}
            <div className="md:col-span-5 flex flex-col justify-center space-y-3">
              <span className="font-jakarta text-[10px] uppercase tracking-[0.25em] text-[var(--color-botanico)]">
                {currentItem.tag}
              </span>
              <h3 className="font-playfair text-[26px] sm:text-[32px] lg:text-[38px] text-[var(--color-crema)] leading-tight font-medium">
                {currentTab.titulo}
              </h3>
              <p className="font-playfair italic text-[16px] sm:text-[18px] text-[var(--color-crema-muted)] font-normal pt-1">
                {currentTab.descripcion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
