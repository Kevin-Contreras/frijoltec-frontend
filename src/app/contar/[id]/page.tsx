import { Metadata } from 'next';
import { getLugares } from '@/lib/data';
import { FormularioContar } from '@/components/contar/FormularioContar';

interface ContarConIdProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ContarConIdProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Reportar lugar ${id} · Basureros en Guatemala`,
    description: `Envía tus observaciones de campo sobre el lugar ${id}.`,
  };
}

export default async function ContarConIdPage({ params }: ContarConIdProps) {
  const { id } = await params;
  const lugares = getLugares();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="font-titulos text-3xl sm:text-4xl font-bold text-texto mb-2">
          Contar lo que vi
        </h1>
        <p className="text-texto-secundario text-base sm:text-lg">
          Reportando sobre el lugar <strong>{id}</strong>. Responde qué encontraste en el terreno.
        </p>
      </div>

      <FormularioContar lugares={lugares} lugarInicialId={id} />
    </div>
  );
}
