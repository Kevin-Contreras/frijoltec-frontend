'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';

interface DondeHayMasProps {
  ranking: { nombre: string; cantidad: number }[];
}

/** Barras horizontales: cuántos lugares hay en cada departamento con animación elegante de llenado. */
export function DondeHayMas({ ranking }: DondeHayMasProps) {
  const maximo = Math.max(1, ...ranking.map((r) => r.cantidad));
  // Empates en orden alfabético para que el orden sea estable.
  const ordenado = [...ranking].sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'));

  const [animado, setAnimado] = useState(false);
  const seccionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimado(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimado(true);
          if (seccionRef.current) {
            observer.unobserve(seccionRef.current);
          }
        }
      },
      { threshold: 0.15 }
    );

    const el = seccionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <Reveal animation="fade-up">
      <section
        ref={seccionRef}
        aria-labelledby="titulo-donde-hay-mas"
        className="rounded-[20px] border border-borde bg-superficie p-6 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <h2
          id="titulo-donde-hay-mas"
          className="mb-6 font-marca text-3xl font-bold text-marca-oscuro tracking-normal"
        >
          Dónde hay más
        </h2>

        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {ordenado.map((d, index) => {
            const porcentaje = (d.cantidad / maximo) * 100;
            return (
              <li
                key={d.nombre}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[12rem_1fr_3rem] rounded-lg p-1.5 transition-colors duration-200 hover:bg-marca-menta-suave/40"
              >
                <span className="text-xl font-medium text-marca-oscuro transition-colors group-hover:text-principal">
                  {d.nombre}
                </span>
                <span
                  className="order-last col-span-2 h-6 overflow-hidden rounded-full bg-marca-menta sm:order-none sm:col-span-1 shadow-inner"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full bg-marca-verde transition-[width] duration-1000 ease-out"
                    style={{
                      width: animado ? `${porcentaje}%` : '0%',
                      transitionDelay: `${Math.min(index * 60, 600)}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </span>
                <span className="text-right text-xl font-bold text-marca-oscuro">
                  {d.cantidad}
                  <span className="sr-only"> {d.cantidad === 1 ? 'lugar' : 'lugares'}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </Reveal>
  );
}
