import { CircleCheck, CircleDashed, Hammer, Megaphone, CircleX } from 'lucide-react';
import { ESTADOS_GESTION, type EstadoGestion } from '@/lib/gestion-ejemplo';

const ICONOS = {
  sin_revisar: CircleDashed,
  avisado: Megaphone,
  en_proceso: Hammer,
  resuelto: CircleCheck,
  no_es_basurero: CircleX,
} as const;

const ESTILOS: Record<EstadoGestion, string> = {
  sin_revisar: 'bg-marca-menta text-marca-oscuro border-marca-menta',
  avisado: 'bg-superficie text-marca-oscuro border-marca-oscuro',
  en_proceso: 'bg-alerta-suave text-alerta-texto border-alerta-suave',
  resuelto: 'bg-marca-oscuro text-white border-marca-oscuro',
  no_es_basurero: 'bg-superficie text-texto-secundario border-borde-fuerte',
};

/** Estado del lugar con ícono + texto (nunca solo color). */
export function EtiquetaEstado({ estado, className = '' }: { estado: EstadoGestion; className?: string }) {
  const Icono = ICONOS[estado];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-lg font-semibold ${ESTILOS[estado]} ${className}`}
    >
      <Icono className="h-5 w-5 shrink-0" aria-hidden="true" />
      {ESTADOS_GESTION[estado].texto}
    </span>
  );
}
