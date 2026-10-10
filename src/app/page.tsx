'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Header } from '@/components/Header';
import { HeroCanvas } from '@/components/HeroCanvas';
import { PolaroidsLayer } from '@/components/PolaroidsLayer';
import { MiniHeroesLayer } from '@/components/MiniHeroesLayer';
import { TextScenesLayer } from '@/components/TextScenesLayer';
import { InfoSection } from '@/components/InfoSection';
import { Footer } from '@/components/Footer';

// Registrar plugin de ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const [heroProgreso, setHeroProgreso] = useState<number>(0);
  const [escenaActual, setEscenaActual] = useState<number>(1);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const infoSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Asegurar que al hacer F5 / recargar la página siempre comience en el inicio
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    // Detección de prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion) {
      setEscenaActual(1);
      return;
    }

    const pinEl = pinSectionRef.current;
    const containerEl = containerRef.current;
    const infoEl = infoSectionRef.current;

    if (!pinEl || !containerEl) return;

    // Calcular altura del Hero como 3 * (altura Escena VIII + Footer)
    // De modo que el Hero sea ≈ 75% del scroll total (requisito: entre 70% y 80%)
    const calculateHeroScrollDistance = () => {
      const infoHeight = infoEl ? infoEl.offsetHeight : 1200;
      const footerHeight = 180;
      const nonHeroHeight = infoHeight + footerHeight;
      // 3 * nonHeroHeight hace que hero / (hero + nonHero) = 3/4 = 75%
      return Math.round(nonHeroHeight * 3.0);
    };

    const heroScrollDistance = calculateHeroScrollDistance();

    // Crear ScrollTrigger con GSAP
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: containerEl,
        start: 'top top',
        end: `+=${heroScrollDistance}`,
        pin: pinEl,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setHeroProgreso(p);

          // Sincronizar escena actual de cabecera (1 a 7 en el hero)
          if (p < 0.08) {
            setEscenaActual(1);
          } else if (p < 0.18) {
            setEscenaActual(2);
          } else if (p < 0.28) {
            setEscenaActual(3);
          } else if (p < 0.50) {
            setEscenaActual(4);
          } else if (p < 0.68) {
            setEscenaActual(5);
          } else if (p < 0.88) {
            setEscenaActual(6);
          } else {
            setEscenaActual(7);
          }
        }
      });

      // Observer para cuando se hace scroll en la Escena VIII
      if (infoEl) {
        ScrollTrigger.create({
          trigger: infoEl,
          start: 'top 50%',
          onEnter: () => setEscenaActual(8),
          onLeaveBack: () => setEscenaActual(7)
        });
      }

      return () => {
        st.kill();
      };
    }, containerRef);

    // Recalcular al cambiar de tamaño
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [isReducedMotion]);

  // Manejo de salto suave a progreso concreto o sección
  const handleJumpToProgress = (targetP: number) => {
    if (!containerRef.current) return;
    const infoHeight = infoSectionRef.current ? infoSectionRef.current.offsetHeight : 1200;
    const heroScrollDistance = Math.round((infoHeight + 180) * 3.0);
    const scrollTarget = containerRef.current.offsetTop + targetP * heroScrollDistance;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  const handleScrollToNext = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modo accesible para prefers-reduced-motion
  if (isReducedMotion) {
    return (
      <main className="min-h-screen bg-black text-[var(--color-crema)]">
        <Header escenaActual={1} />
        <div className="pt-24 px-6 max-w-5xl mx-auto space-y-16">
          <section className="text-center py-12">
            <h1 className="font-playfair text-4xl sm:text-6xl text-[var(--color-crema)] font-semibold">
              No solo vendemos café
            </h1>
            <h2 className="font-playfair italic text-3xl sm:text-5xl text-[var(--color-crema-muted)] mt-2">
              Vendemos experiencia
            </h2>
            <p className="font-caveat text-3xl text-[var(--color-crema-dim)] mt-4">
              “cada sorbo es diferente”
            </p>
          </section>

          {/* Cuadrícula estática de fotos accesibles */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { titulo: 'Café', desc: 'Espresso, café con leche y cappuccino', img: '/photos/espresso-artesanal.webp' },
              { titulo: 'Tostada de plátano', desc: 'Plátano y canela sobre pan tostado', img: '/photos/tostada-platano.webp' },
              { titulo: 'Smoothies naturales', desc: '100 % fruta, preparados al instante', img: '/photos/smoothies-naturales.webp' },
              { titulo: 'Nuestro rincón', desc: 'Un rincón acogedor para quedarse', img: '/photos/nuestro-rincon.webp' }
            ].map((card, i) => (
              <div key={i} className="polaroid-frame p-4 rounded-xl text-center">
                <img src={card.img} alt={card.titulo} className="w-full aspect-square object-cover rounded-lg mb-3" />
                <h3 className="font-playfair text-xl font-bold text-[#1E1713]">{card.titulo}</h3>
                <p className="font-garamond text-sm text-[#4A3B32]">{card.desc}</p>
              </div>
            ))}
          </section>

          <section className="text-center py-8">
            <h2 className="font-playfair text-4xl font-semibold">
              Somos <span className="italic font-normal">Ohana</span>, bienvenido
            </h2>
            <p className="font-caveat text-2xl text-[var(--color-crema-dim)] mt-2">
              “Aquí nadie se queda atrás, ni se olvida un buen café.”
            </p>
          </section>
        </div>
        <div className="mt-16">
          <InfoSection />
          <Footer />
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-black text-[var(--color-crema)] min-h-screen">
      {/* Cabecera Fija */}
      <Header escenaActual={escenaActual} />

      {/* Contenedor del Hero Animado (Sección Pinneada) */}
      <div ref={containerRef} className="relative w-full">
        <div
          ref={pinSectionRef}
          className="relative w-full h-[100dvh] overflow-hidden bg-black flex flex-col items-center justify-center"
        >
          {/* Capa 1: Canvas de fotogramas (fondo exacto) */}
          <HeroCanvas progreso={heroProgreso} />

          {/* Capa 2: Polaroids (Escena III) */}
          <PolaroidsLayer progreso={heroProgreso} />

          {/* Capa 3: Mini Heroes Expandidos (Escena IV) */}
          <MiniHeroesLayer
            progreso={heroProgreso}
            onJumpToProgress={handleJumpToProgress}
          />

          {/* Capa 4: Textos y Destello de Escenas I, II, V, VI y VII */}
          <TextScenesLayer
            progreso={heroProgreso}
            onScrollToNext={handleScrollToNext}
          />
        </div>
      </div>

      {/* Escena VIII: Información en Vivo, Mapa, Redes, Pagos y WhatsApp */}
      <div ref={infoSectionRef}>
        <InfoSection />
      </div>

      {/* Pie de página */}
      <Footer />
    </main>
  );
}
