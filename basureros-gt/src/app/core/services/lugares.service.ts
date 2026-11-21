import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { ClaseControl, Lugar, PuntoControl, TipoAgua } from '../models/lugar.model';

interface FeatureCollection<P> {
  type: 'FeatureCollection';
  features: { geometry: { coordinates: [number, number] }; properties: P }[];
}

/** Propiedades tal como vienen en el GeoJSON (pueden traer null, -1 o floats). */
interface PropiedadesCrudas {
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
  verificado_en_campo: boolean;
  licencia: string;
}

const TIPOS_AGUA: readonly string[] = ['river', 'stream', 'pond', 'ditch', 'water', 'coastline'];

function aNumero(valor: number | string | null | undefined): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function aEntero(valor: number | string | null | undefined): number | null {
  const n = aNumero(valor);
  return n === null ? null : Math.round(n);
}

function aTipoAgua(valor: string | number | null): TipoAgua | null {
  const texto = String(valor);
  return TIPOS_AGUA.includes(texto) ? (texto as TipoAgua) : null;
}

@Injectable({ providedIn: 'root' })
export class LugaresService {
  private readonly http = inject(HttpClient);

  /** Los 54 posibles basureros. Se descargan una sola vez. */
  readonly lugares$: Observable<Lugar[]> = this.http
    .get<FeatureCollection<PropiedadesCrudas>>('data/gpw_guatemala_sitios.geojson')
    .pipe(
      map((fc) =>
        fc.features.map(({ geometry, properties: p }): Lugar => ({
          id: p.id,
          lon: geometry.coordinates[0],
          lat: geometry.coordinates[1],
          direccion: p.lugar,
          departamento: p.departamento,
          distanciaAguaM: aNumero(p.distancia_agua_m),
          tipoAgua: aTipoAgua(p.tipo_agua_cercana),
          poblacion1km: aEntero(p.poblacion_1km),
          poblacion5km: aEntero(p.poblacion_5km),
          elevacionM: aNumero(p.elevacion_m),
          pendienteGrados: aNumero(p.pendiente_grados),
          gpwId: p.gpw_id,
          fuentes: p.fuentes,
          verificadoEnCampo: p.verificado_en_campo === true,
          licencia: p.licencia,
        })),
      ),
      shareReplay(1),
    );

  /** Puntos de control (capa opcional, apagada por defecto). */
  readonly puntosControl$: Observable<PuntoControl[]> = this.http
    .get<FeatureCollection<{ clase: ClaseControl }>>('data/gpw_guatemala_negativos_y_otros.geojson')
    .pipe(
      map((fc) =>
        fc.features.map(({ geometry, properties }) => ({
          lon: geometry.coordinates[0],
          lat: geometry.coordinates[1],
          clase: properties.clase,
        })),
      ),
      shareReplay(1),
    );

  porId(id: string): Observable<Lugar | undefined> {
    return this.lugares$.pipe(map((lista) => lista.find((l) => l.id === id)));
  }
}
