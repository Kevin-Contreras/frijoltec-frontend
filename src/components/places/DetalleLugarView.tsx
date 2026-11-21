'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lugar } from '@/types/lugar';
import {
  formatearDistancia,
  formatearNumero,
  nombreTipoAgua,
  estadoAgua,
  enlaceComoLlegar,
} from '@/lib/formato';
import {
  Navigation,
  MessageSquarePlus,
  Droplets,
  Users,
  Mountain,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
  Copy,
  Layers,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const MapaLeaflet = dynamic(() => import('@/components/map/MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-fondo flex items-center justify-center text-texto-secundario rounded-2xl border border-borde">
      Cargando vista geográfica...
    </div>
  ),
});

interface DetalleLugarViewProps {
  lugar: Lugar;
  anteriorId?: string;
  siguienteId?: string;
}

export function DetalleLugarView({
  lugar,
  anteriorId,
  siguienteId,
}: DetalleLugarViewProps) {
  const [mostrarTecnico, setMostrarTecnico] = useState(false);
  const [capaSatelite, setCapaSatelite] = useState(true);
  const [copiado, setCopiado] = useState(false);

  const estado = estadoAgua(lugar);

  const copiarCoordenadas = () => {
    navigator.clipboard.writeText(`${lugar.lat}, ${lugar.lon}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Navegación entre lugares */}
      <div className="flex items-center justify-between text-sm">
        <Link
          href="/lista"
          className="inline-flex items-center gap-1.5 text-texto-secundario hover:text-principal font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </Link>

        <div className="flex items-center gap-2">
          {anteriorId && (
            <Link
              href={`/lugar/${anteriorId}`}
              className="p-2 rounded-lg border border-borde hover:bg-superficie text-texto-secundario hover:text-principal"
              title="Lugar anterior"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          {siguienteId && (
            <Link
              href={`/lugar/${siguienteId}`}
              className="p-2 rounded-lg border border-borde hover:bg-superficie text-texto-secundario hover:text-principal"
              title="Lugar siguiente"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Encabezado principal */}
      <div className="bg-superficie border border-borde rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-md text-sm font-bold bg-principal-suave text-principal">
            {lugar.id}
          </span>
          <span className="px-3 py-1 rounded-md text-sm font-semibold bg-fondo text-texto-secundario border border-borde">
            {lugar.departamento}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            Nadie lo ha revisado en campo todavía
          </span>
        </div>

        <h1 className="font-titulos text-2xl sm:text-4xl font-bold text-texto leading-snug mb-6">
          {lugar.direccion}
        </h1>

        {/* Mapa / Vista satelital del punto exacto */}
        <div className="relative rounded-2xl overflow-hidden border border-borde h-80 sm:h-96 mb-6 shadow-inner">
          <MapaLeaflet
            lugares={[lugar]}
            mostrarControl={false}
            lugarSeleccionado={lugar}
            onSeleccionarLugar={() => {}}
            capaSatelital={capaSatelite}
          />

          <div className="absolute top-3 right-3 z-[400]">
            <button
              type="button"
              onClick={() => setCapaSatelite(!capaSatelite)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-superficie/90 backdrop-blur text-texto text-xs font-bold rounded-lg border border-borde shadow-md hover:bg-superficie transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              {capaSatelite ? 'Ver mapa callejero' : 'Ver foto satélite'}
            </button>
          </div>
        </div>

        {/* 2 Frases clave destacadas con iconos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Cercanía al agua */}
          <div
            className={`p-5 rounded-2xl border ${
              estado === 'cerca'
                ? 'bg-alerta-suave border-alerta/30 text-alerta-texto'
                : 'bg-fondo border-borde text-texto'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-base">
              <Droplets className="w-5 h-5 flex-shrink-0" />
              <span>Cercanía a fuentes de agua</span>
            </div>
            <p className="text-sm sm:text-base m-0">
              {lugar.distanciaAguaM !== null ? (
                <>
                  Se ubica a <strong>{formatearDistancia(lugar.distanciaAguaM)}</strong> de un{' '}
                  <strong>{nombreTipoAgua(lugar.tipoAgua)}</strong>.
                  {estado === 'cerca' && (
                    <span className="block mt-1 font-semibold text-alerta text-xs sm:text-sm">
                      ⚠️ Atención: La cercanía al agua puede acarrear contaminación directa al río o cuerpo de agua.
                    </span>
                  )}
                </>
              ) : (
                'Sin información específica sobre distancia a cuerpos hídricos.'
              )}
            </p>
          </div>

          {/* Población vecina */}
          <div className="p-5 rounded-2xl bg-fondo border border-borde text-texto">
            <div className="flex items-center gap-2 mb-2 font-bold text-base text-principal">
              <Users className="w-5 h-5 flex-shrink-0" />
              <span>Personas que viven cerca</span>
            </div>
            <p className="text-sm sm:text-base m-0">
              Aproximadamente <strong>{formatearNumero(lugar.poblacion1km)}</strong> habitantes en un radio de 1 km,
              y <strong>{formatearNumero(lugar.poblacion5km)}</strong> en 5 km.
            </p>
          </div>
        </div>

        {/* Botones de acción principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href={enlaceComoLlegar(lugar)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 rounded-xl bg-superficie hover:bg-fondo text-principal border-2 border-principal font-bold text-base transition-colors min-h-[56px] shadow-sm"
          >
            <Navigation className="w-5 h-5" />
            <span>Cómo llegar (Google Maps)</span>
          </a>

          <Link
            href={`/contar/${lugar.id}`}
            className="flex items-center justify-center gap-3 p-4 rounded-xl bg-alerta hover:bg-alerta-hover text-white font-bold text-base transition-colors min-h-[56px] shadow-md"
          >
            <MessageSquarePlus className="w-5 h-5" />
            <span>Ya fui, quiero contar qué vi</span>
          </Link>
        </div>
      </div>

      {/* Más datos técnicos del lugar (Plegable) */}
      <div className="bg-superficie border border-borde rounded-3xl p-6 shadow-sm">
        <button
          type="button"
          onClick={() => setMostrarTecnico(!mostrarTecnico)}
          className="w-full flex items-center justify-between text-left text-texto font-titulos font-bold text-lg sm:text-xl py-1 focus:outline-none"
        >
          <span>Más datos técnicos del lugar</span>
          {mostrarTecnico ? (
            <ChevronUp className="w-6 h-6 text-texto-secundario" />
          ) : (
            <ChevronDown className="w-6 h-6 text-texto-secundario" />
          )}
        </button>

        {mostrarTecnico && (
          <div className="mt-6 pt-6 border-t border-borde space-y-4 text-sm animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-fondo p-3 rounded-xl border border-borde">
                <span className="text-xs text-texto-secundario block font-medium">
                  Identificador Satelital GPW
                </span>
                <span className="font-mono font-bold text-texto text-sm">{lugar.gpwId}</span>
              </div>

              <div className="bg-fondo p-3 rounded-xl border border-borde flex items-center justify-between">
                <div>
                  <span className="text-xs text-texto-secundario block font-medium">
                    Coordenadas WGS84
                  </span>
                  <span className="font-mono font-bold text-texto text-sm">
                    {lugar.lat.toFixed(5)}, {lugar.lon.toFixed(5)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copiarCoordenadas}
                  className="p-2 rounded-lg hover:bg-superficie text-texto-secundario hover:text-principal border border-borde"
                  title="Copiar coordenadas"
                >
                  {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-fondo p-3 rounded-xl border border-borde">
                <span className="text-xs text-texto-secundario block font-medium">
                  Elevación del terreno
                </span>
                <span className="font-bold text-texto text-sm">
                  {lugar.elevacionM !== null ? `${formatearNumero(lugar.elevacionM)} msnm` : 'Sin dato'}
                </span>
              </div>

              <div className="bg-fondo p-3 rounded-xl border border-borde">
                <span className="text-xs text-texto-secundario block font-medium">
                  Pendiente del terreno
                </span>
                <span className="font-bold text-texto text-sm">
                  {lugar.pendienteGrados !== null ? `${lugar.pendienteGrados}° de inclinación` : 'Sin dato'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-texto-secundario block font-medium mb-1">
                Fuentes de información satelital
              </span>
              <p className="text-texto text-xs leading-relaxed bg-fondo p-3 rounded-xl border border-borde">
                {lugar.fuentes}
              </p>
            </div>

            <div className="text-xs text-texto-secundario">
              Licencia de los datos: <strong>{lugar.licencia}</strong> (Uso no comercial y atribución obligatoria).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
