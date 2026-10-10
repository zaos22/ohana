export const NEGOCIO = {
  nombre: 'Ohana Cafetería',
  subtitulo: 'Cafetería en el centro de Benicarló',
  direccion: {
    calle: 'Carrer del Cronista Viciana, 1',
    codigoPostal: '12580',
    ciudad: 'Benicarló',
    provincia: 'Castelló',
    pais: 'España',
    formateada: 'Carrer del Cronista Viciana, 1, 12580 Benicarló, Castelló'
  },
  coordenadas: {
    lat: 40.4194,
    lng: 0.4284
  },
  puntuacionGoogle: 4.6,
  instagram: {
    usuario: '@ohanacafeteria_',
    url: 'https://instagram.com/ohanacafeteria_'
  },
  metodosPago: [
    { id: 'credito', nombre: 'Tarjeta de crédito', icono: 'CreditCard' },
    { id: 'debito', nombre: 'Tarjeta de débito', icono: 'CreditCard' },
    { id: 'nfc', nombre: 'Pago móvil NFC', icono: 'Contactless' }
  ],
  aparcamiento: 'Aparcamiento gratuito en la zona y en la calle',
  mapsEmbedUrl: 'https://www.google.com/maps?q=Carrer+del+Cronista+Viciana+1+12580+Benicarlo+Castellon&output=embed',
  mapsRutaUrl: 'https://www.google.com/maps/dir/?api=1&destination=Carrer+del+Cronista+Viciana+1+12580+Benicarlo+Castellon'
};
