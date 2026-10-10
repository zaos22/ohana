'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X, MessageCircle } from 'lucide-react';
import { FOTOS } from '../../data/fotos';

interface HeaderProps {
  escenaActual: number; // 1 a 8
}

export const Header: React.FC<HeaderProps> = ({ escenaActual }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hola, quisiera reservar una mesa en Ohana Cafetería para el día ___ a las ___ para ___ personas.'
      )}`
    : null;

  const escenaStr = String(Math.min(8, Math.max(1, escenaActual))).padStart(2, '0');
  const progresoPorcentaje = (Math.min(8, Math.max(1, escenaActual)) / 8) * 100;

  const scrollToSection = (id: string) => {
    setDrawerOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/5 transition-all duration-300"
        role="banner"
      >
        <div className="h-20 max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          {/* Logo y Marca */}
          <button
            onClick={() => scrollToSection('escena-1')}
            className="flex items-center gap-4 shrink-0 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-zafiro)] rounded-lg p-1"
            aria-label="Ir al inicio de Ohana Cafetería"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 shadow-[0_0_12px_rgba(47,62,158,0.3)]">
              <Image
                src={FOTOS.logo.src}
                alt={FOTOS.logo.alt}
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair text-[22px] text-[var(--color-crema)] font-medium tracking-wide leading-none">
                Ohana
              </span>
              <span className="font-jakarta text-[10px] uppercase text-[var(--text-subtle)] tracking-widest mt-1">
                Cafetería · Benicarló
              </span>
            </div>
          </button>

          {/* Indicador de Escena (01 / 08) en Escritorio */}
          <div
            className="hidden md:flex flex-col items-center gap-1.5 flex-1 max-w-xs mx-auto"
            aria-label={`Escena actual: ${escenaStr} de 08`}
          >
            <div className="flex items-center justify-between w-full font-jakarta text-[11px] font-semibold tracking-wider text-[var(--color-crema-dim)]">
              <span className="text-[var(--color-crema)]">{escenaStr}</span>
              <span className="text-white/20">/</span>
              <span className="text-[var(--text-subtle)]">08</span>
            </div>
            {/* Barra de progreso de escena */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-zafiro)] transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(47,62,158,0.8)]"
                style={{ width: `${progresoPorcentaje}%` }}
              />
            </div>
            {/* Puntos de escena */}
            <div className="flex items-center gap-1.5 mt-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === escenaActual
                      ? 'bg-[var(--color-zafiro)] scale-125 shadow-[0_0_6px_rgba(47,62,158,0.9)]'
                      : i < escenaActual
                      ? 'bg-[var(--color-crema-muted)] opacity-60'
                      : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navegación y Acciones */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollToSection('escena-8')}
              className="font-jakarta text-[12px] font-semibold tracking-wider uppercase text-[var(--color-crema-dim)] hover:text-white px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Horario & Info
            </button>

            {/* Botón Reservar WhatsApp */}
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-jakarta text-[12px] font-semibold tracking-wider uppercase bg-[var(--color-zafiro)] hover:bg-[var(--color-zafiro-hover)] text-[var(--color-crema)] px-4 py-2.5 rounded-lg transition-all shadow-[0_4px_20px_-2px_rgba(47,62,158,0.4)] flex items-center gap-2 hover:scale-[1.02]"
                id="header-reservar-btn"
              >
                <MessageCircle size={15} />
                <span>Reservar</span>
              </a>
            ) : (
              <button
                disabled
                className="font-jakarta text-[12px] font-semibold tracking-wider uppercase bg-white/10 text-white/40 px-4 py-2.5 rounded-lg cursor-not-allowed flex items-center gap-2"
                title="Número de WhatsApp no configurado"
                id="header-reservar-btn-disabled"
              >
                <MessageCircle size={15} />
                <span>Reservar</span>
              </button>
            )}

            {/* Botón de Menú Móvil */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 text-[var(--color-crema)] hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Lateral */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />

        {/* Panel lateral */}
        <aside
          className={`absolute top-0 right-0 bottom-0 w-full max-w-sm bg-[var(--color-espresso)] border-l border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-out ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación lateral"
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                  <Image
                    src={FOTOS.logo.src}
                    alt={FOTOS.logo.alt}
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-playfair text-[20px] text-[var(--color-crema)] block leading-none">
                    Ohana
                  </span>
                  <span className="font-jakarta text-[9px] uppercase text-[var(--text-subtle)] tracking-wider">
                    Benicarló
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-8 space-y-2">
              <span className="font-jakarta text-[10px] uppercase tracking-[0.2em] text-[var(--text-subtle)] block mb-3">
                Navegación
              </span>
              {[
                { label: '01 · Apertura (Génesis)', id: 'escena-1' },
                { label: '02 · El Despertar', id: 'escena-2' },
                { label: '03 · Lluvia y Polaroids', id: 'escena-3' },
                { label: '04 · Enfoque de Detalle', id: 'escena-4' },
                { label: '05 · Vórtice', id: 'escena-5' },
                { label: '06 · El Clímax', id: 'escena-6' },
                { label: '07 · Somos Ohana', id: 'escena-7' },
                { label: '08 · Horario & Contacto', id: 'escena-8' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left py-2.5 px-3 rounded-lg font-jakarta text-[13px] text-[var(--color-crema-dim)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[var(--color-zafiro)] hover:bg-[var(--color-zafiro-hover)] text-[var(--color-crema)] font-jakarta text-[13px] font-semibold uppercase tracking-wider transition-all shadow-md"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Reservas</span>
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 text-center text-[var(--text-subtle)] font-jakarta text-[11px]">
                Configurar NEXT_PUBLIC_WHATSAPP
              </div>
            )}
            <p className="text-center font-jakarta text-[10px] text-[var(--text-subtle)] mt-3 uppercase tracking-widest">
              Carrer del Cronista Viciana, 1
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};
