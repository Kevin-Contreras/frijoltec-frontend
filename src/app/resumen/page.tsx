import { Metadata } from 'next';
import { getEstadisticas } from '@/lib/data';
import { CifrasPrincipales } from '@/components/resumen/CifrasPrincipales';
import { DondeHayMas } from '@/components/resumen/DondeHayMas';
import { LlamadoContar } from '@/components/resumen/LlamadoContar';

export const metadata: Metadata = {
  title: 'Resumen · Basureros en Guatemala',
  description:
    'Cuántos posibles basureros a cielo abierto hay en Guatemala, cuántos están cerca del agua y en qué departamentos hay más.',
};

export default function ResumenPage() {
  const stats = getEstadisticas();

  return (
    <div className="w-full flex-1 bg-marca-fondo font-marca">
      <div className="max-w-6xl mx-auto flex flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="mb-8 font-marca text-4xl font-bold text-marca-oscuro tracking-normal sm:text-5xl">Resumen</h1>
          <CifrasPrincipales
            total={stats.total}
            departamentos={stats.departamentosCount}
            cercaAgua={stats.cercaAgua}
            revisados={stats.verificados}
          />
        </div>

        <DondeHayMas ranking={stats.rankingDepartamentos} />

        <LlamadoContar />
      </div>
    </div>
  );
}
