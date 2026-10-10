export interface HitoVisual {
  id: string;
  nombre: string;
  frameIndex: number; // 0 a 108
  progresoNormalizado: number; // 0.0 a 1.0
  descripcion: string;
}

export const TOTAL_FRAMES = 109; // frame_0001.webp a frame_0109.webp
export const FRAME_EXPLOSION = 76; // hero_076: mayor salto lumínico y dispersión radial (+21.14 YAVG)

export const HITOS_HERO: HitoVisual[] = [
  {
    id: 'bote_reposo',
    nombre: 'Bote en reposo e iluminación cálida',
    frameIndex: 0,
    progresoNormalizado: 0.0,
    descripcion: 'Bote de vidrio centrado con halo ámbar tenue'
  },
  {
    id: 'inicio_caida',
    nombre: 'Inicio del desprendimiento de granos',
    frameIndex: 14,
    progresoNormalizado: 0.08,
    descripcion: 'Los primeros granos caen hacia la base'
  },
  {
    id: 'flujo_polaroids',
    nombre: 'Torrente continuo (Polaroids y Mini Heroes)',
    frameIndex: 35,
    progresoNormalizado: 0.18,
    descripcion: 'Lluvia constante de granos en eje vertical'
  },
  {
    id: 'llegada_maquina',
    nombre: 'Granos convergen al grupo de la máquina',
    frameIndex: 65,
    progresoNormalizado: 0.50,
    descripcion: 'Vórtice acelerado en el embudo de extracción'
  },
  {
    id: 'explosion_climax',
    nombre: 'Explosión y destello sensorial',
    frameIndex: 76,
    progresoNormalizado: 0.68,
    descripcion: 'Mayor salto de contraste, destello dorado y dispersión radial'
  },
  {
    id: 'dispersion_ondas',
    nombre: 'Ondas radiales y dispersión periférica',
    frameIndex: 88,
    progresoNormalizado: 0.88,
    descripcion: 'Los granos vuelan hacia las esquinas exteriores'
  },
  {
    id: 'identidad_final',
    nombre: 'Posado final y bienvenida Ohana',
    frameIndex: 108,
    progresoNormalizado: 1.0,
    descripcion: 'Último fotograma estático sobre el que reposa el sello'
  }
];

/**
 * Calcula el índice de fotograma (1 a 109) correspondiente a un progreso de scroll (0.0 a 1.0)
 * utilizando interpolación por tramos entre hitos clave.
 */
export function mapearProgresoAFotograma(progreso: number): number {
  const p = Math.max(0, Math.min(1, progreso));

  // Tramos:
  // 0.00 -> 0.08: frames 0..14
  // 0.08 -> 0.18: frames 14..35
  // 0.18 -> 0.50: frames 35..65
  // 0.50 -> 0.68: frames 65..76 (Explosión arranca exactamente en 0.68 -> frame 76)
  // 0.68 -> 0.88: frames 76..88
  // 0.88 -> 1.00: frames 88..108

  let frame = 0;
  if (p <= 0.08) {
    const t = p / 0.08;
    frame = Math.round(0 + t * 14);
  } else if (p <= 0.18) {
    const t = (p - 0.08) / (0.18 - 0.08);
    frame = Math.round(14 + t * (35 - 14));
  } else if (p <= 0.50) {
    const t = (p - 0.18) / (0.50 - 0.18);
    frame = Math.round(35 + t * (65 - 35));
  } else if (p <= 0.68) {
    const t = (p - 0.50) / (0.68 - 0.50);
    frame = Math.round(65 + t * (76 - 65));
  } else if (p <= 0.88) {
    const t = (p - 0.68) / (0.88 - 0.68);
    frame = Math.round(76 + t * (88 - 76));
  } else {
    const t = (p - 0.88) / (1.00 - 0.88);
    frame = Math.round(88 + t * (108 - 88));
  }

  // 1-indexed para los nombres frame_0001 a frame_0109
  return Math.max(1, Math.min(TOTAL_FRAMES, frame + 1));
}
