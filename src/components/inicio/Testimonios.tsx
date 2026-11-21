'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, UserRound } from 'lucide-react';
import {
  COMENTARIOS_EJEMPLO,
  MAX_COMENTARIO,
  getComentarios,
  guardarComentario,
  type Comentario,
} from '@/lib/opiniones';

/** "Lo que dicen quienes usaron la app": carrusel horizontal con formulario al final. */
export function Testimonios() {
  const [comentarios, setComentarios] = useState<Comentario[]>(COMENTARIOS_EJEMPLO);
  const [texto, setTexto] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [scroll, setScroll] = useState({ inicio: 0, ancho: 1, alInicio: true, alFinal: false });
  const carrilRef = useRef<HTMLUListElement>(null);

  // Los comentarios guardados solo existen en el navegador.
  useEffect(() => {
    setComentarios([...COMENTARIOS_EJEMPLO, ...getComentarios()]);
  }, []);

  const medir = useCallback(() => {
    const el = carrilRef.current;
    if (!el) return;
    const maximo = el.scrollWidth - el.clientWidth;
    const ancho = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    const progreso = maximo > 0 ? el.scrollLeft / maximo : 0;
    setScroll({
      ancho,
      inicio: progreso * (1 - ancho),
      alInicio: el.scrollLeft <= 2,
      alFinal: el.scrollLeft >= maximo - 2,
    });
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir, comentarios.length]);

  const mover = (direccion: 1 | -1) => {
    const el = carrilRef.current;
    if (!el) return;
    const tarjeta = el.querySelector('li');
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: paso * direccion, behavior: 'smooth' });
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    const nuevo = guardarComentario(limpio);
    setComentarios((prev) => [...prev, nuevo]);
    setTexto('');
    setEnviado(true);
  };

  return (
    <section aria-labelledby="titulo-testimonios" className="max-w-6xl mx-auto px-4 sm:px-6 w-full font-marca">
      <h2
        id="titulo-testimonios"
        className="font-marca text-3xl sm:text-4xl font-bold text-marca-oscuro tracking-normal mb-8"
      >
        Lo que dicen quienes usaron la app
      </h2>

      <ul
        ref={carrilRef}
        onScroll={medir}
        className="m-0 flex list-none snap-x snap-mandatory gap-5 overflow-x-auto p-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {comentarios.map((c) => (
          <li
            key={c.id}
            className="flex min-h-[300px] w-[85%] shrink-0 snap-start flex-col rounded-[20px] border border-borde bg-superficie p-6 sm:w-[400px]"
          >
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-marca-menta text-marca-oscuro">
                <UserRound className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold text-marca-oscuro">Anónimo</span>
              {c.ejemplo && (
                <span className="ml-auto rounded-full border border-borde-fuerte px-2.5 py-0.5 text-sm font-semibold">
                  Ejemplo
                </span>
              )}
            </div>
            <p className="m-0 text-lg leading-relaxed text-marca-oscuro">{c.texto}</p>
          </li>
        ))}

        {/* Última tarjeta: dejar un comentario */}
        <li className="w-[85%] shrink-0 snap-start rounded-[20px] border border-borde bg-superficie p-6 sm:w-[400px]">
          <form onSubmit={enviar} className="flex h-full flex-col">
            <div className="mb-3 flex items-baseline justify-between">
              <label htmlFor="comentario" className="text-lg font-bold text-marca-oscuro">
                Tu comentario
              </label>
              <span className="text-base text-texto-secundario">
                {texto.length}/{MAX_COMENTARIO}
              </span>
            </div>
            <textarea
              id="comentario"
              value={texto}
              maxLength={MAX_COMENTARIO}
              onChange={(e) => {
                setTexto(e.target.value);
                setEnviado(false);
              }}
              rows={3}
              className="mb-3 w-full resize-none rounded-xl border border-borde-fuerte p-3 text-lg focus:border-marca-oscuro"
            />
            <p className="mb-4 text-base text-texto-secundario">
              Tu comentario es anónimo. No guardamos tu nombre ni tus datos.
            </p>
            <button
              type="submit"
              disabled={!texto.trim()}
              className="inline-flex min-h-[56px] items-center self-start rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white transition-colors hover:bg-marca-oscuro-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar comentario
            </button>
            <p role="status" className="mt-3 mb-0 text-base font-semibold text-marca-oscuro">
              {enviado ? 'Gracias. Tu comentario se guardó en este equipo.' : ''}
            </p>
          </form>
        </li>
      </ul>

      {/* Barra de progreso y flechas */}
      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-marca-menta" aria-hidden="true">
          <div
            className="absolute inset-y-0 rounded-full bg-marca-oscuro transition-[left] duration-150"
            style={{ left: `${scroll.inicio * 100}%`, width: `${scroll.ancho * 100}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={scroll.alInicio}
          aria-label="Ver comentarios anteriores"
          className="flex h-14 w-14 items-center justify-center rounded-xl border border-marca-oscuro bg-superficie text-marca-oscuro hover:bg-marca-menta-suave disabled:cursor-not-allowed disabled:border-borde-fuerte disabled:text-borde-fuerte disabled:hover:bg-superficie"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={scroll.alFinal}
          aria-label="Ver más comentarios"
          className="flex h-14 w-14 items-center justify-center rounded-xl border border-marca-oscuro bg-superficie text-marca-oscuro hover:bg-marca-menta-suave disabled:cursor-not-allowed disabled:border-borde-fuerte disabled:text-borde-fuerte disabled:hover:bg-superficie"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
