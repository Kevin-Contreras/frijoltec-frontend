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
  'inline-flex min-h-[56px] items-center gap-3 rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover';

/** Pantalla "Un lugar". */
export function DetalleLugarView({ lugar, lugares }: DetalleLugarViewProps) {
  const cerca = estadoAgua(lugar) === 'cerca';

  return (
    <div className="w-full flex-1 bg-marca-fondo">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-10 px-4 py-10 font-marca sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* En celular, primero el texto y después el mapa */}
        <div className="order-2 lg:order-1 animate-scale-up">
          <MapaGuatemalaZoom lugares={lugares} seleccionadoId={lugar.id} />
        </div>

        <div className="order-1 flex flex-col gap-6 lg:order-2 animate-fade-in-up">
          <Link
            href="/mapa"
            className="inline-flex min-h-[48px] items-center gap-2 self-start text-lg font-semibold text-marca-oscuro transition-transform hover:-translate-x-1"
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

          <ul className="m-0 flex list-none flex-col gap-4 rounded-[20px] border border-borde bg-superficie p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <li className="flex gap-4 text-lg leading-relaxed text-marca-oscuro">
              <Droplets className="mt-1 h-6 w-6 shrink-0 text-principal" aria-hidden="true" />
              <span className={cerca ? 'font-bold' : ''}>{fraseAgua(lugar)}</span>
            </li>
            <li className="flex gap-4 text-lg leading-relaxed text-marca-oscuro">
              <Users className="mt-1 h-6 w-6 shrink-0 text-principal" aria-hidden="true" />
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

          {/* Reportes de campo verificados */}
          {lugar.reportes && lugar.reportes.length > 0 && (
            <div className="rounded-[20px] border border-borde bg-superficie p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="font-marca text-2xl font-bold text-marca-oscuro">
                  Reportes de campo ({lugar.reportes.length})
                </h3>
                <Link
                  href={`/reportes?sitio_id=${encodeURIComponent(lugar.id)}`}
                  className="text-sm font-semibold text-marca-oscuro hover:text-marca-verde hover:underline"
                >
                  Ver todos &rarr;
                </Link>
              </div>
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {lugar.reportes.map((r) => (
                  <li key={r.id} className="rounded-xl border border-borde p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="rounded-full bg-marca-menta px-3 py-1 text-sm font-semibold text-marca-oscuro">
                        {r.resultado === 'hay_basura'
                          ? 'Sí, hay basura'
                          : r.resultado === 'no_hay_basura'
                          ? 'No hay basura'
                          : 'No pude entrar'}
                      </span>
                      {r.fechaVisita && (
                        <span className="text-sm text-texto-secundario">{r.fechaVisita}</span>
                      )}
                    </div>
                    {r.notas && <p className="m-0 text-base text-marca-oscuro">{r.notas}</p>}
                    {r.fotos && r.fotos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {r.fotos.map((f) => (
                          <img key={f.id} src={f.url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <MasDatosLugar lugar={lugar} />
        </div>
      </div>
    </div>
  );
}
