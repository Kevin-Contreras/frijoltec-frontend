'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Lugar, PuntoControl } from '@/types/lugar';
import { estadoAgua } from '@/lib/formato';

interface MapaLeafletProps {
  lugares: Lugar[];
  puntosControl?: PuntoControl[];
  mostrarControl: boolean;
  lugarSeleccionado: Lugar | null;
  onSeleccionarLugar: (lugar: Lugar) => void;
  capaSatelital?: boolean;
}

export default function MapaLeaflet({
  lugares,
  puntosControl = [],
  mostrarControl,
  lugarSeleccionado,
  onSeleccionarLugar,
  capaSatelital = false,
}: MapaLeafletProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const controlLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Crear mapa centrado en Guatemala
    const map = L.map(mapContainerRef.current, {
      center: [15.4, -90.3],
      zoom: 8,
      zoomControl: true,
      minZoom: 6,
      maxZoom: 18,
    });

    const tileUrl = capaSatelital
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = capaSatelital
      ? 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tiles = L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);
    tileLayerRef.current = tiles;

    markersLayerRef.current = L.layerGroup().addTo(map);
    controlLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [capaSatelital]);

  // Cambiar capa satelital dinámicamente si cambia
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileUrl = capaSatelital
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    tileLayerRef.current.setUrl(tileUrl);
  }, [capaSatelital]);

  // Dibujar marcadores de lugares
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    lugares.forEach((lugar) => {
      const estado = estadoAgua(lugar);
      const esSeleccionado = lugarSeleccionado?.id === lugar.id;

      // Color según cercanía al agua
      let colorFondo = '#1C5D73'; // Lejos (Azul principal)
      let colorBorde = '#0E3846';
      let bordeAncho = 2;

      if (estado === 'cerca') {
        colorFondo = '#B4471A'; // Cerca (Alerta naranja)
        colorBorde = '#FFFFFF';
      } else if (estado === 'sin-dato') {
        colorFondo = '#8A9590'; // Gris
        colorBorde = '#FFFFFF';
      }

      if (esSeleccionado) {
        colorBorde = '#FFE500';
        bordeAncho = 4;
      }

      const size = esSeleccionado ? 28 : 22;

      const iconHtml = `
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background-color: ${colorFondo};
          border: ${bordeAncho}px solid ${colorBorde};
          box-shadow: 0 3px 8px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="width: 6px; height: 6px; border-radius: 50%; background-color: white;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: iconHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([lugar.lat, lugar.lon], { icon: customIcon });

      marker.on('click', () => {
        onSeleccionarLugar(lugar);
      });

      marker.addTo(layer);
    });
  }, [lugares, lugarSeleccionado, onSeleccionarLugar]);

  // Dibujar puntos de control (opcional)
  useEffect(() => {
    const layer = controlLayerRef.current;
    if (!layer) return;

    layer.clearLayers();
    if (!mostrarControl || puntosControl.length === 0) return;

    puntosControl.forEach((pt) => {
      const iconHtml = `
        <div style="
          width: 10px;
          height: 10px;
          background-color: #64748b;
          border: 1px solid white;
          opacity: 0.6;
        "></div>
      `;
      const icon = L.divIcon({
        className: 'control-marker',
        html: iconHtml,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const marker = L.marker([pt.lat, pt.lon], { icon });
      marker.bindTooltip(`Punto de control (${pt.clase})`, { direction: 'top' });
      marker.addTo(layer);
    });
  }, [puntosControl, mostrarControl]);

  // Si se selecciona un lugar externamente, centrar el mapa suavemente
  useEffect(() => {
    if (!mapInstanceRef.current || !lugarSeleccionado) return;
    mapInstanceRef.current.flyTo([lugarSeleccionado.lat, lugarSeleccionado.lon], 13, {
      duration: 1.2,
    });
  }, [lugarSeleccionado]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[450px]" />;
}
