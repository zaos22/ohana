export interface TramoHorario {
  inicio: string; // "HH:MM"
  fin: string;    // "HH:MM"
}

export interface HorarioDia {
  nombre: string;
  abierto: boolean;
  tramos: TramoHorario[];
  nota?: string;
}

// Horario vigente confirmado por el cliente:
// - Lunes, Martes y Jueves: 08:00–14:00 y 16:30–19:30
// - Miércoles y Sábado: 08:00–14:00 (tarde cerrado)
// - Viernes: 08:00–14:00 y 17:00–20:00
// - Domingo: cerrado
export const HORARIOS_SEMANALES: Record<number, HorarioDia> = {
  0: {
    nombre: 'Domingo',
    abierto: false,
    tramos: [],
    nota: 'Cerrado'
  },
  1: {
    nombre: 'Lunes',
    abierto: true,
    tramos: [
      { inicio: '08:00', fin: '14:00' },
      { inicio: '16:30', fin: '19:30' }
    ]
  },
  2: {
    nombre: 'Martes',
    abierto: true,
    tramos: [
      { inicio: '08:00', fin: '14:00' },
      { inicio: '16:30', fin: '19:30' }
    ]
  },
  3: {
    nombre: 'Miércoles',
    abierto: true,
    tramos: [
      { inicio: '08:00', fin: '14:00' }
    ],
    nota: 'tarde cerrado'
  },
  4: {
    nombre: 'Jueves',
    abierto: true,
    tramos: [
      { inicio: '08:00', fin: '14:00' },
      { inicio: '16:30', fin: '19:30' }
    ]
  },
  5: {
    nombre: 'Viernes',
    abierto: true,
    tramos: [
      { inicio: '08:00', fin: '14:00' },
      { inicio: '17:00', fin: '20:00' }
    ]
  },
  6: {
    nombre: 'Sábado',
    abierto: true,
    tramos: [
      { inicio: '08:00', fin: '14:00' }
    ],
    nota: 'tarde cerrado'
  }
};

export interface EstadoEnVivo {
  abiertoAhora: boolean;
  diaSemana: number;
  nombreDia: string;
  mensajePrincipal: string;
  horaActualStr: string;
  diaActualIndice: number;
}

function parseMinutos(horaStr: string): number {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Calcula el estado de apertura en tiempo real en la zona horaria "Europe/Madrid".
 */
export function obtenerEstadoEnVivo(fechaBase: Date = new Date()): EstadoEnVivo {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(fechaBase);
  let hourStr = '00';
  let minuteStr = '00';
  for (const p of parts) {
    if (p.type === 'hour') hourStr = p.value;
    if (p.type === 'minute') minuteStr = p.value;
  }

  // Obtener día de la semana en horario de Madrid
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Madrid',
    weekday: 'short'
  });
  const dayShort = dayFormatter.format(fechaBase);
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
  };
  const diaSemana = dayMap[dayShort] ?? fechaBase.getDay();
  const minutosActuales = parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10);
  const diaInfo = HORARIOS_SEMANALES[diaSemana];

  // 1. Comprobar si está abierto en algún tramo de hoy
  for (const tramo of diaInfo.tramos) {
    const inicioMin = parseMinutos(tramo.inicio);
    const finMin = parseMinutos(tramo.fin);
    if (minutosActuales >= inicioMin && minutosActuales < finMin) {
      return {
        abiertoAhora: true,
        diaSemana,
        nombreDia: diaInfo.nombre,
        mensajePrincipal: `Abierto ahora · Cierra a las ${tramo.fin}`,
        horaActualStr: `${hourStr}:${minuteStr}`,
        diaActualIndice: diaSemana
      };
    }
  }

  // 2. Si no está abierto ahora, buscar si abre más tarde HOY
  for (const tramo of diaInfo.tramos) {
    const inicioMin = parseMinutos(tramo.inicio);
    if (minutosActuales < inicioMin) {
      return {
        abiertoAhora: false,
        diaSemana,
        nombreDia: diaInfo.nombre,
        mensajePrincipal: `Cerrado · Abre hoy a las ${tramo.inicio}`,
        horaActualStr: `${hourStr}:${minuteStr}`,
        diaActualIndice: diaSemana
      };
    }
  }

  // 3. Buscar cuándo vuelve a abrir en los próximos días
  for (let offset = 1; offset <= 7; offset++) {
    const sigDia = (diaSemana + offset) % 7;
    const infoSig = HORARIOS_SEMANALES[sigDia];
    if (infoSig.abierto && infoSig.tramos.length > 0) {
      const primerTramo = infoSig.tramos[0];
      let msg = '';
      const prefijo = diaInfo.abierto ? 'Cerrado por hoy' : 'Cerrado hoy';
      if (offset === 1 && sigDia === 1) {
        msg = `${prefijo} · Abre mañana lunes a las ${primerTramo.inicio}`;
      } else if (offset === 1) {
        msg = `${prefijo} · Abre mañana a las ${primerTramo.inicio}`;
      } else if (sigDia === 1) {
        msg = `${prefijo} · Abre el lunes a las ${primerTramo.inicio}`;
      } else {
        msg = `${prefijo} · Abre el ${infoSig.nombre.toLowerCase()} a las ${primerTramo.inicio}`;
      }
      return {
        abiertoAhora: false,
        diaSemana,
        nombreDia: diaInfo.nombre,
        mensajePrincipal: msg,
        horaActualStr: `${hourStr}:${minuteStr}`,
        diaActualIndice: diaSemana
      };
    }
  }

  return {
    abiertoAhora: false,
    diaSemana,
    nombreDia: diaInfo.nombre,
    mensajePrincipal: 'Cerrado temporalmente',
    horaActualStr: `${hourStr}:${minuteStr}`,
    diaActualIndice: diaSemana
  };
}

/**
 * Genera el schema JSON-LD para openingHoursSpecification.
 */
export function generarOpeningHoursJsonLd() {
  const dayNamesSchema = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const specs: Array<{
    '@type': string;
    dayOfWeek: string;
    opens: string;
    closes: string;
  }> = [];

  for (let d = 0; d < 7; d++) {
    const dia = HORARIOS_SEMANALES[d];
    if (dia.abierto) {
      for (const tramo of dia.tramos) {
        specs.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: dayNamesSchema[d],
          opens: tramo.inicio,
          closes: tramo.fin
        });
      }
    }
  }

  return specs;
}
