# Basureros a cielo abierto en Guatemala — contexto del proyecto

## Qué es
Una aplicación web (escritorio y móvil) para ver en un mapa los **54 lugares de Guatemala que, vistos desde el satélite, parecen basureros a cielo abierto**, para que personas en campo cuenten si de verdad lo son, y para que **municipalidades, asociaciones y grupos de vecinos** reciban esos avisos y cuenten qué están haciendo para limpiarlos.

Proyecto de hackatón del equipo **Frijol Tech**. Los datos vienen de **Global Plastic Watch** (Earthrise Media / Minderoo Foundation), con licencia **CC BY-NC 4.0**: uso no comercial y atribución obligatoria en la interfaz (ya está en el footer y en el inicio).

## Para quién
Personas **sin mucha experiencia con tecnología** (vecinos, personal municipal, voluntarios). Por eso:
- Español sencillo. Nada de jerga: decir "lugar" o "posible basurero", no "sitio", "detección" ni "GPW-GT-001". "Nadie lo ha revisado", no "no verificado".
- Pocas opciones por pantalla, botones grandes (mínimo 48 px de alto, ideal 56–64 px) y letra de 17–18 px o más.
- Los datos técnicos (código, coordenadas, elevación, fuente) se esconden detrás de "Más datos del lugar".
- Debe funcionar bien en celular, con conexión lenta.
- Accesible: contraste WCAG AA, `<button>`, `<a>` y `<label>` reales, y no depender solo del color (el color va siempre con texto o ícono).

