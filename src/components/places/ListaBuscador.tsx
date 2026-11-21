'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Lugar } from '@/types/lugar';
import { normalizarTexto } from '@/lib/formato';
import { fetchSitiosLista, adaptarSitioALugar } from '@/lib/api';
import { TarjetaLugar } from './TarjetaLugar';
import { Reveal } from '@/components/ui/Reveal';

interface ListaBuscadorProps {
  lugares: Lugar[];
  totalInicial?: number;
}

const ITEMS_POR_PAGINA = 9;

export function ListaBuscador({ lugares, totalInicial }: ListaBuscadorProps) {
  const [busqueda, setBusqueda] = useState('');
  const [limite, setLimite] = useState(ITEMS_POR_PAGINA);
  const [lugaresApi, setLugaresApi] = useState<Lugar[] | null>(null);
  const [cargando, setCargando] = useState(false);

  // Búsqueda en backend con debounce, manteniendo respuesta instantánea local
  useEffect(() => {
    if (!busqueda.trim()) {
      setLugaresApi(null);
      setCargando(false);
      return;
    }

    setCargando(true);
    const timer = setTimeout(async () => {
      try {
        const { sitios } = await fetchSitiosLista(busqueda);
        setLugaresApi(sitios.map(adaptarSitioALugar));
      } catch (err) {
        console.warn('Fallback a filtrado local:', err);
        setLugaresApi(null);
      } finally {
        setCargando(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [busqueda]);

  // Si hay respuesta de la API para la búsqueda, usarla; de lo contrario, filtrar localmente
  const filtrados = useMemo(() => {
    if (lugaresApi !== null) return lugaresApi;
    const q = normalizarTexto(busqueda);
    if (!q) return lugares;
    return lugares.filter((l) => normalizarTexto(`${l.direccion} ${l.departamento}`).includes(q));
  }, [lugares, busqueda, lugaresApi]);

  const cambiarBusqueda = (valor: string) => {
    setBusqueda(valor);
    setLimite(ITEMS_POR_PAGINA);
  };

  const totalMostrado = totalInicial ?? lugares.length;

  return (
    <div className="font-marca">
      <label htmlFor="buscar-lista" className="sr-only">
        Busca tu municipio o departamento
      </label>
      <div className="relative mb-8 max-w-3xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-texto-secundario transition-colors"
          aria-hidden="true"
        />
        <input
          id="buscar-lista"
          type="search"
          value={busqueda}
          onChange={(e) => cambiarBusqueda(e.target.value)}
          placeholder="Busca tu municipio o departamento"
          autoComplete="off"
          className="min-h-[60px] w-full rounded-xl border border-borde-fuerte bg-superficie pl-12 pr-14 text-lg text-marca-oscuro placeholder:text-texto-secundario transition-all duration-200 focus:border-marca-oscuro focus:ring-2 focus:ring-marca-menta focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {cargando ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-marca-oscuro">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          </span>
        ) : busqueda ? (
          <button
            type="button"
            onClick={() => cambiarBusqueda('')}
            aria-label="Borrar búsqueda"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-texto-secundario transition-all hover:bg-marca-menta-suave hover:text-marca-oscuro active:scale-90"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <p role="status" className="mb-5 text-xl font-semibold text-marca-oscuro transition-all">
        {busqueda.trim()
          ? `Encontramos ${filtrados.length} ${filtrados.length === 1 ? 'lugar' : 'lugares'}`
          : `Hay ${totalMostrado} lugares en total`}
      </p>

      {filtrados.length > 0 ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.slice(0, limite).map((lugar, index) => (
            <li key={lugar.id} className="h-full">
              <Reveal animation="fade-up" delay={Math.min((index % ITEMS_POR_PAGINA) * 70, 420)} duration={500} className="h-full">
                <TarjetaLugar lugar={lugar} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[20px] border border-borde bg-superficie p-8 text-center animate-fade-in">
          <p className="mb-2 text-xl font-bold text-marca-oscuro">No encontramos lugares con &quot;{busqueda}&quot;</p>
          <p className="mb-6 text-lg text-texto-secundario">Prueba con el nombre de tu departamento.</p>
          <button
            type="button"
            onClick={() => cambiarBusqueda('')}
            className="inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white btn-bounce hover:bg-marca-oscuro-hover"
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
            className="inline-flex min-h-[56px] items-center rounded-xl border border-marca-oscuro bg-superficie px-8 text-lg font-bold text-marca-oscuro shadow-sm transition-all duration-200 hover:scale-105 hover:bg-marca-menta-suave active:scale-95"
          >
            Mostrar más ({filtrados.length - limite})
          </button>
        </div>
      )}
    </div>
  );
}
