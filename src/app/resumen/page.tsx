import { Metadata } from 'next';
import Link from 'next/link';
import { getEstadisticas } from '@/lib/data';
import { formatearNumero } from '@/lib/formato';
import {
  BarChart3,
  Droplets,
  Satellite,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resumen y estadísticas · Basureros en Guatemala',
  description:
    'Estadísticas clave sobre los 54 posibles basureros a cielo abierto detectados en Guatemala, departamentos más afectados y cercanía a ríos.',
};

const TRADUCCION_TIPO_AGUA: Record<string, string> = {
  river: 'Ríos',
  stream: 'Arroyos y riachuelos',
  pond: 'Estanques o lagunetas',
  ditch: 'Zanjas o canales',
  water: 'Cuerpos de agua generales',
  coastline: 'Costas o playas',
  sin_especificar: 'Sin clasificar',
};

export default function ResumenPage() {
  const stats = getEstadisticas();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Encabezado */}
      <div>
        <h1 className="font-titulos text-3xl sm:text-4xl font-bold text-texto mb-2">
          Resumen de la situación en Guatemala
        </h1>
        <p className="text-texto-secundario text-base sm:text-lg">
          Datos cuantitativos de las detecciones satelitales analizadas por Global Plastic Watch.
        </p>
      </div>

      {/* 3 Cifras Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-superficie border border-borde rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-principal-suave text-principal flex items-center justify-center mb-4">
              <Satellite className="w-6 h-6" />
            </div>
            <span className="font-titulos text-4xl sm:text-5xl font-extrabold text-texto block mb-1">
              {stats.total}
            </span>
            <span className="font-titulos font-bold text-lg text-texto block mb-2">
              Lugares identificados
            </span>
            <p className="text-texto-secundario text-sm m-0">
              Distribuidos a lo largo de <strong>{stats.departamentosCount} departamentos</strong> de la república.
            </p>
          </div>
        </div>

        <div className="bg-superficie border-2 border-alerta/30 rounded-3xl p-6 shadow-sm bg-alerta-suave/20 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-alerta-suave text-alerta flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="font-titulos text-4xl sm:text-5xl font-extrabold text-alerta block mb-1">
              {stats.cercaAgua}
            </span>
            <span className="font-titulos font-bold text-lg text-alerta block mb-2">
              Cerca de fuentes de agua
            </span>
            <p className="text-alerta-texto text-sm m-0">
              Están a <strong>menos de 500 metros</strong> de corrientes o cuerpos hídricos con alto riesgo de escorrentía.
            </p>
          </div>
        </div>

        <div className="bg-superficie border border-borde rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="font-titulos text-4xl sm:text-5xl font-extrabold text-texto block mb-1">
              0
            </span>
            <span className="font-titulos font-bold text-lg text-texto block mb-2">
              Revisados formalmente
            </span>
            <p className="text-texto-secundario text-sm m-0">
              Aún no cuentan con validación de campo oficial. Por eso tu participación comunitaria es indispensable.
            </p>
          </div>
        </div>
      </div>

      {/* Departamentos con más lugares */}
      <div className="bg-superficie border border-borde rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-titulos text-2xl font-bold text-texto mb-2">
          Departamentos con mayor cantidad de detecciones
        </h2>
        <p className="text-texto-secundario text-sm mb-6">
          Los 6 departamentos que concentran el mayor número de posibles basureros satelitales.
        </p>

        <div className="space-y-4">
          {stats.rankingDepartamentos.slice(0, 6).map((item, idx) => {
            const porcentaje = Math.round((item.cantidad / stats.total) * 100);
            return (
              <div key={item.nombre} className="space-y-1.5">
                <div className="flex justify-between text-sm font-semibold text-texto">
                  <span>
                    {idx + 1}. {item.nombre}
                  </span>
                  <span>
                    {item.cantidad} lugares ({porcentaje}%)
                  </span>
                </div>
                <div className="w-full bg-fondo rounded-full h-3.5 overflow-hidden border border-borde">
                  <div
                    className="bg-principal h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.cantidad / stats.rankingDepartamentos[0].cantidad) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tipos de agua cercana */}
      <div className="bg-superficie border border-borde rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-titulos text-2xl font-bold text-texto mb-2">
          Cuerpos de agua amenazados
        </h2>
        <p className="text-texto-secundario text-sm mb-6">
          Distribución de los posibles basureros según el tipo de fuente de agua más próxima.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(stats.porTipoAgua).map(([tipo, cant]) => (
            <div key={tipo} className="bg-fondo border border-borde rounded-2xl p-4">
              <span className="text-xs text-texto-secundario block font-medium">
                {TRADUCCION_TIPO_AGUA[tipo] || tipo}
              </span>
              <span className="font-titulos text-2xl font-bold text-principal">
                {cant} {cant === 1 ? 'sitio' : 'sitios'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Llamada a la acción */}
      <div className="bg-principal text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <h2 className="font-titulos text-2xl sm:text-3xl font-bold text-white mb-2">
            Explora cada punto en el mapa interactivo
          </h2>
          <p className="text-principal-suave text-base max-w-xl m-0">
            Filtra por tu departamento, revisa distancias a ríos y reporta observaciones para mantener limpia Guatemala.
          </p>
        </div>
        <Link
          href="/mapa"
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white text-principal font-bold text-base hover:bg-principal-suave transition-colors shadow-lg"
        >
          <MapPin className="w-5 h-5" />
          <span>Ver el mapa completo</span>
        </Link>
      </div>
    </div>
  );
}
