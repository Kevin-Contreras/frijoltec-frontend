import { Metadata } from 'next';
import { getLugares, getPuntosControl, getDepartamentos } from '@/lib/data';
import { fetchSitiosMapa } from '@/lib/api';
import { MapaInteractivo } from '@/components/map/MapaInteractivo';

export const metadata: Metadata = {
  title: 'Mapa interactivo de posibles basureros · Basureros en Guatemala',
  description: 'Explora los 54 lugares detectados por satélite en Guatemala clasificados según su cercanía al agua.',
};

interface MapaPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function MapaPage({ searchParams }: MapaPageProps) {
  const { id } = await searchParams;
  let lugares = getLugares();
  const puntosControl = getPuntosControl();
  let departamentos = getDepartamentos();

  try {
    const mapaSitios = await fetchSitiosMapa();
    if (mapaSitios && mapaSitios.length > 0) {
      // Sincronizar coordenadas o población desde la API si corresponde
      const mapaDict = new Map(mapaSitios.map((s) => [s.id, s]));
      lugares = lugares.map((l) => {
        const delBackend = mapaDict.get(l.id);
        if (delBackend) {
          return {
            ...l,
            lon: delBackend.longitud ?? l.lon,
            lat: delBackend.latitud ?? l.lat,
            direccion: delBackend.lugar ?? l.direccion,
            departamento: delBackend.departamento ?? l.departamento,
            poblacion5km: delBackend.poblacion5km ?? l.poblacion5km,
          };
        }
        return l;
      });
      const deptosSet = new Set<string>();
      lugares.forEach((l) => {
        if (l.departamento) deptosSet.add(l.departamento);
      });
      departamentos = Array.from(deptosSet).sort((a, b) => a.localeCompare(b, 'es'));
    }
  } catch (err) {
    console.warn('Usando fallback local para mapa:', err);
  }

  return (
    <div className="flex-1 flex flex-col">
      <MapaInteractivo
        lugares={lugares}
        puntosControl={puntosControl}
        departamentos={departamentos}
        lugarInicialId={id}
      />
    </div>
  );
}
