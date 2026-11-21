import { Component } from '@angular/core';

@Component({
  selector: 'app-lista',
  template: `
    <section class="contenedor pagina">
      <h1>Buscar un lugar</h1>
      <p class="texto-secundario">Aquí irá el buscador y la lista de lugares.</p>
    </section>
  `,
  styles: `.pagina { padding-block: 2rem; }`,
})
export class ListaComponent {}
