'use client';

import React from 'react';
import Image from 'next/image';
import { NEGOCIO } from '../../data/negocio';
import { FOTOS } from '../../data/fotos';

export const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = React.useState<number>(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hola, quisiera reservar una mesa en Ohana Cafetería para el día ___ a las ___ para ___ personas.'
      )}`
    : '#escena-8';

  return (
    <footer
      className="w-full bg-[#120D0A] py-14 px-6 lg:px-14 border-t border-white/5 text-[var(--color-crema)]"
      role="contentinfo"
      aria-label="Pie de página"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Identidad con Logo y Dirección corregida */}
        <div className="flex items-center gap-4">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0">
            <Image
              src={FOTOS.logo.src}
              alt={FOTOS.logo.alt}
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-playfair text-[20px] text-[var(--color-crema)] font-medium leading-tight">
              {NEGOCIO.nombre}
            </span>
            <span className="font-garamond text-[15px] text-[var(--text-subtle)]">
              {NEGOCIO.direccion.calle}, {NEGOCIO.direccion.ciudad} · {NEGOCIO.direccion.provincia}
            </span>
          </div>
        </div>

        {/* Enlaces de navegación rápida */}
        <nav
          className="flex flex-wrap items-center justify-center gap-6 font-jakarta text-[11px] tracking-wider uppercase text-[var(--color-crema-dim)]"
          aria-label="Enlaces de navegación del pie"
        >
          <button
            onClick={() => scrollToSection('escena-8')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Horario
          </button>
          <button
            onClick={() => scrollToSection('escena-8')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Ubicación
          </button>
          <button
            onClick={() => scrollToSection('escena-8')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Métodos de pago
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors cursor-pointer"
          >
            WhatsApp
          </a>
          <a
            href={NEGOCIO.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Instagram
          </a>
        </nav>

        {/* Copyright y Localización dinámica sin textos superfluos */}
        <div className="text-center md:text-right font-jakarta text-[11px] tracking-widest text-[var(--text-subtle)] uppercase">
          <p>© {currentYear} {NEGOCIO.nombre.toUpperCase()}</p>
          <p className="mt-1 text-[10px] text-white/30">
            {NEGOCIO.direccion.ciudad.toUpperCase()}
          </p>
        </div>
      </div>
    </footer>
  );
};
