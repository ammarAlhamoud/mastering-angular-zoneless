import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectionTrackerService } from '../services/change-detection-tracker.service';

/**
 * =====================================================
 * 🚨 ZONE.JS PROBLEM DEMO - KOMPONENTE
 * =====================================================
 *
 * Diese Komponente SIMULIERT das Verhalten, das mit Zone.js
 * zu UNNÖTIGER Change Detection führen würde:
 *
 * PROBLEME MIT ZONE.JS:
 * ─────────────────────
 * 1. JEDER setTimeout() → Triggert Change Detection
 * 2. JEDER setInterval() → Triggert Change Detection
 * 3. JEDER HTTP Request → Triggert Change Detection
 * 4. JEDES Promise → Triggert Change Detection
 * 5. JEDER Event Listener → Triggert Change Detection
 *
 * WARUM IST DAS PROBLEMATISCH?
 * ────────────────────────────
 * - Die meisten async Operationen ändern NICHT den View
 * - Trotzdem läuft Change Detection durch ALLE Komponenten
 * - Das kostet Performance und Batterielaufzeit
 *
 * BEISPIEL:
 * Ein einfacher Timer, der jede Sekunde läuft, würde mit
 * Zone.js JEDE SEKUNDE Change Detection für die GESAMTE
 * App triggern - auch wenn sich nichts ändert!
 */
@Component({
  selector: 'app-zone-problem-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default, // Simuliert altes Verhalten
  template: `
    <div class="demo-card problem">
      <div class="card-header">
        <span class="icon">🚨</span>
        <h2>Zone.js Problem Demo</h2>
      </div>

      <div class="explanation">
        <h3>Was Zone.js macht:</h3>
        <p>Zone.js "patched" Browser APIs und triggert Change Detection bei:</p>
        <ul>
          <li>✖️ <code>setTimeout/setInterval</code> - Jeder Timer!</li>
          <li>✖️ <code>fetch/XMLHttpRequest</code> - Jeder HTTP Call!</li>
          <li>✖️ <code>Promise.then()</code> - Jedes Promise!</li>
          <li>✖️ <code>addEventListener</code> - Jeder Event!</li>
        </ul>
      </div>

      <div class="demo-area">
        <h3>🔄 Simulierte "unnötige" Change Detections:</h3>

        <div class="counter-display">
          <span class="counter-value">{{ tracker.zoneProblematicCount() }}</span>
          <span class="counter-label">Change Detection Zyklen</span>
        </div>

        <div class="controls">
          <button (click)="simulateSetTimeout()" class="btn danger">
            ⏱️ setTimeout() simulieren
          </button>
          <button (click)="simulateMultipleTimers()" class="btn danger">🔥 5x Timer starten</button>
          <button (click)="simulateHttpCall()" class="btn danger">🌐 HTTP Call simulieren</button>
        </div>

        <div class="status" [class.active]="isRunning">
          {{ statusMessage }}
        </div>
      </div>

      <div class="code-example">
        <h4>❌ Problematischer Code (mit Zone.js):</h4>
        <pre><code>// Jeder dieser Aufrufe triggert Change Detection!
setTimeout(() => {{'{'}}
  // Auch wenn hier nichts view-relevantes passiert
  console.log('Timer done');
{{'}'}}, 1000);

// Das passiert AUTOMATISCH durch Zone.js
// → Zone.js fängt setTimeout ab
// → Nach Ablauf: zone.run() 
// → ApplicationRef.tick()
// → Change Detection für ALLE Komponenten!</code></pre>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-card {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 24px;
        color: white;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      }

      .demo-card.problem {
        border: 2px solid #e74c3c;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }

      .icon {
        font-size: 2rem;
      }

      h2 {
        margin: 0;
        font-size: 1.5rem;
      }

      .explanation {
        background: rgba(231, 76, 60, 0.1);
        border-left: 4px solid #e74c3c;
        padding: 16px;
        margin-bottom: 20px;
        border-radius: 0 8px 8px 0;
      }

      .explanation h3 {
        margin: 0 0 12px 0;
        color: #e74c3c;
      }

      .explanation ul {
        margin: 0;
        padding-left: 20px;
      }

      .explanation li {
        margin: 8px 0;
      }

      code {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Consolas', monospace;
      }

      .demo-area {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .counter-display {
        text-align: center;
        padding: 20px;
        margin: 16px 0;
      }

      .counter-value {
        display: block;
        font-size: 4rem;
        font-weight: bold;
        color: #e74c3c;
        text-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
      }

      .counter-label {
        font-size: 0.9rem;
        opacity: 0.7;
      }

      .controls {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
        margin: 20px 0;
      }

      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn.danger {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      }

      .status {
        text-align: center;
        padding: 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        transition: all 0.3s ease;
      }

      .status.active {
        background: rgba(231, 76, 60, 0.2);
        animation: pulse 1s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .code-example {
        background: #0d1117;
        border-radius: 8px;
        padding: 16px;
      }

      .code-example h4 {
        margin: 0 0 12px 0;
        color: #e74c3c;
      }

      .code-example pre {
        margin: 0;
        overflow-x: auto;
      }

      .code-example code {
        background: transparent;
        color: #8b949e;
        display: block;
        padding: 0;
        font-size: 0.85rem;
        line-height: 1.6;
      }
    `,
  ],
})
export class ZoneProblemDemoComponent implements OnInit, OnDestroy {
  protected readonly tracker = inject(ChangeDetectionTrackerService);

