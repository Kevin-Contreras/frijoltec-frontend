import Link from 'next/link';
import { List, Map, Megaphone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex w-full flex-1 items-center bg-marca-fondo font-marca">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="relative mb-8">
          <img src="/marca/icono-verde.svg" alt="" aria-hidden="true" className="h-36 w-auto sm:h-44" />
        </div>

        <p className="mb-2 text-7xl font-bold leading-none text-marca-oscuro sm:text-8xl" aria-hidden="true">
          404
        </p>
        <h1 className="mb-4 font-marca text-3xl font-bold text-marca-oscuro tracking-normal sm:text-4xl">
          No encontramos esta página
        </h1>
        <p className="mb-10 max-w-xl text-xl leading-relaxed text-texto-secundario">
          Puede que el enlace esté mal escrito o que la página ya no exista. Puedes seguir desde aquí:
        </p>

        <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white transition-colors hover:bg-marca-oscuro-hover"
          >
            Ir al inicio
          </Link>
          <Link
            href="/mapa"
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl border border-marca-oscuro bg-superficie px-6 text-xl font-semibold text-marca-oscuro transition-colors hover:bg-marca-menta-suave"
          >
            <Map className="h-5 w-5" aria-hidden="true" />
            Ver el mapa
          </Link>
          <Link
            href="/lista"
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl border border-marca-oscuro bg-superficie px-6 text-xl font-semibold text-marca-oscuro transition-colors hover:bg-marca-menta-suave"
          >
            <List className="h-5 w-5" aria-hidden="true" />
            Buscar un lugar
          </Link>
        </div>

        <Link
          href="/contar"
          className="mt-8 inline-flex min-h-[48px] items-center gap-2 text-lg font-semibold text-marca-oscuro underline underline-offset-2"
        >
          <Megaphone className="h-5 w-5" aria-hidden="true" />
          ¿Fuiste a un lugar? Cuéntanos lo que viste
        </Link>
      </div>
    </div>
  );
}
