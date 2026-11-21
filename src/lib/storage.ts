import { ReporteLocal } from '../types/lugar';

const STORAGE_KEY = 'basureros_gt_reportes';

export function getReportesLocales(): ReporteLocal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error leyendo reportes de localStorage', e);
    return [];
  }
}

export function guardarReporteLocal(reporte: Omit<ReporteLocal, 'id' | 'fecha'>): ReporteLocal {
  const nuevo: ReporteLocal = {
    ...reporte,
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fecha: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const actuales = getReportesLocales();
      const actualizados = [nuevo, ...actuales];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
    } catch (e) {
      console.error('Error guardando reporte en localStorage', e);
    }
  }

  return nuevo;
}
