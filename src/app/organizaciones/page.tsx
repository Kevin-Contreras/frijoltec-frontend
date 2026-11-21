import { Metadata } from 'next';
import Link from 'next/link';
import { Bell, ClipboardCheck, HandHelping, type LucideIcon } from 'lucide-react';
import { BannerBosquejo } from '@/components/gestion/BannerBosquejo';

export const metadata: Metadata = {
  title: 'Para municipalidades y organizaciones · Basureros en Guatemala',
  description: 'Recibe los avisos de los vecinos y cuenta cómo va la limpieza de cada lugar.',
};

const PASOS: { icono: LucideIcon; titulo: string; texto: string }[] = [
  { icono: Bell, titulo: 'Recibes avisos', texto: 'Los vecinos te avisan cuando encuentran basura en tu zona.' },
  { icono: HandHelping, titulo: 'Dices que lo atiendes', texto: 'Marcas los lugares en los que tu organización va a trabajar.' },
  { icono: ClipboardCheck, titulo: 'Cuentas cómo va', texto: 'Publicas el avance con fotos para que todos lo vean.' },
];

export default function OrganizacionesPage() {
  return (
    <div className="w-full flex-1 bg-marca-fondo font-marca">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
        <BannerBosquejo />

        <div className="max-w-3xl">
          <h1 className="mb-4 font-marca text-4xl font-bold text-marca-oscuro tracking-normal sm:text-5xl">
            Para municipalidades y organizaciones
          </h1>
          <p className="m-0 text-xl leading-relaxed text-texto-secundario">
            Municipalidades, asociaciones y grupos de vecinos pueden recibir los avisos de la gente y contar qué están
            haciendo para limpiar cada lugar.
          </p>
        </div>

        <ol className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
          {PASOS.map(({ icono: Icono, titulo, texto }, i) => (
            <li key={titulo} className="rounded-[20px] border border-borde bg-superficie p-7">
              <span className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-xl bg-marca-menta text-marca-oscuro">
                <Icono className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mb-2 text-2xl font-bold text-marca-oscuro">
                {i + 1}. {titulo}
              </p>
              <p className="m-0 text-lg text-texto-secundario">{texto}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/organizaciones/registro"
            className="inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white hover:bg-marca-oscuro-hover"
          >
            Registrar mi organización
          </Link>
          <Link
            href="/organizaciones/entrar"
            className="inline-flex min-h-[56px] items-center rounded-xl border border-marca-oscuro bg-superficie px-6 text-xl font-semibold text-marca-oscuro hover:bg-marca-menta-suave"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
