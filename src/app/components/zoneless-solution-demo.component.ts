import { Component, inject, signal, computed } from '@angular/core';
import { ChangeDetectionTrackerService } from '../services/change-detection-tracker.service';

/**
 * =====================================================
 * ✅ ZONELESS LÖSUNG DEMO - KOMPONENTE
 * =====================================================
 *
 * Diese Komponente zeigt, wie Angular OHNE Zone.js funktioniert
 * und wie SIGNALS die Change Detection effizient steuern.
 *
 * WIE FUNKTIONIERT ZONELESS?
 * ──────────────────────────
 * Angular erkennt Änderungen durch EXPLIZITE Benachrichtigungen:
 *
 * 1. ✅ Signals - signal(), computed(), effect()
 * 2. ✅ ChangeDetectorRef.markForCheck()
 * 3. ✅ AsyncPipe (intern mit markForCheck)
 * 4. ✅ Template-Events (click, input, etc.)
 *
 * VORTEILE:
 * ─────────
 * - CD läuft NUR wenn wirklich nötig
 * - Präzise Kontrolle über Updates
 * - Bessere Performance
 * - Einfacheres Debugging
 *
 * SIGNALS ERKLÄRT:
 * ────────────────
 * - signal(wert) → Reaktiver Container für einen Wert
 * - signal.set(neuerWert) → Setzt neuen Wert, triggert Update
 * - signal.update(fn) → Aktualisiert basierend auf altem Wert
 * - computed(() => ...) → Berechneter Wert, automatisch aktualisiert
 */
