import { Droplets, Waves } from 'lucide-react';
import type { Lugar } from '@/types/lugar';
import { estadoAgua, formatearDistancia } from '@/lib/formato';
import { getEstadoGestion } from '@/lib/gestion-ejemplo';
import { EtiquetaEstado } from '@/components/gestion/EtiquetaEstado';

/**
 * Estado del lugar: "Nadie lo ha revisado", "Están trabajando en él", "Ya lo limpiaron"…
 * BOSQUEJO: el estado sale de los datos de ejemplo de `gestion-ejemplo.ts`.
 */
export function EtiquetaRevision({ lugar, className = '' }: { lugar: Lugar; className?: string }) {
  return <EtiquetaEstado estado={getEstadoGestion(lugar.id)} className={className} />;
}

/**
 * Distancia al agua con texto (nunca solo color):
 * cerca → "Cerca del agua (134 m)", lejos → "Agua a 2.1 km", sin dato → "Sin dato del agua".
 */
export function EtiquetaAgua({ lugar, className = '' }: { lugar: Lugar; className?: string }) {
  const estado = estadoAgua(lugar);
  const base = 'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-lg font-semibold text-marca-oscuro';

  if (estado === 'cerca') {
    return (
      <span className={`${base} border-marca-oscuro bg-superficie ${className}`}>
        <Droplets className="h-5 w-5 shrink-0" aria-hidden="true" />
        Cerca del agua ({formatearDistancia(lugar.distanciaAguaM)})
      </span>
    );
  }
  if (estado === 'lejos') {
    return (
      <span className={`${base} border-marca-menta bg-marca-menta-suave ${className}`}>
        <Waves className="h-5 w-5 shrink-0" aria-hidden="true" />
        Agua a {formatearDistancia(lugar.distanciaAguaM)}
      </span>
    );
  }
  return <span className={`${base} border-borde bg-superficie text-texto-secundario ${className}`}>Sin dato del agua</span>;
}
