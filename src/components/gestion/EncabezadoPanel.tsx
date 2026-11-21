import Link from 'next/link';
import { Building2, LogOut } from 'lucide-react';
import { TIPOS_ORGANIZACION, type Organizacion } from '@/lib/gestion-ejemplo';

/** Barra superior del panel con la organización que "entró". */
export function EncabezadoPanel({ organizacion }: { organizacion: Organizacion }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-marca-oscuro px-6 py-5 text-white shadow-md animate-fade-in-up">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-marca-menta text-marca-oscuro">
          <Building2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="m-0 text-xl font-bold">{organizacion.nombre}</p>
          <p className="m-0 text-base text-white/80">
            {TIPOS_ORGANIZACION[organizacion.tipo]} · {organizacion.departamento}
          </p>
        </div>
      </div>
      <Link
        href="/organizaciones"
        className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/40 px-4 text-lg font-semibold text-white transition-colors hover:border-marca-menta hover:bg-white/10 hover:text-marca-menta"
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
        Salir
      </Link>
    </div>
  );
}
