import type { EstadoReporte, ReporteLocal } from '@/types/lugar';

const TEXTO_ESTADO: Record<EstadoReporte, string> = {
  si_hay_basura: 'Sí, hay basura',
  no_hay_basura: 'No, no hay basura',
  no_pude_entrar: 'No pude entrar',
};

/** Reportes que esta persona ya guardó en su navegador. */
export function MisReportes({ reportes }: { reportes: ReporteLocal[] }) {
  if (reportes.length === 0) return null;

  return (
    <section aria-labelledby="titulo-mis-reportes" className="mt-12">
      <h2 id="titulo-mis-reportes" className="font-marca text-2xl font-bold text-marca-oscuro tracking-normal mb-4">
        Lo que ya contaste ({reportes.length})
      </h2>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {reportes.map((r) => (
          <li key={r.id} className="rounded-xl border border-borde bg-superficie px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-marca-menta px-3 py-1 text-base font-semibold text-marca-oscuro">
                {TEXTO_ESTADO[r.estado]}
              </span>
              <span className="text-base text-texto-secundario">
                {new Date(r.fechaVisita ? `${r.fechaVisita}T12:00:00` : r.fecha).toLocaleDateString('es-GT')}
              </span>
            </div>
            <p className="mt-2 mb-0 line-clamp-1 text-lg text-marca-oscuro">{r.lugarNombre}</p>
            {r.notas && <p className="mt-1 mb-0 text-base italic text-texto-secundario">“{r.notas}”</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
