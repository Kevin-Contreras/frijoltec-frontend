import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <a class="saltar" href="#contenido">Ir al contenido</a>
    <app-header />
    <main id="contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {}
