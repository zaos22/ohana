import type { Metadata } from 'next';
import { Playfair_Display, EB_Garamond, Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import './globals.css';
import { NEGOCIO } from '../../data/negocio';
import { generarOpeningHoursJsonLd } from '../../data/horarios';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap'
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap'
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Ohana Cafetería | Benicarló',
  description: 'Cafetería en el centro de Benicarló. Café espresso artesanal, desayunos mediterráneos y un rincón acogedor en Carrer del Cronista Viciana, 1.',
  keywords: ['Ohana Cafetería', 'Cafetería Benicarló', 'Café Benicarló', 'Desayunos Benicarló', 'Castellón'],
  authors: [{ name: 'Ohana Cafetería' }],
  metadataBase: new URL('https://ohanacafeteria.es'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Ohana Cafetería | Benicarló',
    description: 'Cafetería en el centro de Benicarló. Carrer del Cronista Viciana, 1. Horario en vivo y reservas por WhatsApp.',
    url: 'https://ohanacafeteria.es',
    siteName: 'Ohana Cafetería',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/photos/logo-ohana.webp',
        width: 800,
        height: 800,
        alt: 'Ohana Cafetería - Emblema Oficial'
      }
    ]
  },
  icons: {
    icon: '/photos/logo-ohana.webp',
    apple: '/photos/logo-ohana.webp'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const openingHours = generarOpeningHoursJsonLd();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: NEGOCIO.nombre,
    description: NEGOCIO.subtitulo,
    url: 'https://ohanacafeteria.es',
    image: 'https://ohanacafeteria.es/photos/logo-ohana.webp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: NEGOCIO.direccion.calle,
      postalCode: NEGOCIO.direccion.codigoPostal,
      addressLocality: NEGOCIO.direccion.ciudad,
      addressRegion: NEGOCIO.direccion.provincia,
      addressCountry: 'ES'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: NEGOCIO.coordenadas.lat,
      longitude: NEGOCIO.coordenadas.lng
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: NEGOCIO.puntuacionGoogle.toString(),
      reviewCount: '120'
    },
    openingHoursSpecification: openingHours,
    sameAs: [NEGOCIO.instagram.url]
  };

  return (
    <html
      lang="es"
      className={`${playfair.variable} ${ebGaramond.variable} ${jakarta.variable} ${caveat.variable} dark antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-[var(--color-crema)] font-sans min-h-screen selection:bg-[var(--color-zafiro)] selection:text-[var(--color-crema)]">
        {children}
      </body>
    </html>
  );
}
