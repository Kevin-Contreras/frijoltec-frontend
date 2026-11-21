import { Metadata } from 'next';
import { getLugares, getPuntosControl, getDepartamentos } from '@/lib/data';
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
  const lugares = getLugares();
  const puntosControl = getPuntosControl();
  const departamentos = getDepartamentos();

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
