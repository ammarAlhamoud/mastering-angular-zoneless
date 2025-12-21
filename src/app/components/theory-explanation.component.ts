import { Component } from '@angular/core';

/**
 * =====================================================
 * 📚 THEORIE KOMPONENTE
 * =====================================================
 *
 * Erklärt die Konzepte hinter Zone.js und Zoneless
 */
@Component({
  selector: 'app-theory-explanation',
  standalone: true,
  template: `
    <div class="theory-panel">
      <h2>📚 Was ist Zone.js und warum Zoneless?</h2>

      <div class="section">
        <h3>🔄 Was macht Zone.js?</h3>
        <p>
          Zone.js ist eine Bibliothek, die Angular seit Version 2 nutzt, um
          <strong>automatisch</strong> zu erkennen, wann sich Daten ändern könnten.
        </p>

        <div class="how-it-works">
          <div class="step">
            <span class="step-number">1</span>
            <div class="step-content">
              <strong>Monkey Patching</strong>
              <p>Zone.js überschreibt ("patched") Browser APIs:</p>
              <code>setTimeout, setInterval, Promise, fetch, addEventListener...</code>
            </div>
          </div>

          <div class="step">
            <span class="step-number">2</span>
            <div class="step-content">
              <strong>Zone Tracking</strong>
              <p>Jede async Operation wird in einer "Zone" ausgeführt</p>
            </div>
          </div>

          <div class="step">
            <span class="step-number">3</span>
            <div class="step-content">
              <strong>Change Detection Trigger</strong>
              <p>Nach JEDER async Operation → Change Detection für die GESAMTE App!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="section problem">
        <h3>⚠️ Die Probleme mit Zone.js</h3>
        <ul>
          <li>
            <strong>Unnötige Change Detection:</strong>
            Jeder setTimeout, auch wenn er nichts am View ändert, triggert CD
          </li>
          <li>
            <strong>Performance Overhead:</strong>
            Zone.js selbst ist ~35KB und hat Laufzeit-Overhead
          </li>
          <li>
            <strong>Debugging-Probleme:</strong>
            Stack Traces werden durch Zone.js unlesbar
          </li>
          <li>
            <strong>Kompatibilitätsprobleme:</strong>
            Nicht alle APIs können gepatched werden (async/await)
          </li>
        </ul>
      </div>

      <div class="section solution">
        <h3>✅ Die Zoneless Lösung</h3>
        <p>
          Mit <strong>Angular Signals</strong> und <strong>Zoneless Change Detection</strong>
          wird Change Detection nur dann ausgeführt, wenn es wirklich nötig ist:
        </p>

        <div class="triggers">
          <div class="trigger good">
            <span class="trigger-icon">✅</span>
            <code>signal.set()</code> / <code>signal.update()</code>
          </div>
          <div class="trigger good">
            <span class="trigger-icon">✅</span>
            <code>markForCheck()</code>
          </div>
          <div class="trigger good">
            <span class="trigger-icon">✅</span>
            Template Events (click, input)
          </div>
          <div class="trigger good">
            <span class="trigger-icon">✅</span>
            <code>AsyncPipe</code> Subscription
          </div>
        </div>
      </div>

      <div class="section code-comparison">
        <h3>💻 Code-Vergleich</h3>

        <div class="comparison-grid">
          <div class="comparison-item old">
            <h4>❌ Alt (mit Zone.js)</h4>
            <pre><code>// Komponente Property
count = 0;

increment() {{'{'}}
  this.count++;
  // Zone.js erkennt irgendwie,
  // dass sich was geändert haben könnte
  // → CD für ALLE Komponenten
{{'}'}}</code></pre>
          </div>

          <div class="comparison-item new">
            <h4>✅ Neu (Zoneless mit Signals)</h4>
            <pre><code>// Signal erstellen
count = signal(0);

increment() {{'{'}}
  this.count.update(c => c + 1);
  // Signal benachrichtigt Angular EXPLIZIT
  // → CD nur für abhängige Views
{{'}'}}</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .theory-panel {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 24px;
        color: white;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        border: 2px solid #9b59b6;
      }

      h2 {
        margin: 0 0 24px 0;
        color: #9b59b6;
      }

      .section {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .section.problem {
        border-left: 4px solid #e74c3c;
      }

      .section.solution {
        border-left: 4px solid #27ae60;
      }

      h3 {
        margin: 0 0 16px 0;
      }

      .how-it-works {
        display: grid;
        gap: 16px;
      }

      .step {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .step-number {
        background: #9b59b6;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }

      .step-content {
        flex: 1;
      }

      .step-content p {
        margin: 4px 0;
        opacity: 0.8;
      }

      code {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 8px;
        border-radius: 4px;
        font-family: 'Consolas', monospace;
        font-size: 0.9rem;
      }

      ul {
        padding-left: 20px;
      }

      li {
        margin: 12px 0;
        line-height: 1.6;
      }

      .triggers {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }

      .trigger {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .trigger.good {
        border-left: 3px solid #27ae60;
      }

      .trigger-icon {
        font-size: 1.2rem;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }

      .comparison-item {
        background: #0d1117;
        border-radius: 8px;
        padding: 16px;
      }

      .comparison-item.old {
        border-top: 3px solid #e74c3c;
      }

      .comparison-item.new {
        border-top: 3px solid #27ae60;
      }

      .comparison-item h4 {
        margin: 0 0 12px 0;
      }

      .comparison-item.old h4 {
        color: #e74c3c;
      }

      .comparison-item.new h4 {
        color: #27ae60;
      }

      .comparison-item pre {
        margin: 0;
        overflow-x: auto;
      }

      .comparison-item code {
        background: transparent;
        padding: 0;
        display: block;
        color: #8b949e;
        line-height: 1.6;
      }
    `,
  ],
})
export class TheoryExplanationComponent {}
