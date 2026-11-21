import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { fetchReporteById, type ReporteBackend } from '@/lib/api';
import { DetalleReporteView } from '@/components/reportes/DetalleReporteView';

interface ReporteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ReporteDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const reporte = await fetchReporteById(id);
    const lugar = reporte.sitio?.lugar || reporte.sitioId;
    return {
      title: `Reporte ${reporte.sitioId} · Basureros en Guatemala`,
      description: `Reporte de visita en campo para ${lugar}: ${reporte.resultado}.`,
    };
  } catch {
    return {
      title: 'Reporte de visita · Basureros en Guatemala',
    };
  }
}

export default async function ReporteDetailPage({ params }: ReporteDetailPageProps) {
  const { id } = await params;

  let reporte: ReporteBackend | null = null;

  try {
    reporte = await fetchReporteById(id);
  } catch (err) {
    console.warn(`No se pudo obtener el reporte ${id}:`, err);
  }

  if (!reporte) {
    return (
      <div className="w-full flex-1 bg-marca-fondo py-16">
        <div className="max-w-xl mx-auto px-4 text-center font-marca">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <AlertCircle className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-marca-oscuro mb-3">Reporte no encontrado</h1>
          <p className="text-lg text-texto-secundario mb-8">
            El reporte con ID <code className="text-sm bg-superficie px-2 py-1 rounded border border-borde">{id}</code> no existe o no se pudo cargar.
          </p>
          <Link
            href="/reportes"
            className="inline-flex min-h-[50px] items-center gap-2 rounded-xl bg-marca-oscuro px-6 text-base font-bold text-white shadow-sm btn-bounce hover:bg-marca-oscuro-hover"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Volver a la lista de reportes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 bg-marca-fondo">
      <DetalleReporteView reporte={reporte} />
    </div>
  );
}
