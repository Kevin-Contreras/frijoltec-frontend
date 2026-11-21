'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Filter,
  AlertTriangle,
  CheckCircle2,
  DoorClosed,
  PlusCircle,
  Loader2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import type { ReporteBackend } from '@/lib/api';
import { fetchReportes } from '@/lib/api';
import { TarjetaReporte } from './TarjetaReporte';
import { Reveal } from '@/components/ui/Reveal';

interface ListaReportesProps {
  reportesIniciales: ReporteBackend[];
  filtroSitioInicial?: string;
  filtroResultadoInicial?: string;
}

type TipoResultado = 'todos' | 'hay_basura' | 'no_hay_basura' | 'no_pude_entrar';

export function ListaReportes({
  reportesIniciales,
  filtroSitioInicial = '',
  filtroResultadoInicial = 'todos',
}: ListaReportesProps) {
  const [reportes, setReportes] = useState<ReporteBackend[]>(reportesIniciales);
  const [filtroResultado, setFiltroResultado] = useState<TipoResultado>(
    (filtroResultadoInicial as TipoResultado) || 'todos'
  );
  const [busqueda, setBusqueda] = useState(filtroSitioInicial);
  const [cargando, setCargando] = useState(false);
  const [fotoModal, setFotoModal] = useState<string | null>(null);

  // Recargar datos desde la API si cambian los filtros
  const recargar = async (resultadoFiltro: TipoResultado) => {
    setCargando(true);
    try {
      const res = await fetchReportes(
        undefined,
        resultadoFiltro === 'todos' ? undefined : resultadoFiltro
      );
      setReportes(res);
    } catch (err) {
      console.warn('Error al obtener reportes del backend:', err);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarResultado = (tipo: TipoResultado) => {
    setFiltroResultado(tipo);
    recargar(tipo);
  };

  // Filtrado local en base al término de búsqueda (ID de sitio, lugar, departamento o comentario)
  const reportesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return reportes.filter((r) => {
      // Filtro de resultado
      if (filtroResultado !== 'todos' && r.resultado !== filtroResultado) {
        return false;
      }
      // Filtro de texto
      if (!q) return true;
      const matchSitioId = r.sitioId.toLowerCase().includes(q);
      const matchLugar = r.sitio?.lugar?.toLowerCase().includes(q) ?? false;
      const matchDepto = r.sitio?.departamento?.toLowerCase().includes(q) ?? false;
      const matchComentario = (r.comentario || r.notas || '').toLowerCase().includes(q);
      return matchSitioId || matchLugar || matchDepto || matchComentario;
    });
  }, [reportes, filtroResultado, busqueda]);

  // Contadores para métricas
  const contadores = useMemo(() => {
    const total = reportes.length;
    const conBasura = reportes.filter((r) => r.resultado === 'hay_basura').length;
    const sinBasura = reportes.filter((r) => r.resultado === 'no_hay_basura').length;
    const inaccesible = reportes.filter((r) => r.resultado === 'no_pude_entrar').length;
    return { total, conBasura, sinBasura, inaccesible };
  }, [reportes]);

  return (
    <div className="space-y-8 font-marca">
      {/* Banner de métricas rápidas */}
      <Reveal animation="fade-up">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-borde bg-superficie p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-marca-fondo text-marca-oscuro">
                <Layers className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-texto-secundario">Total reportes</p>
                <p className="font-marca text-2xl sm:text-3xl font-extrabold text-marca-oscuro">
                  {contadores.total}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-red-800">Con basura</p>
                <p className="font-marca text-2xl sm:text-3xl font-extrabold text-red-900">
                  {contadores.conBasura}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-800">Sin basura</p>
                <p className="font-marca text-2xl sm:text-3xl font-extrabold text-emerald-900">
                  {contadores.sinBasura}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <DoorClosed className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Sin acceso</p>
                <p className="font-marca text-2xl sm:text-3xl font-extrabold text-amber-900">
                  {contadores.inaccesible}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col gap-4 rounded-2xl border border-borde bg-superficie p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Pestañas de estado / resultado */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => seleccionarResultado('todos')}
              className={`inline-flex min-h-[44px] items-center rounded-xl px-4 text-base font-semibold transition-all duration-200 ${
                filtroResultado === 'todos'
                  ? 'bg-marca-oscuro text-white shadow-sm'
                  : 'bg-marca-fondo text-marca-oscuro hover:bg-marca-menta-suave'
              }`}
            >
              Todos ({contadores.total})
            </button>
            <button
              type="button"
              onClick={() => seleccionarResultado('hay_basura')}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-base font-semibold transition-all duration-200 ${
                filtroResultado === 'hay_basura'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'bg-marca-fondo text-red-800 hover:bg-red-100/70'
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Sí, hay basura ({contadores.conBasura})
            </button>
            <button
              type="button"
              onClick={() => seleccionarResultado('no_hay_basura')}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-base font-semibold transition-all duration-200 ${
                filtroResultado === 'no_hay_basura'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-marca-fondo text-emerald-800 hover:bg-emerald-100/70'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              No hay basura ({contadores.sinBasura})
            </button>
            <button
              type="button"
              onClick={() => seleccionarResultado('no_pude_entrar')}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-base font-semibold transition-all duration-200 ${
                filtroResultado === 'no_pude_entrar'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-marca-fondo text-amber-800 hover:bg-amber-100/70'
              }`}
            >
              <DoorClosed className="h-4 w-4 shrink-0" aria-hidden="true" />
              No pude entrar ({contadores.inaccesible})
            </button>
          </div>

          {/* Botón CTA para agregar reporte */}
          <Link
            href="/contar"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-marca-oscuro px-5 text-base font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
          >
            <PlusCircle className="h-5 w-5" aria-hidden="true" />
            Contar lo que vi
          </Link>
        </div>

        {/* Buscador de texto */}
        <div className="relative">
          <label htmlFor="buscar-reportes" className="sr-only">
            Buscar reportes por lugar, departamento o comentario
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-4 text-texto-secundario">
              {cargando ? (
                <Loader2 className="h-5 w-5 animate-spin text-marca-verde" aria-hidden="true" />
              ) : (
                <Search className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <input
              id="buscar-reportes"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código de sitio (ej. GPW-GT-001), municipio, departamento o texto..."
              className="w-full rounded-xl border border-borde bg-superficie py-3 pl-12 pr-10 text-base text-marca-oscuro placeholder-texto-secundario/70 transition-all duration-200 focus:border-marca-verde focus:outline-none focus:ring-2 focus:ring-marca-verde/30"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-3.5 p-1 text-texto-secundario hover:text-marca-oscuro"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Indicador de recuento */}
      <div className="flex items-center justify-between text-texto-secundario text-base">
        <span>
          Mostrando <strong className="text-marca-oscuro font-bold">{reportesFiltrados.length}</strong>{' '}
          {reportesFiltrados.length === 1 ? 'reporte' : 'reportes'}
        </span>
        <button
          type="button"
          onClick={() => recargar(filtroResultado)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-marca-oscuro hover:text-marca-verde"
          title="Actualizar datos"
        >
          <RefreshCw className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`} aria-hidden="true" />
          Actualizar
        </button>
      </div>

      {/* Lista de Tarjetas */}
      {reportesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reportesFiltrados.map((reporte, idx) => (
            <Reveal key={reporte.id} animation="fade-up" delay={Math.min(idx * 40, 300)}>
              <TarjetaReporte reporte={reporte} onVerFoto={(url) => setFotoModal(url)} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-borde bg-superficie p-12 text-center shadow-sm">
          <p className="font-marca text-2xl font-bold text-marca-oscuro mb-2">
            No se encontraron reportes
          </p>
          <p className="text-base text-texto-secundario max-w-md mx-auto mb-6">
            {busqueda || filtroResultado !== 'todos'
              ? 'Intenta cambiar los filtros seleccionados o buscar con otro término.'
              : 'Aún no se han registrado reportes en el sistema. ¡Sé la primera persona en compartir lo que viste!'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {(busqueda || filtroResultado !== 'todos') && (
              <button
                type="button"
                onClick={() => {
                  setBusqueda('');
                  seleccionarResultado('todos');
                }}
                className="inline-flex min-h-[48px] items-center rounded-xl border border-marca-oscuro bg-superficie px-5 text-base font-semibold text-marca-oscuro hover:bg-marca-menta-suave"
              >
                Limpiar filtros
              </button>
            )}
            <Link
              href="/contar"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-marca-oscuro px-6 text-base font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
            >
              <PlusCircle className="h-5 w-5" aria-hidden="true" />
              Contar lo que vi
            </Link>
          </div>
        </div>
      )}

      {/* Modal Lightbox para foto ampliada */}
      {fotoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada del reporte"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setFotoModal(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFotoModal(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Cerrar vista de foto"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
            <img
              src={fotoModal}
              alt="Evidencia fotográfica ampliada"
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
