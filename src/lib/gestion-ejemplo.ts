/**
 * BOSQUEJO — Modo municipalidad / organizaciones.
 * Todo lo de este archivo son datos de ejemplo escritos a mano (no hay backend todavía).
 * Los lugares (ids) sí son reales; las organizaciones, avisos y actualizaciones son inventados.
 */
import type { EstadoReporte } from '@/types/lugar';

export type EstadoGestion = 'sin_revisar' | 'avisado' | 'en_proceso' | 'resuelto' | 'no_es_basurero';

export const ESTADOS_GESTION: Record<EstadoGestion, { texto: string; ayuda: string }> = {
  sin_revisar: { texto: 'Nadie lo ha revisado', ayuda: 'Todavía nadie ha ido.' },
  avisado: { texto: 'Ya avisamos', ayuda: 'La organización ya sabe y lo va a revisar.' },
  en_proceso: { texto: 'Están trabajando en él', ayuda: 'Alguien ya está limpiando o atendiendo el lugar.' },
  resuelto: { texto: 'Ya lo limpiaron', ayuda: 'El lugar fue limpiado.' },
  no_es_basurero: { texto: 'No era un basurero', ayuda: 'Fueron y no encontraron basura.' },
};

export type TipoOrganizacion = 'municipalidad' | 'asociacion' | 'vecinos';

export const TIPOS_ORGANIZACION: Record<TipoOrganizacion, string> = {
  municipalidad: 'Municipalidad',
  asociacion: 'Asociación u ONG',
  vecinos: 'Grupo de vecinos',
};

export interface Organizacion {
  id: string;
  nombre: string;
  tipo: TipoOrganizacion;
  departamento: string;
}

export interface AvisoVecino {
  id: string;
  lugarId: string;
  fecha: string; // AAAA-MM-DD
  respuesta: EstadoReporte;
  notas?: string;
  conFoto: boolean;
  contacto?: string;
}

export interface Actualizacion {
  id: string;
  lugarId: string;
  organizacionId: string;
  estado: EstadoGestion;
  nota: string;
  fecha: string; // AAAA-MM-DD
}

export const ORGANIZACIONES: Organizacion[] = [
  { id: 'muni-escuintla', nombre: 'Municipalidad de Escuintla (ejemplo)', tipo: 'municipalidad', departamento: 'Escuintla' },
  { id: 'muni-guatemala', nombre: 'Municipalidad de Guatemala (ejemplo)', tipo: 'municipalidad', departamento: 'Guatemala' },
  { id: 'playas-limpias', nombre: 'Colectivo Playas Limpias (ejemplo)', tipo: 'asociacion', departamento: 'Escuintla' },
];

/** La organización con la que "entra" el bosquejo del panel. */
export const ORGANIZACION_ACTUAL = ORGANIZACIONES[0];

export const AVISOS: AvisoVecino[] = [
  { id: 'a1', lugarId: 'GPW-GT-004', fecha: '2026-11-18', respuesta: 'si_hay_basura', notas: 'Hay bolsas y llantas junto al río. Huele muy mal.', conFoto: true, contacto: '5555-0101' },
  { id: 'a2', lugarId: 'GPW-GT-004', fecha: '2026-11-20', respuesta: 'si_hay_basura', notas: 'Están quemando basura en las tardes.', conFoto: false },
  { id: 'a3', lugarId: 'GPW-GT-004', fecha: '2026-11-21', respuesta: 'si_hay_basura', conFoto: true },
  { id: 'a4', lugarId: 'GPW-GT-053', fecha: '2026-11-15', respuesta: 'si_hay_basura', notas: 'Basura a la orilla del camino, cerca del mar.', conFoto: true, contacto: 'vecina@correo.com' },
  { id: 'a5', lugarId: 'GPW-GT-019', fecha: '2026-11-10', respuesta: 'si_hay_basura', notas: 'Mucho plástico en la playa.', conFoto: true },
  { id: 'a6', lugarId: 'GPW-GT-019', fecha: '2026-11-12', respuesta: 'si_hay_basura', conFoto: false },
  { id: 'a7', lugarId: 'GPW-GT-018', fecha: '2026-11-08', respuesta: 'no_pude_entrar', notas: 'El terreno tiene portón con candado.', conFoto: false },
  { id: 'a8', lugarId: 'GPW-GT-028', fecha: '2026-11-02', respuesta: 'si_hay_basura', conFoto: false },
  { id: 'a9', lugarId: 'GPW-GT-047', fecha: '2026-11-05', respuesta: 'no_hay_basura', notas: 'Es un terreno de cultivo, no hay basura.', conFoto: true },
  { id: 'a10', lugarId: 'GPW-GT-001', fecha: '2026-11-14', respuesta: 'si_hay_basura', notas: 'Basura en el barranco, baja al arroyo.', conFoto: true },
];

export const ACTUALIZACIONES: Actualizacion[] = [
  { id: 'u1', lugarId: 'GPW-GT-019', organizacionId: 'playas-limpias', estado: 'en_proceso', nota: 'Organizamos una jornada de limpieza para el sábado 29 de noviembre.', fecha: '2026-11-13' },
  { id: 'u2', lugarId: 'GPW-GT-019', organizacionId: 'muni-escuintla', estado: 'avisado', nota: 'Vamos a apoyar con un camión para llevarse lo recolectado.', fecha: '2026-11-14' },
  { id: 'u3', lugarId: 'GPW-GT-028', organizacionId: 'muni-escuintla', estado: 'resuelto', nota: 'Se limpió el terreno y se colocó un rótulo de "No tirar basura".', fecha: '2026-11-09' },
  { id: 'u4', lugarId: 'GPW-GT-047', organizacionId: 'muni-escuintla', estado: 'no_es_basurero', nota: 'Fuimos al lugar: es un terreno de cultivo.', fecha: '2026-11-07' },
  { id: 'u5', lugarId: 'GPW-GT-001', organizacionId: 'muni-guatemala', estado: 'avisado', nota: 'Recibimos los avisos. Un inspector irá esta semana.', fecha: '2026-11-16' },
];

export function getOrganizacion(id: string): Organizacion | undefined {
  return ORGANIZACIONES.find((o) => o.id === id);
}

export function getAvisosDeLugar(lugarId: string): AvisoVecino[] {
  return AVISOS.filter((a) => a.lugarId === lugarId).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/** Actualizaciones de un lugar, la más reciente primero. */
export function getActualizacionesDeLugar(lugarId: string): Actualizacion[] {
  return ACTUALIZACIONES.filter((u) => u.lugarId === lugarId).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/** Estado público del lugar: el de la actualización más reciente, o "avisado" si solo hay avisos de vecinos. */
export function getEstadoGestion(lugarId: string): EstadoGestion {
  const ultima = getActualizacionesDeLugar(lugarId)[0];
  if (ultima) return ultima.estado;
  return 'sin_revisar';
}

/** Organizaciones distintas que han dado actualizaciones sobre el lugar. */
export function getQuienAtiende(lugarId: string): Organizacion[] {
  const ids = Array.from(new Set(getActualizacionesDeLugar(lugarId).map((u) => u.organizacionId)));
  return ids.map(getOrganizacion).filter((o): o is Organizacion => Boolean(o));
}

export function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
}
