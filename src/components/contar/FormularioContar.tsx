'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lugar, EstadoReporte, ReporteLocal } from '@/types/lugar';
import { guardarReporteLocal, getReportesLocales } from '@/lib/storage';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  FileText,
  MapPin,
  ArrowRight,
  ArrowLeft,
  X,
  Send,
  Clock,
} from 'lucide-react';

interface FormularioContarProps {
  lugares: Lugar[];
  lugarInicialId?: string;
}

export function FormularioContar({ lugares, lugarInicialId }: FormularioContarProps) {
  const [lugarId, setLugarId] = useState(lugarInicialId || (lugares[0]?.id ?? ''));
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [estado, setEstado] = useState<EstadoReporte | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [notas, setNotas] = useState('');
  const [telefono, setTelefono] = useState('');
  const [misReportes, setMisReportes] = useState<ReporteLocal[]>([]);
  const [errorValidacion, setErrorValidacion] = useState('');

  useEffect(() => {
    setMisReportes(getReportesLocales());
  }, [paso]);

  const lugarSeleccionado = lugares.find((l) => l.id.toLowerCase() === lugarId.toLowerCase());

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const avanzarPaso2 = () => {
    if (!estado) {
      setErrorValidacion('Por favor selecciona qué viste en el lugar.');
      return;
    }
    setErrorValidacion('');
    setPaso(2);
  };

  const enviarReporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lugarSeleccionado || !estado) return;

    guardarReporteLocal({
      lugarId: lugarSeleccionado.id,
      lugarNombre: lugarSeleccionado.direccion,
      estado,
      fotoUrl: fotoPreview || undefined,
      notas: notas.trim() || undefined,
      telefono: telefono.trim() || undefined,
    });

    setPaso(3);
  };

  const reiniciar = () => {
    setPaso(1);
    setEstado(null);
    setFotoPreview(null);
    setNotas('');
    setTelefono('');
    setErrorValidacion('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Selector de lugar si no vino prefijado o si desea cambiarlo */}
      {paso !== 3 && (
        <div className="bg-superficie border border-borde rounded-2xl p-4 sm:p-6 shadow-sm">
          <label htmlFor="lugar-select" className="block text-sm font-bold text-texto mb-2">
            ¿Sobre qué lugar quieres contar lo que viste?
          </label>
          <select
            id="lugar-select"
            value={lugarId}
            onChange={(e) => setLugarId(e.target.value)}
            className="w-full bg-fondo border border-borde rounded-xl p-3 text-texto font-medium focus:border-principal cursor-pointer"
          >
            {lugares.map((l) => (
              <option key={l.id} value={l.id}>
                [{l.departamento}] {l.id} — {l.direccion.substring(0, 50)}...
              </option>
            ))}
          </select>
          {lugarSeleccionado && (
            <div className="mt-3 text-xs text-texto-secundario flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-principal flex-shrink-0" />
              <span>{lugarSeleccionado.direccion}</span>
            </div>
          )}
        </div>
      )}

      {/* Indicador de pasos */}
      {paso !== 3 && (
        <div className="flex items-center justify-center gap-4 text-sm font-semibold">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              paso === 1
                ? 'bg-principal text-white shadow-sm'
                : 'bg-superficie text-texto-secundario border border-borde'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              1
            </span>
            <span>¿Qué encontraste?</span>
          </div>

          <div className="w-8 h-0.5 bg-borde" />

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              paso === 2
                ? 'bg-principal text-white shadow-sm'
                : 'bg-superficie text-texto-secundario border border-borde'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              2
            </span>
            <span>Detalles adicionales</span>
          </div>
        </div>
      )}

      {/* PASO 1: ¿Qué encontraste? */}
      {paso === 1 && (
        <div className="bg-superficie border border-borde rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-titulos text-xl sm:text-2xl font-bold text-texto">
            Paso 1: ¿Qué viste al visitar este lugar?
          </h2>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => {
                setEstado('si_hay_basura');
                setErrorValidacion('');
              }}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                estado === 'si_hay_basura'
                  ? 'border-alerta bg-alerta-suave/40 text-alerta-texto shadow-sm'
                  : 'border-borde hover:border-borde-fuerte bg-fondo text-texto'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  estado === 'si_hay_basura'
                    ? 'bg-alerta text-white'
                    : 'bg-superficie text-alerta border border-borde'
                }`}
              >
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="font-titulos font-bold text-lg block">
                  Sí, hay basura acumulada
                </span>
                <span className="text-xs sm:text-sm text-texto-secundario">
                  Se observa acumulación de residuos, plásticos o desechos al aire libre.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEstado('no_hay_basura');
                setErrorValidacion('');
              }}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                estado === 'no_hay_basura'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                  : 'border-borde hover:border-borde-fuerte bg-fondo text-texto'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  estado === 'no_hay_basura'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-superficie text-emerald-600 border border-borde'
                }`}
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="font-titulos font-bold text-lg block">
                  No, no hay basura
                </span>
                <span className="text-xs sm:text-sm text-texto-secundario">
                  El terreno está limpio, es vegetación, cultivo, construcción o ya fue limpiado.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEstado('no_pude_entrar');
                setErrorValidacion('');
              }}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                estado === 'no_pude_entrar'
                  ? 'border-slate-600 bg-slate-100 text-slate-900 shadow-sm'
                  : 'border-borde hover:border-borde-fuerte bg-fondo text-texto'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  estado === 'no_pude_entrar'
                    ? 'bg-slate-700 text-white'
                    : 'bg-superficie text-slate-700 border border-borde'
                }`}
              >
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="font-titulos font-bold text-lg block">
                  No pude entrar / camino inaccesible
                </span>
                <span className="text-xs sm:text-sm text-texto-secundario">
                  Propiedad privada cerrada, barranco, falta de paso o peligroso para acceder.
                </span>
              </div>
            </button>
          </div>

          {errorValidacion && (
            <p className="text-alerta text-sm font-semibold m-0">{errorValidacion}</p>
          )}

          {/* Subir foto opcional */}
          <div className="pt-4 border-t border-borde">
            <label className="block text-sm font-bold text-texto mb-2">
              Foto del lugar (opcional):
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-dashed border-borde hover:border-principal bg-fondo hover:bg-superficie cursor-pointer text-sm font-semibold text-principal transition-colors w-full sm:w-auto">
                <Camera className="w-5 h-5" />
                <span>{fotoPreview ? 'Cambiar foto' : 'Tomar o subir foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFoto}
                  className="hidden"
                />
              </label>

              {fotoPreview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-borde shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoPreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFotoPreview(null)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={avanzarPaso2}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-principal hover:bg-principal-hover text-white font-bold text-base transition-colors shadow-sm"
            >
              <span>Continuar al siguiente paso</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PASO 2: Notas y teléfono opcionales */}
      {paso === 2 && (
        <form
          onSubmit={enviarReporte}
          className="bg-superficie border border-borde rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <h2 className="font-titulos text-xl sm:text-2xl font-bold text-texto">
            Paso 2: Notas adicionales (opcional)
          </h2>

          <div>
            <label htmlFor="notas-field" className="block text-sm font-bold text-texto mb-2">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-principal" />
                ¿Quieres agregar algún detalle sobre lo que viste?
              </span>
            </label>
            <textarea
              id="notas-field"
              rows={4}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej. Hay botellas plásticas acumuladas en la ladera hacia el arroyo, o se quemó basura recientemente..."
              className="w-full p-4 rounded-xl border border-borde bg-fondo text-texto text-base focus:border-principal focus:ring-0"
            />
          </div>

          <div>
            <label htmlFor="tel-field" className="block text-sm font-bold text-texto mb-2">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-principal" />
                Teléfono de contacto (opcional)
              </span>
            </label>
            <input
              type="tel"
              id="tel-field"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Número de WhatsApp o teléfono para coordinar jornadas"
              className="w-full p-3.5 rounded-xl border border-borde bg-fondo text-texto text-base focus:border-principal focus:ring-0"
            />
            <span className="text-xs text-texto-secundario mt-1 block">
              No es obligatorio. Tu reporte se envía de manera segura y anónima si no dejas teléfono.
            </span>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-borde bg-fondo hover:bg-superficie text-texto font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Regresar</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-alerta hover:bg-alerta-hover text-white font-bold text-base transition-colors shadow-md"
            >
              <Send className="w-5 h-5" />
              <span>Enviar reporte</span>
            </button>
          </div>
        </form>
      )}

      {/* PASO 3: Agradecimiento / Confirmación */}
      {paso === 3 && (
        <div className="bg-superficie border border-borde rounded-3xl p-8 sm:p-12 text-center shadow-sm space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="font-titulos text-2xl sm:text-3xl font-bold text-texto mb-2">
              ¡Muchas gracias por tu reporte!
            </h2>
            <p className="text-texto-secundario text-base sm:text-lg max-w-lg mx-auto">
              Tu observación sobre el lugar <strong>{lugarSeleccionado?.id}</strong> ha quedado registrada.
              Gracias a personas como tú podemos saber la realidad de nuestro entorno.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={reiniciar}
              className="px-6 py-3 rounded-xl bg-fondo hover:bg-borde text-texto font-semibold text-sm transition-colors w-full sm:w-auto"
            >
              Reportar otro lugar
            </button>

            <Link
              href="/mapa"
              className="px-6 py-3 rounded-xl bg-principal hover:bg-principal-hover text-white font-bold text-sm transition-colors shadow-sm w-full sm:w-auto"
            >
              Volver al mapa
            </Link>
          </div>
        </div>
      )}

      {/* Historial de reportes del usuario guardados localmente */}
      {misReportes.length > 0 && (
        <div className="bg-superficie border border-borde rounded-3xl p-6 shadow-sm">
          <h3 className="font-titulos font-bold text-lg text-texto mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-principal" />
            Tus reportes guardados ({misReportes.length})
          </h3>
          <div className="space-y-3">
            {misReportes.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl bg-fondo border border-borde flex items-start justify-between gap-3 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-principal">{rep.lugarId}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        rep.estado === 'si_hay_basura'
                          ? 'bg-alerta-suave text-alerta-texto'
                          : rep.estado === 'no_hay_basura'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {rep.estado === 'si_hay_basura'
                        ? 'Confirmado basurero'
                        : rep.estado === 'no_hay_basura'
                        ? 'Terreno limpio'
                        : 'Inaccesible'}
                    </span>
                  </div>
                  <p className="text-xs text-texto-secundario line-clamp-1 mb-1">
                    {rep.lugarNombre}
                  </p>
                  {rep.notas && (
                    <p className="text-xs text-texto italic">"{rep.notas}"</p>
                  )}
                </div>
                <span className="text-[11px] text-texto-secundario flex-shrink-0">
                  {new Date(rep.fecha).toLocaleDateString('es-GT')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
