import Link from 'next/link';
import type { Lugar } from '@/types/lugar';
import { estadoAgua, type EstadoAgua } from '@/lib/formato';
import { CONTORNO_PATH, MAPA_ALTO, MAPA_ANCHO, proyectar } from '@/lib/mapa-guatemala';

interface MapaReferenciaProps {
  lugares: Lugar[];
}

/** Se dibujan primero los de menor importancia para que los "cerca del agua" queden encima. */
const ORDEN: EstadoAgua[] = ['sin-dato', 'lejos', 'cerca'];

function Punto({ estado, x, y }: { estado: EstadoAgua; x: number; y: number }) {
  if (estado === 'cerca') {
    return (
      <g>
        <circle cx={x} cy={y} r={13} fill="#FFFFFF" stroke="#142A27" strokeWidth={1.5} />
        <circle cx={x} cy={y} r={10} fill="#000000" />
      </g>
    );
  }
  if (estado === 'lejos') {
    return <circle cx={x} cy={y} r={9} fill="#69AB90" stroke="#142A27" strokeWidth={2.5} />;
  }
  return <circle cx={x} cy={y} r={6} fill="#FFFFFF" stroke="#142A27" strokeWidth={2.5} />;
}

/** Vista previa estática del mapa en el inicio, sin librerías (carga rápido en conexión lenta). */
export function MapaReferencia({ lugares }: MapaReferenciaProps) {
  const puntos = lugares
    .map((l) => ({ id: l.id, estado: estadoAgua(l), ...proyectar(l.lon, l.lat) }))
    .sort((a, b) => ORDEN.indexOf(a.estado) - ORDEN.indexOf(b.estado));

  const cuenta = (e: EstadoAgua) => puntos.filter((p) => p.estado === e).length;

  return (
    <section aria-labelledby="titulo-mapa-referencia" className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
      <h2 id="titulo-mapa-referencia" className="sr-only">
        Mapa de referencia
      </h2>
      <div className="relative rounded-[20px] border border-borde bg-marca-menta-suave px-4 pt-4 pb-24 sm:pb-6 font-marca">
        <svg
          viewBox={`-15 -15 ${MAPA_ANCHO + 30} ${MAPA_ALTO + 30}`}
          className="mx-auto block h-auto w-full max-w-[440px]"
          role="img"
          aria-label={`Mapa de Guatemala con ${lugares.length} posibles basureros`}
        >
          <path d={CONTORNO_PATH} fill="#FFFFFF" stroke="#142A27" strokeWidth={2} strokeLinejoin="round" />
          {puntos.map((p) => (
            <Punto key={p.id} estado={p.estado} x={p.x} y={p.y} />
          ))}
        </svg>

        <p className="m-0 mt-1 text-center text-sm text-texto-secundario">Mapa de referencia</p>

        {/* Leyenda: el color siempre va acompañado de texto */}
        <ul className="m-0 mt-3 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 text-base text-marca-oscuro sm:absolute sm:bottom-6 sm:left-6 sm:mt-0 sm:flex-col sm:items-start">
          <li className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded-full bg-black ring-2 ring-white outline outline-1 outline-marca-oscuro" />
            Cerca del agua ({cuenta('cerca')})
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded-full border-2 border-marca-oscuro bg-marca-verde" />
            Lejos del agua ({cuenta('lejos')})
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-marca-oscuro bg-white" />
            Sin dato del agua ({cuenta('sin-dato')})
          </li>
        </ul>

        <Link
          href="/mapa"
          className="absolute bottom-4 right-4 inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white shadow-md transition-colors hover:bg-marca-oscuro-hover"
        >
          Ver el mapa
        </Link>
      </div>
    </section>
  );
}
