import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Basureros a cielo abierto en Guatemala · Monitoreo Satelital y Ciudadano',
  description:
    'Visualización y verificación de 54 posibles basureros a cielo abierto detectados por satélite en Guatemala. Datos abiertos para la acción comunitaria.',
  keywords: ['Guatemala', 'medio ambiente', 'basureros', 'reciclaje', 'contaminación', 'Global Plastic Watch'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-fondo text-texto font-sans antialiased">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
