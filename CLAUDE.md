# Basureros a cielo abierto en Guatemala — contexto del proyecto

## Qué es
Una aplicación web (escritorio y móvil) para ver en un mapa los **54 lugares de Guatemala que, vistos desde el satélite, parecen basureros a cielo abierto**, y para que personas en campo cuenten si de verdad lo son.

Los datos vienen de **Global Plastic Watch** (Earthrise Media / Minderoo Foundation), con licencia **CC BY-NC 4.0**: uso no comercial y atribución obligatoria en la interfaz.

## Para quién
Personas **sin mucha experiencia con tecnología** (vecinos, personal municipal, voluntarios). Por eso:
- Español sencillo. Nada de jerga: decir "lugar" o "posible basurero", no "sitio", "detección" ni "GPW-GT-001". "Nadie lo ha revisado", no "no verificado".
- Pocas opciones por pantalla, botones grandes (mínimo 48 px de alto, ideal 56–64 px) y letra de 17–18 px o más.
- Los datos técnicos (código, coordenadas, elevación, fuente) se esconden detrás de "Más datos del lugar".
- Debe funcionar bien en celular, con conexión lenta.
- Accesible: contraste WCAG AA, `<button>`, `<a>` y `<label>` reales, y no depender solo del color (el color va siempre con texto).

## Datos (carpeta `data/`)
### `gpw_guatemala_sitios.csv` / `.geojson` — 54 lugares (son los mismos datos en dos formatos)
| campo | significado |
|---|---|
| `id` | GPW-GT-001 … GPW-GT-054 |
| `lat`, `lon` | coordenadas WGS84 (en el GeoJSON van como `[lon, lat]`) |
| `lugar` | dirección larga |
| `departamento` | 18 departamentos distintos |
| `distancia_agua_m` | metros al agua más cercana. **Puede venir vacío o null** (3 lugares) |
| `tipo_agua_cercana` | `river`, `stream`, `pond`, `ditch`, `water`, `coastline`. **`-1` o `"-1"` = sin dato** |
| `poblacion_1km`, `poblacion_5km` | personas en ese radio. A veces viene como float (`933.0`): convertir a entero |
| `elevacion_m`, `pendiente_grados` | terreno |
| `gpw_id`, `fuentes`, `tipo`, `verificado_en_campo` (siempre False), `licencia` | metadatos |

Traducción de `tipo_agua_cercana` para mostrar: river→río, stream→arroyo, pond→estanque, ditch→zanja, water→cuerpo de agua, coastline→costa.

### `gpw_guatemala_negativos_y_otros.geojson` — 165 puntos de control
`properties.clase`: `negativo` (159: lugares revisados que no son basureros), `industrial` (4) e `incierto` (2). Solo es una capa opcional, apagada por defecto.

### Reglas que se derivan de los datos
- "Cerca del agua" = `distancia_agua_m < 500`. Se marca en naranja.
- 1 000 m o más se muestra en km con un decimal ("2.1 km").
- Los números van con formato `es-GT` (22,224).
- Enlace para llegar: `https://www.google.com/maps/dir/?api=1&destination=LAT,LON`

## Pantallas (mockups en el lienzo de Claude: https://claude.ai/artifact/QcpAkxXts4vAR2XrMwC1L3)
**La versión principal es la simple** (página "Escritorio simple" + "Móvil"):
1. **Inicio**: título, una frase ("Encontramos 54 lugares…"), 3 botones grandes (Ver el mapa · Buscar mi municipio · Contar lo que vi) y "cómo funciona" en 3 pasos.
2. **Mapa**: un solo filtro ("¿Qué departamento quieres ver?") y puntos naranja (cerca del agua), azul (lejos) y gris (sin dato). Al tocar un punto aparece una tarjeta con el nombre, una frase sobre el agua, una frase sobre la población y los botones "Cómo llegar" y "Ver más". En móvil el mapa ocupa toda la pantalla y la tarjeta sale desde abajo.
3. **Lista**: un buscador grande que funciona sin tildes ("coban" encuentra "Cobán"). Tarjetas de 9 en 9 con "Mostrar más".
4. **Un lugar**: foto satelital, estado ("Nadie lo ha revisado todavía"), 2 frases con ícono, "Cómo llegar" y "Ya fui, quiero contar qué vi", y "Más datos del lugar" plegable.
5. **Resumen**: 3 números grandes con su frase (54 lugares en 18 departamentos · N cerca del agua · 0 revisados) y los 5 departamentos con más lugares.
6. **Contar lo que vi** (2 pasos + gracias): paso 1 "¿Qué encontraste?" (Sí, hay basura / No, no hay basura / No pude entrar) + foto opcional. Paso 2: notas y teléfono, ambos opcionales. Sin pedir nombre.

También existe una **versión completa** para técnicos (página "Escritorio"): visor con filtros, tabla ordenable con exportar CSV/GeoJSON, ficha técnica, estadísticas por departamento y por distancia al agua, y un formulario de verificación detallado. Se puede hacer después como "modo avanzado".

## Estilo
- Colores: fondo `#F5F7F6`, superficie `#FFFFFF`, texto `#15201C`, texto secundario `#4D5B55`, bordes `#DDE3E0` / `#B9C4BF`, principal `#1C5D73` (suave `#E3EEF1`), alerta `#B4471A` (suave `#FBEAE1`, texto sobre suave `#8A3412`), sin dato `#8A9590`.
- Tipografía: **Space Grotesk** para títulos, **Inter** para texto (Google Fonts).
- Bordes redondeados de 10–16 px. Sin degradados ni emojis. Iconos de línea.

## Stack (confirmado)
- **Angular 19** con componentes standalone, SCSS, control flow (`@if`, `@for`) y signals. Rutas con carga diferida en `src/app/app.routes.ts`.
- Mapa: **Leaflet + OpenStreetMap** (pendiente de instalar).
- Los datos están en `public/data/*.geojson` y se cargan con `LugaresService` (`src/app/core/services/lugares.service.ts`), que ya limpia nulls, `-1` y floats. Los formatos (distancia, números es-GT, tipo de agua, búsqueda sin tildes, enlace "Cómo llegar") están en `src/app/core/utils/formato.ts`.
- Colores y medidas como variables CSS en `src/styles.scss` (`--color-principal`, etc.).
- Estructura: `core/` (modelos, servicios, utilidades), `layout/` (encabezado, pie con atribución), `pages/` (una carpeta por pantalla).
- Los reportes necesitan un backend. Para empezar puede ser Supabase o Firebase (con tabla `reportes`: lugar_id, respuesta, foto_url, notas, telefono, fecha, estado_revision). Hasta tenerlo, guardar en `localStorage`.

## Orden de trabajo sugerido
1. Crear el proyecto, cargar los datos y dibujar el mapa con los 54 puntos de colores.
2. La tarjeta del lugar y la pantalla "Un lugar".
3. La lista con buscador.
4. Inicio y Resumen.
5. El formulario "Contar lo que vi" (al principio solo local).
6. Adaptar a móvil y revisar accesibilidad.
7. Backend para los reportes.

## Reglas para Claude
- Antes de cambios grandes, proponer un plan corto y esperar el visto bueno.
- Mantener todo el texto visible en español sencillo.
- No inventar datos: todo número que se muestre sale de los archivos en `data/`.
- Mostrar siempre la atribución de Global Plastic Watch (CC BY-NC 4.0).
