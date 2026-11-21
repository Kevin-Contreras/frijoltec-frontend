'use client';

import { useEffect, useState } from 'react';
import type { EstadoReporte, Lugar } from '@/types/lugar';
import { guardarReporteLocal } from '@/lib/storage';
import { crearReporte, type CrearReportePayload } from '@/lib/api';
import { AvisoLocal } from './AvisoLocal';
import { MapaLugarSeleccionado } from './MapaLugarSeleccionado';
import { PantallaGracias } from './PantallaGracias';
import { PasoDetallesVisita, hoyISO } from './PasoDetallesVisita';
import { PasoQueEncontraste } from './PasoQueEncontraste';
import { ProgresoPasos } from './ProgresoPasos';
import { SelectorLugar } from './SelectorLugar';

interface FormularioContarProps {
  lugares: Lugar[];
  lugarInicialId?: string;
}

/**
 * Flujo "Contar lo que vi":
 * sin lugar → elegir lugar · paso 1 → qué encontraste + foto · paso 2 → detalles · gracias.
 */
export function FormularioContar({ lugares, lugarInicialId }: FormularioContarProps) {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [estado, setEstado] = useState<EstadoReporte | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [fechaVisita, setFechaVisita] = useState('');
  const [notas, setNotas] = useState('');
  const [contacto, setContacto] = useState('');
  const [avisar, setAvisar] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // La fecha de hoy se calcula en el navegador para usar la hora local de la persona.
  useEffect(() => {
    setFechaVisita(hoyISO());
  }, []);

  // Al cambiar de paso, volver arriba (importante en celular).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [paso]);

  const lugar = lugarInicialId
    ? lugares.find((l) => l.id.toLowerCase() === lugarInicialId.toLowerCase())
    : undefined;

  if (!lugar) {
    return <SelectorLugar lugares={lugares} />;
  }

  if (paso === 3) {
    return <PantallaGracias />;
  }

  const enviar = async () => {
    if (!estado || enviando) return;
    setEnviando(true);

    const resultadoMap: Record<EstadoReporte, 'hay_basura' | 'no_hay_basura' | 'no_pude_entrar'> = {
      si_hay_basura: 'hay_basura',
      no_hay_basura: 'no_hay_basura',
      no_pude_entrar: 'no_pude_entrar',
    };

    const resultado = resultadoMap[estado] || 'hay_basura';

    const payload: CrearReportePayload = {
      sitioId: lugar.id,
      resultado,
      fechaVisita: fechaVisita || hoyISO(),
      comentario: notas.trim().slice(0, 2000) || undefined,
      contacto: contacto.trim().slice(0, 200) || undefined,
      foto: foto || undefined,
    };

    try {
      await crearReporte(payload);
    } catch (err) {
      console.error('Error enviando reporte al backend, guardando copia local:', err);
    }

    guardarReporteLocal({
      lugarId: lugar.id,
      lugarNombre: lugar.direccion,
      estado,
      fotoUrl: foto || undefined,
      notas: notas.trim() || undefined,
      telefono: contacto.trim() || undefined,
      fechaVisita: fechaVisita || undefined,
      avisarOrganizaciones: avisar,
    });

    setEnviando(false);
    setPaso(3);
  };

  return (
    <div className="grid grid-cols-1 gap-10 font-marca lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <h1 className="sr-only">Contar lo que vi</h1>

      <MapaLugarSeleccionado lugares={lugares} lugar={lugar} />

      <div className="flex flex-col gap-6">
        <ProgresoPasos paso={paso} total={2} />
        <AvisoLocal>
          Tu reporte se enviará al sistema de monitoreo comunitario y actualizará la información del lugar.
        </AvisoLocal>

        {paso === 1 ? (
          <PasoQueEncontraste
            estado={estado}
            onEstado={setEstado}
            foto={foto}
            onFoto={setFoto}
            onSiguiente={() => setPaso(2)}
          />
        ) : (
          <PasoDetallesVisita
            fechaVisita={fechaVisita}
            onFechaVisita={setFechaVisita}
            notas={notas}
            onNotas={setNotas}
            contacto={contacto}
            onContacto={setContacto}
            avisar={avisar}
            onAvisar={setAvisar}
            enviando={enviando}
            onAtras={() => setPaso(1)}
            onEnviar={enviar}
          />
        )}
      </div>
    </div>
  );
}
