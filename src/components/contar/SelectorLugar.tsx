'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Lugar, ReporteLocal } from '@/types/lugar';
import { nombreCortoLugar, normalizarTexto } from '@/lib/formato';
import { getReportesLocales } from '@/lib/storage';
import { fetchReportes, type ReporteBackend } from '@/lib/api';
import { MisReportes } from './MisReportes';

interface SelectorLugarProps {
  lugares: Lugar[];
}

const POR_PAGINA = 10;

/** Pantalla inicial: buscar y elegir el lugar que la persona visitó. */
export function SelectorLugar({ lugares }: SelectorLugarProps) {
  const [busqueda, setBusqueda] = useState('');
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [misReportes, setMisReportes] = useState<ReporteLocal[]>([]);
  const [reportesComunidad, setReportesComunidad] = useState<ReporteBackend[]>([]);

  useEffect(() => {
    setMisReportes(getReportesLocales());

    // Cargar reportes de campo de la comunidad desde el backend
    fetchReportes()
      .then((rep) => {
        if (rep && rep.length > 0) {
          setReportesComunidad(rep);
        }
      })
      .catch((err) => console.warn('No se pudieron cargar reportes del backend:', err));
  }, []);

  const filtrados = useMemo(() => {
    const q = normalizarTexto(busqueda);
    if (!q) return lugares;
    return lugares.filter((l) => normalizarTexto(`${l.direccion} ${l.departamento}`).includes(q));
  }, [busqueda, lugares]);

  return (
    <div className="mx-auto w-full max-w-4xl font-marca">
      <h1 className="font-marca text-4xl font-bold text-marca-oscuro tracking-normal mb-3">Contar lo que vi</h1>
      <p className="mb-8 text-xl text-texto-secundario">Primero elige el lugar que visitaste.</p>

      <label htmlFor="buscar-lugar" className="mb-2 block text-lg font-bold text-marca-oscuro">
        Busca por nombre o departamento
      </label>
      <input
        id="buscar-lugar"
        type="search"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setVisibles(POR_PAGINA);
        }}
        placeholder="Ej. Escuintla"
        autoComplete="off"
        className="mb-4 min-h-[60px] w-full rounded-xl border border-borde-fuerte bg-superficie px-4 text-lg focus:border-marca-oscuro"
      />

      <p role="status" className="sr-only">
        {filtrados.length} lugares encontrados
      </p>

      {filtrados.length === 0 ? (
        <p className="rounded-xl border border-borde bg-superficie p-5 text-lg text-texto-secundario">
          No encontramos lugares con &quot;{busqueda}&quot;. Prueba con el nombre del departamento.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {filtrados.slice(0, visibles).map((l) => (
            <li key={l.id}>
              <Link
                href={`/contar/${l.id}`}
                className="block rounded-xl border border-borde bg-superficie px-5 py-4 transition-colors hover:border-marca-oscuro hover:bg-marca-menta-suave"
              >
                <span className="block text-xl font-semibold text-marca-oscuro">{nombreCortoLugar(l)}</span>
                <span className="block text-lg text-texto-secundario">{l.departamento}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {visibles < filtrados.length && (
        <button
          type="button"
          onClick={() => setVisibles((v) => v + POR_PAGINA)}
          className="mt-5 inline-flex min-h-[56px] items-center rounded-xl border border-marca-oscuro bg-superficie px-6 text-lg font-bold text-marca-oscuro hover:bg-marca-menta-suave"
        >
          Mostrar más ({filtrados.length - visibles})
        </button>
      )}

      <MisReportes reportes={misReportes} reportesComunidad={reportesComunidad} />
    </div>
  );
}
