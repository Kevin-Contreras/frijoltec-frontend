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

export function enlaceComoLlegar(lugar: { lat: number; lon: number }): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lugar.lat},${lugar.lon}`;
}
