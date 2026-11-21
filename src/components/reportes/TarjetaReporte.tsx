'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  DoorClosed,
  Calendar,
  MapPin,
  ExternalLink,
  MessageSquare,
  Phone,
  ImageIcon,
} from 'lucide-react';
import type { ReporteBackend } from '@/lib/api';

interface TarjetaReporteProps {
  reporte: ReporteBackend;
  onVerFoto?: (url: string) => void;
}

export function configResultado(resultado: string) {
  switch (resultado) {
    case 'hay_basura':
      return {
        texto: 'Sí, hay basura',
        descripcion: 'La persona confirmó presencia de desechos en el lugar',
        badgeClass: 'bg-red-100 text-red-800 border-red-200',
        icono: AlertTriangle,
      };
    case 'no_hay_basura':
      return {
        texto: 'No hay basura',
        descripcion: 'La persona verificó que el lugar está limpio',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icono: CheckCircle2,
      };
    case 'no_pude_entrar':
    default:
      return {
        texto: 'No pude entrar',
        descripcion: 'El acceso al lugar estaba bloqueado o restringido',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        icono: DoorClosed,
      };
  }
}

export function formatoFechaGT(fechaStr?: string): string {
  if (!fechaStr) return '';
  try {
    const d = fechaStr.includes('T') ? new Date(fechaStr) : new Date(`${fechaStr}T12:00:00`);
    if (isNaN(d.getTime())) return fechaStr;
    return d.toLocaleDateString('es-GT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return fechaStr;
  }
}

export function TarjetaReporte({ reporte, onVerFoto }: TarjetaReporteProps) {
  const cfg = configResultado(reporte.resultado);
  const Icono = cfg.icono;
  const textoComentario = reporte.comentario || reporte.notas;
  const textoContacto = reporte.contacto || reporte.telefono;
  const fotos = reporte.fotos || [];

  return (
    <article className="flex h-full flex-col justify-between rounded-[20px] border border-borde bg-superficie p-6 font-marca card-interactive hover:border-marca-verde/40 shadow-sm transition-all duration-300">
      <div>
        {/* Cabecera: Badge de resultado + Fecha de visita */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-sm font-bold tracking-wide ${cfg.badgeClass}`}
          >
            <Icono className="h-4 w-4 shrink-0" aria-hidden="true" />
            {cfg.texto}
          </span>

          {reporte.fechaVisita && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-texto-secundario">
              <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
              Visita: {formatoFechaGT(reporte.fechaVisita)}
            </span>
          )}
        </div>

        {/* Lugar y departamento */}
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-marca-fondo px-2 py-0.5 text-xs font-bold text-marca-oscuro border border-borde">
              {reporte.sitioId}
            </span>
            {reporte.sitio?.departamento && (
              <span className="text-sm font-semibold text-texto-secundario">
                {reporte.sitio.departamento}
              </span>
            )}
          </div>
          <h2 className="font-marca text-xl font-bold leading-snug text-marca-oscuro line-clamp-2">
            {reporte.sitio?.lugar || `Lugar ${reporte.sitioId}`}
          </h2>
        </div>

        {/* Comentario si existe */}
        {textoComentario && (
          <div className="mb-4 rounded-xl bg-marca-fondo/80 p-3.5 border border-borde/70 text-marca-oscuro">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-texto-secundario" aria-hidden="true" />
              <p className="m-0 text-base leading-relaxed italic line-clamp-4">
                &ldquo;{textoComentario}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Contacto si existe */}
        {textoContacto && (
          <div className="mb-4 flex items-center gap-2 text-sm text-texto-secundario">
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Contacto: <span className="font-semibold text-marca-oscuro">{textoContacto}</span></span>
          </div>
        )}

        {/* Galería de fotos */}
        {fotos.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-texto-secundario uppercase tracking-wider">
              <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Fotos de campo ({fotos.length})</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {fotos.map((foto, idx) => (
                <button
                  key={foto.id || idx}
                  type="button"
                  onClick={() => onVerFoto && onVerFoto(foto.url)}
                  className="group relative h-20 w-20 overflow-hidden rounded-xl border border-borde bg-black/5 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-marca-verde"
                  title="Ver foto ampliada"
                >
                  <img
                    src={foto.url}
                    alt={`Evidencia de reporte ${reporte.sitioId}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción al final */}
      <div className="mt-4 pt-4 border-t border-borde/70 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/reportes/${reporte.id}`}
          className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-marca-oscuro px-4 text-base font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
        >
          Ver reporte completo
        </Link>
        <Link
          href={`/lugar/${reporte.sitioId}`}
          className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border border-borde bg-superficie px-3.5 text-sm font-semibold text-marca-oscuro hover:bg-marca-menta-suave transition-colors"
        >
          <MapPin className="h-4 w-4 shrink-0 text-texto-secundario" aria-hidden="true" />
          Ficha del lugar
          <ExternalLink className="h-3.5 w-3.5 text-texto-secundario" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
