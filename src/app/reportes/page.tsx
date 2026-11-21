import { Metadata } from 'next';
import { fetchReportes, type ReporteBackend } from '@/lib/api';
import { ListaReportes } from '@/components/reportes/ListaReportes';

export const metadata: Metadata = {
  title: 'Reportes de campo · Basureros en Guatemala',
  description: 'Consulta los reportes y fotos de visitas realizados por la comunidad sobre posibles basureros en Guatemala.',
};

interface ReportesPageProps {
  searchParams: Promise<{
    sitio_id?: string;
    resultado?: string;
  }>;
}

export default async function ReportesPage({ searchParams }: ReportesPageProps) {
  const params = await searchParams;
  const sitioId = params?.sitio_id;
  const resultado = params?.resultado;

  let reportes: ReporteBackend[] = [];

  try {
    reportes = await fetchReportes(sitioId, resultado);
  } catch (err) {
    console.warn('Error al cargar reportes para la página:', err);
  }

  return (
    <div className="w-full flex-1 bg-marca-fondo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="font-marca text-4xl font-bold text-marca-oscuro tracking-normal sm:text-5xl mb-3">
            Reportes de campo
          </h1>
          <p className="text-xl text-texto-secundario max-w-3xl">
            Visitas reales y evidencias fotográficas enviadas por personas que fueron a verificar el estado de los lugares.
          </p>
        </div>

        <ListaReportes
          reportesIniciales={reportes}
          filtroSitioInicial={sitioId}
          filtroResultadoInicial={resultado || 'todos'}
        />
      </div>
    </div>
  );
}
