import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-page">
      <section class="hero">
        <h1>{{ t('header.title') }}</h1>
        <p class="subtitle">{{ t('header.subtitle') }}</p>

        <div class="badge">
          <span class="badge-icon">⚡</span>
          <span>{{ t('header.badge') }}</span>
        </div>
      </section>

      <section class="features">
        <a routerLink="/theory" class="feature-card purple">
          <span class="feature-icon">📚</span>
          <h3>{{ t('nav.theory') }}</h3>
          <p>
            {{
              translationService.currentLanguage() === 'en'
                ? 'Learn what Zone.js does and why Zoneless is better'
                : 'Lerne was Zone.js macht und warum Zoneless besser ist'
            }}
          </p>
        </a>

        <a routerLink="/tree" class="feature-card blue">
          <span class="feature-icon">🌳</span>
          <h3>{{ t('nav.tree') }}</h3>
          <p>
            {{
              translationService.currentLanguage() === 'en'
                ? 'See how Change Detection flows through components'
                : 'Beobachte wie Change Detection durch Komponenten fließt'
            }}
          </p>
        </a>

        <a routerLink="/problems" class="feature-card red">
          <span class="feature-icon">🔥</span>
          <h3>{{ t('nav.realProblems') }}</h3>
          <p>
            {{
              translationService.currentLanguage() === 'en'
                ? 'Experience REAL performance problems - not simulations!'
                : 'Erlebe ECHTE Performance-Probleme - keine Simulationen!'
            }}
          </p>
        </a>

        <a routerLink="/comparison" class="feature-card green">
          <span class="feature-icon">📊</span>
          <h3>{{ t('nav.comparison') }}</h3>
          <p>
            {{
              translationService.currentLanguage() === 'en'
                ? 'Direct comparison: Zone.js vs Zoneless side by side'
                : 'Direkter Vergleich: Zone.js vs Zoneless nebeneinander'
            }}
          </p>
        </a>
      </section>

      <section class="quick-facts">
        <h2>
          {{
            translationService.currentLanguage() === 'en' ? '⚡ Quick Facts' : '⚡ Schnelle Fakten'
          }}
        </h2>

        <div class="facts-grid">
          <div class="fact">
            <span class="fact-number">~35KB</span>
            <span class="fact-label">{{
              translationService.currentLanguage() === 'en'
                ? 'Bundle size saved without Zone.js'
                : 'Bundle-Größe gespart ohne Zone.js'
            }}</span>
          </div>
          <div class="fact">
            <span class="fact-number">0</span>
            <span class="fact-label">{{
              translationService.currentLanguage() === 'en'
                ? 'Unnecessary CD cycles with Signals'
                : 'Unnötige CD Zyklen mit Signals'
            }}</span>
          </div>
          <div class="fact">
            <span class="fact-number">100%</span>
            <span class="fact-label">{{
              translationService.currentLanguage() === 'en'
                ? 'Control over when CD runs'
                : 'Kontrolle wann CD läuft'
            }}</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-page {
        padding: 40px 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .hero {
        text-align: center;
        padding: 60px 20px;
        margin-bottom: 60px;
      }

      h1 {
        font-size: 3rem;
        color: white;
        margin: 0 0 16px;
        text-shadow: 0 0 30px rgba(155, 89, 182, 0.5);
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.7);
        font-size: 1.3rem;
        margin: 0 0 24px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(39, 174, 96, 0.3);
      }

      .badge-icon {
        font-size: 1.5rem;
      }

      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 24px;
        margin-bottom: 60px;
      }

      .feature-card {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 32px;
        text-decoration: none;
        color: white;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }

      .feature-card.purple {
        border-color: #9b59b6;
      }
      .feature-card.blue {
        border-color: #3498db;
      }
      .feature-card.red {
        border-color: #e74c3c;
      }
      .feature-card.green {
        border-color: #27ae60;
      }

      .feature-card.purple:hover {
        box-shadow: 0 20px 40px rgba(155, 89, 182, 0.3);
      }
      .feature-card.blue:hover {
        box-shadow: 0 20px 40px rgba(52, 152, 219, 0.3);
      }
      .feature-card.red:hover {
        box-shadow: 0 20px 40px rgba(231, 76, 60, 0.3);
      }
      .feature-card.green:hover {
        box-shadow: 0 20px 40px rgba(39, 174, 96, 0.3);
      }

      .feature-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 16px;
      }

      .feature-card h3 {
        margin: 0 0 12px;
        font-size: 1.3rem;
      }

      .feature-card p {
        margin: 0;
        opacity: 0.7;
        line-height: 1.6;
      }

      .quick-facts {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 40px;
        border: 2px solid #f39c12;
      }

      .quick-facts h2 {
        text-align: center;
        margin: 0 0 32px;
        color: #f39c12;
      }

      .facts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
      }

      .fact {
        text-align: center;
        padding: 24px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
      }

      .fact-number {
        display: block;
        font-size: 3rem;
        font-weight: bold;
        color: #f39c12;
        margin-bottom: 8px;
      }

      .fact-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
      }

      @media (max-width: 768px) {
        h1 {
          font-size: 2rem;
        }

        .subtitle {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class HomeComponent {
  protected readonly translationService = inject(TranslationService);
  protected readonly t = this.translationService.t;
}
