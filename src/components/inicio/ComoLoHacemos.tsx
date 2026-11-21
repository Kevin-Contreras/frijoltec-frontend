import { Cpu, Footprints, Satellite, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const PASOS: { icono: LucideIcon; texto: string }[] = [
  { icono: Satellite, texto: 'Un satélite toma fotos del país desde el espacio.' },
  { icono: Cpu, texto: 'Una computadora marca los lugares que parecen basureros.' },
  { icono: Footprints, texto: 'Personas como tú van y nos cuentan si es cierto.' },
];

export function ComoLoHacemos() {
  return (
    <section aria-labelledby="titulo-como" className="max-w-6xl mx-auto px-4 sm:px-6 w-full font-marca">
      <Reveal animation="fade-up">
        <h2 id="titulo-como" className="font-marca text-3xl sm:text-4xl font-bold text-marca-oscuro tracking-normal mb-8">
          Cómo lo hacemos
        </h2>
      </Reveal>

      <ol className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
        {PASOS.map(({ icono: Icono, texto }, i) => (
          <li key={texto} className="h-full">
            <Reveal animation="fade-up" delay={i * 140} duration={600} className="h-full">
              <div className="group flex h-full gap-5 rounded-[20px] bg-marca-menta-suave p-7 border border-transparent transition-all duration-300 hover:-translate-y-1.5 hover:border-marca-verde/40 hover:shadow-md">
                <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-marca-oscuro text-lg font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {i + 1}
                </span>
                <div>
                  <Icono className="mb-2 h-7 w-7 text-marca-oscuro transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" aria-hidden="true" />
                  <p className="m-0 text-lg leading-snug text-marca-oscuro">{texto}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal animation="fade-in" delay={400}>
        <p className="mt-10 mb-0 text-base text-texto-secundario">
          Datos de Global Plastic Watch — Earthrise Media / Minderoo Foundation (CC BY-NC 4.0).
        </p>
      </Reveal>
    </section>
  );
}
