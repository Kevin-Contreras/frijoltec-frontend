'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp, Send } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import {
  fetchSecciones,
  fetchPropuestas,
  crearPropuesta,
  darMeGusta,
  type PropuestaBackend,
  type SeccionBackend,
} from '@/lib/api';
import {
  CATEGORIAS_PROPUESTA,
  MAX_PROPUESTA,
  PROPUESTAS_EJEMPLO,
  alternarMeGusta,
  getMeGusta,
  getPropuestas,
  guardarPropuesta,
  type Propuesta,
} from '@/lib/opiniones';

interface PropuestasProps {
  propuestasIniciales?: Propuesta[];
  seccionesIniciales?: SeccionBackend[];
}

/** "Cambios que propones": formulario + lista de propuestas conectado a la API de producción. */
export function Propuestas({ propuestasIniciales, seccionesIniciales }: PropuestasProps) {
  const [propuestas, setPropuestas] = useState<Propuesta[]>(() => {
    if (propuestasIniciales && propuestasIniciales.length > 0) {
      return propuestasIniciales;
    }
    return [];
  });
  const [secciones, setSecciones] = useState<SeccionBackend[]>(() => {
    if (seccionesIniciales && seccionesIniciales.length > 0) {
      return seccionesIniciales;
    }
    return [
      { id: 'mapa', nombre: 'Mapa' },
      { id: 'reportes', nombre: 'Reportes' },
    ];
  });
  const [meGusta, setMeGusta] = useState<string[]>([]);
  const [likesContador, setLikesContador] = useState<Record<string, number>>({});
  const [categoria, setCategoria] = useState<string>(() => {
    if (seccionesIniciales && seccionesIniciales.length > 0) {
      return seccionesIniciales[0].nombre;
    }
    return 'Mapa';
  });
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    let montado = true;
    async function inicializar() {
      setMeGusta(getMeGusta());

      try {
        const [secs, props] = await Promise.allSettled([fetchSecciones(), fetchPropuestas()]);

        if (montado && secs.status === 'fulfilled' && secs.value.length > 0) {
          setSecciones(secs.value);
          setCategoria(secs.value[0].nombre);
        }

        if (montado && props.status === 'fulfilled') {
          const mapeadas: Propuesta[] = props.value.map((p) => ({
            id: p.id,
            categoria: (p.seccion?.nombre || 'Mapa') as any,
            texto: p.texto,
            fecha: p.creadoEn,
          }));

          const conteos: Record<string, number> = {};
          props.value.forEach((p) => {
            conteos[p.id] = p.meGusta;
          });
          setLikesContador(conteos);

          setPropuestas(mapeadas);
          return;
        }
      } catch (err) {
        console.warn('Usando propuestas locales:', err);
      }
    }

    inicializar();
    return () => {
      montado = false;
    };
  }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio || enviando) return;

    setEnviando(true);
    try {
      const res = await crearPropuesta(categoria, limpio);
      const nueva: Propuesta = {
        id: res.id,
        categoria: (res.seccion?.nombre || categoria) as any,
        texto: res.texto,
        fecha: res.creadoEn,
      };
      setPropuestas((prev) => [nueva, ...prev]);
      guardarPropuesta(categoria as any, limpio);
      setTexto('');
      setEnviado(true);
    } catch (err) {
      console.error('Error al guardar propuesta en API, guardando local:', err);
      const nueva = guardarPropuesta(categoria as any, limpio);
      setPropuestas((prev) => [nueva, ...prev]);
      setTexto('');
      setEnviado(true);
    } finally {
      setEnviando(false);
    }
  };

  const manejarMeGusta = async (id: string) => {
    const yaMarcada = meGusta.includes(id);
    const nuevoMeGusta = alternarMeGusta(id);
    setMeGusta(nuevoMeGusta);

    // Si es un id del backend (no de ejemplo "ej-"), llamar a la API
    if (!id.startsWith('ej-') && !yaMarcada) {
      try {
        const res = await darMeGusta(id);
        setLikesContador((prev) => ({ ...prev, [id]: res.meGusta }));
      } catch (e) {
        console.error('Error enviando me gusta:', e);
      }
    }
  };

  return (
    <section aria-labelledby="titulo-propuestas" className="bg-marca-menta py-14 sm:py-16 font-marca">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal animation="fade-up">
          <h2
            id="titulo-propuestas"
            className="font-marca text-3xl sm:text-4xl font-bold text-marca-oscuro tracking-normal mb-2"
          >
            Cambios que propones
          </h2>
          <p className="mb-8 text-xl text-marca-oscuro">¿Qué le cambiarías a esta app?</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Formulario */}
          <Reveal animation="fade-up" delay={100}>
            <form onSubmit={enviar} className="rounded-[20px] border border-borde bg-superficie p-6 sm:p-7 shadow-sm">
              <label htmlFor="categoria-propuesta" className="mb-2 block text-lg font-bold text-marca-oscuro">
                Categoría
              </label>
              <select
                id="categoria-propuesta"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="mb-6 min-h-[56px] w-full max-w-xs rounded-xl border border-borde-fuerte bg-superficie px-4 text-lg transition-all focus:border-marca-oscuro focus:ring-2 focus:ring-marca-menta focus:outline-none"
              >
                {secciones.map((s) => (
                  <option key={s.id} value={s.nombre}>
                    {s.nombre}
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
                placeholder="Describe tu idea para mejorar la plataforma..."
                className="w-full resize-y rounded-xl border border-borde-fuerte p-3 text-lg transition-all focus:border-marca-oscuro focus:ring-2 focus:ring-marca-menta focus:outline-none"
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
                className="inline-flex min-h-[56px] items-center gap-2 rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white btn-bounce hover:bg-marca-oscuro-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Proponer cambio
              </button>
              <p role="status" className="mt-3 mb-0 text-base font-semibold text-principal animate-fade-in">
                {enviado ? '✓ Gracias. Tu propuesta se guardó en este equipo.' : ''}
              </p>
            </form>
          </Reveal>

          {/* Lista */}
          <Reveal animation="fade-up" delay={200}>
            <div className="rounded-[20px] border border-borde bg-superficie p-6 sm:p-7 shadow-sm">
              <h3 className="mb-4 font-marca text-lg font-bold text-marca-oscuro tracking-normal">
                Propuestas de otras personas
              </h3>
              <ul className="m-0 flex max-h-[440px] list-none flex-col gap-4 overflow-y-auto p-0 pr-2">
                {propuestas.length === 0 ? (
                  <li className="p-8 text-center text-texto-secundario rounded-xl border border-dashed border-borde">
                    Aún no hay propuestas registradas. ¡Sé el primero en proponer un cambio!
                  </li>
                ) : (
                  propuestas.map((p) => {
                    const marcada = meGusta.includes(p.id);
                    return (
                      <li
                        key={p.id}
                        className="rounded-[16px] border border-borde p-5 transition-all duration-200 hover:border-marca-verde/40 hover:shadow-sm"
                      >
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-marca-menta px-3 py-1 text-base font-semibold text-marca-oscuro">
                            {p.categoria}
                          </span>
                          {p.ejemplo && (
                            <span className="rounded-full border border-borde-fuerte bg-fondo px-2.5 py-0.5 text-sm font-semibold">
                              Ejemplo
                            </span>
                          )}
                        </div>
                        <p className="mb-4 text-lg leading-relaxed text-marca-oscuro">{p.texto}</p>
                        <button
                          type="button"
                          aria-pressed={marcada}
                          onClick={() => manejarMeGusta(p.id)}
                          className={`group inline-flex min-h-[52px] items-center gap-3 rounded-xl border px-6 text-lg font-bold transition-all duration-200 active:scale-95 ${
                            marcada
                              ? 'border-marca-oscuro bg-marca-oscuro text-white shadow-sm'
                              : 'border-marca-oscuro bg-superficie text-marca-oscuro hover:bg-marca-menta-suave'
                          }`}
                        >
                          <ThumbsUp
                            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                              marcada ? 'scale-110 text-marca-menta' : ''
                            }`}
                            aria-hidden="true"
                          />
                          Me gusta <span>{likesContador[p.id] ?? (marcada ? 1 : 0)}</span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
