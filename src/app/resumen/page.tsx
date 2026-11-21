import { Metadata } from 'next';
import { getEstadisticas } from '@/lib/data';
import { fetchSitiosResumen } from '@/lib/api';
import { CifrasPrincipales } from '@/components/resumen/CifrasPrincipales';
import { DondeHayMas } from '@/components/resumen/DondeHayMas';
import { LlamadoContar } from '@/components/resumen/LlamadoContar';

export const metadata: Metadata = {
  title: 'Resumen · Basureros en Guatemala',
  description:
    'Cuántos posibles basureros a cielo abierto hay en Guatemala, cuántos están cerca del agua y en qué departamentos hay más.',
};

export default async function ResumenPage() {
  const statsLocal = getEstadisticas();
  let total = statsLocal.total;
  let departamentosCount = statsLocal.departamentosCount;
  let cercaAgua = statsLocal.cercaAgua;
  let revisados = statsLocal.verificados;
  let ranking = statsLocal.rankingDepartamentos;

  try {
    const resumenApi = await fetchSitiosResumen();
    if (resumenApi && resumenApi.total > 0) {
      total = resumenApi.total;
      departamentosCount = resumenApi.porDepartamento.length;
      ranking = resumenApi.porDepartamento.map((d) => ({
        nombre: d.departamento,
        cantidad: d.sitios,
      }));
    }
  } catch (err) {
    console.warn('Usando fallback local para resumen:', err);
  }

  return (
    <div className="w-full flex-1 bg-marca-fondo font-marca">
      <div className="max-w-6xl mx-auto flex flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="mb-8 font-marca text-4xl font-bold text-marca-oscuro tracking-normal sm:text-5xl">Resumen</h1>
          <CifrasPrincipales
            total={total}
            departamentos={departamentosCount}
            cercaAgua={cercaAgua}
            revisados={revisados}
          />
        </div>

        <DondeHayMas ranking={ranking} />

        <LlamadoContar />
      </div>
    </div>
  );
}
