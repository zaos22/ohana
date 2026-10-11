'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { FlagIcon } from './FlagIcon';

export interface Idioma {
  codigo: string;
  nombre: string;
}

export const IDIOMAS: Idioma[] = [
  { codigo: 'es', nombre: 'Español' },
  { codigo: 'en', nombre: 'English' },
  { codigo: 'nl', nombre: 'Nederlands' },
  { codigo: 'de', nombre: 'Deutsch' },
  { codigo: 'fr', nombre: 'Français' },
  { codigo: 'ca', nombre: 'Català' }
];

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay?: boolean; includedLanguages?: string },
          containerId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export const LanguageSelector: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>('es');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Inyección segura del script de Google Translate solo en el cliente
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Crear el contenedor oculto si no existe
    let container = document.getElementById('google_translate_element');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    // Inicializador global
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'es,en,nl,de,fr,ca',
            autoDisplay: false
          },
          'google_translate_element'
        );
      }
    };

    // Inyectar el script oficial si no está presente
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Leer idioma actual de la cookie
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    if (match && match[1]) {
      const parts = match[1].split('/');
      const lang = parts[parts.length - 1];
      if (lang && IDIOMAS.some((i) => i.codigo === lang)) {
        setSelectedLang(lang);
      }
    }
  }, []);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (codigo: string) => {
    setSelectedLang(codigo);
    setIsOpen(false);

    if (codigo === 'es') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
      window.location.reload();
      return;
    }

    document.cookie = `googtrans=/es/${codigo}; path=/;`;
    document.cookie = `googtrans=/es/${codigo}; domain=.${window.location.hostname}; path=/;`;

    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = codigo;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      window.location.reload();
    }
  };

  const currentIdioma = IDIOMAS.find((i) => i.codigo === selectedLang) || IDIOMAS[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botón trigger: bandera en SVG vectorial de alta definición */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-[var(--color-crema)] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-zafiro)]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Idioma seleccionado: ${currentIdioma.nombre}`}
        title={`Idioma: ${currentIdioma.nombre}`}
      >
        <FlagIcon code={currentIdioma.codigo} className="w-5 h-3.5 object-cover shrink-0" />
        <ChevronDown
          size={12}
          className={`text-[var(--text-subtle)] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--color-espresso-dark)] border border-white/15 shadow-2xl py-1 z-50 backdrop-blur-md overflow-hidden"
          role="listbox"
        >
          <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-jakarta uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-1.5">
            <Globe size={11} className="text-[var(--color-zafiro)]" />
            <span>Google Traductor</span>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {IDIOMAS.map((idioma) => {
              const isSelected = idioma.codigo === selectedLang;
              return (
                <button
                  key={idioma.codigo}
                  type="button"
                  onClick={() => changeLanguage(idioma.codigo)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left font-jakarta text-[12px] transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-zafiro)]/30 text-white font-semibold'
                      : 'text-[var(--color-crema-dim)] hover:bg-white/10 hover:text-white'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="flex items-center gap-3">
                    <FlagIcon code={idioma.codigo} className="w-5 h-3.5 object-cover shrink-0" />
                    <span>{idioma.nombre}</span>
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-crema)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
