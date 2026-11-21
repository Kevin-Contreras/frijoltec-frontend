'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import {
  CATEGORIAS_PROPUESTA,
  MAX_PROPUESTA,
  PROPUESTAS_EJEMPLO,
  alternarMeGusta,
  getMeGusta,
  getPropuestas,
  guardarPropuesta,
  type CategoriaPropuesta,
  type Propuesta,
} from '@/lib/opiniones';

/** "Cambios que propones": formulario + lista de propuestas con "Me gusta". */
export function Propuestas() {
  const [propuestas, setPropuestas] = useState<Propuesta[]>(PROPUESTAS_EJEMPLO);
  const [meGusta, setMeGusta] = useState<string[]>([]);
  const [categoria, setCategoria] = useState<CategoriaPropuesta>('Mapa');
  const [texto, setTexto] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    setPropuestas([...getPropuestas(), ...PROPUESTAS_EJEMPLO]);
    setMeGusta(getMeGusta());
  }, []);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    const nueva = guardarPropuesta(categoria, limpio);
    setPropuestas((prev) => [nueva, ...prev]);
    setTexto('');
    setEnviado(true);
  };

  return (
    <section aria-labelledby="titulo-propuestas" className="bg-marca-menta py-14 sm:py-16 font-marca">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          id="titulo-propuestas"
          className="font-marca text-3xl sm:text-4xl font-bold text-marca-oscuro tracking-normal mb-2"
        >
          Cambios que propones
        </h2>
        <p className="mb-8 text-xl text-marca-oscuro">¿Qué le cambiarías a esta app?</p>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Formulario */}
          <form onSubmit={enviar} className="rounded-[20px] border border-borde bg-superficie p-6">
            <label htmlFor="categoria-propuesta" className="mb-2 block text-lg font-bold text-marca-oscuro">
              Categoría
            </label>
            <select
              id="categoria-propuesta"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaPropuesta)}
              className="mb-6 min-h-[56px] w-full max-w-xs rounded-xl border border-borde-fuerte bg-superficie px-4 text-lg"
            >
              {CATEGORIAS_PROPUESTA.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label htmlFor="texto-propuesta" className="mb-2 block text-lg font-bold text-marca-oscuro">
              Tu propuesta
            </label>
            <textarea
              id="texto-propuesta"
              value={texto}
              maxLength={MAX_PROPUESTA}
              onChange={(e) => {
                setTexto(e.target.value);
                setEnviado(false);
              }}
              rows={4}
              className="w-full resize-y rounded-xl border border-borde-fuerte p-3 text-lg focus:border-marca-oscuro"
            />
            <p className="mt-1 mb-4 text-right text-base text-texto-secundario">
              {texto.length}/{MAX_PROPUESTA}
            </p>
            <p className="mb-5 text-base text-texto-secundario">
              Tu comentario es anónimo. No guardamos tu nombre ni tus datos.
            </p>
            <button
              type="submit"
              disabled={!texto.trim()}
              className="inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white transition-colors hover:bg-marca-oscuro-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proponer cambio
            </button>
            <p role="status" className="mt-3 mb-0 text-base font-semibold text-marca-oscuro">
              {enviado ? 'Gracias. Tu propuesta se guardó en este equipo.' : ''}
            </p>
          </form>

          {/* Lista */}
          <div className="rounded-[20px] border border-borde bg-superficie p-6">
            <h3 className="mb-4 font-marca text-lg font-bold text-marca-oscuro tracking-normal">
              Propuestas de otras personas
            </h3>
            <ul className="m-0 flex max-h-[420px] list-none flex-col gap-4 overflow-y-auto p-0 pr-2">
              {propuestas.map((p) => {
                const marcada = meGusta.includes(p.id);
                return (
                  <li key={p.id} className="rounded-[16px] border border-borde p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-marca-menta px-3 py-1 text-base font-semibold text-marca-oscuro">
                        {p.categoria}
                      </span>
                      {p.ejemplo && (
                        <span className="rounded-full border border-borde-fuerte px-2.5 py-0.5 text-sm font-semibold">
                          Ejemplo
                        </span>
                      )}
                    </div>
                    <p className="mb-4 text-lg leading-relaxed text-marca-oscuro">{p.texto}</p>
                    <button
                      type="button"
                      aria-pressed={marcada}
                      onClick={() => setMeGusta(alternarMeGusta(p.id))}
                      className={`inline-flex min-h-[52px] items-center gap-3 rounded-xl border px-6 text-lg font-bold transition-colors ${
                        marcada
                          ? 'border-marca-oscuro bg-marca-oscuro text-white'
                          : 'border-marca-oscuro bg-superficie text-marca-oscuro hover:bg-marca-menta-suave'
                      }`}
                    >
                      <ThumbsUp className="h-5 w-5" aria-hidden="true" />
                      Me gusta <span>{marcada ? 1 : 0}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
