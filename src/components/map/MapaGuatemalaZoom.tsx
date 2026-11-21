'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Lugar } from '@/types/lugar';
import { MapaGuatemalaSvg } from './MapaGuatemalaSvg';

interface MapaGuatemalaZoomProps {
  lugares: Lugar[];
  seleccionadoId?: string;
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

/** Mapa de referencia con botones + / − que acercan hacia el lugar seleccionado. */
export function MapaGuatemalaZoom({ lugares, seleccionadoId }: MapaGuatemalaZoomProps) {
  const [zoom, setZoom] = useState(1);

  const botonZoom =
    'flex h-14 w-14 items-center justify-center bg-superficie text-marca-oscuro hover:bg-marca-menta-suave disabled:cursor-not-allowed disabled:text-borde-fuerte disabled:hover:bg-superficie';

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-borde bg-marca-menta-suave p-4 font-marca">
      <MapaGuatemalaSvg
        lugares={lugares}
        seleccionadoId={seleccionadoId}
        zoom={zoom}
        className="mx-auto block aspect-square h-auto w-full max-w-[560px]"
      />

      <span className="absolute bottom-4 left-4 rounded-lg border border-borde bg-superficie px-3 py-1.5 text-sm font-semibold text-marca-oscuro">
        Mapa de referencia
      </span>

      <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-xl border border-marca-oscuro">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z * 2, ZOOM_MAX))}
          disabled={zoom >= ZOOM_MAX}
          aria-label="Acercar el mapa"
          className={`${botonZoom} border-b border-marca-oscuro`}
        >
          <Plus className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z / 2, ZOOM_MIN))}
          disabled={zoom <= ZOOM_MIN}
          aria-label="Alejar el mapa"
          className={botonZoom}
        >
          <Minus className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
