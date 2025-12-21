# 🚀 Mastering Angular Zoneless

Ein interaktives Lernprojekt zum Verstehen von **Angular Zoneless Change Detection** und den Unterschied zu Zone.js.

🌐 **Zweisprachig**: Englisch / Deutsch

## 📚 Was lernst du hier?

### 1. Was ist Zone.js?

Zone.js ist eine Bibliothek, die Angular seit Version 2 verwendet, um automatisch zu erkennen, wann sich Daten ändern könnten. Sie "patched" Browser-APIs wie `setTimeout`, `Promise`, `fetch` und `addEventListener`.

### 2. Das Problem mit Zone.js

- **Unnötige Change Detection**: Jede async Operation triggert CD für die GESAMTE App
- **Performance Overhead**: Zone.js ist ~35KB gzipped
- **Debugging-Probleme**: Stack Traces werden unlesbar
- **Kompatibilitätsprobleme**: Nicht alle APIs können gepatched werden

### 3. Die Zoneless Lösung

Angular Signals ermöglichen präzise, explizite Change Detection:

- `signal.set()` / `signal.update()` - Explizites Update
- `markForCheck()` - Manuell gesteuert
- Template Events - Nur bei Benutzer-Interaktion

## 🎮 Features

| Seite                 | Beschreibung                                      |
| --------------------- | ------------------------------------------------- |
| 🏠 **Home**           | Übersicht und Quick Facts                         |
| 📚 **Theory**         | Tiefgehende Erklärung von Zone.js vs Zoneless     |
| 🌳 **Component Tree** | Visualisierung des CD-Flusses durch Komponenten   |
| 🔥 **Real Problems**  | ECHTE Performance-Probleme (Mouse, Timer, Scroll) |
| 📊 **Comparison**     | Side-by-Side Vergleich Zone.js vs Zoneless        |

## 🏃 Projekt starten

```bash
# Dependencies installieren
npm install

# Development Server starten
ng serve

# Browser öffnen
# http://localhost:4200
```

## 📁 Projektstruktur

```
src/app/
├── app.ts                              # Hauptkomponente mit Router
├── app.config.ts                       # ⚡ Zoneless Konfiguration
├── app.routes.ts                       # 🛣️ Routing Konfiguration
├── pages/
│   ├── home/                           # 🏠 Startseite
│   ├── theory/                         # 📚 Theorie-Erklärung
│   ├── tree-demo/                      # 🌳 Komponenten-Baum Demo
│   ├── real-problems/                  # 🔥 Echte Problem-Demos
│   └── comparison/                     # 📊 Vergleichs-Demo
├── shared/
│   ├── header/                         # Navigation & Sprachumschalter
│   └── tree-node/                      # Tree-Visualisierung
├── services/
│   ├── translation.service.ts          # 🌐 i18n (EN/DE)
│   ├── tree-visualization.service.ts   # 🌳 CD-Flow Tracking
│   └── change-detection-tracker.service.ts
└── components/                         # Legacy Demo-Komponenten
├── components/
│   ├── zone-problem-demo.component.ts  # 🚨 Zone.js Problem Demo
│   ├── zoneless-solution-demo.component.ts  # ✅ Zoneless Lösung Demo
│   ├── change-detection-log.component.ts   # 📊 Live-Log
│   └── theory-explanation.component.ts     # 📚 Theorie
└── services/
    └── change-detection-tracker.service.ts # 🔢 CD Counter
```

## 🔑 Wichtige Dateien

### `app.config.ts` - Die Zoneless Konfiguration

```typescript
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // 🚀 Aktiviert Zoneless!
  ],
};
```

### Signal Beispiel

```typescript
// Signal erstellen
counter = signal(0);

// Computed Werte
doubleCounter = computed(() => this.counter() * 2);

// Update
increment() {
  this.counter.update(c => c + 1);
  // → Angular weiß GENAU, was sich geändert hat
}
```

## 📊 Was die Demo zeigt

| Aspekt      | Zone.js         | Zoneless              |
| ----------- | --------------- | --------------------- |
| setTimeout  | Triggert CD     | Kein Effekt           |
| HTTP Calls  | Immer CD        | Nur bei Signal-Update |
| Bundle Size | +35KB           | 0KB extra             |
| Debugging   | Komplexe Traces | Klare Traces          |

## 📖 Weitere Ressourcen

- [Angular Zoneless Guide](https://angular.dev/guide/zoneless)
- [Angular Signals](https://angular.dev/guide/signals)
- [Runtime Performance](https://angular.dev/best-practices/runtime-performance)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
