import { Routes } from '@angular/router';

const SUFIJO = ' · Basureros en Guatemala';

/** Cada pantalla se carga solo cuando se necesita (mejor para conexiones lentas). */
export const routes: Routes = [
  {
    path: '',
    title: 'Inicio' + SUFIJO,
    loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: 'mapa',
    title: 'Mapa' + SUFIJO,
    loadComponent: () => import('./pages/mapa/mapa.component').then((m) => m.MapaComponent),
  },
  {
    path: 'lista',
    title: 'Buscar un lugar' + SUFIJO,
    loadComponent: () => import('./pages/lista/lista.component').then((m) => m.ListaComponent),
  },
  {
    path: 'lugar/:id',
    title: 'Un lugar' + SUFIJO,
    loadComponent: () => import('./pages/lugar/lugar.component').then((m) => m.LugarComponent),
  },
  {
    path: 'resumen',
    title: 'Resumen' + SUFIJO,
    loadComponent: () => import('./pages/resumen/resumen.component').then((m) => m.ResumenComponent),
  },
  {
    path: 'contar',
    title: 'Contar lo que vi' + SUFIJO,
    loadComponent: () => import('./pages/contar/contar.component').then((m) => m.ContarComponent),
  },
  {
    path: 'contar/:id',
    title: 'Contar lo que vi' + SUFIJO,
    loadComponent: () => import('./pages/contar/contar.component').then((m) => m.ContarComponent),
  },
  {
    path: '**',
    title: 'No encontramos esta página' + SUFIJO,
    loadComponent: () =>
      import('./pages/no-encontrado/no-encontrado.component').then((m) => m.NoEncontradoComponent),
  },
];
