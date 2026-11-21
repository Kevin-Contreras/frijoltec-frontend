import { Lugar, TipoAgua } from '../types/lugar';

/** Menos de esta distancia se considera "cerca del agua" (500 metros). */
export const DISTANCIA_CERCA_AGUA_M = 500;

export const NOMBRES_AGUA: Record<TipoAgua, string> = {
  river: 'río',
  stream: 'arroyo',
  pond: 'estanque',
  ditch: 'zanja',
  water: 'cuerpo de agua',
  coastline: 'costa',
};

const numeroGT = new Intl.NumberFormat('es-GT');
const kmGT = new Intl.NumberFormat('es-GT', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** 22224 → "22,224" */
export function formatearNumero(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'Sin dato';
  return numeroGT.format(n);
}

/** 134 → "134 m"; 2062 → "2.1 km" */
export function formatearDistancia(metros: number | null | undefined): string {
  if (metros === null || metros === undefined) return 'Sin dato';
  return metros >= 1000
    ? `${kmGT.format(metros / 1000)} km`
    : `${formatearNumero(Math.round(metros))} m`;
}

export function nombreTipoAgua(tipo: TipoAgua | null | undefined): string {
  if (!tipo) return 'cuerpo de agua';
  return NOMBRES_AGUA[tipo] || tipo;
}

export type EstadoAgua = 'cerca' | 'lejos' | 'sin-dato';

export function estadoAgua(lugar: Lugar): EstadoAgua {
  if (lugar.distanciaAguaM === null || lugar.distanciaAguaM === undefined) return 'sin-dato';
  return lugar.distanciaAguaM < DISTANCIA_CERCA_AGUA_M ? 'cerca' : 'lejos';
}

/** Quita tildes y pasa a minúsculas, para que "coban" encuentre "Cobán". */
export function normalizarTexto(texto: string): string {
  return texto
    ? texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    : '';
}

/** Redondea a 2 cifras para leerlo fácil: 9,812 → 9,800; 473,057 → 470,000. */
export function aproximarPoblacion(n: number): string {
  if (n < 100) return formatearNumero(n);
  const factor = 10 ** (Math.floor(Math.log10(n)) - 1);
  return formatearNumero(Math.round(n / factor) * factor);
}

/** Frase sencilla sobre el agua cercana. */
export function fraseAgua(lugar: Lugar): string {
  const estado = estadoAgua(lugar);
  if (estado === 'sin-dato') return 'No sabemos qué tan cerca está el agua.';
  const tipo = nombreTipoAgua(lugar.tipoAgua);
  const distancia = formatearDistancia(lugar.distanciaAguaM);
  return estado === 'cerca'
    ? `Hay agua (${tipo}) a solo ${distancia}. La basura podría llegar al agua.`
    : `El agua más cercana (${tipo}) está a ${distancia}.`;
}

/** Frase sencilla sobre cuántas personas viven cerca. */
export function frasePoblacion(lugar: Lugar): string {
  const { poblacion1km: p1, poblacion5km: p5 } = lugar;
  if (p1 === null && p5 === null) return 'No sabemos cuántas personas viven cerca.';
  if (p1 !== null && p5 !== null) {
    return `Unas ${aproximarPoblacion(p1)} personas viven a menos de 1 km y ${aproximarPoblacion(p5)} a menos de 5 km.`;
  }
  const [n, radio] = p1 !== null ? [p1, '1 km'] : [p5 as number, '5 km'];
  return `Unas ${aproximarPoblacion(n)} personas viven a menos de ${radio}.`;
}

/**
 * Nombre corto para mostrar, sacado de la dirección real (no se inventan nombres):
 * "1a Calle, Patulul, Suchitepéquez, 10014, Guatemala" → "1a Calle, Patulul".
 */
export function nombreCortoLugar(lugar: { direccion: string }): string {
  const partes = lugar.direccion
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p && !/^\d{4,}$/.test(p) && p !== 'Guatemala');
  return partes.slice(0, 2).join(', ') || lugar.direccion;
}

export function enlaceComoLlegar(lugar: { lat: number; lon: number }): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lugar.lat},${lugar.lon}`;
}
