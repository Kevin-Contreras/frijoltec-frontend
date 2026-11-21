/** Tipo de agua tal como viene en los datos de Global Plastic Watch. */
export type TipoAgua = 'river' | 'stream' | 'pond' | 'ditch' | 'water' | 'coastline';

/** Un posible basurero, ya limpio y listo para usar en la app. */
export interface Lugar {
  id: string;
  lat: number;
  lon: number;
  direccion: string;
  departamento: string;
  /** null cuando no hay dato. */
  distanciaAguaM: number | null;
  /** null cuando viene -1 (sin dato). */
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

/** Clase de los puntos de control (capa opcional). */
export type ClaseControl = 'negativo' | 'industrial' | 'incierto';

export interface PuntoControl {
  lat: number;
  lon: number;
  clase: ClaseControl;
}
