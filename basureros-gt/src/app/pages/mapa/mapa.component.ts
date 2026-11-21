import { Component } from '@angular/core';

@Component({
  selector: 'app-mapa',
  template: `
    <section class="contenedor pagina">
      <h1>Mapa de lugares</h1>
      <p class="texto-secundario">Aquí irá el mapa con los posibles basureros.</p>
    </section>
  `,
  styles: `.pagina { padding-block: 2rem; }`,
})
export class MapaComponent {}
