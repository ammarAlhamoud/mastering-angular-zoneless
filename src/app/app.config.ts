import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * =====================================================
 * ANGULAR ZONELESS CHANGE DETECTION - KONFIGURATION
 * =====================================================
 *
 * Diese Konfiguration aktiviert den ZONELESS-Modus in Angular.
 *
 * WAS BEDEUTET DAS?
 * - Zone.js wird NICHT mehr verwendet
 * - Change Detection wird NUR bei expliziten Signalen ausgelöst
 * - Keine automatische Überwachung von async Operationen
 *
 * VORTEILE:
 * ✅ Kleinere Bundle-Größe (Zone.js ist ~35KB gzipped)
 * ✅ Bessere Performance (weniger unnötige Change Detection)
 * ✅ Einfacheres Debugging (keine Zone.js Patches)
 * ✅ Bessere Stack Traces
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // 🚀 Dies aktiviert Zoneless Change Detection!
    provideZonelessChangeDetection(),
    // 🛣️ Router für Navigation
    provideRouter(routes),
  ],
};
