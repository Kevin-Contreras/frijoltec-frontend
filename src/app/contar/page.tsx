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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="font-titulos text-3xl sm:text-4xl font-bold text-texto mb-2">
          Contar lo que vi
        </h1>
        <p className="text-texto-secundario text-base sm:text-lg">
          Tu reporte ayuda a confirmar la información satelital y a priorizar acciones ambientales en tu comunidad.
        </p>
      </div>

      <FormularioContar lugares={lugares} lugarInicialId={id} />
    </div>
  );
}
