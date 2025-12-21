import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { TranslationService } from './services/translation.service';

/**
 * =====================================================
 * 🚀 MASTERING ANGULAR ZONELESS - HAUPTKOMPONENTE
 * =====================================================
 *
 * Diese App demonstriert den Unterschied zwischen:
 * - Zone.js basierter Change Detection (altes Modell)
 * - Zoneless Change Detection mit Signals (neues Modell)
 *
 * LERNZIELE:
 * 1. Verstehen, was Zone.js macht und warum es problematisch ist
 * 2. Verstehen, wie Zoneless Change Detection funktioniert
 * 3. Praktische Erfahrung mit Angular Signals sammeln
 *
 * HINWEIS:
 * Diese App läuft OHNE Zone.js!
 * Schau in app.config.ts für die Konfiguration.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-header />

      <main class="main-content">
        <router-outlet />
      </main>

      <footer>
        <p>
          📚 {{ translationService.t('footer.moreInfo') }}
          <a href="https://angular.dev/guide/zoneless" target="_blank"> Angular Zoneless Guide </a>
        </p>
        <p class="version">{{ translationService.t('footer.version') }}</p>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      }

      .app-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .main-content {
        flex: 1;
      }

      footer {
        text-align: center;
        padding: 40px 24px;
        color: rgba(255, 255, 255, 0.6);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      footer a {
        color: #3498db;
        text-decoration: none;
      }

      footer a:hover {
        text-decoration: underline;
      }

      .version {
        margin-top: 12px;
        font-size: 0.9rem;
        opacity: 0.5;
      }
    `,
  ],
})
export class App {
  protected readonly translationService = inject(TranslationService);
  title = 'Mastering Angular Zoneless';
}
