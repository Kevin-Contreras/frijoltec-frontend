import fs from 'fs';
import path from 'path';
import { Lugar, PuntoControl, TipoAgua, ClaseControl } from '../types/lugar';

interface FeatureCollection<P> {
  type: 'FeatureCollection';
  features: {
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    properties: P;
  }[];
}

interface RawLugarProperties {
  id: string;
  gpw_id: string;
  lugar: string;
  departamento: string;
  distancia_agua_m: number | string | null;
  tipo_agua_cercana: string | number | null;
  poblacion_1km: number | string | null;
  poblacion_5km: number | string | null;
  elevacion_m: number | string | null;
  pendiente_grados: number | string | null;
  fuentes: string;
  tipo?: string;
  verificado_en_campo: boolean;
  licencia: string;
}

const TIPOS_AGUA: readonly string[] = ['river', 'stream', 'pond', 'ditch', 'water', 'coastline'];

function cleanNumber(val: number | string | null | undefined): number | null {
  if (val === null || val === undefined || val === '') return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

function cleanInt(val: number | string | null | undefined): number | null {
  const n = cleanNumber(val);
  return n === null ? null : Math.round(n);
}

function cleanTipoAgua(val: string | number | null | undefined): TipoAgua | null {
  const text = String(val);
  return TIPOS_AGUA.includes(text) ? (text as TipoAgua) : null;
}

let cachedLugares: Lugar[] | null = null;
let cachedPuntosControl: PuntoControl[] | null = null;

export function getLugares(): Lugar[] {
  if (cachedLugares) return cachedLugares;

  const filePath = path.join(process.cwd(), 'public', 'data', 'gpw_guatemala_sitios.geojson');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data: FeatureCollection<RawLugarProperties> = JSON.parse(fileContent);

  cachedLugares = data.features.map(({ geometry, properties: p }) => ({
    id: p.id,
    lon: geometry.coordinates[0],
    lat: geometry.coordinates[1],
    direccion: p.lugar,
    departamento: p.departamento,
    distanciaAguaM: cleanNumber(p.distancia_agua_m),
    tipoAgua: cleanTipoAgua(p.tipo_agua_cercana),
    poblacion1km: cleanInt(p.poblacion_1km),
    poblacion5km: cleanInt(p.poblacion_5km),
    elevacionM: cleanNumber(p.elevacion_m),
    pendienteGrados: cleanNumber(p.pendiente_grados),
    gpwId: p.gpw_id,
    fuentes: p.fuentes || 'Global Plastic Watch',
    verificadoEnCampo: p.verificado_en_campo === true,
    licencia: p.licencia || 'CC BY-NC 4.0',
  }));

  return cachedLugares;
}

export function getLugarById(id: string): Lugar | undefined {
  const lugares = getLugares();
  return lugares.find((l) => l.id.toLowerCase() === id.toLowerCase());
}

export function getPuntosControl(): PuntoControl[] {
  if (cachedPuntosControl) return cachedPuntosControl;

  const filePath = path.join(process.cwd(), 'public', 'data', 'gpw_guatemala_negativos_y_otros.geojson');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data: FeatureCollection<{ clase: ClaseControl }> = JSON.parse(fileContent);

  cachedPuntosControl = data.features.map(({ geometry, properties }, idx) => ({
    id: `CTRL-${idx + 1}`,
    lon: geometry.coordinates[0],
    lat: geometry.coordinates[1],
    clase: properties.clase,
  }));

  return cachedPuntosControl;
}

export function getDepartamentos(): string[] {
  const lugares = getLugares();
  const set = new Set<string>();
  lugares.forEach((l) => {
    if (l.departamento) set.add(l.departamento);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
}

export function getEstadisticas() {
  const lugares = getLugares();
  const total = lugares.length;
  const cercaAgua = lugares.filter((l) => l.distanciaAguaM !== null && l.distanciaAguaM < 500).length;
  const verificados = lugares.filter((l) => l.verificadoEnCampo).length;

  const porDepartamento: Record<string, number> = {};
  const porTipoAgua: Record<string, number> = {};

  lugares.forEach((l) => {
    porDepartamento[l.departamento] = (porDepartamento[l.departamento] || 0) + 1;
    const tag = l.tipoAgua || 'sin_especificar';
    porTipoAgua[tag] = (porTipoAgua[tag] || 0) + 1;
  });

  const rankingDepartamentos = Object.entries(porDepartamento)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  return {
    total,
    cercaAgua,
    lejosAgua: total - cercaAgua,
    verificados,
    departamentosCount: Object.keys(porDepartamento).length,
    rankingDepartamentos,
    porTipoAgua,
  };
}
