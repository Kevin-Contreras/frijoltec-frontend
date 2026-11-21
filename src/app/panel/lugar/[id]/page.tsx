import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getLugarById } from '@/lib/data';
import { nombreCortoLugar } from '@/lib/formato';
import { ORGANIZACION_ACTUAL, getAvisosDeLugar, getEstadoGestion } from '@/lib/gestion-ejemplo';
import { getHistorialVista } from '@/lib/gestion-vista';
import { BannerBosquejo } from '@/components/gestion/BannerBosquejo';
import { EncabezadoPanel } from '@/components/gestion/EncabezadoPanel';
import { EtiquetaEstado } from '@/components/gestion/EtiquetaEstado';
import { AvisosVecinos } from '@/components/gestion/AvisosVecinos';
import { ActualizarLugar } from '@/components/gestion/ActualizarLugar';
import { EtiquetaAgua } from '@/components/places/EtiquetasLugar';

interface PanelLugarProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Actualizar lugar · Panel de organización',
};

/** BOSQUEJO: ficha de un lugar dentro del panel de la organización. */
export default async function PanelLugarPage({ params }: PanelLugarProps) {
  const { id } = await params;
  const lugar = getLugarById(id);
  if (!lugar) notFound();

  const avisos = getAvisosDeLugar(lugar.id);

  return (
    <div className="w-full flex-1 bg-marca-fondo font-marca">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <BannerBosquejo />
        <EncabezadoPanel organizacion={ORGANIZACION_ACTUAL} />

        <Link
          href="/panel"
          className="group inline-flex min-h-[48px] items-center gap-2 self-start text-lg font-semibold text-marca-oscuro hover:underline"
        >
          <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
          Volver a los lugares
        </Link>

        <div className="animate-fade-in-up">
          <div className="mb-4 flex flex-wrap gap-3">
            <EtiquetaEstado estado={getEstadoGestion(lugar.id)} />
            <EtiquetaAgua lugar={lugar} />
          </div>
          <h1 className="mb-2 font-marca text-4xl font-bold text-marca-oscuro tracking-normal">
            {nombreCortoLugar(lugar)}
          </h1>
          <p className="mb-3 text-xl text-texto-secundario">{lugar.departamento}</p>
          <Link
            href={`/lugar/${lugar.id}`}
            className="inline-flex items-center gap-2 text-lg font-semibold text-marca-oscuro underline underline-offset-2"
          >
            Ver la página pública del lugar
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <section aria-labelledby="titulo-avisos">
            <h2 id="titulo-avisos" className="mb-4 font-marca text-2xl font-bold text-marca-oscuro tracking-normal">
              Lo que contaron los vecinos ({avisos.length})
            </h2>
            <AvisosVecinos avisos={avisos} />
          </section>

          <ActualizarLugar organizacion={ORGANIZACION_ACTUAL} historialInicial={getHistorialVista(lugar.id)} />
        </div>
      </div>
    </div>
  );
}
