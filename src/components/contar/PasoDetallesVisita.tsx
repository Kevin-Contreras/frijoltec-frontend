'use client';

interface PasoDetallesVisitaProps {
  fechaVisita: string;
  onFechaVisita: (v: string) => void;
  notas: string;
  onNotas: (v: string) => void;
  contacto: string;
  onContacto: (v: string) => void;
  avisar: boolean;
  onAvisar: (v: boolean) => void;
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
  'w-full rounded-xl border border-borde-fuerte bg-superficie px-4 text-lg text-marca-oscuro focus:border-marca-oscuro';

/** Paso 2: cuándo fue, comentario y contacto (opcionales). */
export function PasoDetallesVisita(props: PasoDetallesVisitaProps) {
  return (
    <form
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

      <label htmlFor="comentario-visita" className="mb-2 block text-xl font-semibold text-marca-oscuro">
        Comentario <span className="font-normal text-texto-secundario">(opcional)</span>
      </label>
      <textarea
        id="comentario-visita"
        rows={5}
        value={props.notas}
        onChange={(e) => props.onNotas(e.target.value)}
        className={`${campo} mb-7 resize-y py-3`}
      />

      <label htmlFor="contacto-visita" className="mb-2 block text-xl font-semibold text-marca-oscuro">
        Teléfono o correo para contactarte <span className="font-normal text-texto-secundario">(opcional)</span>
      </label>
      <input
        id="contacto-visita"
        type="text"
        inputMode="email"
        autoComplete="off"
        value={props.contacto}
        onChange={(e) => props.onContacto(e.target.value)}
        className={`${campo} mb-7 min-h-[60px]`}
      />

      <label className="mb-8 flex cursor-pointer items-start gap-4 rounded-xl border border-borde bg-superficie px-5 py-4 text-marca-oscuro">
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
          onClick={props.onAtras}
          className="inline-flex min-h-[56px] items-center rounded-xl border border-marca-oscuro bg-superficie px-6 text-xl font-semibold text-marca-oscuro hover:bg-marca-menta-suave"
        >
          Atrás
        </button>
        <button
          type="submit"
          className="inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white hover:bg-marca-oscuro-hover"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
