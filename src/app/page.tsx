import { getLugares } from '@/lib/data';
import { Hero } from '@/components/inicio/Hero';
import { AccionesPrincipales } from '@/components/inicio/AccionesPrincipales';
import { MapaReferencia } from '@/components/inicio/MapaReferencia';
import { Testimonios } from '@/components/inicio/Testimonios';
import { Propuestas } from '@/components/inicio/Propuestas';
import { ComoLoHacemos } from '@/components/inicio/ComoLoHacemos';

export default function InicioPage() {
  const lugares = getLugares();

  return (
    <div className="flex flex-col bg-marca-fondo">
      <Hero totalLugares={lugares.length} />
      <AccionesPrincipales />

      <div className="flex flex-col gap-16 py-14 sm:gap-20 sm:py-16">
        <MapaReferencia lugares={lugares} />
        <Testimonios />
      </div>

      <Propuestas />

      <div className="py-14 sm:py-20">
        <ComoLoHacemos />
      </div>
    </div>
  );
}
