import { Cpu, Footprints, Satellite, type LucideIcon } from 'lucide-react';

const PASOS: { icono: LucideIcon; texto: string }[] = [
  { icono: Satellite, texto: 'Un satélite toma fotos del país desde el espacio.' },
  { icono: Cpu, texto: 'Una computadora marca los lugares que parecen basureros.' },
  { icono: Footprints, texto: 'Personas como tú van y nos cuentan si es cierto.' },
];

export function ComoLoHacemos() {
  return (
    <section aria-labelledby="titulo-como" className="max-w-6xl mx-auto px-4 sm:px-6 w-full font-marca">
      <h2 id="titulo-como" className="font-marca text-3xl sm:text-4xl font-bold text-marca-oscuro tracking-normal mb-8">
        Cómo lo hacemos
      </h2>

      <ol className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
        {PASOS.map(({ icono: Icono, texto }, i) => (
          <li key={texto} className="flex gap-5 rounded-[20px] bg-marca-menta-suave p-7">
            <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-marca-oscuro text-lg font-bold text-white">
              {i + 1}
            </span>
            <div>
              <Icono className="mb-2 h-7 w-7 text-marca-oscuro" aria-hidden="true" />
              <p className="m-0 text-lg leading-snug text-marca-oscuro">{texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 mb-0 text-base text-texto-secundario">
        Datos de Global Plastic Watch — Earthrise Media / Minderoo Foundation (CC BY-NC 4.0).
      </p>
    </section>
  );
}
