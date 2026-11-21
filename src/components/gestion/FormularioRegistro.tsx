'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { TIPOS_ORGANIZACION, type TipoOrganizacion } from '@/lib/gestion-ejemplo';

const campo =
  'min-h-[56px] w-full rounded-xl border border-borde-fuerte bg-superficie px-4 text-lg text-marca-oscuro transition-shadow focus:border-marca-oscuro focus:shadow-md';
const etiqueta = 'mb-2 block text-lg font-semibold text-marca-oscuro';

/** BOSQUEJO: el formulario no envía nada, solo muestra la pantalla de "recibido". */
export function FormularioRegistro({ departamentos }: { departamentos: string[] }) {
  const [tipo, setTipo] = useState<TipoOrganizacion>('municipalidad');
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <div className="rounded-[20px] border border-borde bg-superficie px-6 py-10 text-center shadow-sm animate-scale-up">
        <span
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-marca-menta text-marca-oscuro animate-pop"
          style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}
        >
          <Check className="h-9 w-9" aria-hidden="true" />
        </span>
        <h2 className="mb-3 font-marca text-3xl font-bold text-marca-oscuro tracking-normal">Recibimos tu solicitud</h2>
        <p className="mx-auto mb-8 max-w-xl text-xl text-texto-secundario">
          Antes de activar la cuenta vamos a confirmar que tu organización es real. Te escribiremos al correo que
          dejaste.
        </p>
        <Link
          href="/panel"
          className="inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
        >
          Ver cómo se ve el panel (ejemplo)
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setEnviado(true);
      }}
      className="flex flex-col gap-7 rounded-[20px] border border-borde bg-superficie p-6 shadow-sm sm:p-8 animate-fade-in-up"
    >
      <fieldset className="m-0 border-0 p-0">
        <legend className={`${etiqueta} p-0`}>¿Qué tipo de organización es?</legend>
        <div className="flex flex-col gap-3">
          {(Object.keys(TIPOS_ORGANIZACION) as TipoOrganizacion[]).map((t) => (
            <label
              key={t}
              className={`flex min-h-[60px] cursor-pointer items-center gap-4 rounded-xl border px-5 text-lg font-semibold text-marca-oscuro transition-all duration-200 active:scale-[0.99] ${
                tipo === t
                  ? 'border-marca-oscuro bg-marca-menta-suave shadow-sm'
                  : 'border-borde bg-superficie hover:-translate-y-0.5 hover:border-borde-fuerte hover:shadow-sm'
              }`}
            >
              <input
                type="radio"
                name="tipo-organizacion"
                checked={tipo === t}
                onChange={() => setTipo(t)}
                className="h-6 w-6 accent-[#142A27]"
              />
              {TIPOS_ORGANIZACION[t]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="org-nombre" className={etiqueta}>
          Nombre de la organización
        </label>
        <input id="org-nombre" required className={campo} placeholder="Ej. Municipalidad de Escuintla" />
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="org-departamento" className={etiqueta}>
            Departamento
          </label>
          <select id="org-departamento" required className={campo} defaultValue="">
            <option value="" disabled>
              Elige uno
            </option>
            {departamentos.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="org-municipio" className={etiqueta}>
            Municipio
          </label>
          <input id="org-municipio" required className={campo} />
        </div>
      </div>

      <div>
        <label htmlFor="org-persona" className={etiqueta}>
          Tu nombre
        </label>
        <input id="org-persona" required autoComplete="name" className={campo} />
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="org-correo" className={etiqueta}>
            Correo
          </label>
          <input id="org-correo" type="email" required autoComplete="email" className={campo} />
        </div>
        <div>
          <label htmlFor="org-telefono" className={etiqueta}>
            Teléfono <span className="font-normal text-texto-secundario">(opcional)</span>
          </label>
          <input id="org-telefono" type="tel" autoComplete="tel" className={campo} />
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex min-h-[56px] items-center self-start rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
      >
        Enviar solicitud
      </button>
    </form>
  );
}
