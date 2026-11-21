'use client';

import { ImagePlus, X } from 'lucide-react';
import type { EstadoReporte } from '@/types/lugar';

const OPCIONES: { valor: EstadoReporte; texto: string }[] = [
  { valor: 'si_hay_basura', texto: 'Sí, hay basura' },
  { valor: 'no_hay_basura', texto: 'No, no hay basura' },
  { valor: 'no_pude_entrar', texto: 'No pude entrar' },
];

interface PasoQueEncontrasteProps {
  estado: EstadoReporte | null;
  onEstado: (estado: EstadoReporte) => void;
  foto: string | null;
  onFoto: (foto: string | null) => void;
  onSiguiente: () => void;
}

/** Paso 1: ¿Qué encontraste? + foto opcional. */
export function PasoQueEncontraste({ estado, onEstado, foto, onFoto, onSiguiente }: PasoQueEncontrasteProps) {
  const elegirFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onloadend = () => onFoto(lector.result as string);
    lector.readAsDataURL(archivo);
    e.target.value = '';
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (estado) onSiguiente();
      }}
    >
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-5 p-0 font-marca text-3xl font-bold text-marca-oscuro">¿Qué encontraste?</legend>
        <div className="flex flex-col gap-3">
          {OPCIONES.map((op) => {
            const marcada = estado === op.valor;
            return (
              <label
                key={op.valor}
                className={`flex min-h-[68px] cursor-pointer items-center gap-4 rounded-xl border px-5 text-xl font-semibold text-marca-oscuro transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-marca-verde ${
                  marcada
                    ? 'border-marca-oscuro bg-marca-menta-suave'
                    : 'border-borde bg-superficie hover:border-borde-fuerte'
                }`}
              >
                <input
                  type="radio"
                  name="que-encontraste"
                  value={op.valor}
                  checked={marcada}
                  onChange={() => onEstado(op.valor)}
                  className="h-6 w-6 shrink-0 accent-[#142A27]"
                />
                {op.texto}
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-8 mb-3 text-xl font-semibold text-marca-oscuro">
        Sube una foto <span className="font-normal text-texto-secundario">(opcional)</span>
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border border-marca-oscuro bg-superficie px-6 text-xl font-semibold text-marca-oscuro hover:bg-marca-menta-suave has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-marca-verde">
          <ImagePlus className="h-6 w-6" aria-hidden="true" />
          {foto ? 'Cambiar foto' : 'Elegir foto'}
          <input type="file" accept="image/*" onChange={elegirFoto} className="sr-only" />
        </label>

        {foto && (
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-borde">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto} alt="Foto que elegiste" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onFoto(null)}
              aria-label="Quitar foto"
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!estado}
        className="mt-10 inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white transition-colors hover:bg-marca-oscuro-hover disabled:cursor-not-allowed disabled:bg-sin-dato"
      >
        Siguiente
      </button>
      {!estado && <p className="mt-2 mb-0 text-base text-texto-secundario">Elige una opción para seguir.</p>}
    </form>
  );
}
