interface HeroProps {
  totalLugares: number;
}

/**
 * Portada del inicio. Si existe `public/img/hero.jpg` se ve detrás del color oscuro;
 * si no, queda solo el fondo oscuro con el ícono de la marca.
 */
export function Hero({ totalLugares }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-marca-oscuro text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(20, 42, 39, 0.82), rgba(20, 42, 39, 0.82)), url('/img/hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Ícono decorativo de la marca */}
      <img
        src="/marca/icono-blanco.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-6 hidden w-[560px] max-w-none opacity-15 lg:block"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-40 sm:pb-44">
        <h1 className="font-marca font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-3xl mb-6 tracking-normal">
          Basureros a cielo abierto en Guatemala
        </h1>
        <p className="font-marca text-lg sm:text-xl leading-relaxed text-white/90 max-w-3xl">
          Encontramos {totalLugares} lugares que, vistos desde el satélite, parecen basureros.
          <br className="hidden sm:block" /> Todavía nadie los ha revisado en persona. ¿Qué quieres hacer?
        </p>
      </div>
    </section>
  );
}
