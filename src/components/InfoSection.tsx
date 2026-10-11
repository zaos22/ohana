'use client';

import React, { useEffect, useState } from 'react';
import {
  Clock,
  MapPin,
  Camera,
  CreditCard,
  Smartphone,
  Navigation,
  MessageCircle,
  Car
} from 'lucide-react';
import { NEGOCIO } from '../../data/negocio';
import {
  HORARIOS_SEMANALES,
  obtenerEstadoEnVivo,
  EstadoEnVivo
} from '../../data/horarios';

export const InfoSection: React.FC = () => {
  const [estado, setEstado] = useState<EstadoEnVivo | null>(null);

  useEffect(() => {
    // Cálculo inicial
    setEstado(obtenerEstadoEnVivo());

    // Actualización reactiva cada 30 segundos
    const timer = setInterval(() => {
      setEstado(obtenerEstadoEnVivo());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
  const isDev = process.env.NODE_ENV === 'development';
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hola, quisiera reservar una mesa en Ohana Cafetería para el día ___ a las ___ para ___ personas.'
      )}`
    : null;

  // Días de la semana ordenados: 1 (Lunes) a 6 (Sábado), y 0 (Domingo) al final
  const diasOrdenados = [1, 2, 3, 4, 5, 6, 0];

  return (
    <section
      id="escena-8"
      className="relative w-full bg-[var(--color-espresso)] text-[var(--color-crema)] py-20 px-6 lg:px-14 overflow-hidden border-t border-white/5"
      aria-label="Escena VIII: Horario e Información Esencial"
    >
      {/* Decoración superior con transición de granos y degradado */}
      <div
        className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none opacity-60 flex items-center justify-around px-8"
        aria-hidden="true"
      >
        <div className="w-3 h-5 rounded-full bg-[#100704] rotate-45" />
        <div className="w-4 h-6 rounded-full bg-[#0a0402] -rotate-12" />
        <div className="w-3 h-5 rounded-full bg-[#150a05] rotate-30" />
        <div className="w-4 h-6 rounded-full bg-[#0e0603] -rotate-45" />
        <div className="w-3 h-5 rounded-full bg-[#120704] rotate-15" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col">
        {/* Cabecera de sección */}
        <div className="mb-12 border-b border-[var(--color-crema)]/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-[var(--color-botanico)] block mb-2">
              Información y Horario
            </span>
            <h2 className="font-playfair text-[32px] sm:text-[40px] text-[var(--color-crema)] font-normal leading-tight">
              {NEGOCIO.nombre}
            </h2>
          </div>
          <p className="font-playfair italic text-[18px] sm:text-[20px] text-[var(--color-crema-muted)]">
            {NEGOCIO.subtitulo}
          </p>
        </div>

        {/* 2 Columnas Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ================= COLUMNA 1: HORARIO EN VIVO ================= */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-espresso-dark)] border border-white/5 shadow-2xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <Clock size={20} className="text-[var(--color-botanico)]" />
                    <h3 className="font-playfair text-[22px] sm:text-[24px] text-[var(--color-crema)] font-medium">
                      Horario en vivo
                    </h3>
                  </div>
                  <span className="font-jakarta text-[11px] uppercase tracking-wider text-[var(--text-subtle)]">
                    Benicarló
                  </span>
                </div>

                {/* Píldora de Estado en Vivo (calculado con Intl.DateTimeFormat) */}
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center justify-between transition-colors ${
                    estado?.abiertoAhora
                      ? 'bg-[var(--color-botanico)]/15 border border-[var(--color-botanico)]/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        estado?.abiertoAhora
                          ? 'bg-[var(--color-botanico-light)] animate-ping'
                          : 'bg-[var(--color-crema-dim)] opacity-60'
                      }`}
                    />
                    <span
                      className={`font-jakarta text-[13px] font-semibold tracking-wider ${
                        estado?.abiertoAhora
                          ? 'text-[var(--color-crema)]'
                          : 'text-[var(--color-crema-muted)]'
                      }`}
                    >
                      {estado?.mensajePrincipal || 'Calculando estado...'}
                    </span>
                  </div>
                  <span className="font-jakarta text-[11px] uppercase tracking-widest text-[var(--text-subtle)]">
                    {estado?.nombreDia}
                  </span>
                </div>

                {/* Tabla semanal con "Hoy" calculado en vivo */}
                <div className="space-y-2 font-garamond text-[17px]">
                  {diasOrdenados.map((diaIndex) => {
                    const diaInfo = HORARIOS_SEMANALES[diaIndex];
                    const esHoy = estado?.diaActualIndice === diaIndex;

                    return (
                      <div
                        key={diaIndex}
                        className={`flex items-center justify-between py-2 px-3.5 rounded-xl transition-colors ${
                          esHoy
                            ? 'bg-[var(--color-zafiro)]/30 border border-[var(--color-zafiro)]/50 shadow-[0_2px_12px_rgba(47,62,158,0.25)]'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {esHoy && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-crema)]" />
                          )}
                          <span
                            className={`font-jakarta text-[13px] ${
                              esHoy
                                ? 'font-bold text-[var(--color-crema)]'
                                : 'text-[var(--color-crema-dim)]'
                            }`}
                          >
                            {diaInfo.nombre} {esHoy ? '(Hoy)' : ''}
                          </span>
                        </div>

                        <div>
                          {diaInfo.abierto ? (
                            <span className="font-jakarta text-[12px] text-[var(--color-crema)]">
                              {diaInfo.tramos
                                .map((t) => `${t.inicio}–${t.fin}`)
                                .join('  ·  ')}
                              {diaInfo.nota ? (
                                <span className="text-[var(--text-subtle)] text-[11px] ml-2">
                                  ({diaInfo.nota})
                                </span>
                              ) : null}
                            </span>
                          ) : (
                            <span className="font-jakarta text-[11px] uppercase tracking-wider text-[var(--text-subtle)]">
                              Cerrado
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ================= COLUMNA 2: UBICACIÓN, REDES & PAGOS ================= */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {/* Tarjeta de Ubicación con Mapa Real integrado */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-espresso-dark)] border border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <MapPin size={20} className="text-[var(--color-zafiro)]" />
                  <h3 className="font-playfair text-[22px] sm:text-[24px] text-[var(--color-crema)] font-medium">
                    Ubicación
                  </h3>
                </div>
                <span className="font-jakarta text-[11px] uppercase tracking-wider text-[var(--color-botanico)]">
                  Benicarló · Castelló
                </span>
              </div>

              {/* Iframe interactivo con filtro cálido para armonizar la paleta */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                <iframe
                  title="Ubicación de Ohana Cafetería en Benicarló"
                  src={NEGOCIO.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: 'invert(90%) hue-rotate(180deg) contrast(95%) brightness(90%) sepia(20%)'
                  }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full block"
                />
              </div>

              <div className="space-y-1">
                <p className="font-garamond text-[17px] text-[var(--color-crema)] font-medium">
                  {NEGOCIO.direccion.formateada}
                </p>
                <p className="font-jakarta text-[12px] text-[var(--text-subtle)] flex items-center gap-1.5 pt-1">
                  <Car size={15} className="text-[var(--color-botanico)]" />
                  <span>{NEGOCIO.aparcamiento}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end">
                <a
                  href={NEGOCIO.mapsRutaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-crema)] font-jakarta text-[11px] font-semibold uppercase tracking-wider transition-all"
                >
                  <span>Cómo llegar</span>
                  <Navigation size={14} className="text-[var(--color-zafiro)]" />
                </a>
              </div>
            </div>

            {/* Sub-bloque 2: Instagram y Métodos de Pago */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tarjeta Instagram */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-espresso-dark)] border border-white/5 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[var(--color-crema-dim)] mb-2">
                    <Camera size={18} />
                    <span className="font-jakarta text-[11px] uppercase tracking-wider">Instagram</span>
                  </div>
                  <p className="font-playfair text-[20px] text-[var(--color-crema)] tracking-tight font-medium">
                    {NEGOCIO.instagram.usuario}
                  </p>
                  <p className="font-jakarta text-[11px] text-[var(--text-subtle)] mt-1">
                    Nuestra comunidad y el día a día
                  </p>
                </div>
                <div className="mt-5">
                  <a
                    href={NEGOCIO.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-crema)] transition-colors font-jakarta text-[11px] font-semibold uppercase tracking-wider"
                  >
                    Síguenos en Instagram
                  </a>
                </div>
              </div>

              {/* Métodos de Pago */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-espresso-dark)] border border-white/5 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="font-jakarta text-[11px] uppercase tracking-wider text-[var(--color-crema-dim)] block mb-3">
                    Métodos de pago
                  </span>
                  <div className="space-y-2.5 font-jakarta text-[12px] text-[var(--color-crema-dim)]">
                    <div className="flex items-center gap-2.5">
                      <CreditCard size={16} className="text-[var(--color-botanico)]" />
                      <span>Tarjeta de crédito</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CreditCard size={16} className="text-[var(--color-botanico)]" />
                      <span>Tarjeta de débito</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Smartphone size={16} className="text-[var(--color-botanico)]" />
                      <span>Pago móvil NFC</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-center">
                  <span className="font-jakarta text-[10px] text-[var(--text-subtle)] uppercase tracking-widest block">
                    Cobro sin contacto rápido
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BLOQUE DESTACADO: RESERVAS WHATSAPP ================= */}
        <div className="mt-12 w-full p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-r from-[var(--color-espresso-dark)] via-[#221711] to-[var(--color-espresso-dark)] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5 sm:gap-6 z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/40 flex items-center justify-center shrink-0 border border-white/10 text-[var(--color-botanico)] shadow-inner">
              <MessageCircle size={32} />
            </div>
            <div>
              <span className="font-jakarta text-[11px] uppercase tracking-[0.2em] text-[var(--color-botanico)] block mb-1">
                Contacto directo
              </span>
              <h3 className="font-playfair text-[24px] sm:text-[30px] text-[var(--color-crema)] font-normal leading-tight">
                Reserva tu mesa por WhatsApp
              </h3>
              <p className="font-garamond text-[16px] sm:text-[18px] text-[var(--color-crema-muted)] mt-1">
                Atención para reservas de mesa y consultas en Benicarló
              </p>
            </div>
          </div>

          <div className="z-10 shrink-0 w-full sm:w-auto">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[var(--color-zafiro)] hover:bg-[var(--color-zafiro-hover)] text-[var(--color-crema)] font-jakarta text-[13px] font-semibold uppercase tracking-wider transition-all shadow-[0_8px_24px_-4px_rgba(47,62,158,0.5)] hover:scale-[1.02]"
                id="info-reservar-whatsapp-btn"
              >
                <MessageCircle size={18} />
                <span>Reservar por WhatsApp</span>
              </a>
            ) : (
              <div className="flex flex-col items-center sm:items-end gap-2">
                <button
                  disabled
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white/10 text-white/40 font-jakarta text-[13px] font-semibold uppercase tracking-wider cursor-not-allowed"
                >
                  <MessageCircle size={18} />
                  <span>Reservar por WhatsApp</span>
                </button>
                {isDev && (
                  <span className="font-jakarta text-[11px] text-amber-400/90 text-center sm:text-right">
                    Aviso dev: define NEXT_PUBLIC_WHATSAPP en .env.local
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
