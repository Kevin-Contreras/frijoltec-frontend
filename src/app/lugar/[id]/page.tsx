import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getLugares, getLugarById } from '@/lib/data';
import { nombreCortoLugar } from '@/lib/formato';
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
    title: `${nombreCortoLugar(lugar)}, ${lugar.departamento} · Basureros en Guatemala`,
    description: `Posible basurero en ${lugar.departamento}, Guatemala: cercanía al agua, personas que viven cerca y cómo llegar.`,
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

  return <DetalleLugarView lugar={lugar} lugares={getLugares()} />;
}
