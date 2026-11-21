import { getLugares } from '@/lib/data';
import {
  fetchSitiosResumen,
  fetchComentarios,
  fetchPropuestas,
  fetchSecciones,
  type SeccionBackend,
} from '@/lib/api';
import type { Comentario, Propuesta } from '@/lib/opiniones';
import { Hero } from '@/components/inicio/Hero';
import { AccionesPrincipales } from '@/components/inicio/AccionesPrincipales';
import { MapaReferencia } from '@/components/inicio/MapaReferencia';
import { Testimonios } from '@/components/inicio/Testimonios';
import { Propuestas } from '@/components/inicio/Propuestas';
import { ComoLoHacemos } from '@/components/inicio/ComoLoHacemos';

export default async function InicioPage() {
  const lugares = getLugares();
  let total = lugares.length;
  let comentariosIniciales: Comentario[] = [];
  let propuestasIniciales: Propuesta[] = [];
  let seccionesIniciales: SeccionBackend[] = [];

  try {
    const [resumen, comentariosApi, propuestasApi, seccionesApi] = await Promise.allSettled([
      fetchSitiosResumen(),
      fetchComentarios(),
      fetchPropuestas(),
      fetchSecciones(),
    ]);

    if (resumen.status === 'fulfilled' && resumen.value?.total > 0) {
      total = resumen.value.total;
    }
    if (comentariosApi.status === 'fulfilled' && comentariosApi.value?.length > 0) {
      comentariosIniciales = comentariosApi.value.map((c) => ({
        id: c.id,
        texto: c.texto,
        fecha: c.creadoEn,
      }));
    }
    if (propuestasApi.status === 'fulfilled' && propuestasApi.value?.length > 0) {
      propuestasIniciales = propuestasApi.value.map((p) => ({
        id: p.id,
        categoria: (p.seccion?.nombre || 'Mapa') as any,
        texto: p.texto,
        fecha: p.creadoEn,
      }));
    }
    if (seccionesApi.status === 'fulfilled' && seccionesApi.value?.length > 0) {
      seccionesIniciales = seccionesApi.value;
    }
  } catch (err) {
    console.warn('Usando fallback local para inicio:', err);
  }

  return (
    <div className="flex flex-col bg-marca-fondo">
      <Hero totalLugares={total} />
      <AccionesPrincipales />

      <div className="flex flex-col gap-16 py-14 sm:gap-20 sm:py-16">
        <MapaReferencia lugares={lugares} />
        <Testimonios comentariosIniciales={comentariosIniciales} />
      </div>

      <Propuestas
        propuestasIniciales={propuestasIniciales}
        seccionesIniciales={seccionesIniciales}
      />

      <div className="py-14 sm:py-20">
        <ComoLoHacemos />
      </div>
    </div>
  );
}