## Stack
- **Next.js 15 (App Router) + React 19 + TypeScript**, **Tailwind CSS 3**, **lucide-react** para íconos, **Leaflet** solo en la página `/mapa`.
- Comandos: `npm run dev` (http://localhost:3000), `npm run build`, `npx tsc --noEmit`.
- Las páginas son Server Components y leen los datos con `src/lib/data.ts` (lee el GeoJSON con `fs`). Los componentes con estado llevan `'use client'`.
- Sin backend todavía: los reportes, comentarios y propuestas se guardan en `localStorage`.
- Nota de red: en la red del hackatón hay un firewall Fortinet que bloquea npm (`UNABLE_TO_VERIFY_LEAF_SIGNATURE` / `403`). Hay que instalar desde otra red con datos móviles (no "compartir Wi-Fi" del celular). No dejar `strict-ssl=false`.

## Estructura
```
public/
  data/                     GeoJSON de Global Plastic Watch (ver "Datos")
  marca/                    Logos Frijol Tech en SVG: logo-*.svg (completo) e icono-*.svg (solo el ícono),
                            en menta-blanco, blanco, negro, verde, menta y oscuro
  img/hero.jpg              (pendiente) foto de fondo del inicio; si no existe se ve solo el fondo oscuro
src/
  app/                      Una carpeta por ruta (ver "Pantallas")
  components/
    layout/                 Header (nav + menú móvil) y Footer (atribución, "Hecho por Frijol Tech")
    inicio/                 Secciones del inicio: Hero, AccionesPrincipales, MapaReferencia, Testimonios,
                            Propuestas, ComoLoHacemos
    places/                 TarjetaLugar, ListaBuscador, DetalleLugarView, EtiquetasLugar, MasDatosLugar
    contar/                 Flujo "Contar lo que vi": FormularioContar (controla los pasos), SelectorLugar,
                            PasoQueEncontraste, PasoDetallesVisita, PantallaGracias, MapaLugarSeleccionado,
                            ProgresoPasos, AvisoLocal, MisReportes
    resumen/                CifrasPrincipales, DondeHayMas, LlamadoContar
    map/                    MapaGuatemalaSvg (mapa SVG sin librerías), MapaGuatemalaZoom (con + / −),
                            MapaLeaflet y MapaInteractivo (página /mapa)
    gestion/                Modo organizaciones (bosquejo, ver abajo)
  lib/
    data.ts                 getLugares, getLugarById, getDepartamentos, getEstadisticas, getPuntosControl
    formato.ts              Formatos y frases (ver "Reglas de los datos")
    storage.ts              Reportes en localStorage
    opiniones.ts            Comentarios y propuestas del inicio en localStorage
    mapa-guatemala.ts       Contorno simplificado de Guatemala y proyección lon/lat → SVG
    gestion-ejemplo.ts      Datos QUEMADOS del modo organizaciones
    gestion-vista.ts        Adapta esos datos a lo que muestra la pantalla
  types/lugar.ts            Lugar, PuntoControl, ReporteLocal, EstadoReporte
```
Convención: **un componente por archivo**, páginas delgadas que solo juntan componentes.

## Datos (`public/data/`)
### `gpw_guatemala_sitios.geojson` — 54 lugares
| campo | significado |
|---|---|
| `id` | GPW-GT-001 … GPW-GT-054 |
| coordenadas | WGS84, en el GeoJSON como `[lon, lat]` |
| `lugar` | dirección larga (a veces en inglés: "Zone 7, Guatemala City") |
| `departamento` | 18 departamentos distintos |
| `distancia_agua_m` | metros al agua más cercana. **Puede venir vacío o null** (3 lugares) |
| `tipo_agua_cercana` | `river`, `stream`, `pond`, `ditch`, `water`, `coastline`. **`-1` = sin dato** |
| `poblacion_1km`, `poblacion_5km` | personas en ese radio. A veces float (`933.0`): se convierte a entero |
| `elevacion_m`, `pendiente_grados` | terreno |
| `gpw_id`, `fuentes`, `tipo`, `verificado_en_campo` (siempre false), `licencia` | metadatos |

`data.ts` ya limpia nulls, `-1` y floats. Cifras reales: 54 lugares, 18 departamentos, 23 cerca del agua, 3 sin dato de agua. Más lugares: Escuintla 7, Guatemala 6, Zacapa 5.

### `gpw_guatemala_negativos_y_otros.geojson` — 165 puntos de control
`clase`: `negativo` (159), `industrial` (4), `incierto` (2). Capa opcional del mapa, apagada por defecto.

### Reglas de los datos (todo en `src/lib/formato.ts`)
- "Cerca del agua" = `distancia_agua_m < 500` (`estadoAgua()` → `cerca` | `lejos` | `sin-dato`).
- 1 000 m o más se muestra en km con un decimal ("2.1 km") — `formatearDistancia()`.
- Números con formato `es-GT` (22,224) — `formatearNumero()`. Población redondeada a 2 cifras para leer fácil (22,224 → "22,000") — `aproximarPoblacion()`.
- Tipo de agua: river→río, stream→arroyo, pond→estanque, ditch→zanja, water→cuerpo de agua, coastline→costa.
- Frases listas: `fraseAgua()` ("Hay agua (arroyo) a solo 134 m. La basura podría llegar al agua.") y `frasePoblacion()`.
- **Nombre del lugar**: los datos no traen nombres. `nombreCortoLugar()` usa las 2 primeras partes de la dirección ("1a Calle, Patulul"). No inventar nombres como los del diseño de Figma.
- Búsqueda sin tildes: `normalizarTexto()` ("coban" encuentra "Cobán").
- Cómo llegar: `enlaceComoLlegar()` → `https://www.google.com/maps/dir/?api=1&destination=LAT,LON`.

## Diseño (Figma Make: "Basureros a Cielo Abierto Guatemala")
El diseño vigente es el de Figma (marca Frijol Tech). Se recibe por capturas: el enlace de Figma Make no se puede leer sin sesión.
- **Colores** (Tailwind `marca-*`, en `tailwind.config.ts`): oscuro `#142A27` (header, footer, botones principales), menta `#D1F7DE` (etiquetas, fondos de íconos, botón "Contar lo que vi" del header), menta suave `#E3F8EA` (recuadros y avisos), verde `#69AB90` (puntos "lejos" y barras), fondo `#F3FAF6`.
- Los colores antiguos (`principal`, `alerta`, `fondo`, …) siguen en Tailwind para la página `/mapa`, que **todavía no tiene el diseño nuevo**. `alerta` se usa en el estado "Están trabajando en él" y en "Cerca del agua" del panel.
- **Tipografía**: Montserrat (`font-marca`). Space Grotesk / Inter quedan solo para `/mapa`.
- Tarjetas blancas con borde `border-borde` y radio de 20 px (`rounded-[20px]`); botones de 56 px (`min-h-[56px]`, `rounded-xl`).
- Puntos del mapa SVG: negro con anillo blanco = cerca del agua, verde = lejos, blanco pequeño = sin dato. Siempre con leyenda o texto.

## Pantallas
| Ruta | Estado | Qué tiene |
|---|---|---|
| `/` | Diseño nuevo | Hero con "Encontramos 54 lugares…", 3 tarjetas (Ver el mapa · Buscar mi municipio · Contar lo que vi), mapa de referencia SVG con leyenda, carrusel "Lo que dicen quienes usaron la app" con formulario de comentario, "Cambios que propones" (propuestas con "Me gusta"), "Cómo lo hacemos". Comentarios y propuestas de muestra llevan etiqueta "Ejemplo". |
| `/mapa` | **Diseño anterior** (pendiente) | Leaflet con filtros, capa satelital y puntos de control. |
| `/lista` | Diseño nuevo | Buscador sin tildes, "Hay 54 lugares en total", tarjetas de 9 en 9 con estado, etiqueta de agua, "Ver más" y "Cómo llegar". |
| `/lugar/[id]` | Diseño nuevo | Mapa SVG con zoom y el lugar resaltado, etiquetas, nombre, 2 frases (agua y población), "Cómo llegar", "Ya fui, quiero contar qué vi", "¿Quién lo está atendiendo?" y "Más datos del lugar" plegable (código, ubicación con Copiar, altura, fuente). |
| `/resumen` | Diseño nuevo | 3 cifras (54 lugares en 18 departamentos · 23 a menos de 500 m del agua · 0 revisados), barras "Dónde hay más" con los 18 departamentos, recuadro "¿Conoces alguno de estos lugares?". |
| `/contar`, `/contar/[id]` | Diseño nuevo | Sin id: buscador para elegir el lugar + "Lo que ya contaste". Con id: Paso 1 "¿Qué encontraste?" (Sí, hay basura / No, no hay basura / No pude entrar) + foto; Paso 2 "Cuéntanos de tu visita" (fecha, comentario, teléfono o correo, casilla "Avisar a la municipalidad y a los grupos de la zona"); pantalla "¡Gracias por contarnos!". Se guarda en `localStorage`. |
| `/organizaciones`… `/panel`… | **Bosquejo** | Ver la sección siguiente. |

Navegación (Header): Mapa · Lista · Resumen · Organizaciones + botón "Contar lo que vi". En pantallas menores a `lg` se usa el menú desplegable.

## Modo organizaciones (BOSQUEJO, no funcional)
Idea: los vecinos avisan, y municipalidades, asociaciones u ONG y grupos de vecinos se registran, ven los avisos de su zona y publican actualizaciones que el público ve.

- **Todo está quemado** en `src/lib/gestion-ejemplo.ts`: 3 organizaciones de ejemplo (Municipalidad de Escuintla, Municipalidad de Guatemala, Colectivo Playas Limpias, todas con "(ejemplo)" en el nombre), 10 avisos de vecinos y 5 actualizaciones. Los ids de lugares son reales. Cada pantalla muestra el `BannerBosquejo`.
- Estados de un lugar (`EstadoGestion`): `sin_revisar` "Nadie lo ha revisado" · `avisado` "Ya avisamos" · `en_proceso` "Están trabajando en él" · `resuelto` "Ya lo limpiaron" · `no_es_basurero` "No era un basurero". Se muestran con `EtiquetaEstado` (ícono + texto).
- Tipos de organización: `municipalidad`, `asociacion` (Asociación u ONG), `vecinos` (Grupo de vecinos).
- Rutas:
  - `/organizaciones`: explicación en 3 pasos + "Registrar mi organización" / "Ya tengo cuenta".
  - `/organizaciones/registro`: formulario (tipo, nombre, departamento, municipio, contacto). Al enviar solo muestra "Recibimos tu solicitud".
  - `/organizaciones/entrar`: correo y contraseña de adorno; "Entrar" lleva a `/panel`.
  - `/panel`: entra como `ORGANIZACION_ACTUAL` (Municipalidad de Escuintla). Cifras + bandeja de los lugares de su departamento con pestañas Por atender / En proceso / Cerrados / Todos.
  - `/panel/lugar/[id]`: lo que contaron los vecinos (el contacto solo lo ve la organización) + "Dar actualización" (estado, nota, foto). Lo publicado solo vive en pantalla hasta recargar.
- Lado público: `EtiquetaRevision` (tarjetas de la Lista y página del lugar) muestra el estado de ejemplo, y `/lugar/[id]` tiene "¿Quién lo está atendiendo?". Ejemplo más completo: **GPW-GT-019** (Sipacate). **Ojo**: por eso algunos lugares aparecen como "Ya lo limpiaron" aunque no sea real.
- Para hacerlo funcional: reemplazar `gestion-ejemplo.ts` por un backend (propuesta: Supabase con login, tablas `organizaciones`, `avisos`, `actualizaciones`, almacenamiento de fotos y reglas para que cada organización vea solo su zona). Las cuentas de organización deben verificarse antes de activarse. Asignar avisos por departamento o asignar a mano el municipio de los 54 lugares (el municipio solo viene dentro de la dirección).

## Pendientes
- `/mapa` con el diseño nuevo.
- Foto del hero en `public/img/hero.jpg`.
- Backend para reportes, comentarios, propuestas y el modo organizaciones.
- El contorno de Guatemala en `mapa-guatemala.ts` es aproximado (unos 26 puntos hechos a mano).
- Probar en celular y revisar accesibilidad con lector de pantalla.

## Reglas para Claude
- Antes de cambios grandes, proponer un plan corto y esperar el visto bueno.
- **Respetar el proyecto existente**: Next.js + Tailwind + lucide-react; no cambiar de framework ni quitar colores o tokens que usan otras páginas.
- Dividir en varios archivos: un componente por archivo, páginas delgadas.
- Mantener todo el texto visible en español sencillo.
- No inventar datos: todo número que se muestre sale de `public/data/`. La única excepción es el bosquejo de organizaciones y los textos de muestra del inicio, que siempre se marcan como "ejemplo".
- Mostrar siempre la atribución de Global Plastic Watch (CC BY-NC 4.0).
- No instalar dependencias sin preguntar.
- Verificar con `npx tsc --noEmit` y `npx next build` antes de dar algo por terminado.
