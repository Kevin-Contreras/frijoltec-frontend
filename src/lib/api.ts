import { Lugar, TipoAgua } from '@/types/lugar';

export const API_BASE_URL = 'https://frojoltecbackend.vercel.app';

export interface SitioBackend {
  id: string;
  gpwId?: string;
  lugar: string;
  departamento: string;
  longitud: number;
  latitud: number;
  distanciaAguaM: number | null;
  tipoAguaCercana?: string | null;
  poblacion1km?: number | null;
  poblacion5km?: number | null;
  elevacionM?: number | null;
  pendienteGrados?: number | null;
  tipo?: string;
  verificadoEnCampo?: boolean;
  revisado?: boolean;
  licencia?: string;
  fuentes?: string;
  reportes?: ReporteBackend[];
}

export interface SitioMapaBackend {
  id: string;
  lugar: string;
  departamento: string;
  longitud: number;
  latitud: number;
  poblacion5km: number | null;
}

export interface SitioListaBackend {
  id: string;
  lugar: string;
  departamento: string;
  longitud: number;
  latitud: number;
  distanciaAguaM: number | null;
  revisado: boolean;
}

export interface ResumenBackend {
  total: number;
  porDepartamento: { departamento: string; sitios: number }[];
  porTipoAguaCercana: { tipoAguaCercana: string; sitios: number }[];
}

export interface ReporteBackend {
  id: string;
  sitioId: string;
  resultado: 'hay_basura' | 'no_hay_basura' | 'no_pude_entrar';
  notas?: string;
  telefono?: string;
  fechaVisita?: string;
  fotos?: { id: string; url: string }[];
  creadoEn: string;
}

export interface ComentarioBackend {
  id: string;
  texto: string;
  creadoEn: string;
}

export interface SeccionBackend {
  id: string;
  nombre: string;
}

export interface PropuestaBackend {
  id: string;
  texto: string;
  meGusta: number;
  creadoEn: string;
  seccion: SeccionBackend;
}

// Adaptador para convertir formato del backend a la interfaz interna Lugar
export function adaptarSitioALugar(s: SitioBackend | SitioListaBackend): Lugar {
  return {
    id: s.id,
    lon: s.longitud,
    lat: s.latitud,
    direccion: s.lugar,
    departamento: s.departamento,
    distanciaAguaM: s.distanciaAguaM ?? null,
    tipoAgua: (((s as SitioBackend).tipoAguaCercana as TipoAgua) || null),
    poblacion1km: (s as SitioBackend).poblacion1km ?? null,
    poblacion5km: (s as SitioBackend).poblacion5km ?? null,
    elevacionM: (s as SitioBackend).elevacionM ?? null,
    pendienteGrados: (s as SitioBackend).pendienteGrados ?? null,
    gpwId: (s as SitioBackend).gpwId || s.id,
    fuentes: (s as SitioBackend).fuentes || 'Global Plastic Watch',
    verificadoEnCampo: (s as SitioBackend).verificadoEnCampo ?? (s as SitioListaBackend).revisado ?? false,
    licencia: (s as SitioBackend).licencia || 'CC BY-NC 4.0',
    reportes: (s as SitioBackend).reportes || [],
  };
}

// Helper genérico para peticiones API
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Error en API ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.success !== undefined) {
    return json.data as T;
  }
  return json as T;
}

// 1. Mapa
export async function fetchSitiosMapa(): Promise<SitioMapaBackend[]> {
  return apiFetch<SitioMapaBackend[]>('/sitios/mapa');
}

// 2. Lista
export async function fetchSitiosLista(q?: string): Promise<{ sitios: SitioListaBackend[]; total: number }> {
  const query = q ? `?q=${encodeURIComponent(q)}` : '';
  const url = `${API_BASE_URL}/sitios/lista${query}`;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`Error fetching /sitios/lista: ${res.status}`);
  const json = await res.json();
  return {
    sitios: json.data || [],
    total: json.total ?? (json.data?.length || 0),
  };
}

// 3. Sitio individual
export async function fetchSitioById(id: string): Promise<SitioBackend> {
  return apiFetch<SitioBackend>(`/sitios/${encodeURIComponent(id)}`);
}

// 4. Resumen
export async function fetchSitiosResumen(): Promise<ResumenBackend> {
  return apiFetch<ResumenBackend>('/sitios/resumen');
}

// 5. Reportes
export async function fetchReportes(sitioId?: string, resultado?: string): Promise<ReporteBackend[]> {
  const params = new URLSearchParams();
  if (sitioId) params.append('sitio_id', sitioId);
  if (resultado) params.append('resultado', resultado);
  const q = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<ReporteBackend[]>(`/reportes${q}`);
}

export interface CrearReportePayload {
  sitioId: string;
  resultado: 'hay_basura' | 'no_hay_basura' | 'no_pude_entrar';
  fechaVisita: string; // YYYY-MM-DD
  comentario?: string;
  contacto?: string;
  foto?: string;
}

export async function fetchReporteById(id: string): Promise<ReporteBackend> {
  return apiFetch<ReporteBackend>(`/reportes/${encodeURIComponent(id)}`);
}

export async function crearReporte(payload: CrearReportePayload): Promise<ReporteBackend> {
  return apiFetch<ReporteBackend>('/reportes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 6. Comentarios anónimos
export async function fetchComentarios(): Promise<ComentarioBackend[]> {
  return apiFetch<ComentarioBackend[]>('/comentarios');
}

export async function crearComentario(texto: string): Promise<ComentarioBackend> {
  return apiFetch<ComentarioBackend>('/comentarios', {
    method: 'POST',
    body: JSON.stringify({ texto }),
  });
}

// 7. Secciones y Propuestas
export async function fetchSecciones(): Promise<SeccionBackend[]> {
  return apiFetch<SeccionBackend[]>('/secciones');
}

export async function fetchPropuestas(): Promise<PropuestaBackend[]> {
  return apiFetch<PropuestaBackend[]>('/propuestas');
}

export async function crearPropuesta(categoria: string, texto: string): Promise<PropuestaBackend> {
  return apiFetch<PropuestaBackend>('/propuestas', {
    method: 'POST',
    body: JSON.stringify({ categoria, texto }),
  });
}

export async function darMeGusta(propuestaId: string): Promise<{ meGusta: number }> {
  return apiFetch<{ meGusta: number }>(`/propuestas/${encodeURIComponent(propuestaId)}/me-gusta`, {
    method: 'POST',
  });
}
