import { Component } from '@angular/core';

@Component({
  selector: 'app-no-encontrado',
  template: `
    <section class="contenedor pagina">
      <h1>No encontramos esta página</h1>
      <p class="texto-secundario">Puede que el enlace esté mal escrito.</p>
    </section>
  `,
  styles: `.pagina { padding-block: 2rem; }`,
})
export class NoEncontradoComponent {}
