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
    <div className="w-full flex-1 bg-marca-fondo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <FormularioContar lugares={lugares} lugarInicialId={id} />
      </div>
    </div>
  );
}
