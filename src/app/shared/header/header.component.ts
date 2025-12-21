import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <a routerLink="/">
            <span class="logo-icon">⚡</span>
            <span class="logo-text">Angular Zoneless</span>
          </a>
        </div>

        <nav class="main-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            {{ t('nav.home') }}
          </a>
          <a routerLink="/theory" routerLinkActive="active">
            {{ t('nav.theory') }}
          </a>
          <a routerLink="/tree" routerLinkActive="active">
            {{ t('nav.tree') }}
          </a>
          <a routerLink="/problems" routerLinkActive="active">
            {{ t('nav.realProblems') }}
          </a>
          <a routerLink="/comparison" routerLinkActive="active">
            {{ t('nav.comparison') }}
          </a>
        </nav>

        <div class="header-actions">
          <button class="lang-toggle" (click)="toggleLanguage()">
            {{ translationService.currentLanguage() === 'en' ? '🇩🇪 DE' : '🇬🇧 EN' }}
          </button>

          <div class="zoneless-badge">
            <span class="pulse"></span>
            <span>Zoneless</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .app-header {
        background: rgba(15, 12, 41, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(155, 89, 182, 0.3);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .header-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 24px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }

      .logo a {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: white;
        font-weight: 700;
        font-size: 1.1rem;
      }

      .logo-icon {
        font-size: 1.5rem;
      }

      .main-nav {
        display: flex;
        gap: 8px;
      }

      .main-nav a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .main-nav a:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }

      .main-nav a.active {
        color: white;
        background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .lang-toggle {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .lang-toggle:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .zoneless-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
        color: white;
        padding: 6px 14px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;
      }

      .pulse {
        width: 8px;
        height: 8px;
        background: #2ecc71;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(46, 204, 113, 0);
        }
      }

      @media (max-width: 900px) {
        .main-nav {
          display: none;
        }

        .logo-text {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  protected readonly translationService = inject(TranslationService);
  protected readonly t = this.translationService.t;

  toggleLanguage() {
    this.translationService.toggleLanguage();
  }
}
