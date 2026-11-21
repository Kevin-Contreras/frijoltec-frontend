import type { EstadoReporte, ReporteLocal } from '@/types/lugar';
import type { ReporteBackend } from '@/lib/api';
import { Reveal } from '@/components/ui/Reveal';

const TEXTO_ESTADO: Record<EstadoReporte | string, string> = {
  si_hay_basura: 'Sí, hay basura',
  hay_basura: 'Sí, hay basura',
  no_hay_basura: 'No, no hay basura',
  no_pude_entrar: 'No pude entrar',
};

interface MisReportesProps {
  reportes: ReporteLocal[];
  reportesComunidad?: ReporteBackend[];
}

/** Reportes locales guardados en este equipo y reportes de campo de la comunidad desde el backend. */
export function MisReportes({ reportes, reportesComunidad = [] }: MisReportesProps) {
  if (reportes.length === 0 && reportesComunidad.length === 0) return null;

  return (
    <div className="mt-12 space-y-8">
      {reportes.length > 0 && (
        <section aria-labelledby="titulo-mis-reportes">
          <h2 id="titulo-mis-reportes" className="font-marca text-2xl font-bold text-marca-oscuro tracking-normal mb-4">
            Lo que ya contaste ({reportes.length})
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {reportes.map((r, i) => (
              <li key={r.id}>
              <Reveal animation="fade-up" delay={Math.min(i * 60, 360)} duration={500}>
              <div className="rounded-xl border border-borde bg-superficie px-5 py-4 card-interactive hover:border-marca-verde/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-marca-menta px-3 py-1 text-base font-semibold text-marca-oscuro">
                    {TEXTO_ESTADO[r.estado] || r.estado}
                  </span>
                  <span className="text-base text-texto-secundario">
                    {new Date(r.fechaVisita ? `${r.fechaVisita}T12:00:00` : r.fecha).toLocaleDateString('es-GT')}
                  </span>
                </div>
                <p className="mt-2 mb-0 line-clamp-1 text-lg text-marca-oscuro">{r.lugarNombre}</p>
                {r.notas && <p className="mt-1 mb-0 text-base italic text-texto-secundario">“{r.notas}”</p>}
              </div>
              </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {reportesComunidad.length > 0 && (
        <section aria-labelledby="titulo-reportes-comunidad">
          <h2 id="titulo-reportes-comunidad" className="font-marca text-2xl font-bold text-marca-oscuro tracking-normal mb-4">
            Reportes verificados en campo ({reportesComunidad.length})
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {reportesComunidad.map((r, i) => (
              <li key={r.id}>
              <Reveal animation="fade-up" delay={Math.min(i * 60, 360)} duration={500}>
              <div className="rounded-xl border border-borde bg-superficie px-5 py-4 card-interactive hover:border-marca-verde/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-marca-menta px-3 py-1 text-base font-semibold text-marca-oscuro">
                    {TEXTO_ESTADO[r.resultado] || r.resultado}
                  </span>
                  <span className="text-base text-texto-secundario">
                    {new Date(r.fechaVisita ? `${r.fechaVisita}T12:00:00` : r.creadoEn).toLocaleDateString('es-GT')}
                  </span>
                </div>
                {r.notas && <p className="mt-2 mb-0 text-base text-marca-oscuro">“{r.notas}”</p>}
                {r.fotos && r.fotos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.fotos.map((f) => (
                      <img key={f.id} src={f.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    ))}
                  </div>
                )}
              </div>
              </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
