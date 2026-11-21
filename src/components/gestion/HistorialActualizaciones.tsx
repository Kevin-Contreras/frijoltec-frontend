import { Camera } from 'lucide-react';
import { TIPOS_ORGANIZACION, type EstadoGestion, type TipoOrganizacion } from '@/lib/gestion-ejemplo';
import { EtiquetaEstado } from './EtiquetaEstado';

export interface ActualizacionVista {
  id: string;
  organizacion: string;
  tipo: TipoOrganizacion;
  estado: EstadoGestion;
  nota: string;
  fecha: string; // ya formateada
  conFoto?: boolean;
  /** true = la acaba de escribir quien está usando el bosquejo (no se guarda). */
  nueva?: boolean;
}

/** Línea de tiempo de lo que han hecho las organizaciones en un lugar. */
export function HistorialActualizaciones({ items }: { items: ActualizacionVista[] }) {
  if (items.length === 0) {
    return <p className="m-0 text-lg text-texto-secundario">Todavía ninguna organización ha dado actualizaciones.</p>;
  }

  return (
    <ol className="m-0 flex list-none flex-col gap-4 p-0">
      {items.map((u) => (
        <li key={u.id} className="rounded-2xl border border-borde bg-superficie p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <EtiquetaEstado estado={u.estado} />
            {u.nueva && (
              <span className="rounded-full border border-borde-fuerte px-2.5 py-0.5 text-sm font-semibold">
                Nueva (no se guarda)
              </span>
            )}
          </div>
          <p className="mb-2 text-lg text-marca-oscuro">{u.nota}</p>
          <p className="m-0 flex flex-wrap items-center gap-x-3 text-base text-texto-secundario">
            <span className="font-semibold text-marca-oscuro">{u.organizacion}</span>
            <span>{TIPOS_ORGANIZACION[u.tipo]}</span>
            <span>· {u.fecha}</span>
            {u.conFoto && (
              <span className="inline-flex items-center gap-1">
                · <Camera className="h-4 w-4" aria-hidden="true" /> con foto
              </span>
            )}
          </p>
        </li>
      ))}
    </ol>
  );
}
