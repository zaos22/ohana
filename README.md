# Ohana Cafetería (Benicarló) ☕🌺

Sitio web oficial interactivo para **Ohana Cafetería**, ubicada en el centro de Benicarló (Castellón). Diseñado con una experiencia visual cinematográfica y narrativa guiada por scroll continuo, pantalla de carga editorial minimalista con precarga completa de fotogramas, cartas polaroid interactivas, traductor multilingüe y datos de negocio en tiempo real.

---

## 🚀 Tecnologías Principales

- **Framework:** [Next.js 16.4.3](https://nextjs.org/) (App Router & Turbopack)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) + Variables CSS semánticas y sistema de rejilla de `8px`
- **Animaciones & Scroll Trigger:** [GSAP](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Tipografía:** [Google Fonts](https://fonts.google.com/) (`Playfair Display`, `EB Garamond`, `Plus Jakarta Sans`, `Caveat`)
- **Traducción:** Motor de Google Translate integrado con selector de banderas vectoriales SVG (`es`, `en`, `nl`, `de`, `fr`, `ca`).

---

## ✨ Características y Experiencia de Usuario

1. **Pantalla de Carga Editorial Minimalista (`Preloader`)**:
   - Composición tipográfica editorial (`Playfair Display`, `Caveat` y `EB Garamond`) con línea fina de progreso (`1px`), porcentaje interpolado (`00% — 100%`) y contador de secuencia (`001 / 109`).
   - **Precarga completa de los 109 fotogramas del Hero** mediante una cola concurrente (10 workers) que almacena los `Blob` en memoria (`blobCache`) y pre-decodifica los `ImageBitmap` antes de abrir la experiencia.
   - Precarga paralela en segundo plano del catálogo de fotografías de las Polaroids.
   - Bloqueo temporal de scroll durante la carga y transición de salida tipo telón (`yPercent: -100`) con refresco automático de `ScrollTrigger`.

2. **Hero Animado Cinematográfico (78 % del scroll total)**:
   - Reproducción fluida y reversible de 109 fotogramas WebP optimizados sin latencia de red gracias a la precarga en memoria.
   - Detección automática de orientación (escritorio 16:9 y móvil 9:16).
   - Gestión de memoria en GPU con decodificación `ImageBitmap` (caché completa en escritorio y ventana deslizante en móvil) para rendimiento constante a 60 fps.
   - Fundido cruzado inicial ultra-suave desde la fotografía de portada hacia la animación.
   - Pacing refinado con `scrub: 1.2` para un desplazamiento suave y natural en ambas direcciones.

3. **Muestra Gastronómica en Polaroids (*Selección Ohana*)**:
   - Franjas panorámicas cinematográficas (*letterbox*) superior e inferior adaptadas a la cabecera fija (`80px`).
   - Encuadre y escalado responsivo bidimensional (`vw` + `dvh`) acotado entre ambas franjas para evitar solapamientos en ventanas compactas o con textos traducidos de varias líneas.
   - Desplazamiento horizontal continuo con centrado matemático exacto, zoom dinámico y profundidad de campo (*depth of field*).
   - Polaroids de la carta: Café Espresso artesanal, Tostadas de plátano con canela, Tostada de queso brie con nueces y miel, Bollería recién horneada y Smoothies 100 % naturales.

4. **Selector de Idiomas (Banderas Vectoriales)**:
   - Selector en la barra de navegación con banderas SVG personalizadas de alta fidelidad:
     - 🇪🇸 Español (Castellano nativo)
     - 🇬🇧 English
     - 🇳🇱 Nederlands
     - 🇩🇪 Deutsch
     - 🇫🇷 Français
     - 🇦🇩 Català / Valencià
   - Eliminación de barras flotantes invasivas de Google Translate para mantener el diseño intacto.

5. **Horario en Vivo & Datos Esenciales**:
   - Cálculo automático en tiempo real bajo la zona horaria `Europe/Madrid`.
   - Soporte para jornadas partidas y avisos de próxima apertura (*ej. "Cerrado hoy · Abre mañana lunes a las 08:00"*).
   - Mapa interactivo de Google Maps armonizado con la paleta de colores.
   - Botón directo de reserva de mesa y consultas vía WhatsApp.
   - Marcado de datos estructurados Schema.org (`CafeOrCoffeeShop`) para SEO local.

6. **Accesibilidad, Semántica & Control de Scroll**:
   - Elementos HTML5 semánticos (`<header>`, `<main>`, `<section>`, `<figure>`, `<figcaption>`, `<output>`, `<progress>`, `<footer>`).
   - Reset automático del scroll a la parte superior (`0, 0`) al recargar con **F5**.
   - Barra lateral oculta en todos los navegadores conservando la física nativa.
   - Soporte completo para `prefers-reduced-motion` para usuarios con sensibilidad al movimiento.

---

## 📍 Datos del Negocio

- **Dirección:** Carrer del Cronista Viciana, 1, 12580 Benicarló, Castellón, España
- **Puntuación Google:** 4.6 ★★★★★
- **Instagram:** [@ohanacafeteria_](https://www.instagram.com/ohanacafeteria_/)
- **Horario:**
  - **Lunes, Martes y Jueves:** 08:00 – 14:00 | 16:30 – 19:30
  - **Miércoles y Sábados:** 08:00 – 14:00 (Tarde cerrado)
  - **Viernes:** 08:00 – 14:00 | 17:00 – 20:00
  - **Domingo:** Cerrado

---

## 🛠️ Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js 18.18+ o superior
- Gestor de paquetes npm o yarn

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <url-del-repositorio>
cd ohana
npm install
```

### 2. Variables de entorno (Opcional)
Crea un archivo `.env.local` en la raíz si deseas habilitar el número de reservas directas por WhatsApp:
```env
NEXT_PUBLIC_WHATSAPP=34XXXXXXXXX
```

### 3. Modo desarrollo
Inicia el servidor local con Turbopack:
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Compilación para producción
```bash
npm run build
npm run start
```

---

## 📂 Estructura del Proyecto

```
ohana/
├── data/
│   ├── fotos.ts         # Catálogo de fotografías oficiales y textos descriptivos
│   ├── hero.ts          # Mapeo de fotogramas e hitos de animación
│   ├── horarios.ts      # Lógica de cálculo en vivo y Schema.org JSON-LD
│   ├── negocio.ts       # Datos verificados de la cafetería en Benicarló
│   └── textos.ts        # Contenidos y citas del Storyboard
├── public/
│   ├── frames/
│   │   ├── desktop/     # 109 fotogramas WebP en resolución 16:9
│   │   └── mobile/      # 109 fotogramas WebP en resolución vertical 9:16
│   └── photos/          # Imágenes de carta, logo y productos
├── src/
│   ├── app/
│   │   ├── globals.css  # Variables CSS de marca, tipografías y reglas de scroll
│   │   ├── layout.tsx   # Metadatos, fuentes Google y Schema.org
│   │   └── page.tsx     # Orquestador del preloader, scroll GSAP y capas visuales
│   └── components/
│       ├── FlagIcon.tsx          # Iconos vectoriales SVG para banderas
│       ├── Footer.tsx            # Pie de página y navegación secundaria
│       ├── Header.tsx            # Cabecera fija, barra de escena y drawer móvil
│       ├── HeroCanvas.tsx        # Canvas 2D con precarga completa de 109 fotogramas
│       ├── InfoSection.tsx       # Sección de horarios en vivo, mapa y reservas
│       ├── LanguageSelector.tsx  # Selector de idiomas con integración de Google Translate
│       ├── MiniHeroesLayer.tsx   # Vista de detalle expandido de productos
│       ├── PolaroidsLayer.tsx    # Franjas cinematográficas y polaroids responsivas 2D
│       ├── Preloader.tsx         # Pantalla de carga editorial minimalista (0–100%)
│       └── TextScenesLayer.tsx   # Textos narrativos y destello del hero
├── next.config.ts       # Configuración de Next.js
├── package.json
└── README.md
```

---

## 📄 Licencia

Desarrollado para **Ohana Cafetería**. Todos los derechos reservados.
