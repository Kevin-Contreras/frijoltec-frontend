/**
 * Contorno simplificado de Guatemala y proyección a coordenadas SVG.
 * Solo sirve para el "Mapa de referencia" del inicio (no es un mapa preciso).
 */

/** Contorno aproximado de Guatemala como [lon, lat]. */
const CONTORNO: [number, number][] = [
  [-92.23, 14.53], // Pacífico, frontera con México
  [-92.1, 15.07],
  [-91.73, 16.07],
  [-90.44, 16.07],
  [-90.45, 16.41],
  [-90.6, 16.47],
  [-90.71, 16.69],
  [-91.08, 16.92],
  [-91.45, 17.25],
  [-90.98, 17.25],
  [-90.98, 17.82],
  [-89.15, 17.82], // esquina noreste con Belice
  [-89.22, 15.89],
  [-88.93, 15.89], // Golfo de Honduras
  [-88.6, 15.7],
  [-88.21, 15.72],
  [-88.68, 15.35], // frontera con Honduras
  [-89.15, 15.07],
  [-89.22, 14.87],
  [-89.35, 14.42],
  [-89.58, 14.36], // frontera con El Salvador
  [-89.84, 14.03],
  [-90.1, 13.73],
  [-90.61, 13.91], // costa del Pacífico
  [-91.23, 13.93],
  [-91.7, 14.13],
];

const LON_MIN = -92.35;
const LON_MAX = -88.1;
const LAT_MIN = 13.65;
const LAT_MAX = 17.92;
/** Corrige el ancho de los grados de longitud a esta latitud (~15.5°). */
const ESCALA_X = Math.cos((15.5 * Math.PI) / 180);
const PX_POR_GRADO = 100;

export const MAPA_ANCHO = Math.round((LON_MAX - LON_MIN) * ESCALA_X * PX_POR_GRADO);
export const MAPA_ALTO = Math.round((LAT_MAX - LAT_MIN) * PX_POR_GRADO);

export function proyectar(lon: number, lat: number): { x: number; y: number } {
  return {
    x: (lon - LON_MIN) * ESCALA_X * PX_POR_GRADO,
    y: (LAT_MAX - lat) * PX_POR_GRADO,
  };
}

/** Atributo `d` del <path> con el contorno del país. */
export const CONTORNO_PATH =
  CONTORNO.map(([lon, lat], i) => {
    const { x, y } = proyectar(lon, lat);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + ' Z';
