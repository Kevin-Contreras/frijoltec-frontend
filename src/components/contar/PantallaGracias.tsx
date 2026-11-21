import Link from 'next/link';
import { Check } from 'lucide-react';
import { AvisoLocal } from './AvisoLocal';

/** Pantalla final después de enviar el reporte. */
export function PantallaGracias() {
  return (
    <section
      aria-labelledby="titulo-gracias"
      className="mx-auto w-full max-w-4xl rounded-[20px] border border-borde bg-superficie px-6 py-10 text-center font-marca shadow-sm sm:px-10 animate-scale-up"
    >
      <span
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-marca-menta text-marca-oscuro animate-pop"
        style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}
      >
        <Check className="h-9 w-9" aria-hidden="true" />
      </span>
      <h1 id="titulo-gracias" className="font-marca text-4xl font-bold text-marca-oscuro tracking-normal mb-3">
        ¡Gracias por contarnos!
      </h1>
      <p className="mb-6 text-xl text-texto-secundario">Tu visita nos ayuda a saber si de verdad es un basurero.</p>

      <div className="mx-auto mb-8 max-w-xl text-left">
        <AvisoLocal>
          Tu reporte ha sido enviado y registrado en la base de datos comunitaria. También se guardó una copia de respaldo en este dispositivo.
        </AvisoLocal>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/mapa"
          className="inline-flex min-h-[56px] items-center rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
        >
          Volver al mapa
        </Link>
        <Link
          href="/contar"
          className="inline-flex min-h-[56px] items-center rounded-xl border border-marca-oscuro bg-superficie px-6 text-xl font-semibold text-marca-oscuro btn-bounce hover:bg-marca-menta-suave"
        >
          Contar otro lugar
        </Link>
      </div>
    </section>
  );
}
