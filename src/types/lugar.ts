export type TipoAgua =
  | 'river'
  | 'stream'
  | 'pond'
  | 'ditch'
  | 'water'
  | 'coastline';

export interface Lugar {
  id: string;
  lat: number;
  lon: number;
  direccion: string;
  departamento: string;
  distanciaAguaM: number | null;
  tipoAgua: TipoAgua | null;
  poblacion1km: number | null;
  poblacion5km: number | null;
  elevacionM: number | null;
  pendienteGrados: number | null;
  gpwId: string;
  fuentes: string;
  verificadoEnCampo: boolean;
  licencia: string;
}

export type ClaseControl = 'negativo' | 'industrial' | 'incierto';

export interface PuntoControl {
  id: string;
  lat: number;
  lon: number;
  clase: ClaseControl;
}

export type EstadoReporte = 'si_hay_basura' | 'no_hay_basura' | 'no_pude_entrar';

export interface ReporteLocal {
  id: string;
  lugarId: string;
  lugarNombre: string;
  estado: EstadoReporte;
  fotoUrl?: string;
  notas?: string;
  /** Teléfono o correo para contactar a la persona (opcional). */
  telefono?: string;
  /** Día de la visita, formato AAAA-MM-DD. */
  fechaVisita?: string;
  fecha: string;
}
