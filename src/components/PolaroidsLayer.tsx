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
  defaultRotate: number;
  centerProgreso: number; // Momento exacto en el que esta polaroid está en el centro con zoom in máximo
}

const ITEMS: PolaroidItem[] = [
  {
    id: 'cafe',
    foto: FOTOS.espressoArtesanal,
    defaultRotate: -3,
    centerProgreso: 0.20
  },
  {
    id: 'platano',
    foto: FOTOS.tostadaPlatano,
    defaultRotate: 2.5,
    centerProgreso: 0.27
  },
  {
    id: 'brie',
    foto: FOTOS.tostadaBrieMiel,
    defaultRotate: -2,
    centerProgreso: 0.34
  },
  {
    id: 'vitrina',
    foto: FOTOS.bolleriaVitrina,
    defaultRotate: 3,
    centerProgreso: 0.41
  },
  {
    id: 'smoothies',
    foto: FOTOS.smoothiesNaturales,
    defaultRotate: -1.5,
    centerProgreso: 0.48
  }
];

export const PolaroidsLayer: React.FC<PolaroidsLayerProps> = ({ progreso }) => {
  // Tramo activo total de la experiencia cinematográfica
  const isActive = progreso >= 0.15 && progreso <= 0.52;

  // Animación de entrada y salida de las bandas negras de cine (Letterbox)
  // Entran entre 0.15 y 0.18, se mantienen hasta 0.49, y se retiran entre 0.49 y 0.52
  let letterboxFactor = 0;
  if (progreso >= 0.15 && progreso < 0.18) {
    letterboxFactor = (progreso - 0.15) / 0.03;
  } else if (progreso >= 0.18 && progreso <= 0.49) {
    letterboxFactor = 1;
  } else if (progreso > 0.49 && progreso <= 0.52) {
    letterboxFactor = 1 - (progreso - 0.49) / 0.03;
  }
  letterboxFactor = Math.max(0, Math.min(1, letterboxFactor));

  // Opacidad global de la fila de polaroids
  const containerOpacity = letterboxFactor;

  // Cálculo del desplazamiento horizontal de la fila:
  // Se anima en el tramo de 0.17 a 0.49.
  // Cuando progreso está en 0.17, el foco empieza en la primera polaroid (índice 0).
  // A medida que avanza hasta 0.49, recorre suavemente hasta la última (índice 4).
  const startP = 0.17;
  const endP = 0.49;
  const clampedP = Math.max(startP, Math.min(endP, progreso));
  const progressRatio = (clampedP - startP) / (endP - startP); // 0.0 a 1.0 exacto
  const focalIndex = progressRatio * (ITEMS.length - 1); // 0.0 a 4.0

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-25"
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: 'opacity 0.25s ease-out'
      }}
      aria-hidden={!isActive}
    >
      {/* ── BANDA NEGRA SUPERIOR (CINEMA LETTERBOX) ADAPTADA AL NAVBAR (h-20 / 80px) ── */}
      <div
        className="absolute top-20 left-0 w-full bg-black/95 border-b border-white/10 z-35 transition-transform duration-75 pointer-events-none shadow-2xl backdrop-blur-sm"
        style={{
          height: 'clamp(38px, 7vh, 64px)',
          transform: `translateY(${-100 + letterboxFactor * 100}%)`
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto h-full flex items-center justify-between px-6 lg:px-12 text-[var(--color-crema)]/70 text-xs sm:text-sm font-sans tracking-widest uppercase">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Selección Ohana
          </span>
          <span className="font-mono text-[11px] text-[var(--color-crema)]/40 hidden sm:inline tracking-wider">
            ESPECTRO GASTRONÓMICO · BENICARLÓ
          </span>
        </div>
      </div>

      {/* ── BANDA NEGRA INFERIOR (CINEMA LETTERBOX) ── */}
      <div
        className="absolute bottom-0 left-0 w-full bg-black/95 border-t border-white/10 z-35 transition-transform duration-75 pointer-events-none shadow-2xl backdrop-blur-sm"
        style={{
          height: 'clamp(42px, 8vh, 76px)',
          transform: `translateY(${100 - letterboxFactor * 100}%)`
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto h-full flex items-center justify-center px-4 text-center">
          <p className="font-garamond italic text-[var(--color-crema-muted)] text-sm sm:text-base">
            Desliza para recorrer cada rincón de nuestra carta
          </p>
        </div>
      </div>

      {/* ── CONTENEDOR DE LA FILA HORIZONTAL DE POLAROIDS ── */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        style={{ opacity: containerOpacity }}
      >
        <div
          className="flex items-center justify-center gap-8 sm:gap-14 md:gap-20 transition-transform duration-100 ease-out will-change-transform"
          style={{
            // Centra exactamente la polaroid focal en el eje de la pantalla sin deformaciones ni saltos bruscos
            transform: `translateX(calc(${(2 - focalIndex)} * clamp(270px, 32vw, 380px)))`
          }}
        >
          {ITEMS.map((item, idx) => {
            // Distancia del elemento al foco actual (0 = exactamente centrado)
            const dist = Math.abs(focalIndex - idx);

            // Factor de foco gaussiano / suavizado: 1 cuando dist=0, decayendo a 0 cuando dist >= 1.2
            const focusStrength = Math.max(0, 1 - Math.min(dist, 1.2) / 1.2);

            // ZOOM IN cuando se enfoca (1.18 en desktop / 1.15 en móvil), ZOOM OUT a distancia (0.75 - 0.8)
            const scale = 0.76 + 0.40 * Math.pow(focusStrength, 1.4);

            // Opacidad: nítida al frente (1.0), más tenue a los lados (0.55 - 0.65)
            const itemOpacity = 0.50 + 0.50 * focusStrength;

            // Rotación: se alinea más derecha cuando está enfocada, y mantiene su inclinación lúdica al estar en fila
            const rotate = item.defaultRotate * (1 - 0.7 * focusStrength);

            // Z-Index: la que está enfocada con zoom in se superpone por encima de las adyacentes
            const zIndex = Math.round(focusStrength * 30) + 10;

            // Filtro de desenfoque de profundidad de campo cinematográfico (Depth of Field)
            const blurAmount = (1 - focusStrength) * 3;

            return (
              <div
                key={item.id}
                className="flex-shrink-0 transition-all duration-150 ease-out select-none"
                style={{
                  zIndex,
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  opacity: itemOpacity,
                  filter: `blur(${blurAmount}px)`
                }}
              >
                <div
                  className={`polaroid-frame p-2.5 pb-5 sm:p-4 sm:pb-8 rounded-[4px] w-[215px] xs:w-[240px] sm:w-[300px] md:w-[350px] transition-shadow duration-300 ${
                    focusStrength > 0.7
                      ? 'shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,248,240,0.15)] ring-1 ring-white/30'
                      : 'shadow-[0_15px_30px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {/* Foto de la Polaroid */}
                  <div className="relative aspect-square w-full overflow-hidden bg-black/10 rounded-[3px]">
                    <Image
                      src={item.foto.src}
                      alt={item.foto.alt}
                      fill
                      sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, 350px"
                      className="object-cover transition-transform duration-500"
                      priority
                    />
                  </div>

                  {/* Pie de foto manuscrito auténtico */}
                  <div className="pt-3 sm:pt-4 text-center">
                    <span className="font-caveat text-[26px] sm:text-[32px] md:text-[36px] font-bold text-[#1E1713] tracking-wide block leading-none">
                      {item.foto.titulo}
                    </span>
                    {item.foto.pie && (
                      <span className="font-garamond text-[13px] sm:text-[15px] text-[#5A4B42] block mt-1 leading-snug">
                        {item.foto.pie}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
