import Link from 'next/link';
import { Navigation } from 'lucide-react';
import { Lugar } from '@/types/lugar';
import { enlaceComoLlegar, nombreCortoLugar } from '@/lib/formato';
import { EtiquetaAgua, EtiquetaRevision } from './EtiquetasLugar';

interface TarjetaLugarProps {
  lugar: Lugar;
}

export function TarjetaLugar({ lugar }: TarjetaLugarProps) {
  return (
    <article className="flex h-full flex-col rounded-[20px] border border-borde bg-superficie p-6 font-marca">
      <EtiquetaRevision lugar={lugar} className="mb-4 w-full" />

      <h2 className="mb-1 font-marca text-2xl font-bold leading-snug text-marca-oscuro tracking-normal">
        {nombreCortoLugar(lugar)}
      </h2>
      <p className="mb-4 text-lg text-texto-secundario">{lugar.departamento}</p>

      <EtiquetaAgua lugar={lugar} className="mb-6 w-full" />

      <div className="mt-auto grid grid-cols-2 gap-3">
        <Link
          href={`/lugar/${lugar.id}`}
          className="inline-flex min-h-[60px] items-center justify-center rounded-xl bg-marca-oscuro px-4 text-xl font-bold text-white transition-colors hover:bg-marca-oscuro-hover"
        >
          Ver más
        </Link>
        <a
          href={enlaceComoLlegar(lugar)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-xl border border-marca-oscuro bg-superficie px-4 text-lg font-semibold leading-tight text-marca-oscuro transition-colors hover:bg-marca-menta-suave"
        >
          <Navigation className="h-5 w-5 shrink-0" aria-hidden="true" />
          Cómo llegar
          <span className="sr-only">(se abre Google Maps)</span>
        </a>
      </div>
    </article>
  );
}
