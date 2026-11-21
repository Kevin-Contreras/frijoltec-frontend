import { Component } from '@angular/core';

@Component({
  selector: 'app-resumen',
  template: `
    <section class="contenedor pagina">
      <h1>Resumen</h1>
      <p class="texto-secundario">Aquí irán los números principales.</p>
    </section>
  `,
  styles: `.pagina { padding-block: 2rem; }`,
})
export class ResumenComponent {}
