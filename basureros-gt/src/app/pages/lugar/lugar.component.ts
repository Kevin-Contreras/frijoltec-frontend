import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { LugaresService } from '../../core/services/lugares.service';

@Component({
  selector: 'app-lugar',
  template: `
    <section class="contenedor pagina">
      @if (lugar(); as l) {
        <h1>{{ l.direccion }}</h1>
        <p class="texto-secundario">Aquí irá la información de este lugar.</p>
      } @else {
        <h1>Un lugar</h1>
        <p class="texto-secundario">Cargando…</p>
      }
    </section>
  `,
  styles: `.pagina { padding-block: 2rem; }`,
})
export class LugarComponent {
  private readonly servicio = inject(LugaresService);

  /** Viene de la ruta /lugar/:id */
  readonly id = input.required<string>();

  readonly lugar = toSignal(toObservable(this.id).pipe(switchMap((id) => this.servicio.porId(id))));
}
