import { Info } from 'lucide-react';

/** Recuadro menta con ícono de información. */
export function AvisoLocal({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 flex items-start gap-3 rounded-xl bg-marca-menta-suave px-4 py-3.5 text-base text-marca-oscuro animate-fade-in">
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
