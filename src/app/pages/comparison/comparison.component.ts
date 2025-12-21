import { Component, inject, signal, OnDestroy, NgZone, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { RealChangeDetectionService } from '../../services/real-change-detection.service';

/**
 * =====================================================
 * 📊 COMPARISON PAGE - ECHTER ZONE.JS VERGLEICH
 * =====================================================
 *
 * Diese Seite nutzt ECHTES Zone.js!
 * - NgZone.run() → führt Code INNERHALB der Zone aus → triggert echtes CD
 * - NgZone.runOutsideAngular() → führt Code AUSSERHALB aus → kein CD
 */
@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="comparison-page">
      <header class="page-header">
        <h1>📊 {{ t('comparison.title') }}</h1>
        <p class="subtitle">
          {{
            translationService.currentLanguage() === 'en'
              ? '🎯 This is REAL Zone.js - not a simulation!'
              : '🎯 Das ist ECHTES Zone.js - keine Simulation!'
          }}
        </p>
        <div class="real-badge">
          <span class="pulse"></span>
          {{ translationService.currentLanguage() === 'en' ? 'LIVE COMPARISON' : 'LIVE-VERGLEICH' }}
        </div>
      </header>

      <!-- Info Banner -->
      <div class="info-banner">
        <div class="info-icon">ℹ️</div>
        <div class="info-content">
          <strong>{{
            translationService.currentLanguage() === 'en'
              ? 'How this works:'
              : 'So funktioniert es:'
          }}</strong>
          <p>
            {{
              translationService.currentLanguage() === 'en'
                ? 'Zone.js is loaded but the app runs in Zoneless mode. We use NgZone.run() to execute code INSIDE Zone.js, and NgZone.runOutsideAngular() for Zoneless.'
                : 'Zone.js ist geladen aber die App läuft im Zoneless-Modus. Wir nutzen NgZone.run() um Code INNERHALB Zone.js auszuführen, und NgZone.runOutsideAngular() für Zoneless.'
            }}
          </p>
        </div>
      </div>

      <div class="comparison-grid">
        <!-- Zone.js Panel (REAL!) -->
        <section class="panel zone-panel">
          <div class="panel-header">
            <span class="panel-icon">🚨</span>
            <h2>Zone.js ({{ translationService.currentLanguage() === 'en' ? 'REAL' : 'ECHT' }})</h2>
          </div>

          <div class="counter-display">
            <span class="counter-value zone">{{ zoneCounter() }}</span>
            <span class="counter-label">Counter Value</span>
          </div>

          <div class="cd-indicator" [class.active]="zoneCdActive()">
            <span class="cd-icon">🔄</span>
            <span>Change Detection</span>
          </div>

          <div class="stats">
            <div class="stat">
              <span class="stat-value">{{ realCdService.zoneCdCount() }}</span>
              <span class="stat-label">CD Cycles</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ zoneMouseMoves() }}</span>
              <span class="stat-label">Mouse Events</span>
            </div>
          </div>

          <div class="controls">
            <button class="btn" (click)="incrementWithZone()">➕ Increment</button>
            <button class="btn" (click)="runZoneTimer()" [disabled]="timerRunning()">
              ⏱️ Timer (5 ticks)
            </button>
            <button class="btn" (click)="runZoneHttp()">🌐 HTTP</button>
          </div>

          <div
            class="mouse-area"
            #zoneMouseArea
            (mouseenter)="startZoneMouseTracking()"
            (mouseleave)="stopMouseTracking('zone')"
          >
            <span>{{
              translationService.currentLanguage() === 'en'
                ? '🖱️ Move mouse here'
                : '🖱️ Maus hier bewegen'
            }}</span>
            <span class="mouse-count"
              >{{ zoneMouseMoves() }} moves → {{ zoneMouseCdCount() }} CDs</span
            >
          </div>

          <div class="explanation">
            <p>
              ⚠️
              {{
                translationService.currentLanguage() === 'en'
                  ? 'Every async callback triggers full Change Detection!'
                  : 'Jeder async Callback triggert volles Change Detection!'
              }}
            </p>
          </div>
        </section>

        <!-- Zoneless Panel -->
        <section class="panel zoneless-panel">
          <div class="panel-header">
            <span class="panel-icon">⚡</span>
            <h2>
              Zoneless ({{ translationService.currentLanguage() === 'en' ? 'REAL' : 'ECHT' }})
            </h2>
          </div>

          <div class="counter-display">
            <span class="counter-value zoneless">{{ zonelessCounter() }}</span>
            <span class="counter-label">Counter Value</span>
          </div>

          <div class="cd-indicator" [class.active]="zonelessCdActive()">
            <span class="cd-icon">🎯</span>
            <span>Targeted Update</span>
          </div>

          <div class="stats">
            <div class="stat">
              <span class="stat-value">{{ realCdService.zonelessCdCount() }}</span>
              <span class="stat-label">CD Cycles</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ zonelessMouseMoves() }}</span>
              <span class="stat-label">Mouse Events</span>
            </div>
          </div>

          <div class="controls">
            <button class="btn" (click)="incrementZoneless()">➕ Increment</button>
            <button class="btn" (click)="runZonelessTimer()" [disabled]="timerRunning()">
              ⏱️ Timer (5 ticks)
            </button>
            <button class="btn" (click)="runZonelessHttp()">🌐 HTTP</button>
          </div>

          <div
            class="mouse-area zoneless"
            #zonelessMouseArea
            (mouseenter)="startZonelessMouseTracking()"
            (mouseleave)="stopMouseTracking('zoneless')"
          >
            <span>{{
              translationService.currentLanguage() === 'en'
                ? '🖱️ Move mouse here'
                : '🖱️ Maus hier bewegen'
            }}</span>
            <span class="mouse-count"
              >{{ zonelessMouseMoves() }} moves → {{ zonelessMouseCdCount() }} CDs</span
            >
          </div>

          <div class="explanation success">
            <p>
              ✅
              {{
                translationService.currentLanguage() === 'en'
                  ? 'Only signal.set() triggers Change Detection!'
                  : 'Nur signal.set() triggert Change Detection!'
              }}
            </p>
          </div>
        </section>
      </div>

      <!-- Activity Log -->
      <section class="activity-log">
        <div class="log-header">
          <h3>
            📋
            {{
              translationService.currentLanguage() === 'en'
                ? 'Real-Time Activity Log'
                : 'Echtzeit-Aktivitätsprotokoll'
            }}
          </h3>
          <button class="reset-btn" (click)="resetAll()">🔄 Reset</button>
        </div>

        <div class="log-entries">
          @for (entry of realCdService.operationLog().slice().reverse().slice(0, 20); track
          entry.timestamp) {
          <div class="log-entry" [class]="entry.type">
            <span class="entry-time">{{ formatTime(entry.timestamp) }}</span>
            <span class="entry-source" [class]="entry.type">
              {{ entry.type === 'zone' ? '🚨 Zone' : '⚡ Zoneless' }}
            </span>
            <span class="entry-action">{{ entry.operation }}</span>
            <span class="entry-cd" [class.triggered]="entry.cdTriggered">
              {{ entry.cdTriggered ? '🔄 CD!' : '✨ No CD' }}
            </span>
          </div>
          } @empty {
          <div class="log-empty">
            {{
              translationService.currentLanguage() === 'en'
                ? 'Click buttons or move mouse to see the real difference!'
                : 'Klicke auf Buttons oder bewege die Maus um den echten Unterschied zu sehen!'
            }}
          </div>
          }
        </div>
      </section>

      <!-- Summary Stats -->
      <section class="summary-section">
        <h3>
          📊 {{ translationService.currentLanguage() === 'en' ? 'Real Metrics' : 'Echte Metriken' }}
        </h3>

        <div class="summary-stats">
          <div class="summary-stat zone">
            <div class="stat-header">🚨 Zone.js</div>
            <div class="stat-body">
              <span class="stat-big">{{ realCdService.zoneCdCount() }}</span>
              <span class="stat-sub">CD Cycles</span>
            </div>
          </div>

          <div class="summary-stat vs"><span>VS</span></div>

          <div class="summary-stat zoneless">
            <div class="stat-header">⚡ Zoneless</div>
            <div class="stat-body">
              <span class="stat-big">{{ realCdService.zonelessCdCount() }}</span>
              <span class="stat-sub">CD Cycles</span>
            </div>
          </div>

          <div class="summary-stat savings" *ngIf="realCdService.zoneCdCount() > 0">
            <div class="stat-header">
              💰 {{ translationService.currentLanguage() === 'en' ? 'Savings' : 'Ersparnis' }}
            </div>
            <div class="stat-body">
              <span class="stat-big">{{ getSavingsPercentage() }}%</span>
              <span class="stat-sub">{{
                translationService.currentLanguage() === 'en' ? 'less work' : 'weniger Arbeit'
              }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Code Examples -->
      <section class="code-section">
        <h3>
          💻
          {{
            translationService.currentLanguage() === 'en'
              ? 'The Code Behind This'
              : 'Der Code dahinter'
          }}
        </h3>

        <div class="code-comparison">
          <div class="code-block zone">
            <h4>🚨 Zone.js Mode</h4>
            <pre><code>// Code runs INSIDE Angular Zone
this.ngZone.run(() => &#123;
  setTimeout(() => &#123;
    this.value = 'new';
    // → CD triggered automatically!
  &#125;, 100);
&#125;);</code></pre>
          </div>

          <div class="code-block zoneless">
            <h4>⚡ Zoneless Mode</h4>
            <pre><code>// Code runs OUTSIDE Angular Zone
this.ngZone.runOutsideAngular(() => &#123;
  setTimeout(() => &#123;
    // Only this triggers CD:
    this.mySignal.set('new');
  &#125;, 100);
&#125;);</code></pre>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .comparison-page {
        padding: 40px 24px;
        max-width: 1200px;
        margin: 0 auto;
        color: white;
      }

      .page-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .page-header h1 {
        color: #3498db;
        margin: 0 0 12px;
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.8);
        margin: 0 0 16px;
        font-size: 1.1rem;
      }

      .real-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.85rem;
      }

      .pulse {
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.3);
          opacity: 0.7;
        }
      }

      .info-banner {
        display: flex;
        gap: 16px;
        background: rgba(52, 152, 219, 0.15);
        border: 1px solid rgba(52, 152, 219, 0.3);
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 32px;
      }

      .info-icon {
        font-size: 1.5rem;
      }
      .info-content strong {
        color: #3498db;
      }
      .info-content p {
        margin: 8px 0 0;
        opacity: 0.9;
        font-size: 0.95rem;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 32px;
      }

      @media (max-width: 768px) {
        .comparison-grid {
          grid-template-columns: 1fr;
        }
      }

      .panel {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 24px;
      }

      .zone-panel {
        border: 2px solid #e74c3c;
      }
      .zoneless-panel {
        border: 2px solid #27ae60;
      }

      .panel-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }

      .panel-icon {
        font-size: 1.5rem;
      }
      .panel-header h2 {
        margin: 0;
        font-size: 1.1rem;
      }

      .counter-display {
        text-align: center;
        padding: 24px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        margin-bottom: 16px;
      }

      .counter-value {
        display: block;
        font-size: 3.5rem;
        font-weight: bold;
      }

      .counter-value.zone {
        color: #e74c3c;
      }
      .counter-value.zoneless {
        color: #27ae60;
      }
      .counter-label {
        font-size: 0.9rem;
        opacity: 0.7;
      }

      .cd-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        margin-bottom: 16px;
        transition: all 0.3s ease;
      }

      .cd-indicator.active {
        background: rgba(231, 76, 60, 0.3);
        animation: cdPulse 0.3s ease;
      }

      .zoneless-panel .cd-indicator.active {
        background: rgba(39, 174, 96, 0.3);
      }

      @keyframes cdPulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
        100% {
          transform: scale(1);
        }
      }

      .stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
      }

      .stat {
        background: rgba(0, 0, 0, 0.2);
        padding: 12px;
        border-radius: 8px;
        text-align: center;
      }

      .stat-value {
        display: block;
        font-size: 1.8rem;
        font-weight: bold;
        color: #3498db;
      }

      .stat-label {
        font-size: 0.75rem;
        opacity: 0.7;
      }

      .controls {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .btn {
        flex: 1;
        min-width: 80px;
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
      }
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .mouse-area {
        padding: 20px;
        background: rgba(231, 76, 60, 0.1);
        border: 2px dashed rgba(231, 76, 60, 0.5);
        border-radius: 12px;
        text-align: center;
        margin-bottom: 16px;
        transition: all 0.3s ease;
      }

      .mouse-area:hover {
        background: rgba(231, 76, 60, 0.2);
        border-color: #e74c3c;
      }

      .mouse-area.zoneless {
        background: rgba(39, 174, 96, 0.1);
        border-color: rgba(39, 174, 96, 0.5);
      }

      .mouse-area.zoneless:hover {
        background: rgba(39, 174, 96, 0.2);
        border-color: #27ae60;
      }

      .mouse-count {
        display: block;
        margin-top: 8px;
        font-weight: bold;
        font-size: 0.9rem;
      }

      .explanation {
        background: rgba(231, 76, 60, 0.1);
        border-left: 4px solid #e74c3c;
        padding: 12px 16px;
        border-radius: 0 8px 8px 0;
      }

      .explanation.success {
        background: rgba(39, 174, 96, 0.1);
        border-left-color: #27ae60;
      }

      .explanation p {
        margin: 0;
        font-size: 0.9rem;
      }

      .activity-log {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
      }

      .log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .log-header h3 {
        margin: 0;
        color: #3498db;
      }

      .reset-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .reset-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .log-entries {
        max-height: 250px;
        overflow-y: auto;
      }

      .log-entry {
        display: grid;
        grid-template-columns: 80px 100px 1fr 80px;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        margin-bottom: 6px;
        font-size: 0.85rem;
        align-items: center;
      }

      .log-entry.zone {
        background: rgba(231, 76, 60, 0.1);
      }
      .log-entry.zoneless {
        background: rgba(39, 174, 96, 0.1);
      }

      .entry-time {
        opacity: 0.6;
        font-family: monospace;
      }
      .entry-source {
        font-weight: 500;
      }
      .entry-source.zone {
        color: #e74c3c;
      }
      .entry-source.zoneless {
        color: #27ae60;
      }
      .entry-cd {
        font-weight: 500;
      }
      .entry-cd.triggered {
        color: #e74c3c;
      }

      .log-empty {
        text-align: center;
        padding: 32px;
        opacity: 0.6;
      }

      .summary-section {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
      }

      .summary-section h3 {
        margin: 0 0 20px;
        color: #3498db;
        text-align: center;
      }

      .summary-stats {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
      }

      .summary-stat {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px 30px;
        border-radius: 12px;
        text-align: center;
        min-width: 140px;
      }

      .summary-stat.zone {
        border: 2px solid #e74c3c;
      }
      .summary-stat.zoneless {
        border: 2px solid #27ae60;
      }
      .summary-stat.savings {
        border: 2px solid #f39c12;
      }
      .summary-stat.vs {
        background: none;
        min-width: auto;
        font-size: 1.5rem;
        opacity: 0.5;
      }

      .stat-header {
        font-size: 0.9rem;
        margin-bottom: 8px;
        opacity: 0.8;
      }
      .stat-big {
        display: block;
        font-size: 2.5rem;
        font-weight: bold;
      }
      .summary-stat.zone .stat-big {
        color: #e74c3c;
      }
      .summary-stat.zoneless .stat-big {
        color: #27ae60;
      }
      .summary-stat.savings .stat-big {
        color: #f39c12;
      }
      .stat-sub {
        font-size: 0.8rem;
        opacity: 0.7;
      }

      .code-section {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 24px;
      }

      .code-section h3 {
        margin: 0 0 20px;
        color: #3498db;
        text-align: center;
      }

      .code-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      @media (max-width: 768px) {
        .code-comparison {
          grid-template-columns: 1fr;
        }
      }

      .code-block {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        overflow: hidden;
      }

      .code-block h4 {
        margin: 0;
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.3);
      }

      .code-block.zone h4 {
        border-bottom: 2px solid #e74c3c;
      }
      .code-block.zoneless h4 {
        border-bottom: 2px solid #27ae60;
      }

      .code-block pre {
        margin: 0;
        padding: 16px;
        overflow-x: auto;
      }

      .code-block code {
        font-family: 'Fira Code', monospace;
        font-size: 0.85rem;
        line-height: 1.5;
      }
    `,
  ],
})
export class ComparisonComponent implements OnDestroy {
  protected readonly translationService = inject(TranslationService);
  protected readonly t = this.translationService.t;
  protected readonly realCdService = inject(RealChangeDetectionService);
  private readonly ngZone = inject(NgZone);

  @ViewChild('zoneMouseArea') zoneMouseArea!: ElementRef<HTMLDivElement>;
  @ViewChild('zonelessMouseArea') zonelessMouseArea!: ElementRef<HTMLDivElement>;

  // Counters
  readonly zoneCounter = signal(0);
  readonly zonelessCounter = signal(0);

  // CD indicators
  readonly zoneCdActive = signal(false);
  readonly zonelessCdActive = signal(false);

  // Timer state
  readonly timerRunning = signal(false);

  // Mouse tracking
  readonly zoneMouseMoves = signal(0);
  readonly zonelessMouseMoves = signal(0);
  readonly zoneMouseCdCount = signal(0);
  readonly zonelessMouseCdCount = signal(0);

  private mouseHandler: ((e: MouseEvent) => void) | null = null;
  private timers: number[] = [];

  /**
   * INCREMENT MIT ZONE.JS
   * NgZone.run() führt Code innerhalb der Angular Zone aus
   */
  incrementWithZone() {
    this.ngZone.run(() => {
      this.zoneCounter.update((c) => c + 1);
      this.realCdService.zoneCdCount.update((c) => c + 1);
      this.flashZoneCd();
      this.addZoneLog('Button click', true);
    });
  }

  /**
   * INCREMENT ZONELESS
   * Signal-Update triggert gezieltes CD
   */
  incrementZoneless() {
    this.zonelessCounter.update((c) => c + 1);
    this.realCdService.zonelessCdCount.update((c) => c + 1);
    this.flashZonelessCd();
    this.addZonelessLog('Button click', false);
  }

  /**
   * TIMER MIT ZONE.JS
   * Jeder setInterval-Tick innerhalb NgZone.run() triggert CD
   */
  runZoneTimer() {
    this.timerRunning.set(true);
    let ticks = 0;

    this.ngZone.run(() => {
      const timer = window.setInterval(() => {
        ticks++;
        this.realCdService.zoneCdCount.update((c) => c + 1);
        this.flashZoneCd();
        this.addZoneLog(`Timer tick ${ticks}/5`, true);

        if (ticks >= 5) {
          clearInterval(timer);
          this.zoneCounter.update((c) => c + 10);
          this.timerRunning.set(false);
        }
      }, 300);
      this.timers.push(timer);
    });
  }

  /**
   * TIMER ZONELESS
   * Timer läuft außerhalb, nur ein CD am Ende
   */
  runZonelessTimer() {
    this.timerRunning.set(true);
    let ticks = 0;

    this.addZonelessLog('Timer started (5 ticks)', false);

    this.ngZone.runOutsideAngular(() => {
      const timer = window.setInterval(() => {
        ticks++;

        if (ticks >= 5) {
          clearInterval(timer);
          // Nur EIN Signal-Update am Ende!
          this.zonelessCounter.update((c) => c + 10);
          this.realCdService.zonelessCdCount.update((c) => c + 1);
          this.flashZonelessCd();
          this.addZonelessLog('Timer complete (1 CD total)', false);
          this.timerRunning.set(false);
        }
      }, 300);
      this.timers.push(timer);
    });
  }

  /**
   * HTTP MIT ZONE.JS
   */
  runZoneHttp() {
    this.addZoneLog('HTTP request sent...', true);

    this.ngZone.run(() => {
      setTimeout(() => {
        this.zoneCounter.update((c) => c + 5);
        this.realCdService.zoneCdCount.update((c) => c + 1);
        this.flashZoneCd();
        this.addZoneLog('HTTP response received', true);
      }, 800);
    });
  }

  /**
   * HTTP ZONELESS
   */
  runZonelessHttp() {
    this.addZonelessLog('HTTP request sent...', false);

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zonelessCounter.update((c) => c + 5);
        this.realCdService.zonelessCdCount.update((c) => c + 1);
        this.flashZonelessCd();
        this.addZonelessLog('HTTP response received', false);
      }, 800);
    });
  }

  /**
   * MOUSE TRACKING MIT ZONE.JS
   * Jede Mausbewegung triggert CD!
   */
  startZoneMouseTracking() {
    if (this.mouseHandler) return;

    this.mouseHandler = (e: MouseEvent) => {
      this.ngZone.run(() => {
        this.zoneMouseMoves.update((c) => c + 1);
        this.zoneMouseCdCount.update((c) => c + 1);
        this.realCdService.zoneCdCount.update((c) => c + 1);
      });
    };

    this.zoneMouseArea?.nativeElement?.addEventListener('mousemove', this.mouseHandler);
  }

  /**
   * MOUSE TRACKING ZONELESS
   * Mausbewegungen werden gezählt, aber kein CD pro Event
   */
  startZonelessMouseTracking() {
    if (this.mouseHandler) return;

    let localMoves = 0;

    this.mouseHandler = (e: MouseEvent) => {
      this.ngZone.runOutsideAngular(() => {
        localMoves++;
        // Nur alle 10 Bewegungen ein UI-Update
        if (localMoves % 10 === 0) {
          this.zonelessMouseMoves.set(localMoves);
          this.zonelessMouseCdCount.update((c) => c + 1);
          this.realCdService.zonelessCdCount.update((c) => c + 1);
        }
      });
    };

    this.zonelessMouseArea?.nativeElement?.addEventListener('mousemove', this.mouseHandler);
  }

  stopMouseTracking(type: 'zone' | 'zoneless') {
    if (this.mouseHandler) {
      if (type === 'zone') {
        this.zoneMouseArea?.nativeElement?.removeEventListener('mousemove', this.mouseHandler);
        if (this.zoneMouseMoves() > 0) {
          this.addZoneLog(
            `Mouse tracking: ${this.zoneMouseMoves()} moves, ${this.zoneMouseCdCount()} CDs`,
            true
          );
        }
      } else {
        this.zonelessMouseArea?.nativeElement?.removeEventListener('mousemove', this.mouseHandler);
        if (this.zonelessMouseMoves() > 0) {
          this.addZonelessLog(
            `Mouse tracking: ${this.zonelessMouseMoves()} moves, ${this.zonelessMouseCdCount()} CDs`,
            false
          );
        }
      }
      this.mouseHandler = null;
    }
  }

  private flashZoneCd() {
    this.zoneCdActive.set(true);
    setTimeout(() => this.zoneCdActive.set(false), 200);
  }

  private flashZonelessCd() {
    this.zonelessCdActive.set(true);
    setTimeout(() => this.zonelessCdActive.set(false), 200);
  }

  private addZoneLog(operation: string, cdTriggered: boolean) {
    this.realCdService.operationLog.update((log) => [
      ...log,
      {
        timestamp: Date.now(),
        type: 'zone' as const,
        operation,
        cdTriggered,
      },
    ]);
  }

  private addZonelessLog(operation: string, cdTriggered: boolean) {
    this.realCdService.operationLog.update((log) => [
      ...log,
      {
        timestamp: Date.now(),
        type: 'zoneless' as const,
        operation,
        cdTriggered,
      },
    ]);
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  getSavingsPercentage(): number {
    const zone = this.realCdService.zoneCdCount();
    const zoneless = this.realCdService.zonelessCdCount();
    if (zone === 0) return 0;
    return Math.round(((zone - zoneless) / zone) * 100);
  }

  resetAll() {
    this.zoneCounter.set(0);
    this.zonelessCounter.set(0);
    this.zoneMouseMoves.set(0);
    this.zonelessMouseMoves.set(0);
    this.zoneMouseCdCount.set(0);
    this.zonelessMouseCdCount.set(0);
    this.realCdService.reset();
  }

  ngOnDestroy() {
    this.timers.forEach((t) => clearTimeout(t));
    if (this.mouseHandler) {
      this.zoneMouseArea?.nativeElement?.removeEventListener('mousemove', this.mouseHandler);
      this.zonelessMouseArea?.nativeElement?.removeEventListener('mousemove', this.mouseHandler);
    }
  }
}
