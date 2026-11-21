'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MapPin, Menu, X, Compass, ListFilter, BarChart3, MessageSquarePlus } from 'lucide-react';

const ENLACES = [
  { ruta: '/', texto: 'Inicio', icono: Compass },
  { ruta: '/mapa', texto: 'Mapa', icono: MapPin },
  { ruta: '/lista', texto: 'Buscar un lugar', icono: ListFilter },
  { ruta: '/resumen', texto: 'Resumen', icono: BarChart3 },
  { ruta: '/contar', texto: 'Contar lo que vi', icono: MessageSquarePlus, destacado: true },
];

export function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-superficie border-b border-borde shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Marca / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-texto hover:text-principal transition-colors focus:rounded-md p-1"
        >
          <span className="w-10 h-10 rounded-xl bg-principal text-white flex items-center justify-center font-titulos font-bold text-xl shadow-inner">
            GT
          </span>
          <div className="flex flex-col">
            <span className="font-titulos font-bold text-lg sm:text-xl leading-tight">
              Basureros en Guatemala
            </span>
            <span className="text-xs text-texto-secundario font-medium">
              Monitoreo ciudadano y satelital
            </span>
          </div>
        </Link>

        {/* Navegación Escritorio */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-2">
          {ENLACES.map((enlace) => {
            const Icono = enlace.icono;
            const activo = pathname === enlace.ruta;

            if (enlace.destacado) {
              return (
                <Link
                  key={enlace.ruta}
                  href={enlace.ruta}
                  className={`ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-base transition-all shadow-sm ${
                    activo
                      ? 'bg-alerta-hover text-white ring-2 ring-alerta'
                      : 'bg-alerta text-white hover:bg-alerta-hover'
                  }`}
                >
                  <Icono className="w-5 h-5" />
                  {enlace.texto}
                </Link>
              );
            }

            return (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-base font-medium transition-colors ${
                  activo
                    ? 'bg-principal-suave text-principal font-bold'
                    : 'text-texto hover:bg-fondo hover:text-principal'
                }`}
              >
                <Icono className="w-4 h-4" />
                {enlace.texto}
              </Link>
            );
          })}
        </nav>

        {/* Botón Móvil */}
        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden p-3 rounded-lg text-texto hover:bg-fondo focus:ring-2 focus:ring-principal"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Menú desplegable Móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-superficie border-b border-borde px-4 pt-2 pb-6 space-y-2 animate-fadeIn shadow-lg">
          {ENLACES.map((enlace) => {
            const Icono = enlace.icono;
            const activo = pathname === enlace.ruta;
            return (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                onClick={() => setMenuAbierto(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-md text-lg font-medium transition-colors min-h-[52px] ${
                  enlace.destacado
                    ? 'bg-alerta text-white font-bold'
                    : activo
                    ? 'bg-principal-suave text-principal font-bold'
                    : 'text-texto hover:bg-fondo'
                }`}
              >
                <Icono className="w-5 h-5" />
                {enlace.texto}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
