/**
 * Comentarios y propuestas de cambio del inicio.
 * Por ahora se guardan solo en este navegador (localStorage), igual que los reportes,
 * hasta que exista el backend.
 */

export interface Comentario {
  id: string;
  texto: string;
  fecha: string;
  /** true = texto de muestra del diseño, se marca con "Ejemplo". */
  ejemplo?: boolean;
}

export const CATEGORIAS_PROPUESTA = ['Mapa', 'Lista', 'Reportes', 'Resumen', 'Otra cosa'] as const;
export type CategoriaPropuesta = (typeof CATEGORIAS_PROPUESTA)[number];

export interface Propuesta {
  id: string;
  categoria: CategoriaPropuesta;
  texto: string;
  fecha: string;
  ejemplo?: boolean;
}

export const MAX_COMENTARIO = 200;
export const MAX_PROPUESTA = 250;

export const COMENTARIOS_EJEMPLO: Comentario[] = [
  { id: 'ej-c1', texto: 'Me gustó que el mapa se entiende rápido, sin palabras raras.', fecha: '', ejemplo: true },
  { id: 'ej-c2', texto: 'Fue fácil buscar lugares cerca de donde vivo.', fecha: '', ejemplo: true },
  { id: 'ej-c3', texto: 'Contar lo que vi me tomó solo un minuto.', fecha: '', ejemplo: true },
];

export const PROPUESTAS_EJEMPLO: Propuesta[] = [
  { id: 'ej-p1', categoria: 'Mapa', texto: 'Que se pueda ver solo los lugares que están cerca de mí.', fecha: '', ejemplo: true },
  {
    id: 'ej-p2',
    categoria: 'Reportes',
    texto: 'Que se pueda mandar el reporte aunque no haya internet y se envíe después.',
    fecha: '',
    ejemplo: true,
  },
];

const CLAVE_COMENTARIOS = 'basureros_gt_comentarios';
const CLAVE_PROPUESTAS = 'basureros_gt_propuestas';
const CLAVE_ME_GUSTA = 'basureros_gt_me_gusta';

function leer<T>(clave: string, porDefecto: T): T {
  if (typeof window === 'undefined') return porDefecto;
  try {
    const raw = localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {
    console.error('No se pudo guardar en localStorage', e);
  }
}

function nuevoId(prefijo: string): string {
  return `${prefijo}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function getComentarios(): Comentario[] {
  return leer<Comentario[]>(CLAVE_COMENTARIOS, []);
}

export function guardarComentario(texto: string): Comentario {
  const nuevo: Comentario = { id: nuevoId('com'), texto: texto.slice(0, MAX_COMENTARIO), fecha: new Date().toISOString() };
  escribir(CLAVE_COMENTARIOS, [...getComentarios(), nuevo]);
  return nuevo;
}

export function getPropuestas(): Propuesta[] {
  return leer<Propuesta[]>(CLAVE_PROPUESTAS, []);
}

export function guardarPropuesta(categoria: CategoriaPropuesta, texto: string): Propuesta {
  const nueva: Propuesta = {
    id: nuevoId('prop'),
    categoria,
    texto: texto.slice(0, MAX_PROPUESTA),
    fecha: new Date().toISOString(),
  };
  escribir(CLAVE_PROPUESTAS, [nueva, ...getPropuestas()]);
  return nueva;
}

/** Ids de propuestas a las que este navegador les dio "Me gusta". */
export function getMeGusta(): string[] {
  return leer<string[]>(CLAVE_ME_GUSTA, []);
}

export function alternarMeGusta(id: string): string[] {
  const actuales = getMeGusta();
  const nuevos = actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id];
  escribir(CLAVE_ME_GUSTA, nuevos);
  return nuevos;
}
