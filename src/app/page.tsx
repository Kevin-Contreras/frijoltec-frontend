import Link from 'next/link';
import { getLugares, getEstadisticas } from '@/lib/data';
import { formatearNumero } from '@/lib/formato';
import { TarjetaLugar } from '@/components/places/TarjetaLugar';
import {
  MapPin,
  Search,
  MessageSquarePlus,
  Satellite,
  Users2,
  ShieldAlert,
  ArrowRight,
  Droplets,
  CheckCircle2,
} from 'lucide-react';

export default function InicioPage() {
  const lugares = getLugares();
  const stats = getEstadisticas();

  // Lugares más críticos cerca de fuentes hídricas
  const lugaresCriticos = lugares
    .filter((l) => l.distanciaAguaM !== null && l.distanciaAguaM < 300)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      {/* Hero Principal */}
      <section className="bg-gradient-to-b from-principal-suave/60 to-fondo pt-12 sm:pt-20 pb-12 border-b border-borde">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white text-principal border border-borde shadow-sm mb-6">
            <Satellite className="w-4 h-4 text-principal" />
            Datos satelitales abiertos de Global Plastic Watch
          </span>

          <h1 className="font-titulos text-3xl sm:text-5xl lg:text-6xl font-bold text-texto tracking-tight mb-6 leading-tight">
            Basureros a cielo abierto en Guatemala
          </h1>

          <p className="text-lg sm:text-xl text-texto-secundario max-w-2xl mx-auto mb-10 leading-relaxed">
            Encontramos <strong>{stats.total} lugares</strong> en Guatemala que, vistos desde el satélite,
            parecen basureros a cielo abierto. Necesitamos que personas en el lugar nos cuenten si de verdad lo son.
          </p>

          {/* 3 Botones Principales de Acción Grande */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link
              href="/mapa"
              className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-principal hover:bg-principal-hover text-white font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5 min-h-[64px]"
            >
              <MapPin className="w-6 h-6 flex-shrink-0" />
              <span>Ver el mapa</span>
            </Link>

            <Link
              href="/lista"
              className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-superficie hover:bg-principal-suave text-texto hover:text-principal border-2 border-borde hover:border-principal font-bold text-lg shadow-sm transition-all min-h-[64px]"
            >
              <Search className="w-6 h-6 flex-shrink-0 text-principal" />
              <span>Buscar un lugar</span>
            </Link>

            <Link
              href="/contar"
              className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-alerta hover:bg-alerta-hover text-white font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5 min-h-[64px]"
            >
              <MessageSquarePlus className="w-6 h-6 flex-shrink-0" />
              <span>Contar lo que vi</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Cifras Clave */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-superficie border border-borde rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-principal-suave text-principal">
              <Satellite className="w-8 h-8" />
            </div>
            <div>
              <span className="font-titulos text-3xl sm:text-4xl font-extrabold text-texto block">
                {stats.total}
              </span>
              <span className="text-texto-secundario text-base font-medium">
                Lugares detectados por satélite en {stats.departamentosCount} departamentos
              </span>
            </div>
          </div>

          <div className="bg-superficie border-2 border-alerta/30 rounded-2xl p-6 shadow-sm flex items-start gap-4 bg-alerta-suave/20">
            <div className="p-3 rounded-xl bg-alerta-suave text-alerta">
              <Droplets className="w-8 h-8" />
            </div>
            <div>
              <span className="font-titulos text-3xl sm:text-4xl font-extrabold text-alerta block">
                {stats.cercaAgua}
              </span>
              <span className="text-alerta-texto text-base font-medium">
                Están a menos de 500 metros de un río, lago o zanja
              </span>
            </div>
          </div>

          <div className="bg-superficie border border-borde rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="font-titulos text-3xl sm:text-4xl font-extrabold text-texto block">
                0
              </span>
              <span className="text-texto-secundario text-base font-medium">
                Revisados formalmente en campo. ¡Tu reporte hace la diferencia!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona en 3 Pasos Sencillos */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-titulos text-2xl sm:text-3xl font-bold text-texto mb-3">
            ¿Cómo funciona este proyecto?
          </h2>
          <p className="text-texto-secundario text-base">
            Una herramienta abierta para que comunidades, municipios y voluntarios colaboren en el cuidado ambiental.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Paso 1 */}
          <div className="bg-superficie border border-borde rounded-2xl p-6 flex flex-col relative shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-principal text-white flex items-center justify-center font-titulos font-bold text-xl mb-4">
              1
            </div>
            <h3 className="font-titulos text-xl font-bold text-texto mb-2">
              Detección satelital
            </h3>
            <p className="text-texto-secundario text-base leading-relaxed">
              Global Plastic Watch usa satélites para identificar concentraciones de residuos al aire libre en todo el país.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-superficie border border-borde rounded-2xl p-6 flex flex-col relative shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-principal text-white flex items-center justify-center font-titulos font-bold text-xl mb-4">
              2
            </div>
            <h3 className="font-titulos text-xl font-bold text-texto mb-2">
              Verificación ciudadana
            </h3>
            <p className="text-texto-secundario text-base leading-relaxed">
              Vecinos, estudiantes y personal municipal visitan el lugar y nos dicen con un simple formulario qué vieron.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-superficie border border-borde rounded-2xl p-6 flex flex-col relative shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-principal text-white flex items-center justify-center font-titulos font-bold text-xl mb-4">
              3
            </div>
            <h3 className="font-titulos text-xl font-bold text-texto mb-2">
              Acción y protección
            </h3>
            <p className="text-texto-secundario text-base leading-relaxed">
              Con datos confirmados se pueden priorizar jornadas de limpieza y evitar que la basura llegue a los ríos.
            </p>
          </div>
        </div>
      </section>

      {/* Muestra de Lugares Críticos Cerca de Ríos */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-alerta tracking-wide uppercase">
              Urgente atención
            </span>
            <h2 className="font-titulos text-2xl sm:text-3xl font-bold text-texto mt-1">
              Lugares más cercanos a fuentes de agua
            </h2>
            <p className="text-texto-secundario text-sm sm:text-base">
              La basura acumulada cerca de corrientes contamina el agua potable y los ecosistemas de Guatemala.
            </p>
          </div>
          <Link
            href="/lista"
            className="inline-flex items-center gap-2 text-principal hover:text-principal-hover font-bold text-sm"
          >
            Ver todos los lugares
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lugaresCriticos.map((lugar) => (
            <TarjetaLugar key={lugar.id} lugar={lugar} />
          ))}
        </div>
      </section>
    </div>
  );
}
