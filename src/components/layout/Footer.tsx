import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-superficie border-t border-borde text-texto-secundario text-sm py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="m-0 leading-relaxed text-center md:text-left">
            Datos provistos por{' '}
            <a
              href="https://www.globalplasticwatch.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-principal underline font-semibold hover:text-principal-hover"
            >
              Global Plastic Watch
            </a>{' '}
            (Earthrise Media / Minderoo Foundation).
          </p>
          <p className="m-0 text-xs mt-1 text-center md:text-left">
            Licencia{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.es"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-principal"
            >
              CC BY-NC 4.0
            </a>{' '}
            (Atribución - Uso no comercial).
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/mapa" className="hover:text-principal transition-colors">
            Ver mapa
          </Link>
          <Link href="/lista" className="hover:text-principal transition-colors">
            Lista de lugares
          </Link>
          <Link href="/resumen" className="hover:text-principal transition-colors">
            Estadísticas
          </Link>
          <Link href="/contar" className="hover:text-principal font-medium transition-colors">
            Reportar
          </Link>
        </div>
      </div>
    </footer>
  );
}
