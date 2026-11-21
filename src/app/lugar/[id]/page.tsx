import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getLugares, getLugarById } from '@/lib/data';
import { DetalleLugarView } from '@/components/places/DetalleLugarView';

interface LugarPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LugarPageProps): Promise<Metadata> {
  const { id } = await params;
  const lugar = getLugarById(id);

  if (!lugar) {
    return {
      title: 'Lugar no encontrado · Basureros en Guatemala',
    };
  }

  return {
    title: `${lugar.direccion.substring(0, 50)}... · Basureros en Guatemala`,
    description: `Ficha del posible basurero ${lugar.id} en ${lugar.departamento}, Guatemala. Coordenadas, cercanía al agua y estado.`,
  };
}

export async function generateStaticParams() {
  const lugares = getLugares();
  return lugares.map((l) => ({
    id: l.id,
  }));
}

export default async function LugarPage({ params }: LugarPageProps) {
  const { id } = await params;
  const lugar = getLugarById(id);

  if (!lugar) {
    notFound();
  }

  const lugares = getLugares();
  const index = lugares.findIndex((l) => l.id.toLowerCase() === lugar.id.toLowerCase());
  const anteriorId = index > 0 ? lugares[index - 1].id : undefined;
  const siguienteId = index < lugares.length - 1 ? lugares[index + 1].id : undefined;

  return (
    <DetalleLugarView
      lugar={lugar}
      anteriorId={anteriorId}
      siguienteId={siguienteId}
    />
  );
}
