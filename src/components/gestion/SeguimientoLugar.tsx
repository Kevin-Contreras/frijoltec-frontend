import Link from 'next/link';
import { getHistorialVista } from '@/lib/gestion-vista';
import { HistorialActualizaciones } from './HistorialActualizaciones';

/** Sección pública en "Un lugar": qué organizaciones lo atienden y qué han hecho. */
export function SeguimientoLugar({ lugarId }: { lugarId: string }) {
  const historial = getHistorialVista(lugarId);

  return (
    <section aria-labelledby="titulo-seguimiento" className="rounded-[20px] border border-borde bg-superficie p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="titulo-seguimiento" className="m-0 font-marca text-2xl font-bold text-marca-oscuro tracking-normal">
          ¿Quién lo está atendiendo?
        </h2>
        {historial.length > 0 && (
          <span className="rounded-full border border-borde-fuerte px-2.5 py-0.5 text-sm font-semibold">Ejemplo</span>
        )}
      </div>

      {historial.length > 0 ? (
        <HistorialActualizaciones items={historial} />
      ) : (
        <p className="mb-0 text-lg text-texto-secundario">Todavía ninguna municipalidad u organización lo está atendiendo.</p>
      )}

      <p className="mt-4 mb-0 text-base text-texto-secundario">
        ¿Eres de una municipalidad o asociación?{' '}
        <Link href="/organizaciones" className="font-semibold text-marca-oscuro underline">
          Súmate para ayudar
        </Link>
      </p>
    </section>
  );
}
