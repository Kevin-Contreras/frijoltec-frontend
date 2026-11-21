interface DondeHayMasProps {
  ranking: { nombre: string; cantidad: number }[];
}

/** Barras horizontales: cuántos lugares hay en cada departamento. El número siempre va escrito. */
export function DondeHayMas({ ranking }: DondeHayMasProps) {
  const maximo = Math.max(1, ...ranking.map((r) => r.cantidad));
  // Empates en orden alfabético para que el orden sea estable.
  const ordenado = [...ranking].sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'));

  return (
    <section aria-labelledby="titulo-donde-hay-mas" className="rounded-[20px] border border-borde bg-superficie p-6 sm:p-10">
      <h2
        id="titulo-donde-hay-mas"
        className="mb-6 font-marca text-3xl font-bold text-marca-oscuro tracking-normal"
      >
        Dónde hay más
      </h2>

      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        {ordenado.map((d) => (
          <li
            key={d.nombre}
            className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[12rem_1fr_3rem]"
          >
            <span className="text-xl text-marca-oscuro">{d.nombre}</span>
            <span className="order-last col-span-2 h-6 overflow-hidden rounded-full bg-marca-menta sm:order-none sm:col-span-1" aria-hidden="true">
              <span
                className="block h-full rounded-full bg-marca-verde"
                style={{ width: `${(d.cantidad / maximo) * 100}%` }}
              />
            </span>
            <span className="text-right text-xl font-bold text-marca-oscuro">
              {d.cantidad}
              <span className="sr-only"> {d.cantidad === 1 ? 'lugar' : 'lugares'}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
