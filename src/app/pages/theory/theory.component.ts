import { Component, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-theory',
  standalone: true,
  template: `
    <div class="theory-page">
      <h1>{{ t('theory.title') }}</h1>

      <section class="section zone-explanation">
        <h2>🔄 {{ t('theory.whatZoneDoes') }}</h2>
        <p>
          {{
            translationService.currentLanguage() === 'en'
              ? 'Zone.js is a library that Angular has used since version 2 to automatically detect when application state might have changed.'
              : 'Zone.js ist eine Bibliothek, die Angular seit Version 2 nutzt, um automatisch zu erkennen, wann sich der App-Zustand geändert haben könnte.'
          }}
        </p>

        <div class="steps">
          <div class="step">
            <span class="step-number">1</span>
            <div class="step-content">
              <strong>{{ t('theory.monkeyPatching') }}</strong>
              <p>{{ t('theory.monkeyPatchingDesc') }}</p>
              <code>setTimeout, setInterval, Promise, fetch, addEventListener...</code>
            </div>
          </div>

          <div class="step">
            <span class="step-number">2</span>
            <div class="step-content">
              <strong>{{ t('theory.zoneTracking') }}</strong>
              <p>{{ t('theory.zoneTrackingDesc') }}</p>
            </div>
          </div>

          <div class="step">
            <span class="step-number">3</span>
            <div class="step-content">
              <strong>{{ t('theory.cdTrigger') }}</strong>
              <p>{{ t('theory.cdTriggerDesc') }}</p>
            </div>
          </div>
        </div>

        <div class="diagram">
          <div class="diagram-title">
            {{
              translationService.currentLanguage() === 'en'
                ? 'How Zone.js works:'
                : 'So funktioniert Zone.js:'
            }}
          </div>
          <div class="flow">
            <div class="flow-item">
              <span class="flow-icon">🖱️</span>
              <span>User Event / Timer / HTTP</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-item zone">
              <span class="flow-icon">🔄</span>
              <span>Zone.js catches it</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-item">
              <span class="flow-icon">⚙️</span>
              <span>ApplicationRef.tick()</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-item bad">
              <span class="flow-icon">🌳</span>
              <span>CD for ALL components!</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section problems">
        <h2>⚠️ {{ t('theory.zoneProblem') }}</h2>

        <div class="problem-list">
          <div class="problem-item">
            <span class="problem-icon">🐌</span>
            <div>
              <strong>{{
                translationService.currentLanguage() === 'en'
                  ? 'Unnecessary Change Detection'
                  : 'Unnötige Change Detection'
              }}</strong>
              <p>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'Every async operation triggers CD, even when nothing in the view changes'
                    : 'Jede async Operation triggert CD, auch wenn sich nichts im View ändert'
                }}
              </p>
            </div>
          </div>

          <div class="problem-item">
            <span class="problem-icon">📦</span>
            <div>
              <strong>{{
                translationService.currentLanguage() === 'en'
                  ? 'Performance Overhead'
                  : 'Performance Overhead'
              }}</strong>
              <p>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'Zone.js itself is ~35KB gzipped and adds runtime overhead'
                    : 'Zone.js selbst ist ~35KB gzipped und hat Laufzeit-Overhead'
                }}
              </p>
            </div>
          </div>

          <div class="problem-item">
            <span class="problem-icon">🐛</span>
            <div>
              <strong>{{
                translationService.currentLanguage() === 'en'
                  ? 'Debugging Issues'
                  : 'Debugging-Probleme'
              }}</strong>
              <p>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'Stack traces become unreadable due to Zone.js wrapping'
                    : 'Stack Traces werden durch Zone.js Wrapping unlesbar'
                }}
              </p>
            </div>
          </div>

          <div class="problem-item">
            <span class="problem-icon">🔌</span>
            <div>
              <strong>{{
                translationService.currentLanguage() === 'en'
                  ? 'Compatibility Issues'
                  : 'Kompatibilitätsprobleme'
              }}</strong>
              <p>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'Not all APIs can be patched (async/await, some new browser APIs)'
                    : 'Nicht alle APIs können gepatched werden (async/await, neue Browser APIs)'
                }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section solution">
        <h2>✅ {{ t('theory.zonelessSolution') }}</h2>

        <p>
          {{
            translationService.currentLanguage() === 'en'
              ? 'With Angular Signals and Zoneless Change Detection, Angular only runs CD when explicitly notified:'
              : 'Mit Angular Signals und Zoneless Change Detection läuft CD nur bei expliziter Benachrichtigung:'
          }}
        </p>

        <div class="triggers">
          <div class="trigger good">
            <span class="trigger-icon">✅</span>
            <code>signal.set() / signal.update()</code>
          </div>
          <div class="trigger good">
            <span class="trigger-icon">✅</span>
            <code>ChangeDetectorRef.markForCheck()</code>
          </div>
          <div class="trigger good">
            <span class="trigger-icon">✅</span>
            <span>Template Events (click, input, etc.)</span>
          </div>
          <div class="trigger good">
            <span class="trigger-icon">✅</span>
            <code>AsyncPipe</code>
          </div>
        </div>

        <div class="diagram success">
          <div class="diagram-title">
            {{
              translationService.currentLanguage() === 'en'
                ? 'How Zoneless works:'
                : 'So funktioniert Zoneless:'
            }}
          </div>
          <div class="flow">
            <div class="flow-item">
              <span class="flow-icon">📡</span>
              <span>signal.update()</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-item good">
              <span class="flow-icon">🎯</span>
              <span>{{
                translationService.currentLanguage() === 'en'
                  ? 'Only affected views!'
                  : 'Nur betroffene Views!'
              }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section code-comparison">
        <h2>💻 {{ t('theory.codeComparison') }}</h2>

        <div class="comparison-grid">
          <div class="comparison-item old">
            <h4>
              ❌
              {{
                translationService.currentLanguage() === 'en'
                  ? 'Old (with Zone.js)'
                  : 'Alt (mit Zone.js)'
              }}
            </h4>
            <pre><code>// Component property
count = 0;

increment() {{'{'}}
  this.count++;
  // Zone.js "somehow" knows
  // something might have changed
  // → CD for ALL components!
{{'}'}}</code></pre>
          </div>

          <div class="comparison-item new">
            <h4>
              ✅
              {{
                translationService.currentLanguage() === 'en'
                  ? 'New (Zoneless with Signals)'
                  : 'Neu (Zoneless mit Signals)'
              }}
            </h4>
            <pre><code>// Create Signal
count = signal(0);

increment() {{'{'}}
  this.count.update(c => c + 1);
  // Signal notifies Angular EXPLICITLY
  // → CD only for dependent views
{{'}'}}</code></pre>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .theory-page {
        padding: 40px 24px;
        max-width: 1000px;
        margin: 0 auto;
        color: white;
      }

      h1 {
        text-align: center;
        color: #9b59b6;
        margin-bottom: 40px;
      }

      .section {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 32px;
        margin-bottom: 32px;
      }

      .section h2 {
        margin: 0 0 24px;
      }

      .zone-explanation {
        border: 2px solid #9b59b6;
      }

      .problems {
        border: 2px solid #e74c3c;
      }

      .problems h2 {
        color: #e74c3c;
      }

      .solution {
        border: 2px solid #27ae60;
      }

      .solution h2 {
        color: #27ae60;
      }

      .steps {
        display: grid;
        gap: 16px;
        margin-bottom: 24px;
      }

      .step {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .step-number {
        background: #9b59b6;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }

      .step-content p {
        margin: 4px 0 8px;
        opacity: 0.8;
      }

      code {
        background: rgba(255, 255, 255, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        font-family: 'Consolas', monospace;
      }

      .diagram {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        padding: 24px;
        margin-top: 24px;
      }

      .diagram.success {
        border: 2px solid #27ae60;
      }

      .diagram-title {
        font-weight: 600;
        margin-bottom: 16px;
        text-align: center;
      }

      .flow {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
      }

      .flow-item {
        background: rgba(255, 255, 255, 0.1);
        padding: 12px 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .flow-item.zone {
        background: rgba(155, 89, 182, 0.3);
        border: 1px solid #9b59b6;
      }

      .flow-item.bad {
        background: rgba(231, 76, 60, 0.3);
        border: 1px solid #e74c3c;
      }

      .flow-item.good {
        background: rgba(39, 174, 96, 0.3);
        border: 1px solid #27ae60;
      }

      .flow-arrow {
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.5);
      }

      .flow-icon {
        font-size: 1.2rem;
      }

      .problem-list {
        display: grid;
        gap: 16px;
      }

      .problem-item {
        display: flex;
        gap: 16px;
        align-items: flex-start;
        background: rgba(231, 76, 60, 0.1);
        padding: 16px;
        border-radius: 8px;
        border-left: 4px solid #e74c3c;
      }

      .problem-icon {
        font-size: 1.5rem;
      }

      .problem-item strong {
        display: block;
        margin-bottom: 4px;
      }

      .problem-item p {
        margin: 0;
        opacity: 0.8;
      }

      .triggers {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        margin: 24px 0;
      }

      .trigger {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .trigger.good {
        border-left: 3px solid #27ae60;
      }

      .trigger-icon {
        font-size: 1.2rem;
      }

      .code-comparison {
        border: 2px solid #3498db;
      }

      .code-comparison h2 {
        color: #3498db;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
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
        margin: 0 0 12px;
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
        font-size: 0.85rem;
      }
    `,
  ],
})
export class TheoryComponent {
  protected readonly translationService = inject(TranslationService);
  protected readonly t = this.translationService.t;
}
