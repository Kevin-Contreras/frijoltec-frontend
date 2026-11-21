import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getLugares, getLugarById } from '@/lib/data';
import { fetchSitioById, adaptarSitioALugar } from '@/lib/api';
import { nombreCortoLugar } from '@/lib/formato';
import { DetalleLugarView } from '@/components/places/DetalleLugarView';

interface LugarPageProps {
  params: Promise<{ id: string }>;
}

async function obtenerLugar(id: string) {
  try {
    const sitioApi = await fetchSitioById(id);
    if (sitioApi && sitioApi.id) {
      return adaptarSitioALugar(sitioApi);
    }
  } catch (err) {
    // Si la API falla o está offline, intentamos con datos locales
  }
  return getLugarById(id);
}

export async function generateMetadata({ params }: LugarPageProps): Promise<Metadata> {
  const { id } = await params;
  const lugar = await obtenerLugar(id);

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
  const lugar = await obtenerLugar(id);

  if (!lugar) {
    notFound();
  }

  return <DetalleLugarView lugar={lugar} lugares={getLugares()} />;
}
