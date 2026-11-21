import { Metadata } from 'next';
import { getLugares } from '@/lib/data';
import { FormularioContar } from '@/components/contar/FormularioContar';

export const metadata: Metadata = {
  title: 'Contar lo que vi · Basureros en Guatemala',
  description: 'Ayúdanos a verificar si los lugares detectados por satélite son realmente basureros a cielo abierto.',
};

interface ContarPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ContarPage({ searchParams }: ContarPageProps) {
  const { id } = await searchParams;
  const lugares = getLugares();

  return (
    <div className="w-full flex-1 bg-marca-fondo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <FormularioContar lugares={lugares} lugarInicialId={id} />
      </div>
    </div>
  );
}
