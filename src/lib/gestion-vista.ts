import type { ActualizacionVista } from '@/components/gestion/HistorialActualizaciones';
import { formatearFecha, getActualizacionesDeLugar, getOrganizacion } from './gestion-ejemplo';

/** Convierte las actualizaciones de ejemplo de un lugar al formato que muestra la pantalla. */
export function getHistorialVista(lugarId: string): ActualizacionVista[] {
  return getActualizacionesDeLugar(lugarId).map((u) => {
    const org = getOrganizacion(u.organizacionId);
    return {
      id: u.id,
      organizacion: org?.nombre ?? 'Organización',
      tipo: org?.tipo ?? 'asociacion',
      estado: u.estado,
      nota: u.nota,
      fecha: formatearFecha(u.fecha),
    };
  });
}
