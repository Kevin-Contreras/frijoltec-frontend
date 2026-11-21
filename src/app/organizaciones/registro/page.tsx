import { Metadata } from 'next';
import { getDepartamentos } from '@/lib/data';
import { BannerBosquejo } from '@/components/gestion/BannerBosquejo';
import { FormularioRegistro } from '@/components/gestion/FormularioRegistro';

export const metadata: Metadata = {
  title: 'Registrar mi organización · Basureros en Guatemala',
};

export default function RegistroOrganizacionPage() {
  return (
    <div className="w-full flex-1 bg-marca-fondo font-marca">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <BannerBosquejo />
        <div className="animate-fade-in-up">
          <h1 className="mb-3 font-marca text-4xl font-bold text-marca-oscuro tracking-normal">
            Registrar mi organización
          </h1>
          <p className="m-0 text-xl text-texto-secundario">
            Municipalidades, asociaciones y grupos de vecinos pueden ayudar a limpiar estos lugares.
          </p>
        </div>
        <FormularioRegistro departamentos={getDepartamentos()} />
      </div>
    </div>
  );
}
