import { Metadata } from 'next';
import { getLugares } from '@/lib/data';
import { fetchSitiosLista, adaptarSitioALugar } from '@/lib/api';
import { ListaBuscador } from '@/components/places/ListaBuscador';

export const metadata: Metadata = {
  title: 'Lista de lugares · Basureros en Guatemala',
  description: 'Explora y busca entre los 54 posibles basureros identificados en los 18 departamentos de Guatemala.',
};

export default async function ListaPage() {
  let lugares = getLugares();
  let total = lugares.length;

  try {
    const res = await fetchSitiosLista();
    if (res.sitios && res.sitios.length > 0) {
      lugares = res.sitios.map(adaptarSitioALugar);
      total = res.total;
    }
  } catch (err) {
    console.warn('Usando fallback local para lista:', err);
  }

  return (
    <div className="w-full flex-1 bg-marca-fondo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="mb-8 font-marca text-4xl font-bold text-marca-oscuro tracking-normal sm:text-5xl">
          Lista de lugares
        </h1>
        <ListaBuscador lugares={lugares} totalInicial={total} />
      </div>
    </div>
  );
}
