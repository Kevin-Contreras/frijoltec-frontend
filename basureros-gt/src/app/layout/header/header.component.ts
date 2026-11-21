import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly enlaces = [
    { ruta: '/mapa', texto: 'Mapa' },
    { ruta: '/lista', texto: 'Buscar' },
    { ruta: '/resumen', texto: 'Resumen' },
    { ruta: '/contar', texto: 'Contar lo que vi' },
  ];
}
