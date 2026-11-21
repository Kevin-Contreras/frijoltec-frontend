'use client';

import { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Lugar } from '@/types/lugar';
import { MapaGuatemalaSvg } from './MapaGuatemalaSvg';

interface MapaGuatemalaZoomProps {
  lugares: Lugar[];
  seleccionadoId?: string;
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const DURACION_MS = 450;

/** Mapa de referencia con botones + / − que acercan suavemente hacia el lugar seleccionado. */
export function MapaGuatemalaZoom({ lugares, seleccionadoId }: MapaGuatemalaZoomProps) {
  const [objetivo, setObjetivo] = useState(1);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);

  // Anima el zoom (el viewBox del SVG no se puede animar con CSS).
  useEffect(() => {
    const desde = zoomRef.current;
    if (desde === objetivo) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      zoomRef.current = objetivo;
      setZoom(objetivo);
      return;
    }

    let inicio: number | null = null;
    let frame = 0;
    const paso = (t: number) => {
      if (inicio === null) inicio = t;
      const p = Math.min((t - inicio) / DURACION_MS, 1);
      const suave = 1 - Math.pow(1 - p, 3); // easeOutCubic
      // Interpolación geométrica: el acercamiento se siente parejo en 1→2 y 2→4.
      const valor = desde * Math.pow(objetivo / desde, suave);
      zoomRef.current = valor;
      setZoom(valor);
      if (p < 1) frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [objetivo]);

  const botonZoom =
    'flex h-14 w-14 items-center justify-center bg-superficie text-marca-oscuro transition-all duration-150 hover:bg-marca-menta-suave active:scale-90 disabled:cursor-not-allowed disabled:text-borde-fuerte disabled:hover:bg-superficie disabled:active:scale-100';

  return (
    <div className="group relative overflow-hidden rounded-[20px] border border-borde bg-marca-menta-suave p-4 font-marca transition-all duration-300 hover:border-marca-verde/60 hover:shadow-lg">
      <MapaGuatemalaSvg
        lugares={lugares}
        seleccionadoId={seleccionadoId}
        zoom={zoom}
        className="mx-auto block aspect-square h-auto w-full max-w-[560px]"
      />

      <span className="absolute bottom-4 left-4 rounded-lg border border-borde bg-superficie px-3 py-1.5 text-sm font-semibold text-marca-oscuro shadow-sm">
        Mapa de referencia
      </span>

      <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-xl border border-marca-oscuro shadow-md">
        <button
          type="button"
          onClick={() => setObjetivo((z) => Math.min(z * 2, ZOOM_MAX))}
          disabled={objetivo >= ZOOM_MAX}
          aria-label="Acercar el mapa"
          className={`${botonZoom} border-b border-marca-oscuro`}
        >
          <Plus className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setObjetivo((z) => Math.max(z / 2, ZOOM_MIN))}
          disabled={objetivo <= ZOOM_MIN}
          aria-label="Alejar el mapa"
          className={botonZoom}
        >
          <Minus className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
