import { Component, input } from '@angular/core';

@Component({
  selector: 'app-contar',
  template: `
    <section class="contenedor pagina">
      <h1>Contar lo que vi</h1>
      <p class="texto-secundario">Aquí irá el formulario para contar qué encontraste.</p>
    </section>
  `,
  styles: `.pagina { padding-block: 2rem; }`,
})
export class ContarComponent {
  /** Opcional: viene de la ruta /contar/:id cuando se llega desde un lugar. */
  readonly id = input<string>();
}
