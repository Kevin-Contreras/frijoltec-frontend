import { Metadata } from 'next';
import { getLugares } from '@/lib/data';
import { estadoAgua, formatearDistancia, nombreCortoLugar } from '@/lib/formato';
import {
  ORGANIZACION_ACTUAL,
  formatearFecha,
  getAvisosDeLugar,
  getEstadoGestion,
} from '@/lib/gestion-ejemplo';
import { BannerBosquejo } from '@/components/gestion/BannerBosquejo';
import { EncabezadoPanel } from '@/components/gestion/EncabezadoPanel';
import { BandejaAvisos, type FilaBandeja } from '@/components/gestion/BandejaAvisos';

export const metadata: Metadata = {
  title: 'Panel de organización · Basureros en Guatemala',
};

/** BOSQUEJO: panel de la organización con datos de ejemplo. */
export default function PanelPage() {
  const org = ORGANIZACION_ACTUAL;

  const filas: FilaBandeja[] = getLugares()
    .filter((l) => l.departamento === org.departamento)
    .map((l) => {
      const avisos = getAvisosDeLugar(l.id);
      return {
        lugarId: l.id,
        nombre: nombreCortoLugar(l),
        departamento: l.departamento,
        estado: getEstadoGestion(l.id),
        avisos: avisos.length,
        conFoto: avisos.filter((a) => a.conFoto).length,
        ultimoAviso: avisos[0] ? formatearFecha(avisos[0].fecha) : null,
        cercaAgua: estadoAgua(l) === 'cerca',
        distanciaTexto: formatearDistancia(l.distanciaAguaM),
      };
    })
    // Primero lo más urgente: más avisos y cerca del agua.
    .sort((a, b) => b.avisos - a.avisos || Number(b.cercaAgua) - Number(a.cercaAgua));

  const resumen = [
    { numero: filas.reduce((s, f) => s + f.avisos, 0), frase: 'avisos de vecinos' },
    { numero: filas.filter((f) => f.estado === 'en_proceso').length, frase: 'lugares en proceso' },
    { numero: filas.filter((f) => f.estado === 'resuelto').length, frase: 'lugares limpiados' },
  ];

  return (
    <div className="w-full flex-1 bg-marca-fondo font-marca">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <BannerBosquejo />
        <EncabezadoPanel organizacion={org} />

        <h1 className="sr-only">Panel de {org.nombre}</h1>

        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
          {resumen.map((r) => (
            <li key={r.frase} className="rounded-[20px] border border-borde bg-superficie p-6">
              <span className="block text-5xl font-bold leading-none text-marca-oscuro">{r.numero}</span>
              <span className="mt-3 block text-xl text-texto-secundario">{r.frase}</span>
            </li>
          ))}
        </ul>

        <BandejaAvisos filas={filas} />
      </div>
    </div>
  );
}
