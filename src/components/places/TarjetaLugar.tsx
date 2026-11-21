import Link from 'next/link';
import { Lugar } from '@/types/lugar';
import {
  formatearDistancia,
  formatearNumero,
  nombreTipoAgua,
  estadoAgua,
  enlaceComoLlegar,
} from '@/lib/formato';
import { Droplets, Users, Navigation, ArrowRight, Mountain } from 'lucide-react';

interface TarjetaLugarProps {
  lugar: Lugar;
}

export function TarjetaLugar({ lugar }: TarjetaLugarProps) {
  const estado = estadoAgua(lugar);

  return (
    <article className="bg-superficie border border-borde rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Cabecera de la tarjeta */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-principal-suave text-principal">
            {lugar.id}
          </span>
          <span className="text-xs font-semibold text-texto-secundario bg-fondo px-2.5 py-1 rounded-full">
            {lugar.departamento}
          </span>
        </div>

        <h3 className="font-titulos font-bold text-lg text-texto line-clamp-2 leading-snug mb-3">
          {lugar.direccion}
        </h3>

        {/* Indicadores de impacto ambiental */}
        <div className="space-y-2 mb-4 text-sm">
          {/* Cercanía al agua */}
          <div
            className={`flex items-start gap-2 p-2.5 rounded-xl ${
              estado === 'cerca'
                ? 'bg-alerta-suave text-alerta-texto font-medium'
                : 'bg-fondo text-texto-secundario'
            }`}
          >
            <Droplets className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              {lugar.distanciaAguaM !== null ? (
                <>
                  A <strong>{formatearDistancia(lugar.distanciaAguaM)}</strong> de un{' '}
                  {nombreTipoAgua(lugar.tipoAgua)}
                  {estado === 'cerca' && (
                    <span className="block text-[11px] font-bold text-alerta">
                      ⚠️ Cerca de fuente hídrica (&lt; 500 m)
                    </span>
                  )}
                </>
              ) : (
                'Distancia al agua no determinada'
              )}
            </div>
          </div>

          {/* Población */}
          <div className="flex items-center gap-2 px-1 text-xs sm:text-sm text-texto-secundario">
            <Users className="w-4 h-4 text-principal flex-shrink-0" />
            <span>
              <strong>{formatearNumero(lugar.poblacion1km)}</strong> personas viven a 1 km
            </span>
          </div>

          {/* Elevación */}
          {lugar.elevacionM !== null && (
            <div className="flex items-center gap-2 px-1 text-xs text-texto-secundario">
              <Mountain className="w-4 h-4 text-principal/70 flex-shrink-0" />
              <span>{formatearNumero(lugar.elevacionM)} msnm</span>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción inferiores */}
      <div className="pt-3 border-t border-borde flex items-center justify-between gap-2">
        <a
          href={enlaceComoLlegar(lugar)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold text-principal hover:bg-principal-suave transition-colors"
          title="Ver ruta en Google Maps"
        >
          <Navigation className="w-4 h-4" />
          Cómo llegar
        </a>

        <Link
          href={`/lugar/${lugar.id}`}
          className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-principal hover:bg-principal-hover text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
        >
          Ver detalles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
