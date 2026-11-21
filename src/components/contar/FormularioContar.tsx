'use client';

import { useEffect, useState } from 'react';
import type { EstadoReporte, Lugar } from '@/types/lugar';
import { guardarReporteLocal } from '@/lib/storage';
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

  const enviar = () => {
    if (!estado) return;
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
    setPaso(3);
  };

  return (
    <div className="grid grid-cols-1 gap-10 font-marca lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <h1 className="sr-only">Contar lo que vi</h1>

      <MapaLugarSeleccionado lugares={lugares} lugar={lugar} />

      <div className="flex flex-col gap-6">
        <ProgresoPasos paso={paso} total={2} />
        <AvisoLocal>Aviso: tu reporte se guardará solo en este navegador.</AvisoLocal>

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
            onAtras={() => setPaso(1)}
            onEnviar={enviar}
          />
        )}
      </div>
    </div>
  );
}
