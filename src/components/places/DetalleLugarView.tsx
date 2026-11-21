import Link from 'next/link';
import { ArrowLeft, Droplets, Megaphone, Navigation, Users } from 'lucide-react';
import { Lugar } from '@/types/lugar';
import { enlaceComoLlegar, estadoAgua, fraseAgua, frasePoblacion, nombreCortoLugar } from '@/lib/formato';
import { MapaGuatemalaZoom } from '@/components/map/MapaGuatemalaZoom';
import { EtiquetaAgua, EtiquetaRevision } from './EtiquetasLugar';
import { MasDatosLugar } from './MasDatosLugar';
import { SeguimientoLugar } from '@/components/gestion/SeguimientoLugar';

interface DetalleLugarViewProps {
  lugar: Lugar;
  /** Todos los lugares, para dibujarlos en el mapa de referencia. */
  lugares: Lugar[];
}

const boton =
  'inline-flex min-h-[56px] items-center gap-3 rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white transition-colors hover:bg-marca-oscuro-hover';

/** Pantalla "Un lugar". */
export function DetalleLugarView({ lugar, lugares }: DetalleLugarViewProps) {
  const cerca = estadoAgua(lugar) === 'cerca';

  return (
    <div className="w-full flex-1 bg-marca-fondo">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-10 px-4 py-10 font-marca sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* En celular, primero el texto y después el mapa */}
        <div className="order-2 lg:order-1">
          <MapaGuatemalaZoom lugares={lugares} seleccionadoId={lugar.id} />
        </div>

        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Link
            href="/mapa"
            className="inline-flex min-h-[48px] items-center gap-2 self-start text-lg font-semibold text-marca-oscuro hover:underline"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Volver al mapa
          </Link>

          <div>
            <div className="mb-5 flex flex-wrap gap-3">
              <EtiquetaRevision lugar={lugar} />
              <EtiquetaAgua lugar={lugar} />
            </div>
            <h1 className="mb-3 font-marca text-4xl font-bold leading-tight text-marca-oscuro tracking-normal sm:text-5xl">
              {nombreCortoLugar(lugar)}
            </h1>
            <p className="m-0 text-xl text-texto-secundario">{lugar.departamento}</p>
          </div>

          <ul className="m-0 flex list-none flex-col gap-4 rounded-[20px] border border-borde bg-superficie p-6">
            <li className="flex gap-4 text-lg leading-relaxed text-marca-oscuro">
              <Droplets className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />
              <span className={cerca ? 'font-bold' : ''}>{fraseAgua(lugar)}</span>
            </li>
            <li className="flex gap-4 text-lg leading-relaxed text-marca-oscuro">
              <Users className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />
              <span>{frasePoblacion(lugar)}</span>
            </li>
          </ul>

          <div className="flex flex-wrap gap-4">
            <a href={enlaceComoLlegar(lugar)} target="_blank" rel="noopener noreferrer" className={boton}>
              <Navigation className="h-5 w-5" aria-hidden="true" />
              Cómo llegar
              <span className="sr-only">(se abre Google Maps)</span>
            </a>
            <Link href={`/contar/${lugar.id}`} className={boton}>
              <Megaphone className="h-5 w-5" aria-hidden="true" />
              Ya fui, quiero contar qué vi
            </Link>
          </div>

          <SeguimientoLugar lugarId={lugar.id} />

          <MasDatosLugar lugar={lugar} />
        </div>
      </div>
    </div>
  );
}
