import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-lg mx-auto">
      <span className="w-16 h-16 rounded-3xl bg-principal-suave text-principal flex items-center justify-center font-titulos font-bold text-2xl mb-6">
        404
      </span>
      <h1 className="font-titulos text-3xl font-bold text-texto mb-3">
        No encontramos esta página
      </h1>
      <p className="text-texto-secundario text-base mb-8">
        Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-principal hover:bg-principal-hover text-white font-bold text-base transition-colors w-full sm:w-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Ir al inicio</span>
        </Link>
        <Link
          href="/mapa"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-superficie border border-borde hover:bg-fondo text-texto font-bold text-base transition-colors w-full sm:w-auto"
        >
          <MapPin className="w-5 h-5 text-principal" />
          <span>Ver el mapa</span>
        </Link>
      </div>
    </div>
  );
}
