import Link from 'next/link';
import { ArrowRight, Map, Megaphone, Search, type LucideIcon } from 'lucide-react';

interface Accion {
  ruta: string;
  titulo: string;
  texto: string;
  icono: LucideIcon;
  destacada?: boolean;
}

const ACCIONES: Accion[] = [
  { ruta: '/mapa', titulo: 'Ver el mapa', texto: 'Mira dónde están los lugares en todo el país.', icono: Map },
  { ruta: '/lista', titulo: 'Buscar mi municipio', texto: 'Encuentra lugares cerca de donde vives.', icono: Search },
  {
    ruta: '/contar',
    titulo: 'Contar lo que vi',
    texto: 'Si ya fuiste a uno, cuéntanos qué encontraste.',
    icono: Megaphone,
    destacada: true,
  },
];

/** Las 3 tarjetas grandes que se montan sobre el borde inferior del Hero. */
export function AccionesPrincipales() {
  return (
    <section aria-label="¿Qué quieres hacer?" className="relative z-10 -mt-28 sm:-mt-32">
      <ul className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 list-none m-0">
        {ACCIONES.map(({ ruta, titulo, texto, icono: Icono, destacada }) => (
          <li key={ruta}>
            <Link
              href={ruta}
              className="group flex h-full flex-col rounded-[20px] border border-borde bg-superficie p-6 sm:p-7 font-marca text-marca-oscuro shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className={`mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-xl ${
                  destacada ? 'bg-marca-oscuro text-marca-menta' : 'bg-marca-menta text-marca-oscuro'
                }`}
              >
                <Icono className="h-7 w-7" aria-hidden="true" />
              </span>
              <span className="mb-3 text-2xl font-bold">{titulo}</span>
              <span className="mb-5 text-lg leading-relaxed text-texto-secundario">{texto}</span>
              <ArrowRight
                className="mt-auto h-6 w-6 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
