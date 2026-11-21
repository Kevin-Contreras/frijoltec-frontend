import Link from 'next/link';

/** Recuadro final que invita a reportar. */
export function LlamadoContar() {
  return (
    <section
      aria-labelledby="titulo-llamado-contar"
      className="rounded-[20px] border border-marca-oscuro bg-marca-menta px-6 py-12 text-center sm:px-10"
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
        className="inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white transition-colors hover:bg-marca-oscuro-hover"
      >
        Contar lo que vi
      </Link>
    </section>
  );
}
