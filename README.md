# Basureros a cielo abierto en Guatemala (Next.js)

Una aplicación web moderna, accesible y optimizada en **Next.js (App Router)** para visualizar en un mapa interactivo los **54 lugares de Guatemala detectados desde satélite como posibles basureros a cielo abierto**, y permitir que personas en campo (vecinos, voluntarios, autoridades municipales) reporten y confirmen la situación real en el terreno.

Datos provistos por **[Global Plastic Watch](https://www.globalplasticwatch.org/)** (Earthrise Media / Minderoo Foundation) bajo licencia **CC BY-NC 4.0**.

---

## 🚀 Tecnologías

- **Framework**: Next.js 15 (React 19, TypeScript, App Router)
- **Estilos**: Tailwind CSS con la paleta de color y tipografía de diseño accesible (`Space Grotesk` e `Inter`)
- **Mapas**: Leaflet con capa OpenStreetMap y vista de satélite de alta resolución (Esri World Imagery)
- **Iconografía**: Lucide React
- **Almacenamiento de reportes**: LocalStorage con historial local y soporte offline

---

## 📱 Pantallas y Funcionalidades

1. **Inicio (`/`)**:
   - Resumen visual con los 54 lugares detectados y los 18 departamentos con presencia.
   - Indicador de impacto: cantidad de sitios a menos de 500 metros de fuentes de agua (ríos, riachuelos y lagos).
   - Accesos directos a Mapa, Buscador y Formulario de reporte.
   - Explicación del funcionamiento en 3 pasos simples.

2. **Mapa interactivo (`/mapa`)**:
   - Mapa con marcadores por código de color (Naranja = cerca de agua &lt; 500m, Azul = lejos, Gris = sin dato).
   - Filtro reactivo por Departamento y por Proximidad al agua.
   - Alternancia entre mapa callejero y vista satelital.
   - Capa opcional con los 165 puntos de control de contraste.
   - Tarjeta flotante interactiva al tocar cualquier lugar con enlace directo a cómo llegar en Google Maps y reportar.

3. **Buscador y Lista (`/lista`)**:
   - Búsqueda en tiempo real insensible a tildes y mayúsculas (`coban` encuentra `Cobán`).
   - Paginación progresiva de 9 en 9.
   - Fichas claras con distancia al agua y población vecina.

4. **Ficha de un lugar (`/lugar/[id]`)**:
   - Mapa centrado en las coordenadas exactas.
   - Indicadores de cercanía a fuentes hídricas y población en 1 km / 5 km.
   - Enlace "Cómo llegar" en Google Maps.
   - Datos técnicos plegables: coordenadas WGS84 con copiado en un clic, identificador satelital GPW, elevación y pendiente.
   - Navegación entre lugares anterior / siguiente.

5. **Resumen estadístico (`/resumen`)**:
   - Ranking de los departamentos con más basureros detectados.
   - Clasificación por tipo de cuerpo de agua afectado (ríos, arroyos, zanjas, lagunas).

6. **Contar lo que vi (`/contar` y `/contar/[id]`)**:
   - Formulario en 2 pasos diseñado para personas no técnicas y celulares:
     - Paso 1: Selección de lo encontrado (Sí hay basura / No hay basura / No pude entrar) y foto opcional.
     - Paso 2: Notas y teléfono opcionales.
     - Paso 3: Confirmación de envío y persistencia local para consulta de reportes enviados.

---

## 🛠️ Instalación y Desarrollo

```bash
# 1. Instalar dependencias
yarn install
# o con npm:
npm install

# 2. Iniciar servidor de desarrollo
yarn dev
# o:
npm run dev

# 3. Compilar para producción
yarn build
```

---

## 📄 Atribución y Licencia

Datos de [Global Plastic Watch](https://www.globalplasticwatch.org/) (Earthrise Media / Minderoo Foundation), con licencia [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.es). Uso no comercial y atribución obligatoria.
