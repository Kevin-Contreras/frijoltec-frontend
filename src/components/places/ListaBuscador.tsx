'use client';

import { useState, useMemo } from 'react';
import { Lugar } from '@/types/lugar';
import { normalizarTexto, estadoAgua } from '@/lib/formato';
import { TarjetaLugar } from './TarjetaLugar';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

interface ListaBuscadorProps {
  lugares: Lugar[];
  departamentos: string[];
}

const ITEMS_POR_PAGINA = 9;

export function ListaBuscador({ lugares, departamentos }: ListaBuscadorProps) {
  const [busqueda, setBusqueda] = useState('');
  const [deptoSeleccionado, setDeptoSeleccionado] = useState('todos');
  const [filtroAgua, setFiltroAgua] = useState<'todos' | 'cerca' | 'lejos'>('todos');
  const [limite, setLimite] = useState(ITEMS_POR_PAGINA);

  // Filtrar lugares con búsqueda insensible a tildes y mayúsculas
  const filtrados = useMemo(() => {
    const textoNorm = normalizarTexto(busqueda);

    return lugares.filter((lugar) => {
      // Filtro de texto (dirección, departamento, id)
      if (textoNorm) {
        const direccionNorm = normalizarTexto(lugar.direccion);
        const deptoNorm = normalizarTexto(lugar.departamento);
        const idNorm = normalizarTexto(lugar.id);
        const coincide =
          direccionNorm.includes(textoNorm) ||
          deptoNorm.includes(textoNorm) ||
          idNorm.includes(textoNorm);
        if (!coincide) return false;
      }

      // Filtro por departamento
      if (deptoSeleccionado !== 'todos' && lugar.departamento !== deptoSeleccionado) {
        return false;
      }

      // Filtro por agua
      if (filtroAgua === 'cerca' && estadoAgua(lugar) !== 'cerca') {
        return false;
      }
      if (filtroAgua === 'lejos' && estadoAgua(lugar) !== 'lejos') {
        return false;
      }

      return true;
    });
  }, [lugares, busqueda, deptoSeleccionado, filtroAgua]);

  const lugaresVisibles = useMemo(() => {
    return filtrados.slice(0, limite);
  }, [filtrados, limite]);

  const hayMas = limite < filtrados.length;

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y controles */}
      <div className="bg-superficie border border-borde rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        {/* Buscador grande con icono y botón de borrar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-texto-secundario" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setLimite(ITEMS_POR_PAGINA);
            }}
            placeholder="Buscar por municipio, dirección o departamento (ej. Cobán, Mixco, Petén)..."
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-borde focus:border-principal focus:ring-0 bg-fondo text-texto font-medium text-base sm:text-lg transition-colors placeholder:text-texto-secundario/70"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                setLimite(ITEMS_POR_PAGINA);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-texto-secundario hover:text-texto rounded-full hover:bg-superficie"
              aria-label="Borrar búsqueda"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filtros desplegables */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filtro departamento */}
            <div className="flex-1 sm:flex-initial">
              <label htmlFor="lista-depto" className="sr-only">
                Departamento
              </label>
              <select
                id="lista-depto"
                value={deptoSeleccionado}
                onChange={(e) => {
                  setDeptoSeleccionado(e.target.value);
                  setLimite(ITEMS_POR_PAGINA);
                }}
                className="w-full sm:w-auto bg-fondo border border-borde rounded-xl px-4 py-2.5 text-sm font-semibold text-texto focus:border-principal cursor-pointer"
              >
                <option value="todos">Todos los departamentos ({lugares.length})</option>
                {departamentos.map((d) => (
                  <option key={d} value={d}>
                    {d} ({lugares.filter((l) => l.departamento === d).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro agua */}
            <div className="flex-1 sm:flex-initial">
              <label htmlFor="lista-agua" className="sr-only">
                Proximidad al agua
              </label>
              <select
                id="lista-agua"
                value={filtroAgua}
                onChange={(e) => {
                  setFiltroAgua(e.target.value as any);
                  setLimite(ITEMS_POR_PAGINA);
                }}
                className="w-full sm:w-auto bg-fondo border border-borde rounded-xl px-4 py-2.5 text-sm font-semibold text-texto focus:border-principal cursor-pointer"
              >
                <option value="todos">Todas las distancias al agua</option>
                <option value="cerca">Cerca del agua (&lt; 500 m)</option>
                <option value="lejos">Lejos del agua (&gt;= 500 m)</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-texto-secundario font-medium">
            Mostrando <strong>{filtrados.length}</strong> de {lugares.length} lugares
          </div>
        </div>
      </div>

      {/* Cuadrícula de tarjetas */}
      {filtrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lugaresVisibles.map((lugar) => (
            <TarjetaLugar key={lugar.id} lugar={lugar} />
          ))}
        </div>
      ) : (
        <div className="bg-superficie border border-borde rounded-2xl p-12 text-center max-w-lg mx-auto">
          <p className="font-titulos text-xl font-bold text-texto mb-2">
            No se encontraron lugares
          </p>
          <p className="text-texto-secundario text-base mb-6">
            Intenta con otro término de búsqueda o limpia los filtros para ver todos los puntos.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusqueda('');
              setDeptoSeleccionado('todos');
              setFiltroAgua('todos');
            }}
            className="px-6 py-2.5 rounded-xl bg-principal text-white font-semibold hover:bg-principal-hover"
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {/* Botón "Mostrar más" */}
      {hayMas && (
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={() => setLimite((prev) => prev + ITEMS_POR_PAGINA)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-superficie hover:bg-principal-suave text-principal border-2 border-principal font-bold text-base transition-colors shadow-sm"
          >
            <span>Mostrar más lugares ({filtrados.length - limite} restantes)</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