  isRunning = false;
  statusMessage = 'Bereit für Simulation...';

  private timers: number[] = [];

  ngOnInit() {
    // Initiale Info
    console.log('🚨 Zone Problem Demo geladen');
  }

  ngOnDestroy() {
    // Cleanup aller Timer
    this.timers.forEach((id) => clearTimeout(id));
  }

  /**
   * Simuliert einen setTimeout - mit Zone.js würde das
   * automatisch Change Detection triggern!
   */
  simulateSetTimeout() {
    this.isRunning = true;
    this.statusMessage = '⏱️ Timer läuft... (1 Sekunde)';

    const timerId = window.setTimeout(() => {
      // Mit Zone.js: Diese Callback-Ausführung triggert CD!
      this.tracker.incrementZoneProblematic('setTimeout() callback');
      this.isRunning = false;
      this.statusMessage = '✅ Timer abgelaufen - CD wurde getriggert!';
    }, 1000);

    this.timers.push(timerId);
  }

  /**
   * Simuliert mehrere Timer - zeigt exponentielles Problem
   */
  simulateMultipleTimers() {
    this.isRunning = true;
    this.statusMessage = '🔥 5 Timer laufen gleichzeitig...';

    for (let i = 1; i <= 5; i++) {
      const timerId = window.setTimeout(() => {
        this.tracker.incrementZoneProblematic(`setTimeout #${i}`);
        if (i === 5) {
          this.isRunning = false;
          this.statusMessage = '✅ Alle Timer fertig - 5x CD getriggert!';
        }
      }, i * 500);

      this.timers.push(timerId);
    }
  }

  /**
   * Simuliert einen HTTP Call
   */
  simulateHttpCall() {
    this.isRunning = true;
    this.statusMessage = '🌐 HTTP Request läuft...';

    // Simuliert HTTP-ähnliches Verhalten mit fetch
    Promise.resolve()
      .then(() => {
        return new Promise((resolve) => setTimeout(resolve, 1500));
      })
      .then(() => {
        // Mit Zone.js: Promise + setTimeout = 2x CD!
        this.tracker.incrementZoneProblematic('HTTP Response (Promise.then)');
        this.isRunning = false;
        this.statusMessage = '✅ HTTP Response erhalten - CD getriggert!';
      });
  }
}
