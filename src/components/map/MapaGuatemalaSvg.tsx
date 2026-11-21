import type { Lugar } from '@/types/lugar';
import { estadoAgua, type EstadoAgua } from '@/lib/formato';
import { CONTORNO_PATH, MAPA_ALTO, MAPA_ANCHO, proyectar } from '@/lib/mapa-guatemala';

interface MapaGuatemalaSvgProps {
  lugares: Lugar[];
  /** Lugar que se resalta con un anillo. */
  seleccionadoId?: string;
  /** 1 = país completo. Con zoom se centra en el lugar seleccionado. */
  zoom?: number;
  className?: string;
}

const MARGEN = 15;
/** Se dibujan primero los de menor importancia para que los "cerca del agua" queden encima. */
const ORDEN: EstadoAgua[] = ['sin-dato', 'lejos', 'cerca'];

function Punto({ estado, x, y, s }: { estado: EstadoAgua; x: number; y: number; s: number }) {
  if (estado === 'cerca') {
    return (
      <g>
        <circle cx={x} cy={y} r={13 * s} fill="#FFFFFF" stroke="#142A27" strokeWidth={1.5 * s} />
        <circle cx={x} cy={y} r={10 * s} fill="#000000" />
      </g>
    );
  }
  if (estado === 'lejos') {
    return <circle cx={x} cy={y} r={9 * s} fill="#69AB90" stroke="#142A27" strokeWidth={2.5 * s} />;
  }
  return <circle cx={x} cy={y} r={6 * s} fill="#FFFFFF" stroke="#142A27" strokeWidth={2.5 * s} />;
}

/** Mapa simple de Guatemala en SVG (sin librerías). Lo usan el inicio y "Contar lo que vi". */
export function MapaGuatemalaSvg({ lugares, seleccionadoId, zoom = 1, className }: MapaGuatemalaSvgProps) {
  const puntos = lugares
    .map((l) => ({ id: l.id, estado: estadoAgua(l), ...proyectar(l.lon, l.lat) }))
    .sort((a, b) => ORDEN.indexOf(a.estado) - ORDEN.indexOf(b.estado));

  const seleccionado = puntos.find((p) => p.id === seleccionadoId);

  // Caja visible: todo el país, o una parte centrada en el lugar elegido.
  const anchoTotal = MAPA_ANCHO + MARGEN * 2;
  const altoTotal = MAPA_ALTO + MARGEN * 2;
  const ancho = anchoTotal / zoom;
  const alto = altoTotal / zoom;
  const centroX = seleccionado?.x ?? MAPA_ANCHO / 2;
  const centroY = seleccionado?.y ?? MAPA_ALTO / 2;
  const x = Math.min(Math.max(centroX - ancho / 2, -MARGEN), anchoTotal - MARGEN - ancho);
  const y = Math.min(Math.max(centroY - alto / 2, -MARGEN), altoTotal - MARGEN - alto);

  // Los puntos y las líneas mantienen su tamaño en pantalla al hacer zoom.
  const s = 1 / zoom;

  return (
    <svg
      viewBox={`${x.toFixed(1)} ${y.toFixed(1)} ${ancho.toFixed(1)} ${alto.toFixed(1)}`}
      className={className}
      role="img"
      aria-label={`Mapa de Guatemala con ${lugares.length} posibles basureros`}
    >
      <path d={CONTORNO_PATH} fill="#FFFFFF" stroke="#142A27" strokeWidth={2 * s} strokeLinejoin="round" />
      {puntos.map((p) =>
        p.id === seleccionadoId ? null : <Punto key={p.id} estado={p.estado} x={p.x} y={p.y} s={s} />,
      )}
      {seleccionado && (
        <g>
          <circle
            cx={seleccionado.x}
            cy={seleccionado.y}
            r={24 * s}
            fill="#69AB90"
            fillOpacity={0.55}
            stroke="#142A27"
            strokeWidth={4 * s}
          />
          <Punto estado={seleccionado.estado} x={seleccionado.x} y={seleccionado.y} s={s} />
        </g>
      )}
    </svg>
  );
}
