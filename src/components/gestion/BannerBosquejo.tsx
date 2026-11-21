import { Info } from 'lucide-react';

/** Aviso fijo en las pantallas del modo organizaciones: nada de esto funciona todavía. */
export function BannerBosquejo() {
  return (
    <p className="m-0 flex items-start gap-3 rounded-xl border border-marca-oscuro/20 bg-marca-menta px-4 py-3 text-base text-marca-oscuro animate-fade-in-down">
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span>
        <strong>Bosquejo:</strong> esta sección todavía no funciona. Las organizaciones, avisos y actualizaciones
        que ves son ejemplos.
      </span>
    </p>
  );
}
