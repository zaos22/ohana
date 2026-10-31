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
    <section
      aria-label="Selección Ohana: Galería de especialidades"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-25"
      style={
        {
          opacity: isActive ? 1 : 0,
          visibility: isActive ? 'visible' : 'hidden',
          transition: 'opacity 0.25s ease-out',
          // Variables responsivas sincronizadas tanto en ancho (vw) como en alto disponible (dvh)
          '--header-h': '80px',
          '--letterbox-top': 'clamp(32px, 5.5dvh, 56px)',
          '--letterbox-bottom': 'clamp(36px, 6.5dvh, 64px)',
          '--polaroid-w': 'clamp(168px, min(66vw, calc((100dvh - 224px) * 0.54)), 312px)',
          '--polaroid-gap': 'clamp(24px, min(5vw, 4.5dvh), 64px)'
        } as React.CSSProperties
      }
      aria-hidden={!isActive}
    >
      {/* ── BANDA NEGRA SUPERIOR (CINEMA LETTERBOX) ADAPTADA AL NAVBAR (80px) ── */}
      <header
        className="absolute left-0 w-full z-35 transition-transform duration-75 pointer-events-none shadow-2xl backdrop-blur-sm"
        style={{
          top: 'var(--header-h)',
          height: 'var(--letterbox-top)',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          transform: `translateY(${-100 + letterboxFactor * 100}%)`
        }}
      >
        <div
          className="w-full max-w-[1440px] mx-auto h-full flex items-center justify-between gap-4 px-6 lg:px-12 text-[10px] sm:text-xs font-jakarta tracking-[0.2em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="flex items-center gap-2 font-medium whitespace-nowrap">
            <span
              className="w-2 h-2 rounded-full animate-pulse shrink-0"
              style={{ backgroundColor: 'var(--color-botanico)' }}
            />
            <span>Selección Ohana</span>
          </span>
          <span
            className="font-jakarta text-[10px] sm:text-[11px] hidden sm:inline tracking-[0.18em] whitespace-nowrap truncate"
            style={{ color: 'var(--text-subtle)' }}
          >
            ESPECTRO GASTRONÓMICO · BENICARLÓ
          </span>
        </div>
      </header>

      {/* ── BANDA NEGRA INFERIOR (CINEMA LETTERBOX) ── */}
      <footer
        className="absolute bottom-0 left-0 w-full z-35 transition-transform duration-75 pointer-events-none shadow-2xl backdrop-blur-sm"
        style={{
          height: 'var(--letterbox-bottom)',
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-subtle)',
          transform: `translateY(${100 - letterboxFactor * 100}%)`
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto h-full flex items-center justify-center px-6 text-center">
          <p
            className="font-garamond italic text-xs sm:text-sm md:text-base truncate"
            style={{ color: 'var(--color-crema-muted)' }}
          >
            Desliza para recorrer cada rincón de nuestra carta
          </p>
        </div>
      </footer>

      {/* ── CONTENEDOR DE LA FILA HORIZONTAL DE POLAROIDS (ACOTADO ENTRE LAS DOS FRANJAS) ── */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center overflow-hidden"
        style={{
          top: 'calc(var(--header-h) + var(--letterbox-top))',
          bottom: 'var(--letterbox-bottom)',
          opacity: containerOpacity
        }}
      >
        <div
          className="flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
          style={{
            gap: 'var(--polaroid-gap)',
            // Centra matemáticamente la polaroid focal usando las mismas variables de ancho + gap
            transform: `translateX(calc(${2 - focalIndex} * (var(--polaroid-w) + var(--polaroid-gap))))`
          }}
        >
          {ITEMS.map((item, idx) => {
            // Distancia del elemento al foco actual (0 = exactamente centrado)
            const dist = Math.abs(focalIndex - idx);

            // Factor de foco gaussiano / suavizado: 1 cuando dist=0, decayendo a 0 cuando dist >= 1.2
            const focusStrength = Math.max(0, 1 - Math.min(dist, 1.2) / 1.2);

            // ZOOM IN controlado (máx 1.10) para que nunca invada las franjas cinematográficas
            const scale = 0.78 + 0.32 * Math.pow(focusStrength, 1.4);

            // Opacidad: nítida al frente (1.0), más tenue a los lados (0.50)
            const itemOpacity = 0.50 + 0.50 * focusStrength;

            // Rotación: se alinea más derecha cuando está enfocada, y mantiene su inclinación lúdica al estar en fila
            const rotate = item.defaultRotate * (1 - 0.7 * focusStrength);

            // Z-Index: la que está enfocada con zoom in se superpone por encima de las adyacentes
            const zIndex = Math.round(focusStrength * 30) + 10;

            // Filtro de desenfoque de profundidad de campo cinematográfico (Depth of Field)
            const blurAmount = (1 - focusStrength) * 3;

            return (
              <figure
                key={item.id}
                className="flex-shrink-0 transition-all duration-150 ease-out select-none m-0"
                style={{
                  width: 'var(--polaroid-w)',
                  zIndex,
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  opacity: itemOpacity,
                  filter: `blur(${blurAmount}px)`
                }}
              >
                <div
                  className={`polaroid-frame w-full rounded-[4px] transition-shadow duration-300 ${
                    focusStrength > 0.7
                      ? 'shadow-[0_24px_48px_rgba(0,0,0,0.85)] ring-1 ring-white/30'
                      : 'shadow-[0_14px_28px_rgba(0,0,0,0.65)]'
                  }`}
                  style={{
                    padding: 'clamp(8px, 1.4dvh, 16px)',
                    paddingBottom: 'clamp(14px, 2.4dvh, 24px)'
                  }}
                >
                  {/* Foto de la Polaroid */}
                  <div className="relative aspect-square w-full overflow-hidden bg-black/10 rounded-[3px]">
                    <Image
                      src={item.foto.src}
                      alt={item.foto.alt}
                      fill
                      sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 312px"
                      className="object-cover transition-transform duration-500"
                      priority
                    />
                  </div>

                  {/* Pie de foto manuscrito auténtico */}
                  <figcaption className="pt-2 sm:pt-3 text-center">
                    <span
                      className="font-caveat font-bold tracking-wide block leading-[1.08] line-clamp-2"
                      style={{
                        color: 'var(--color-espresso)',
                        fontSize: 'clamp(20px, min(4.5vw, 3.4dvh), 32px)'
                      }}
                    >
                      {item.foto.titulo}
                    </span>
                    {item.foto.pie && (
                      <span
                        className="font-garamond block mt-1 leading-snug line-clamp-2"
                        style={{
                          color: 'var(--color-espresso-surface)',
                          opacity: 0.85,
                          fontSize: 'clamp(11px, min(2.6vw, 1.75dvh), 14px)'
                        }}
                      >
                        {item.foto.pie}
                      </span>
                    )}
                  </figcaption>
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};
