'use client';

import { useState } from 'react';
import { Check, ChevronDown, Copy } from 'lucide-react';
import type { Lugar } from '@/types/lugar';
import { formatearNumero } from '@/lib/formato';

/** Sección plegable con los datos técnicos (código, coordenadas, altura, fuente). */
export function MasDatosLugar({ lugar }: { lugar: Lugar }) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const coordenadas = `${Number(lugar.lat.toFixed(4))}, ${Number(lugar.lon.toFixed(4))}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`${lugar.lat}, ${lugar.lon}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="rounded-[20px] border border-borde bg-superficie font-marca shadow-sm transition-all duration-300 hover:border-marca-verde/40 hover:shadow-md">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls="mas-datos-lugar"
        className="flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[20px] px-6 text-left text-xl font-bold text-marca-oscuro"
      >
        Más datos del lugar
        <ChevronDown
          className={`h-6 w-6 shrink-0 transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {abierto && (
        <dl id="mas-datos-lugar" className="m-0 space-y-4 px-6 pb-6 text-lg text-marca-oscuro animate-fade-in-down">
          <div>
            <dt className="text-base text-texto-secundario">Código</dt>
            <dd className="m-0">{lugar.id}</dd>
          </div>
          <div>
            <dt className="text-base text-texto-secundario">Ubicación</dt>
            <dd className="m-0 flex flex-wrap items-center gap-3">
              {coordenadas}
              <button
                type="button"
                onClick={copiar}
                className={`inline-flex min-h-[52px] items-center gap-2 rounded-xl border px-4 text-base font-bold btn-bounce ${
                  copiado ? 'border-marca-oscuro bg-marca-menta' : 'border-borde-fuerte bg-superficie hover:bg-marca-menta-suave'
                }`}
              >
                {copiado ? (
                  <Check className="h-5 w-5 animate-pop" aria-hidden="true" />
                ) : (
                  <Copy className="h-5 w-5" aria-hidden="true" />
                )}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </dd>
          </div>
          <div>
            <dt className="text-base text-texto-secundario">Altura sobre el mar</dt>
            <dd className="m-0">
              {lugar.elevacionM !== null ? `${formatearNumero(Math.round(lugar.elevacionM))} m` : 'Sin dato'}
            </dd>
          </div>
          <div>
            <dt className="text-base text-texto-secundario">Fuente</dt>
            <dd className="m-0">Global Plastic Watch — Earthrise Media / Minderoo Foundation, {lugar.licencia.split(' - ')[0]}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
