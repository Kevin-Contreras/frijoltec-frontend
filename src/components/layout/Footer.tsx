export function Footer() {
  return (
    <footer className="mt-auto bg-marca-oscuro py-12 font-marca text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="mb-6 text-lg leading-relaxed text-white/90">
            Datos de{' '}
            <a
              href="https://www.globalplasticwatch.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-2 hover:text-marca-menta"
            >
              Global Plastic Watch
            </a>{' '}
            — Earthrise Media / Minderoo Foundation, licencia{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-2 hover:text-marca-menta"
            >
              CC BY-NC 4.0
            </a>
            . Lugares vistos por satélite que nadie ha revisado en persona todavía.
          </p>

          <p className="m-0 flex items-center gap-3 text-lg font-bold">
            Hecho por
            <img src="/marca/logo-menta-blanco.svg" alt="Frijol Tech" className="h-14 w-auto" />
          </p>
        </div>

        <img
          src="/marca/icono-menta.svg"
          alt=""
          aria-hidden="true"
          className="hidden h-28 w-auto md:block"
        />
      </div>
    </footer>
  );
}
