'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Lugar, PuntoControl } from '@/types/lugar';
import {
  formatearDistancia,
  formatearNumero,
  nombreTipoAgua,
  estadoAgua,
  enlaceComoLlegar,
} from '@/lib/formato';
import {
  Navigation,
  ExternalLink,
  Layers,
  MapPin,
  X,
  Droplets,
  Users,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Cargar mapa sólo en el navegador para evitar problemas de SSR con Leaflet
const MapaLeaflet = dynamic(
  () =>
    import('./MapaLeaflet').catch((err) => {
      // Si el navegador tiene en caché un hash de chunk desfasado tras un build/dev, forzamos recarga limpia
      if (typeof window !== 'undefined') {
        const reloaded = sessionStorage.getItem('chunk_map_reload');
        if (!reloaded) {
          sessionStorage.setItem('chunk_map_reload', 'true');
          window.location.reload();
          return new Promise<never>(() => {});
        }
      }
      throw err;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-fondo border border-borde rounded-xl text-texto-secundario">
        <div className="w-10 h-10 border-4 border-principal border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-medium">Cargando mapa interactivo...</p>
      </div>
    ),
  }
);

interface MapaInteractivoProps {
  lugares: Lugar[];
  puntosControl?: PuntoControl[];
  departamentos: string[];
  lugarInicialId?: string;
}

export function MapaInteractivo({
  lugares,
  puntosControl = [],
  departamentos,
  lugarInicialId,
}: MapaInteractivoProps) {
  const [deptoSeleccionado, setDeptoSeleccionado] = useState<string>('todos');
  const [filtroAgua, setFiltroAgua] = useState<'todos' | 'cerca' | 'lejos'>('todos');
  const [mostrarControl, setMostrarControl] = useState<boolean>(false);
  const [capaSatelital, setCapaSatelital] = useState<boolean>(false);

  const initialLugar = useMemo(() => {
    if (!lugarInicialId) return null;
    return lugares.find((l) => l.id.toLowerCase() === lugarInicialId.toLowerCase()) || null;
  }, [lugarInicialId, lugares]);

  const [lugarActivo, setLugarActivo] = useState<Lugar | null>(initialLugar);

  // Filtrado de lugares
  const lugaresFiltrados = useMemo(() => {
    return lugares.filter((lugar) => {
      if (deptoSeleccionado !== 'todos' && lugar.departamento !== deptoSeleccionado) {
        return false;
      }
      if (filtroAgua === 'cerca' && estadoAgua(lugar) !== 'cerca') {
        return false;
      }
      if (filtroAgua === 'lejos' && estadoAgua(lugar) !== 'lejos') {
        return false;
      }
      return true;
    });
  }, [lugares, deptoSeleccionado, filtroAgua]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
      {/* Barra superior de controles y filtros */}
      <div className="bg-superficie border-b border-borde p-3 sm:p-4 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm font-medium">
            {/* Filtro Departamento */}
            <div className="flex items-center gap-2">
              <label htmlFor="select-depto" className="text-texto font-semibold">
                Departamento:
              </label>
              <select
                id="select-depto"
                value={deptoSeleccionado}
                onChange={(e) => setDeptoSeleccionado(e.target.value)}
                className="bg-fondo border border-borde rounded-lg px-3 py-2 text-texto font-medium focus:ring-2 focus:ring-principal cursor-pointer"
              >
                <option value="todos">Todos los departamentos ({lugares.length})</option>
                {departamentos.map((depto) => {
                  const count = lugares.filter((l) => l.departamento === depto).length;
                  return (
                    <option key={depto} value={depto}>
                      {depto} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Filtro Cercanía Agua */}
            <div className="flex items-center gap-2">
              <label htmlFor="select-agua" className="text-texto font-semibold">
                Agua:
              </label>
              <select
                id="select-agua"
                value={filtroAgua}
                onChange={(e) => setFiltroAgua(e.target.value as any)}
                className="bg-fondo border border-borde rounded-lg px-3 py-2 text-texto font-medium focus:ring-2 focus:ring-principal cursor-pointer"
              >
                <option value="todos">Todas las distancias</option>
                <option value="cerca">Cerca del agua (&lt; 500 m)</option>
                <option value="lejos">Más lejos (&gt;= 500 m)</option>
              </select>
            </div>
          </div>

          {/* Opciones visuales: Capa satélite y puntos de control */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setCapaSatelital(!capaSatelital)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                capaSatelital
                  ? 'bg-principal text-white border-principal font-semibold'
                  : 'bg-fondo text-texto border-borde hover:bg-superficie'
              }`}
            >
              <Layers className="w-4 h-4" />
              {capaSatelital ? 'Vista Calles' : 'Vista Satelital'}
            </button>

            <button
              type="button"
              onClick={() => setMostrarControl(!mostrarControl)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                mostrarControl
                  ? 'bg-texto text-white border-texto font-semibold'
                  : 'bg-fondo text-texto-secundario border-borde hover:bg-superficie'
              }`}
              title="Muestra 165 puntos de control revisados que no son basureros o son industriales"
            >
              <span>{mostrarControl ? '✓ Puntos control' : '+ Puntos control'}</span>
            </button>
          </div>
        </div>

        {/* Leyenda rápida */}
        <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-borde/60 flex flex-wrap items-center justify-between text-xs text-texto-secundario">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-alerta inline-block border border-white shadow-sm" />
              <span>Cerca del agua (&lt; 500m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-principal inline-block border border-white shadow-sm" />
              <span>Lejos del agua</span>
            </div>
            {mostrarControl && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-slate-500 inline-block border border-white" />
                <span>Puntos de control (165)</span>
              </div>
            )}
          </div>
          <div>
            <span>
              Mostrando <strong className="text-texto">{lugaresFiltrados.length}</strong> de {lugares.length} lugares
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor del Mapa con Hoja / Panel flotante */}
      <div className="relative flex-1 w-full overflow-hidden">
        <ErrorBoundary>
          <MapaLeaflet
            lugares={lugaresFiltrados}
            puntosControl={puntosControl}
            mostrarControl={mostrarControl}
            lugarSeleccionado={lugarActivo}
            onSeleccionarLugar={(lugar) => setLugarActivo(lugar)}
            capaSatelital={capaSatelital}
          />
        </ErrorBoundary>

        {/* Tarjeta flotante cuando se toca un lugar */}
        {lugarActivo && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 max-w-full z-[1000] bg-superficie border border-borde rounded-2xl shadow-2xl p-5 animate-fade-in-up">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-principal-suave text-principal">
                  {lugarActivo.id}
                </span>
                <span className="text-xs text-texto-secundario font-medium">
                  {lugarActivo.departamento}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLugarActivo(null)}
                className="p-1.5 rounded-full hover:bg-fondo text-texto-secundario hover:text-texto"
                aria-label="Cerrar detalle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-titulos font-bold text-lg text-texto leading-snug mb-3">
              {lugarActivo.direccion}
            </h3>

            {/* Datos clave de cercanía al agua y población */}
            <div className="space-y-2 mb-4 text-sm">
              <div
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  estadoAgua(lugarActivo) === 'cerca'
                    ? 'bg-alerta-suave text-alerta-texto font-medium'
                    : 'bg-fondo text-texto-secundario'
                }`}
              >
                <Droplets className="w-4 h-4 flex-shrink-0" />
                <span>
                  {lugarActivo.distanciaAguaM !== null ? (
                    <>
                      A {formatearDistancia(lugarActivo.distanciaAguaM)} de un{' '}
                      <strong>{nombreTipoAgua(lugarActivo.tipoAgua)}</strong>
                      {estadoAgua(lugarActivo) === 'cerca' && ' (Riesgo hídrico)'}
                    </>
                  ) : (
                    'Sin dato de distancia a agua'
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 px-2 text-texto-secundario">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>
                  Aprox. <strong>{formatearNumero(lugarActivo.poblacion1km)}</strong> habitantes en 1 km
                </span>
              </div>
            </div>

            {/* Botones de acción directos */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-borde">
              <a
                href={enlaceComoLlegar(lugarActivo)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-fondo hover:bg-borde text-texto font-semibold text-sm transition-colors"
              >
                <Navigation className="w-4 h-4 text-principal" />
                Cómo llegar
              </a>
              <Link
                href={`/lugar/${lugarActivo.id}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-principal hover:bg-principal-hover text-white font-semibold text-sm transition-colors"
              >
                Ver ficha
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-2">
              <Link
                href={`/contar/${lugarActivo.id}`}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-alerta-suave text-alerta-texto hover:bg-alerta hover:text-white font-semibold text-xs transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Ya fui a este lugar, quiero contar qué vi
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
