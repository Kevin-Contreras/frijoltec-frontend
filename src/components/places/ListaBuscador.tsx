'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Lugar } from '@/types/lugar';
import { normalizarTexto } from '@/lib/formato';
import { TarjetaLugar } from './TarjetaLugar';

interface ListaBuscadorProps {
  lugares: Lugar[];
}

const ITEMS_POR_PAGINA = 9;

export function ListaBuscador({ lugares }: ListaBuscadorProps) {
  const [busqueda, setBusqueda] = useState('');
  const [limite, setLimite] = useState(ITEMS_POR_PAGINA);

  // Búsqueda sin tildes ni mayúsculas: "coban" encuentra "Cobán".
  const filtrados = useMemo(() => {
    const q = normalizarTexto(busqueda);
    if (!q) return lugares;
    return lugares.filter((l) => normalizarTexto(`${l.direccion} ${l.departamento}`).includes(q));
  }, [lugares, busqueda]);

  const cambiarBusqueda = (valor: string) => {
    setBusqueda(valor);
    setLimite(ITEMS_POR_PAGINA);
  };

  return (
    <div className="font-marca">
      <label htmlFor="buscar-lista" className="sr-only">
        Busca tu municipio o departamento
      </label>
      <div className="relative mb-8 max-w-3xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-texto-secundario"
          aria-hidden="true"
        />
        <input
          id="buscar-lista"
          type="search"
          value={busqueda}
          onChange={(e) => cambiarBusqueda(e.target.value)}
          placeholder="Busca tu municipio o departamento"
          autoComplete="off"
          className="min-h-[60px] w-full rounded-xl border border-borde-fuerte bg-superficie pl-12 pr-14 text-lg text-marca-oscuro placeholder:text-texto-secundario focus:border-marca-oscuro [&::-webkit-search-cancel-button]:hidden"
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => cambiarBusqueda('')}
            aria-label="Borrar búsqueda"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-texto-secundario hover:bg-marca-menta-suave hover:text-marca-oscuro"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <p role="status" className="mb-5 text-xl font-semibold text-marca-oscuro">
        {busqueda.trim()
          ? `Encontramos ${filtrados.length} ${filtrados.length === 1 ? 'lugar' : 'lugares'}`
          : `Hay ${lugares.length} lugares en total`}
      </p>

      {filtrados.length > 0 ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.slice(0, limite).map((lugar) => (
            <li key={lugar.id}>
              <TarjetaLugar lugar={lugar} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[20px] border border-borde bg-superficie p-8 text-center">
          <p className="mb-2 text-xl font-bold text-marca-oscuro">No encontramos lugares con &quot;{busqueda}&quot;</p>
          <p className="mb-6 text-lg text-texto-secundario">Prueba con el nombre de tu departamento.</p>
          <button
            type="button"
            onClick={() => cambiarBusqueda('')}
            className="inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white hover:bg-marca-oscuro-hover"
          >
            Ver todos los lugares
          </button>
        </div>
      )}

      {limite < filtrados.length && (
        <div className="pt-8 text-center">
          <button
            type="button"
            onClick={() => setLimite((prev) => prev + ITEMS_POR_PAGINA)}
            className="inline-flex min-h-[56px] items-center rounded-xl border border-marca-oscuro bg-superficie px-8 text-lg font-bold text-marca-oscuro hover:bg-marca-menta-suave"
          >
            Mostrar más ({filtrados.length - limite})
          </button>
        </div>
      )}
    </div>
  );
}
