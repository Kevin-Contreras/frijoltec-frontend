'use client';

import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { ESTADOS_GESTION, type EstadoGestion, type Organizacion } from '@/lib/gestion-ejemplo';
import { HistorialActualizaciones, type ActualizacionVista } from './HistorialActualizaciones';

const OPCIONES: EstadoGestion[] = ['avisado', 'en_proceso', 'resuelto', 'no_es_basurero'];

interface ActualizarLugarProps {
  organizacion: Organizacion;
  historialInicial: ActualizacionVista[];
}

/**
 * BOSQUEJO: formulario "Dar actualización".
 * Lo que se publica solo se agrega a la lista en pantalla; se pierde al recargar.
 */
export function ActualizarLugar({ organizacion, historialInicial }: ActualizarLugarProps) {
  const [historial, setHistorial] = useState(historialInicial);
  const [estado, setEstado] = useState<EstadoGestion | null>(null);
  const [nota, setNota] = useState('');
  const [conFoto, setConFoto] = useState(false);
  const [publicado, setPublicado] = useState(false);

  const publicar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estado) return;
    const nueva: ActualizacionVista = {
      id: `nueva-${Date.now()}`,
      organizacion: organizacion.nombre,
      tipo: organizacion.tipo,
      estado,
      nota: nota.trim() || ESTADOS_GESTION[estado].ayuda,
      fecha: 'Hoy',
      conFoto,
      nueva: true,
    };
    setHistorial((h) => [nueva, ...h]);
    setEstado(null);
    setNota('');
    setConFoto(false);
    setPublicado(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={publicar}
        className="flex flex-col gap-6 rounded-[20px] border border-borde bg-superficie p-6 shadow-sm animate-fade-in-up"
      >
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-4 p-0 font-marca text-2xl font-bold text-marca-oscuro">Dar actualización</legend>
          <div className="flex flex-col gap-3">
            {OPCIONES.map((op) => (
              <label
                key={op}
                className={`flex min-h-[60px] cursor-pointer items-start gap-4 rounded-xl border px-5 py-3 text-marca-oscuro transition-all duration-200 active:scale-[0.99] ${
                  estado === op
                    ? 'border-marca-oscuro bg-marca-menta-suave shadow-sm'
                    : 'border-borde bg-superficie hover:-translate-y-0.5 hover:border-borde-fuerte hover:shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name="estado-gestion"
                  checked={estado === op}
                  onChange={() => {
                    setEstado(op);
                    setPublicado(false);
                  }}
                  className="mt-1 h-6 w-6 shrink-0 accent-[#142A27]"
                />
                <span>
                  <span className="block text-lg font-semibold">{ESTADOS_GESTION[op].texto}</span>
                  <span className="block text-base text-texto-secundario">{ESTADOS_GESTION[op].ayuda}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="nota-actualizacion" className="mb-2 block text-lg font-semibold text-marca-oscuro">
            ¿Qué hicieron? <span className="font-normal text-texto-secundario">(opcional)</span>
          </label>
          <textarea
            id="nota-actualizacion"
            rows={4}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej. Fuimos el lunes y sacamos 3 camiones de basura."
            className="w-full resize-y rounded-xl border border-borde-fuerte bg-superficie px-4 py-3 text-lg transition-shadow focus:border-marca-oscuro focus:shadow-md"
          />
        </div>

        <label className="inline-flex min-h-[56px] cursor-pointer items-center gap-3 self-start rounded-xl border border-marca-oscuro bg-superficie px-6 text-lg font-semibold text-marca-oscuro btn-bounce hover:bg-marca-menta-suave has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-marca-verde">
          <ImagePlus className="h-6 w-6" aria-hidden="true" />
          {conFoto ? 'Foto elegida' : 'Subir foto del antes o después'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setConFoto(Boolean(e.target.files?.length))}
          />
        </label>

        <p className="m-0 text-base text-texto-secundario">
          Esta actualización la verá cualquier persona en la página del lugar.
        </p>

        <button
          type="submit"
          disabled={!estado}
          className="inline-flex min-h-[56px] items-center self-start rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover disabled:cursor-not-allowed disabled:bg-sin-dato disabled:shadow-none disabled:hover:translate-y-0"
        >
          Publicar actualización
        </button>
        <p role="status" className="m-0 text-base font-semibold text-marca-oscuro">
          {publicado && <span className="animate-fade-in">Publicada en el bosquejo. Al recargar la página se pierde.</span>}
        </p>
      </form>

      <section aria-labelledby="titulo-historial">
        <h2 id="titulo-historial" className="mb-4 font-marca text-2xl font-bold text-marca-oscuro tracking-normal">
          Lo que se ha hecho
        </h2>
        <HistorialActualizaciones items={historial} />
      </section>
    </div>
  );
}
