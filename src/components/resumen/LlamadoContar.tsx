import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { Megaphone } from 'lucide-react';

/** Recuadro final que invita a reportar. */
export function LlamadoContar() {
  return (
    <Reveal animation="scale-up">
      <section
        aria-labelledby="titulo-llamado-contar"
        className="rounded-[20px] border border-marca-oscuro bg-marca-menta px-6 py-12 text-center sm:px-10 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <h2
          id="titulo-llamado-contar"
          className="mb-3 font-marca text-3xl font-bold text-marca-oscuro tracking-normal sm:text-4xl"
        >
          ¿Conoces alguno de estos lugares?
        </h2>
        <p className="mb-8 text-xl text-marca-oscuro">Tu visita nos ayuda a saber si de verdad es un basurero.</p>
        <Link
          href="/contar"
          className="inline-flex min-h-[56px] items-center gap-2.5 rounded-xl bg-marca-oscuro px-8 text-xl font-bold text-white shadow-md btn-bounce hover:bg-marca-oscuro-hover"
        >
          <Megaphone className="h-6 w-6" aria-hidden="true" />
          Contar lo que vi
        </Link>
      </section>
    </Reveal>
  );
}