@Component({
  selector: 'app-zoneless-solution-demo',
  standalone: true,
  template: `
    <div class="demo-card solution">
      <div class="card-header">
        <span class="icon">✅</span>
        <h2>Zoneless Lösung mit Signals</h2>
      </div>

      <div class="explanation">
        <h3>Wie Zoneless funktioniert:</h3>
        <p>Change Detection wird NUR bei expliziten Signalen ausgelöst:</p>
        <ul>
          <li>✅ <code>signal.set()</code> - Explizites Update</li>
          <li>✅ <code>signal.update()</code> - Explizites Update</li>
          <li>✅ Template Events - Nur bei Interaktion</li>
          <li>✅ <code>markForCheck()</code> - Manuell gesteuert</li>
        </ul>
      </div>

      <div class="demo-area">
        <h3>🎯 Effiziente Signal-basierte Updates:</h3>

        <div class="signal-display">
          <div class="signal-item">
            <span class="signal-label">Counter Signal:</span>
            <span class="signal-value">{{ counter() }}</span>
          </div>
          <div class="signal-item">
            <span class="signal-label">Computed (x2):</span>
            <span class="signal-value computed">{{ doubleCounter() }}</span>
          </div>
          <div class="signal-item">
            <span class="signal-label">Computed (Quadrat):</span>
            <span class="signal-value computed">{{ squaredCounter() }}</span>
          </div>
        </div>

        <div class="counter-display">
          <span class="counter-value">{{ tracker.zonelessOptimizedCount() }}</span>
          <span class="counter-label">Effiziente Updates</span>
        </div>

        <div class="controls">
          <button (click)="incrementCounter()" class="btn success">➕ Signal.update()</button>
          <button (click)="setCounter(100)" class="btn success">🎯 Signal.set(100)</button>
          <button (click)="resetCounter()" class="btn success">🔄 Reset</button>
        </div>

        <div class="status success">
          {{ statusMessage() }}
        </div>
      </div>

      <div class="code-example">
        <h4>✅ Optimierter Code (Zoneless mit Signals):</h4>
        <pre><code>// Signal erstellen
counter = signal(0);

// Computed Werte - automatisch aktualisiert
doubleCounter = computed(() => this.counter() * 2);

// Update - EXPLIZIT und EFFIZIENT
incrementCounter() {{'{'}}
  this.counter.update(c => c + 1);
  // → Signal benachrichtigt Angular
  // → CD nur für DIESE Komponente
  // → Computed werden neu berechnet
{{'}'}}

// Kein Zone.js Overhead!
// Kein unnötiges Rendering!
// Perfekte Kontrolle!</code></pre>
      </div>

      <div class="comparison-box">
        <h4>📊 Vergleich Zone.js vs Zoneless:</h4>
        <table>
          <tr>
            <th>Aspekt</th>
            <th>Zone.js</th>
            <th>Zoneless</th>
          </tr>
          <tr>
            <td>setTimeout</td>
            <td class="bad">Triggert CD</td>
            <td class="good">Kein Effekt</td>
          </tr>
          <tr>
            <td>HTTP Calls</td>
            <td class="bad">Immer CD</td>
            <td class="good">Nur bei Signal-Update</td>
          </tr>
          <tr>
            <td>Bundle Size</td>
            <td class="bad">+35KB</td>
            <td class="good">0KB extra</td>
          </tr>
          <tr>
            <td>Debugging</td>
            <td class="bad">Komplexe Traces</td>
            <td class="good">Klare Traces</td>
          </tr>
        </table>
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

      .demo-card.solution {
        border: 2px solid #27ae60;
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
        background: rgba(39, 174, 96, 0.1);
        border-left: 4px solid #27ae60;
        padding: 16px;
        margin-bottom: 20px;
        border-radius: 0 8px 8px 0;
      }

      .explanation h3 {
        margin: 0 0 12px 0;
        color: #27ae60;
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

      .signal-display {
        display: grid;
        gap: 12px;
        margin: 16px 0;
      }

      .signal-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        padding: 12px 16px;
        border-radius: 8px;
      }

      .signal-label {
        font-weight: 500;
        opacity: 0.8;
      }

      .signal-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #27ae60;
      }

      .signal-value.computed {
        color: #3498db;
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
        color: #27ae60;
        text-shadow: 0 0 20px rgba(39, 174, 96, 0.5);
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

      .btn.success {
        background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
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
      }

      .status.success {
        background: rgba(39, 174, 96, 0.2);
      }

      .code-example {
        background: #0d1117;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
      }

      .code-example h4 {
        margin: 0 0 12px 0;
        color: #27ae60;
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

      .comparison-box {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        padding: 20px;
      }

      .comparison-box h4 {
        margin: 0 0 16px 0;
        color: #f39c12;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      th {
        background: rgba(255, 255, 255, 0.05);
        font-weight: 600;
      }

      .good {
        color: #27ae60;
      }

      .bad {
        color: #e74c3c;
      }
    `,
  ],
})
export class ZonelessSolutionDemoComponent {
  protected readonly tracker = inject(ChangeDetectionTrackerService);

  // 🎯 SIGNALS - Der Kern von Zoneless Angular!
  readonly counter = signal(0);

  // 🧮 COMPUTED - Automatisch abgeleitete Werte
  readonly doubleCounter = computed(() => this.counter() * 2);
  readonly squaredCounter = computed(() => this.counter() ** 2);

  // Status als Signal
  readonly statusMessage = signal('Klicke auf einen Button!');

  /**
   * Inkrementiert den Counter - EXPLIZITES Update
   * → Nur diese Komponente wird aktualisiert
   * → Computed Werte werden automatisch neu berechnet
   */
  incrementCounter() {
    this.counter.update((c) => c + 1);
    this.tracker.incrementZonelessOptimized('signal.update()');
    this.statusMessage.set(`Counter auf ${this.counter()} erhöht!`);
  }

  /**
   * Setzt den Counter auf einen bestimmten Wert
   */
  setCounter(value: number) {
    this.counter.set(value);
    this.tracker.incrementZonelessOptimized('signal.set()');
    this.statusMessage.set(`Counter auf ${value} gesetzt!`);
  }

  /**
   * Setzt den Counter zurück
   */
  resetCounter() {
    this.counter.set(0);
    this.tracker.incrementZonelessOptimized('signal.set(0)');
    this.statusMessage.set('Counter zurückgesetzt!');
  }
}
