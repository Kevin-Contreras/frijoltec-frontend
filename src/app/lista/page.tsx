import { Metadata } from 'next';
import { getLugares, getDepartamentos } from '@/lib/data';
import { ListaBuscador } from '@/components/places/ListaBuscador';

export const metadata: Metadata = {
  title: 'Buscar lugares y municipios · Basureros en Guatemala',
  description: 'Explora y busca entre los 54 posibles basureros identificados en los 18 departamentos de Guatemala.',
};

export default function ListaPage() {
  const lugares = getLugares();
  const departamentos = getDepartamentos();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      <div className="mb-8">
        <h1 className="font-titulos text-3xl sm:text-4xl font-bold text-texto mb-2">
          Buscar un posible basurero
        </h1>
        <p className="text-texto-secundario text-base sm:text-lg">
          Filtra por departamento o escribe el nombre de tu municipio para encontrar los sitios detectados.
        </p>
      </div>

      <ListaBuscador lugares={lugares} departamentos={departamentos} />
    </div>
  );
}
