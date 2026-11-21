import { Camera, Lock } from 'lucide-react';
import type { EstadoReporte } from '@/types/lugar';
import { formatearFecha, type AvisoVecino } from '@/lib/gestion-ejemplo';

const RESPUESTA: Record<EstadoReporte, string> = {
  si_hay_basura: 'Sí, hay basura',
  no_hay_basura: 'No, no hay basura',
  no_pude_entrar: 'No pude entrar',
};

/** Lo que contaron los vecinos sobre el lugar (solo lo ve la organización). */
export function AvisosVecinos({ avisos }: { avisos: AvisoVecino[] }) {
  if (avisos.length === 0) {
    return <p className="m-0 text-lg text-texto-secundario">Ningún vecino ha contado nada de este lugar todavía.</p>;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0">
      {avisos.map((a) => (
        <li key={a.id} className="rounded-2xl border border-borde bg-superficie p-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-marca-menta px-3 py-1 text-base font-semibold text-marca-oscuro">
              {RESPUESTA[a.respuesta]}
            </span>
            <span className="text-base text-texto-secundario">{formatearFecha(a.fecha)}</span>
          </div>
          {a.notas && <p className="mb-2 text-lg text-marca-oscuro">“{a.notas}”</p>}
          <p className="m-0 flex flex-wrap gap-x-5 gap-y-1 text-base text-texto-secundario">
            {a.conFoto && (
              <span className="inline-flex items-center gap-1.5">
                <Camera className="h-4 w-4" aria-hidden="true" /> Mandó foto
              </span>
            )}
            {a.contacto ? (
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4" aria-hidden="true" /> Contacto: {a.contacto} (solo lo ve tu organización)
              </span>
            ) : (
              <span>Sin datos de contacto</span>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}
