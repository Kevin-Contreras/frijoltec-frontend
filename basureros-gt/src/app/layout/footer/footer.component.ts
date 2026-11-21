import { Component } from '@angular/core';

/** Atribución obligatoria de Global Plastic Watch (CC BY-NC 4.0). */
@Component({
  selector: 'app-footer',
  template: `
    <footer class="pie">
      <p class="contenedor">
        Datos de
        <a href="https://www.globalplasticwatch.org/" target="_blank" rel="noopener">Global Plastic Watch</a>
        (Earthrise Media / Minderoo Foundation), con licencia
        <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.es" target="_blank" rel="noopener">CC BY-NC 4.0</a>.
        Uso no comercial.
      </p>
    </footer>
  `,
  styles: `
    .pie {
      border-top: 1px solid var(--color-borde);
      background: var(--color-superficie);
      color: var(--color-texto-secundario);
      font-size: 1rem;
    }
    p { margin: 0; padding-block: 1rem; }
  `,
})
export class FooterComponent {}
