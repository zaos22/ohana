'use client';

import React from 'react';

interface FlagProps {
  code: string;
  className?: string;
}

export const FlagIcon: React.FC<FlagProps> = ({ code, className = 'w-6 h-4' }) => {
  switch (code) {
    case 'es':
      // Bandera de España (Rojo - Amarillo - Rojo)
      return (
        <svg viewBox="0 0 750 500" className={`inline-block rounded-[2px] shadow-sm ${className}`}>
          <rect width="750" height="500" fill="#AA151B" />
          <rect width="750" height="250" y="125" fill="#F1BF00" />
        </svg>
      );
    case 'en':
      // Bandera de Reino Unido (Union Jack)
      return (
        <svg viewBox="0 0 60 30" className={`inline-block rounded-[2px] shadow-sm ${className}`}>
          <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z"/>
          </clipPath>
          <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
          </clipPath>
          <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
      );
    case 'nl':
      // Bandera de Países Bajos / Holanda (Rojo - Blanco - Azul)
      return (
        <svg viewBox="0 0 9 6" className={`inline-block rounded-[2px] shadow-sm ${className}`}>
          <rect width="9" height="2" fill="#AE1C28" />
          <rect width="9" height="2" y="2" fill="#FFFFFF" />
          <rect width="9" height="2" y="4" fill="#21468B" />
        </svg>
      );
    case 'de':
      // Bandera de Alemania (Negro - Rojo - Dorado)
      return (
        <svg viewBox="0 0 5 3" className={`inline-block rounded-[2px] shadow-sm ${className}`}>
          <rect width="5" height="1" fill="#000000" />
          <rect width="5" height="1" y="1" fill="#DD0000" />
          <rect width="5" height="1" y="2" fill="#FFCE00" />
        </svg>
      );
    case 'fr':
      // Bandera de Francia (Azul - Blanco - Rojo)
      return (
        <svg viewBox="0 0 3 2" className={`inline-block rounded-[2px] shadow-sm ${className}`}>
          <rect width="1" height="2" fill="#002395" />
          <rect width="1" height="2" x="1" fill="#FFFFFF" />
          <rect width="1" height="2" x="2" fill="#ED2939" />
        </svg>
      );
    case 'ca':
      // Senyera (Català / Comunitat Valenciana) (4 barras rojas sobre fondo amarillo)
      return (
        <svg viewBox="0 0 810 540" className={`inline-block rounded-[2px] shadow-sm ${className}`}>
          <rect width="810" height="540" fill="#FCD116" />
          <rect width="810" height="60" y="60" fill="#D52B1E" />
          <rect width="810" height="60" y="180" fill="#D52B1E" />
          <rect width="810" height="60" y="300" fill="#D52B1E" />
          <rect width="810" height="60" y="420" fill="#D52B1E" />
        </svg>
      );
    default:
      return null;
  }
};
