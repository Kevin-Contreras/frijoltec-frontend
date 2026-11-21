'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Megaphone, Menu, X } from 'lucide-react';

const ENLACES: { ruta: string; texto: string; tambienActivoEn?: string[] }[] = [
  { ruta: '/mapa', texto: 'Mapa' },
  { ruta: '/lista', texto: 'Lista' },
  { ruta: '/reportes', texto: 'Reportes' },
  { ruta: '/resumen', texto: 'Resumen' },
  // Modo municipalidad / asociaciones (bosquejo). El panel también cuenta como esta pestaña.
  { ruta: '/organizaciones', texto: 'Organizaciones', tambienActivoEn: ['/panel'] },
];

const CTA = { ruta: '/contar', texto: 'Contar lo que vi' };

export function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const coincide = (ruta: string) => pathname === ruta || pathname.startsWith(`${ruta}/`);
  const esActivo = (ruta: string, tambien: string[] = []) => coincide(ruta) || tambien.some(coincide);

  return (
    <header className="sticky top-0 z-50 bg-marca-oscuro/95 backdrop-blur-md border-b border-white/10 font-marca text-white shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between gap-4">
        {/* Marca / Logo */}
        <Link
          href="/"
          className="flex items-center rounded-md p-1 transition-transform duration-300 hover:scale-105"
          aria-label="Frijol Tech, ir al inicio"
        >
          <img src="/marca/logo-menta-blanco.svg" alt="" className="h-14 w-auto sm:h-16" />
        </Link>

        {/* Navegación Escritorio */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-1.5">
          {ENLACES.map((enlace) => {
            const activo = esActivo(enlace.ruta, enlace.tambienActivoEn);
            return (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                aria-current={activo ? 'page' : undefined}
                className={`relative inline-flex min-h-[48px] items-center rounded-xl px-4 text-lg font-semibold transition-all duration-200 ${
                  activo
                    ? 'bg-white/15 text-marca-menta shadow-inner'
                    : 'text-white/90 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
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
          className="hidden lg:inline-flex min-h-[56px] items-center gap-2 rounded-xl bg-marca-menta px-6 text-lg font-semibold text-marca-oscuro transition-all duration-200 hover:bg-marca-menta-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95"
        >
          <Megaphone className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
          {CTA.texto}
        </Link>

        {/* Botón Móvil */}
        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="lg:hidden p-3 rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
        >
          {menuAbierto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Menú desplegable Móvil con animación */}
      {menuAbierto && (
        <nav
          id="menu-movil"
          aria-label="Navegación principal"
          className="lg:hidden border-t border-white/10 bg-marca-oscuro/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-fade-in-down"
        >
          {ENLACES.map((enlace) => {
            const activo = esActivo(enlace.ruta, enlace.tambienActivoEn);
            return (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                onClick={() => setMenuAbierto(false)}
                aria-current={activo ? 'page' : undefined}
                className={`flex min-h-[56px] items-center rounded-xl px-4 text-lg font-semibold transition-colors ${
                  activo ? 'bg-white/15 text-marca-menta' : 'text-white hover:bg-white/10'
                }`}
              >
                {enlace.texto}
              </Link>
            );
          })}
          <Link
            href={CTA.ruta}
            onClick={() => setMenuAbierto(false)}
            className="flex min-h-[56px] items-center gap-2 rounded-xl bg-marca-menta px-4 text-lg font-semibold text-marca-oscuro active:scale-95 transition-transform"
          >
            <Megaphone className="h-5 w-5" aria-hidden="true" />
            {CTA.texto}
          </Link>
        </nav>
      )}
    </header>
  );
}
