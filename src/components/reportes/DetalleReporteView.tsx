'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  MessageSquare,
  Phone,
  ImageIcon,
  Navigation,
  Share2,
  Check,
  PlusCircle,
  X,
} from 'lucide-react';
import type { ReporteBackend } from '@/lib/api';
import { configResultado, formatoFechaGT } from './TarjetaReporte';
import { Reveal } from '@/components/ui/Reveal';

interface DetalleReporteViewProps {
  reporte: ReporteBackend;
}

export function DetalleReporteView({ reporte }: DetalleReporteViewProps) {
  const [copiado, setCopiado] = useState(false);
  const [fotoModal, setFotoModal] = useState<string | null>(null);

  const cfg = configResultado(reporte.resultado);
  const Icono = cfg.icono;
  const textoComentario = reporte.comentario || reporte.notas;
  const textoContacto = reporte.contacto || reporte.telefono;
  const fotos = reporte.fotos || [];

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Ignorar fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 font-marca space-y-8">
      {/* Botón Volver */}
      <div className="flex items-center justify-between">
        <Link
          href="/reportes"
          className="inline-flex items-center gap-2 text-base font-semibold text-marca-oscuro hover:text-marca-verde transition-colors"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Volver a todos los reportes
        </Link>

        <button
          type="button"
          onClick={copiarEnlace}
          className="inline-flex items-center gap-1.5 rounded-xl border border-borde bg-superficie px-3.5 py-2 text-sm font-semibold text-marca-oscuro hover:bg-marca-menta-suave transition-colors"
        >
          {copiado ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <span>¡Enlace copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-texto-secundario" aria-hidden="true" />
              <span>Compartir reporte</span>
            </>
          )}
        </button>
      </div>

      {/* Cabecera principal del reporte */}
      <Reveal animation="fade-up">
        <div className="rounded-[24px] border border-borde bg-superficie p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-base font-bold tracking-wide ${cfg.badgeClass}`}
            >
              <Icono className="h-5 w-5 shrink-0" aria-hidden="true" />
              {cfg.texto}
            </span>

            <span className="text-xs font-mono text-texto-secundario bg-marca-fondo px-2.5 py-1 rounded-md border border-borde">
              ID: {reporte.id}
            </span>
          </div>

          <h1 className="font-marca text-3xl sm:text-4xl font-extrabold text-marca-oscuro tracking-normal mb-3">
            Reporte de visita en campo
          </h1>
          <p className="text-lg text-texto-secundario max-w-2xl">
            {cfg.descripcion} durante su inspección del lugar.
          </p>

          {/* Fechas */}
          <div className="mt-6 pt-6 border-t border-borde/70 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-texto-secundario">
            {reporte.fechaVisita && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-marca-oscuro shrink-0" aria-hidden="true" />
                <span>
                  Fecha de la visita: <strong className="text-marca-oscuro font-bold">{formatoFechaGT(reporte.fechaVisita)}</strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-marca-oscuro shrink-0" aria-hidden="true" />
              <span>
                Registrado en el sistema: <strong className="text-marca-oscuro font-bold">{formatoFechaGT(reporte.creadoEn)}</strong>
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Tarjeta del Lugar inspeccionado */}
      <Reveal animation="fade-up" delay={80}>
        <div className="rounded-[20px] border border-borde bg-superficie p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-marca-verde shrink-0" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-texto-secundario">
                Lugar inspeccionado
              </span>
            </div>
            <span className="rounded-lg bg-marca-fondo px-3 py-1 text-sm font-bold text-marca-oscuro border border-borde">
              {reporte.sitioId}
            </span>
          </div>

          <h2 className="font-marca text-2xl font-bold text-marca-oscuro mb-2">
            {reporte.sitio?.lugar || `Sitio ${reporte.sitioId}`}
          </h2>

          {reporte.sitio?.departamento && (
            <p className="text-base text-texto-secundario mb-6">
              Departamento de <strong>{reporte.sitio.departamento}</strong>, Guatemala.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/lugar/${reporte.sitioId}`}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-marca-oscuro px-5 text-base font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
            >
              Ver ficha del lugar
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={`/contar/${reporte.sitioId}`}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-marca-oscuro bg-superficie px-5 text-base font-semibold text-marca-oscuro hover:bg-marca-menta-suave transition-colors"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Enviar otro reporte aquí
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Comentario de la persona */}
      {textoComentario && (
        <Reveal animation="fade-up" delay={140}>
          <div className="rounded-[20px] border border-borde bg-superficie p-6 sm:p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-marca-oscuro">
              <MessageSquare className="h-5 w-5 text-marca-verde shrink-0" aria-hidden="true" />
              <h3 className="font-marca text-xl font-bold">Comentario de la visita</h3>
            </div>
            <blockquote className="rounded-xl bg-marca-fondo p-5 border-l-4 border-marca-verde text-lg leading-relaxed text-marca-oscuro italic">
              &ldquo;{textoComentario}&rdquo;
            </blockquote>
          </div>
        </Reveal>
      )}

      {/* Contacto si existe */}
      {textoContacto && (
        <Reveal animation="fade-up" delay={180}>
          <div className="rounded-[20px] border border-borde bg-superficie p-6 shadow-sm flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-marca-menta text-marca-oscuro shrink-0">
              <Phone className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-texto-secundario">Contacto proporcionado por quien visitó</p>
              <p className="font-marca text-xl font-bold text-marca-oscuro">{textoContacto}</p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Fotos de campo */}
      {fotos.length > 0 && (
        <Reveal animation="fade-up" delay={220}>
          <div className="rounded-[20px] border border-borde bg-superficie p-6 sm:p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-marca-verde shrink-0" aria-hidden="true" />
                <h3 className="font-marca text-xl font-bold text-marca-oscuro">
                  Evidencia fotográfica ({fotos.length})
                </h3>
              </div>
              <span className="text-xs text-texto-secundario">Haz clic en una imagen para ampliar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fotos.map((foto, idx) => (
                <button
                  key={foto.id || idx}
                  type="button"
                  onClick={() => setFotoModal(foto.url)}
                  className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-borde bg-black/5 text-left transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-marca-verde"
                >
                  <img
                    src={foto.url}
                    alt={`Foto de evidencia del lugar ${reporte.sitioId}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      Ver foto en tamaño completo
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Modal Lightbox */}
      {fotoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada del reporte"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
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
