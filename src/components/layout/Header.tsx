'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Megaphone, Menu, X } from 'lucide-react';

const ENLACES = [
  { ruta: '/mapa', texto: 'Mapa' },
  { ruta: '/lista', texto: 'Lista' },
  { ruta: '/resumen', texto: 'Resumen' },
];

const CTA = { ruta: '/contar', texto: 'Contar lo que vi' };

export function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const esActivo = (ruta: string) => pathname === ruta || pathname.startsWith(`${ruta}/`);

  return (
    <header className="sticky top-0 z-50 bg-marca-oscuro font-marca text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between gap-4">
        {/* Marca / Logo */}
        <Link href="/" className="flex items-center rounded-md p-1" aria-label="Frijol Tech, ir al inicio">
          <img src="/marca/logo-menta-blanco.svg" alt="" className="h-14 w-auto sm:h-16" />
        </Link>

        {/* Navegación Escritorio */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-2">
          {ENLACES.map((enlace) => {
            const activo = esActivo(enlace.ruta);
            return (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                aria-current={activo ? 'page' : undefined}
                className={`inline-flex min-h-[48px] items-center rounded-md px-4 text-lg font-semibold transition-colors ${
                  activo ? 'bg-white/10 text-marca-menta' : 'text-white hover:bg-white/10'
                }`}
              >
                {enlace.texto}
              </Link>
            );
          })}
        </nav>

        <Link
          href={CTA.ruta}
          aria-current={esActivo(CTA.ruta) ? 'page' : undefined}
          className="hidden md:inline-flex min-h-[56px] items-center gap-2 rounded-xl bg-marca-menta px-6 text-lg font-semibold text-marca-oscuro transition-colors hover:bg-marca-menta-hover"
        >
          <Megaphone className="h-5 w-5" aria-hidden="true" />
          {CTA.texto}
        </Link>

        {/* Botón Móvil */}
        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden p-3 rounded-lg text-white hover:bg-white/10"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
        >
          {menuAbierto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Menú desplegable Móvil */}
      {menuAbierto && (
        <nav
          id="menu-movil"
          aria-label="Navegación principal"
          className="md:hidden border-t border-white/10 bg-marca-oscuro px-4 pt-2 pb-6 space-y-2"
        >
          {ENLACES.map((enlace) => {
            const activo = esActivo(enlace.ruta);
            return (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                onClick={() => setMenuAbierto(false)}
                aria-current={activo ? 'page' : undefined}
                className={`flex min-h-[56px] items-center rounded-md px-4 text-lg font-semibold ${
                  activo ? 'bg-white/10 text-marca-menta' : 'text-white hover:bg-white/10'
                }`}
              >
                {enlace.texto}
              </Link>
            );
          })}
          <Link
            href={CTA.ruta}
            onClick={() => setMenuAbierto(false)}
            className="flex min-h-[56px] items-center gap-2 rounded-xl bg-marca-menta px-4 text-lg font-semibold text-marca-oscuro"
          >
            <Megaphone className="h-5 w-5" aria-hidden="true" />
            {CTA.texto}
          </Link>
        </nav>
      )}
    </header>
  );
}
