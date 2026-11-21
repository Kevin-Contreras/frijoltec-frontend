interface ProgresoPasosProps {
  paso: number;
  total: number;
}

export function ProgresoPasos({ paso, total }: ProgresoPasosProps) {
  return (
    <div>
      <p className="mb-2 text-base font-bold text-marca-oscuro">
        Paso {paso} de {total}
      </p>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={paso}
        aria-label={`Paso ${paso} de ${total}`}
        className="h-2.5 w-full overflow-hidden rounded-full bg-marca-menta"
      >
        <div
          className="h-full rounded-full bg-marca-oscuro transition-[width] duration-700"
          style={{ width: `${(paso / total) * 100}%`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </div>
    </div>
  );
}
