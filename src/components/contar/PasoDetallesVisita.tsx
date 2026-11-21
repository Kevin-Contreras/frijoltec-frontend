'use client';

import { Loader2 } from 'lucide-react';

interface PasoDetallesVisitaProps {
  fechaVisita: string;
  onFechaVisita: (v: string) => void;
  notas: string;
  onNotas: (v: string) => void;
  contacto: string;
  onContacto: (v: string) => void;
  avisar: boolean;
  onAvisar: (v: boolean) => void;
  enviando?: boolean;
  onAtras: () => void;
  onEnviar: () => void;
}

/** Fecha de hoy en formato AAAA-MM-DD (hora local). */
export function hoyISO(): string {
  const d = new Date();
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

const campo =
  'w-full rounded-xl border border-borde-fuerte bg-superficie px-4 text-lg text-marca-oscuro transition-shadow focus:border-marca-oscuro focus:shadow-md';

/** Paso 2: cuándo fue, comentario y contacto (opcionales). */
export function PasoDetallesVisita(props: PasoDetallesVisitaProps) {
  return (
    <form
      className="animate-fade-in-up"
      onSubmit={(e) => {
        e.preventDefault();
        props.onEnviar();
      }}
    >
      <h2 className="mb-6 font-marca text-3xl font-bold text-marca-oscuro tracking-normal">Cuéntanos de tu visita</h2>

      <label htmlFor="fecha-visita" className="mb-2 block text-xl font-semibold text-marca-oscuro">
        ¿Cuándo fuiste?
      </label>
      <input
        id="fecha-visita"
        type="date"
        value={props.fechaVisita}
        max={hoyISO()}
        onChange={(e) => props.onFechaVisita(e.target.value)}
        className={`${campo} mb-7 min-h-[60px] max-w-[220px]`}
      />

      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor="comentario-visita" className="block text-xl font-semibold text-marca-oscuro">
          Comentario <span className="font-normal text-texto-secundario">(opcional)</span>
        </label>
        <span className="text-sm text-texto-secundario">{props.notas.length}/2000</span>
      </div>
      <textarea
        id="comentario-visita"
        rows={5}
        maxLength={2000}
        placeholder="¿Qué viste en el lugar? Cuéntanos detalles de la zona..."
        value={props.notas}
        onChange={(e) => props.onNotas(e.target.value)}
        className={`${campo} mb-7 resize-y py-3`}
      />

      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor="contacto-visita" className="block text-xl font-semibold text-marca-oscuro">
          Teléfono o correo para contactarte <span className="font-normal text-texto-secundario">(opcional)</span>
        </label>
        <span className="text-sm text-texto-secundario">{props.contacto.length}/200</span>
      </div>
      <input
        id="contacto-visita"
        type="text"
        inputMode="email"
        maxLength={200}
        placeholder="Ej. 5555-1234 o correo@ejemplo.com"
        autoComplete="off"
        value={props.contacto}
        onChange={(e) => props.onContacto(e.target.value)}
        className={`${campo} mb-7 min-h-[60px]`}
      />

      <label
        className={`mb-8 flex cursor-pointer items-start gap-4 rounded-xl border px-5 py-4 text-marca-oscuro transition-all duration-200 ${
          props.avisar ? 'border-marca-oscuro bg-marca-menta-suave' : 'border-borde bg-superficie hover:border-borde-fuerte'
        }`}
      >
        <input
          type="checkbox"
          checked={props.avisar}
          onChange={(e) => props.onAvisar(e.target.checked)}
          className="mt-1 h-6 w-6 shrink-0 accent-[#142A27]"
        />
        <span>
          <span className="block text-xl font-semibold">Avisar a la municipalidad y a los grupos de la zona</span>
          <span className="block text-base text-texto-secundario">
            Verán lo que contaste. Si dejaste teléfono o correo, solo ellos lo podrán ver.
          </span>
        </span>
      </label>

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          disabled={props.enviando}
          onClick={props.onAtras}
          className="inline-flex min-h-[56px] items-center rounded-xl border border-marca-oscuro bg-superficie px-6 text-xl font-semibold text-marca-oscuro btn-bounce hover:bg-marca-menta-suave disabled:opacity-50"
        >
          Atrás
        </button>
        <button
          type="submit"
          disabled={props.enviando}
          className="inline-flex min-h-[56px] items-center gap-2 rounded-xl bg-marca-oscuro px-8 text-xl font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {props.enviando ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>Enviando reporte...</span>
            </>
          ) : (
            <span>Enviar reporte</span>
          )}
        </button>
      </div>
    </form>
  );
}
