import Link from 'next/link';
import type { Lugar } from '@/types/lugar';
import { nombreCortoLugar } from '@/lib/formato';
import { MapaGuatemalaZoom } from '@/components/map/MapaGuatemalaZoom';
import { EtiquetaAgua, EtiquetaRevision } from '@/components/places/EtiquetasLugar';

interface MapaLugarSeleccionadoProps {
  lugares: Lugar[];
  lugar: Lugar;
}

/** Columna izquierda del formulario: mapa con zoom + datos básicos del lugar elegido. */
export function MapaLugarSeleccionado({ lugares, lugar }: MapaLugarSeleccionadoProps) {
  return (
    <div className="font-marca">
      <MapaGuatemalaZoom lugares={lugares} seleccionadoId={lugar.id} />

      <div className="mt-5 flex flex-wrap gap-3">
        <EtiquetaRevision lugar={lugar} />
        <EtiquetaAgua lugar={lugar} />
      </div>

      <p className="mt-4 mb-1 text-lg font-semibold text-texto-secundario">
        {nombreCortoLugar(lugar)} · {lugar.departamento}
      </p>
      <Link href="/contar" className="text-base font-semibold text-marca-oscuro underline underline-offset-2">
        Elegir otro lugar
      </Link>
    </div>
  );
}
