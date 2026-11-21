'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, Users } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import type { EstadoGestion } from '@/lib/gestion-ejemplo';
import { EtiquetaEstado } from './EtiquetaEstado';

export interface FilaBandeja {
  lugarId: string;
  nombre: string;
  departamento: string;
  estado: EstadoGestion;
  avisos: number;
  conFoto: number;
  ultimoAviso: string | null; // ya formateado
  cercaAgua: boolean;
  distanciaTexto: string;
}

type Pestana = 'pendientes' | 'en_proceso' | 'cerrados' | 'todos';

const PESTANAS: { id: Pestana; texto: string; estados: EstadoGestion[] }[] = [
  { id: 'pendientes', texto: 'Por atender', estados: ['sin_revisar', 'avisado'] },
  { id: 'en_proceso', texto: 'En proceso', estados: ['en_proceso'] },
  { id: 'cerrados', texto: 'Cerrados', estados: ['resuelto', 'no_es_basurero'] },
  { id: 'todos', texto: 'Todos', estados: ['sin_revisar', 'avisado', 'en_proceso', 'resuelto', 'no_es_basurero'] },
];

/** Lista de lugares de la zona de la organización, con pestañas por estado. */
export function BandejaAvisos({ filas }: { filas: FilaBandeja[] }) {
  const [pestana, setPestana] = useState<Pestana>('pendientes');
  const actual = PESTANAS.find((p) => p.id === pestana)!;
  const visibles = filas.filter((f) => actual.estados.includes(f.estado));

  return (
    <section aria-labelledby="titulo-bandeja">
      <h2 id="titulo-bandeja" className="mb-5 font-marca text-3xl font-bold text-marca-oscuro tracking-normal">
        Lugares en tu zona
      </h2>

      <div role="tablist" aria-label="Filtrar por estado" className="mb-6 flex flex-wrap gap-2">
        {PESTANAS.map((p) => {
          const cantidad = filas.filter((f) => p.estados.includes(f.estado)).length;
          const activa = p.id === pestana;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={activa}
              onClick={() => setPestana(p.id)}
              className={`inline-flex min-h-[52px] items-center gap-2 rounded-xl border px-5 text-lg font-semibold transition-all duration-200 active:scale-95 ${
                activa
                  ? 'border-marca-oscuro bg-marca-oscuro text-white shadow-md'
                  : 'border-borde-fuerte bg-superficie text-marca-oscuro hover:-translate-y-0.5 hover:bg-marca-menta-suave hover:shadow-sm'
              }`}
            >
              {p.texto}
              <span className={`rounded-full px-2 text-base ${activa ? 'bg-white/20' : 'bg-marca-menta'}`}>{cantidad}</span>
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        <p key={pestana} className="rounded-[20px] border border-borde bg-superficie p-6 text-lg text-texto-secundario animate-fade-in">
          No hay lugares en esta pestaña.
        </p>
      ) : (
        // key={pestana}: al cambiar de pestaña la lista se vuelve a montar y las tarjetas entran de nuevo.
        <ul key={pestana} className="m-0 flex list-none flex-col gap-4 p-0">
          {visibles.map((f, index) => (
            <li key={f.lugarId}>
            <Reveal animation="fade-up" delay={Math.min(index * 70, 420)} duration={500}>
            <div className="flex flex-col gap-4 rounded-[20px] border border-borde bg-superficie p-6 card-interactive hover:border-marca-verde/40 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <EtiquetaEstado estado={f.estado} />
                  {f.cercaAgua && (
                    <span className="inline-flex items-center rounded-full border border-alerta bg-alerta-suave px-4 py-1.5 text-lg font-semibold text-alerta-texto">
                      Cerca del agua ({f.distanciaTexto})
                    </span>
                  )}
                </div>
                <p className="mb-1 text-2xl font-bold text-marca-oscuro">{f.nombre}</p>
                <p className="mb-3 text-lg text-texto-secundario">{f.departamento}</p>
                <p className="m-0 flex flex-wrap gap-x-5 gap-y-1 text-lg text-marca-oscuro">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-5 w-5" aria-hidden="true" />
                    {f.avisos === 0 ? 'Sin avisos de vecinos' : `${f.avisos} ${f.avisos === 1 ? 'aviso' : 'avisos'} de vecinos`}
                  </span>
                  {f.conFoto > 0 && (
                    <span className="inline-flex items-center gap-2">
                      <Camera className="h-5 w-5" aria-hidden="true" />
                      {f.conFoto} con foto
                    </span>
                  )}
                  {f.ultimoAviso && <span className="text-texto-secundario">Último: {f.ultimoAviso}</span>}
                </p>
              </div>
              <Link
                href={`/panel/lugar/${f.lugarId}`}
                className="group/boton inline-flex min-h-[56px] shrink-0 items-center justify-center gap-2 rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
              >
                Ver y actualizar
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/boton:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
            </Reveal>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
