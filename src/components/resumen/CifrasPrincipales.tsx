interface CifrasPrincipalesProps {
  total: number;
  departamentos: number;
  cercaAgua: number;
  revisados: number;
}

/** Los 3 números grandes del resumen, cada uno con su frase. */
export function CifrasPrincipales({ total, departamentos, cercaAgua, revisados }: CifrasPrincipalesProps) {
  const cifras = [
    { numero: total, frase: `lugares en ${departamentos} departamentos` },
    { numero: cercaAgua, frase: 'a menos de 500 m del agua' },
    { numero: revisados, frase: revisados === 1 ? 'lugar revisado en persona' : 'lugares revisados en persona' },
  ];

  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
      {cifras.map((c) => (
        <li key={c.frase} className="rounded-[20px] border border-borde bg-superficie px-7 py-7">
          <span className="block font-marca text-6xl font-bold leading-none text-marca-oscuro">{c.numero}</span>
          <span className="mt-4 block text-xl text-texto-secundario">{c.frase}</span>
        </li>
      ))}
    </ul>
  );
}
