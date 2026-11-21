import { Metadata } from 'next';
import Link from 'next/link';
import { BannerBosquejo } from '@/components/gestion/BannerBosquejo';

export const metadata: Metadata = {
  title: 'Entrar · Organizaciones · Basureros en Guatemala',
};

const campo =
  'min-h-[56px] w-full rounded-xl border border-borde-fuerte bg-superficie px-4 text-lg text-marca-oscuro focus:border-marca-oscuro';

/** BOSQUEJO: no hay inicio de sesión real; el botón lleva directo al panel de ejemplo. */
export default function EntrarOrganizacionPage() {
  return (
    <div className="w-full flex-1 bg-marca-fondo font-marca">
      <div className="max-w-xl mx-auto flex flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <BannerBosquejo />
        <h1 className="m-0 font-marca text-4xl font-bold text-marca-oscuro tracking-normal">Entrar</h1>

        <div className="flex flex-col gap-6 rounded-[20px] border border-borde bg-superficie p-6 sm:p-8">
          <div>
            <label htmlFor="entrar-correo" className="mb-2 block text-lg font-semibold text-marca-oscuro">
              Correo
            </label>
            <input id="entrar-correo" type="email" autoComplete="email" className={campo} />
          </div>
          <div>
            <label htmlFor="entrar-clave" className="mb-2 block text-lg font-semibold text-marca-oscuro">
              Contraseña
            </label>
            <input id="entrar-clave" type="password" autoComplete="current-password" className={campo} />
          </div>
          <Link
            href="/panel"
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl bg-marca-oscuro px-6 text-xl font-bold text-white hover:bg-marca-oscuro-hover"
          >
            Entrar
          </Link>
        </div>

        <p className="m-0 text-lg text-texto-secundario">
          ¿Tu organización todavía no tiene cuenta?{' '}
          <Link href="/organizaciones/registro" className="font-semibold text-marca-oscuro underline">
            Regístrala aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
