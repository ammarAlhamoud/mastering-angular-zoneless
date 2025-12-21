import {
  Component,
  inject,
  signal,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { TranslationService } from '../../services/translation.service';

/**
 * =====================================================
 * 🔥 REAL PROBLEMS PAGE
 * =====================================================
 *
 * Diese Seite demonstriert ECHTE Performance-Probleme,
 * nicht nur Simulationen!
 *
 * Da diese App OHNE Zone.js läuft, müssen wir die Probleme
 * visualisieren, indem wir zeigen:
 * 1. Wie oft Events feuern würden
 * 2. Wie Zoneless das Problem löst
 */
@Component({
  selector: 'app-real-problems',
  standalone: true,
  template: `
    <div class="problems-page">
      <header class="page-header">
        <h1>🔥 {{ t('problems.title') }}</h1>
        <p>{{ t('problems.subtitle') }}</p>
        <div class="info-badge">
          <span>ℹ️</span>
          {{
            translationService.currentLanguage() === 'en'
              ? 'This app runs Zoneless - so you see the SOLUTION in action!'
              : 'Diese App läuft Zoneless - du siehst die LÖSUNG in Aktion!'
          }}
        </div>
      </header>

      <div class="problems-grid">
        <!-- Mouse Move Problem -->
        <section class="problem-card">
          <div class="problem-header">
            <span class="problem-icon">🖱️</span>
            <h2>{{ t('problems.mouseMoveTitle') }}</h2>
          </div>

          <p class="problem-desc">{{ t('problems.mouseMoveDesc') }}</p>

          <div
            class="demo-area mouse-area"
            #mouseArea
            (mousemove)="onMouseMove($event)"
            (mouseleave)="mousePosition.set(null)"
          >
            <div class="mouse-tracker">
              @if (mousePosition()) {
              <span>X: {{ mousePosition()!.x }}, Y: {{ mousePosition()!.y }}</span>
              } @else {
              <span>{{
                translationService.currentLanguage() === 'en'
                  ? 'Move mouse here!'
                  : 'Maus hierher bewegen!'
              }}</span>
              }
            </div>
          </div>

          <div class="stats-row">
            <div class="stat problem-stat">
              <span class="stat-label">{{
                translationService.currentLanguage() === 'en' ? 'Events fired' : 'Events gefeuert'
              }}</span>
              <span class="stat-value">{{ mouseMoveCount() }}</span>
            </div>
            <div class="stat solution-stat">
              <span class="stat-label">{{
                translationService.currentLanguage() === 'en'
                  ? 'CD triggered (Zoneless)'
                  : 'CD ausgelöst (Zoneless)'
              }}</span>
              <span class="stat-value">{{ mouseSignalUpdates() }}</span>
            </div>
          </div>

          <div class="comparison">
            <div class="with-zone">
              <strong
                >❌
                {{
                  translationService.currentLanguage() === 'en' ? 'With Zone.js:' : 'Mit Zone.js:'
                }}</strong
              >
              <p>
                {{ mouseMoveCount() }}
                {{ translationService.currentLanguage() === 'en' ? 'CD cycles!' : 'CD Zyklen!' }}
              </p>
            </div>
            <div class="zoneless">
              <strong>✅ Zoneless:</strong>
              <p>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'CD only when signal updates!'
                    : 'CD nur bei Signal-Update!'
                }}
              </p>
            </div>
          </div>

          <button class="reset-btn" (click)="resetMouseStats()">🔄 Reset</button>
        </section>

        <!-- Timer/Interval Problem -->
        <section class="problem-card">
          <div class="problem-header">
            <span class="problem-icon">⏱️</span>
            <h2>{{ t('problems.timerTitle') }}</h2>
          </div>

          <p class="problem-desc">{{ t('problems.timerDesc') }}</p>

          <div class="demo-area timer-area">
            <div class="timer-display">
              <span class="timer-value">{{ timerValue() }}</span>
              <span class="timer-unit">ms</span>
            </div>

            <div class="timer-controls">
              <button class="btn start" (click)="startTimer()" [disabled]="timerRunning()">
                ▶️
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'Start 100ms Interval'
                    : 'Starte 100ms Interval'
                }}
              </button>
              <button class="btn stop" (click)="stopTimer()" [disabled]="!timerRunning()">
                ⏹️ Stop
              </button>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat problem-stat">
              <span class="stat-label">{{
                translationService.currentLanguage() === 'en' ? 'Interval ticks' : 'Interval Ticks'
              }}</span>
              <span class="stat-value">{{ timerTicks() }}</span>
            </div>
            <div class="stat solution-stat">
              <span class="stat-label">{{
                translationService.currentLanguage() === 'en' ? 'Real CD runs' : 'Echte CD Läufe'
              }}</span>
              <span class="stat-value">{{ timerCdRuns() }}</span>
            </div>
          </div>

          <div class="comparison">
            <div class="with-zone">
              <strong
                >❌
                {{
                  translationService.currentLanguage() === 'en' ? 'With Zone.js:' : 'Mit Zone.js:'
                }}</strong
              >
              <p>
                {{ timerTicks() }}
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'unnecessary CD cycles!'
                    : 'unnötige CD Zyklen!'
                }}
              </p>
            </div>
            <div class="zoneless">
              <strong>✅ Zoneless:</strong>
              <p>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'CD only when we call signal.set()!'
                    : 'CD nur wenn wir signal.set() aufrufen!'
                }}
              </p>
            </div>
          </div>
        </section>

        <!-- Scroll Events Problem -->
        <section class="problem-card">
          <div class="problem-header">
            <span class="problem-icon">📜</span>
            <h2>{{ t('problems.scrollTitle') }}</h2>
          </div>

          <p class="problem-desc">{{ t('problems.scrollDesc') }}</p>

          <div class="demo-area scroll-area" (scroll)="onScroll($event)">
            <div class="scroll-content">
              @for (item of scrollItems; track item) {
              <div class="scroll-item">{{ item }}</div>
              }
            </div>
          </div>

          <div class="stats-row">
            <div class="stat problem-stat">
              <span class="stat-label">{{
                translationService.currentLanguage() === 'en' ? 'Scroll events' : 'Scroll Events'
              }}</span>
              <span class="stat-value">{{ scrollEventCount() }}</span>
            </div>
            <div class="stat solution-stat">
              <span class="stat-label">Scroll Position</span>
              <span class="stat-value">{{ scrollPosition() }}px</span>
            </div>
          </div>

          <div class="comparison">
            <div class="with-zone">
              <strong
                >❌
                {{
                  translationService.currentLanguage() === 'en' ? 'With Zone.js:' : 'Mit Zone.js:'
                }}</strong
              >
              <p>
                {{ scrollEventCount() }} CD
                {{ translationService.currentLanguage() === 'en' ? 'per scroll!' : 'pro Scroll!' }}
              </p>
            </div>
            <div class="zoneless">
              <strong>✅ Zoneless:</strong>
              <p>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'No CD unless we update signals!'
                    : 'Kein CD außer bei Signal-Updates!'
                }}
              </p>
            </div>
          </div>

          <button class="reset-btn" (click)="resetScrollStats()">🔄 Reset</button>
        </section>

        <!-- WebSocket/Real-time Problem -->
        <section class="problem-card">
          <div class="problem-header">
            <span class="problem-icon">🌐</span>
            <h2>
              {{
                translationService.currentLanguage() === 'en'
                  ? 'Real-time Updates'
                  : 'Echtzeit-Updates'
              }}
            </h2>
          </div>

          <p class="problem-desc">
            {{
              translationService.currentLanguage() === 'en'
                ? 'Simulated WebSocket-like updates flooding in'
                : 'Simulierte WebSocket-ähnliche Updates'
            }}
          </p>

          <div class="demo-area realtime-area">
            <div class="messages-container">
              @for (msg of realtimeMessages(); track msg.id) {
              <div class="message" [class.new]="msg.isNew">
                <span class="msg-time">{{ msg.time }}</span>
                <span class="msg-text">{{ msg.text }}</span>
              </div>
              }
            </div>
          </div>

          <div class="realtime-controls">
            <button
              class="btn start"
              (click)="startRealtimeUpdates()"
              [disabled]="realtimeRunning()"
            >
              ▶️
              {{
                translationService.currentLanguage() === 'en'
                  ? 'Start Updates (50ms)'
                  : 'Starte Updates (50ms)'
              }}
            </button>
            <button
              class="btn stop"
              (click)="stopRealtimeUpdates()"
              [disabled]="!realtimeRunning()"
            >
              ⏹️ Stop
            </button>
          </div>

          <div class="stats-row">
            <div class="stat problem-stat">
              <span class="stat-label">{{
                translationService.currentLanguage() === 'en'
                  ? 'Messages received'
                  : 'Nachrichten empfangen'
              }}</span>
              <span class="stat-value">{{ realtimeMessageCount() }}</span>
            </div>
            <div class="stat solution-stat">
              <span class="stat-label">{{
                translationService.currentLanguage() === 'en'
                  ? 'Batched updates'
                  : 'Gebündelte Updates'
              }}</span>
              <span class="stat-value">{{ realtimeBatchCount() }}</span>
            </div>
          </div>

          <div class="tip">
            💡 <strong>Tip:</strong>
            {{
              translationService.currentLanguage() === 'en'
                ? 'With Zoneless, you can batch updates and control when CD runs!'
                : 'Mit Zoneless kannst du Updates bündeln und CD kontrollieren!'
            }}
          </div>
        </section>
      </div>

      <section class="summary">
        <h2>
          📊 {{ translationService.currentLanguage() === 'en' ? 'Summary' : 'Zusammenfassung' }}
        </h2>
        <div class="summary-grid">
          <div class="summary-item bad">
            <h3>
              {{ translationService.currentLanguage() === 'en' ? 'With Zone.js' : 'Mit Zone.js' }}
            </h3>
            <p class="big-number">{{ getTotalPotentialCdRuns() }}</p>
            <p>
              {{
                translationService.currentLanguage() === 'en'
                  ? 'potential CD cycles'
                  : 'potenzielle CD Zyklen'
              }}
            </p>
          </div>
          <div class="summary-item good">
            <h3>Zoneless</h3>
            <p class="big-number">{{ getTotalActualCdRuns() }}</p>
            <p>
              {{
                translationService.currentLanguage() === 'en'
                  ? 'controlled CD cycles'
                  : 'kontrollierte CD Zyklen'
              }}
            </p>
          </div>
          <div class="summary-item savings">
            <h3>{{ translationService.currentLanguage() === 'en' ? 'Saved!' : 'Gespart!' }}</h3>
            <p class="big-number">{{ getSavingsPercentage() }}%</p>
            <p>
              {{
                translationService.currentLanguage() === 'en'
                  ? 'less unnecessary work'
                  : 'weniger unnötige Arbeit'
              }}
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .problems-page {
        padding: 40px 24px;
        max-width: 1400px;
        margin: 0 auto;
        color: white;
      }

      .page-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .page-header h1 {
        color: #e74c3c;
        margin: 0 0 12px;
      }

      .page-header p {
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 16px;
      }

      .info-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(39, 174, 96, 0.2);
        border: 1px solid #27ae60;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
      }

      .problems-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
      }

      .problem-card {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #e74c3c;
        border-radius: 16px;
        padding: 24px;
      }

      .problem-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .problem-icon {
        font-size: 2rem;
      }

      .problem-header h2 {
        margin: 0;
        font-size: 1.2rem;
      }

      .problem-desc {
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 16px;
        font-size: 0.9rem;
      }

      .demo-area {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        margin-bottom: 16px;
        overflow: hidden;
      }

      .mouse-area {
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: crosshair;
        transition: background 0.3s ease;
      }

      .mouse-area:hover {
        background: rgba(52, 152, 219, 0.2);
      }

      .mouse-tracker {
        font-family: 'Consolas', monospace;
        font-size: 1.1rem;
      }

      .timer-area {
        padding: 20px;
        text-align: center;
      }

      .timer-display {
        margin-bottom: 16px;
      }

      .timer-value {
        font-size: 3rem;
        font-weight: bold;
        color: #f39c12;
      }

      .timer-unit {
        font-size: 1rem;
        opacity: 0.7;
        margin-left: 4px;
      }

      .timer-controls,
      .realtime-controls {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn.start {
        background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
        color: white;
      }

      .btn.stop {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
      }

      .scroll-area {
        height: 150px;
        overflow-y: auto;
        padding: 12px;
      }

      .scroll-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .scroll-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 12px;
        border-radius: 6px;
        font-size: 0.85rem;
      }

      .realtime-area {
        height: 150px;
        padding: 12px;
      }

      .messages-container {
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .message {
        display: flex;
        gap: 12px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        font-size: 0.8rem;
        animation: fadeIn 0.3s ease;
      }

      .message.new {
        background: rgba(52, 152, 219, 0.2);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .msg-time {
        color: rgba(255, 255, 255, 0.5);
        font-family: 'Consolas', monospace;
      }

      .stats-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
      }

      .stat {
        text-align: center;
        padding: 12px;
        border-radius: 8px;
      }

      .stat-label {
        display: block;
        font-size: 0.75rem;
        opacity: 0.7;
        margin-bottom: 4px;
      }

      .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .problem-stat {
        background: rgba(231, 76, 60, 0.2);
      }
      .problem-stat .stat-value {
        color: #e74c3c;
      }

      .solution-stat {
        background: rgba(39, 174, 96, 0.2);
      }
      .solution-stat .stat-value {
        color: #27ae60;
      }

      .comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
      }

      .with-zone,
      .zoneless {
        padding: 12px;
        border-radius: 8px;
        font-size: 0.85rem;
      }

      .with-zone {
        background: rgba(231, 76, 60, 0.1);
        border-left: 3px solid #e74c3c;
      }

      .zoneless {
        background: rgba(39, 174, 96, 0.1);
        border-left: 3px solid #27ae60;
      }

      .with-zone p,
      .zoneless p {
        margin: 8px 0 0;
      }

      .reset-btn {
        width: 100%;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 8px;
        cursor: pointer;
      }

      .tip {
        background: rgba(243, 156, 18, 0.1);
        border-left: 3px solid #f39c12;
        padding: 12px;
        border-radius: 0 8px 8px 0;
        font-size: 0.85rem;
        margin-top: 12px;
      }

      .summary {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #9b59b6;
        border-radius: 16px;
        padding: 32px;
      }

      .summary h2 {
        text-align: center;
        margin: 0 0 24px;
        color: #9b59b6;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
      }

      .summary-item {
        text-align: center;
        padding: 24px;
        border-radius: 12px;
      }

      .summary-item.bad {
        background: rgba(231, 76, 60, 0.2);
        border: 1px solid #e74c3c;
      }

      .summary-item.good {
        background: rgba(39, 174, 96, 0.2);
        border: 1px solid #27ae60;
      }

      .summary-item.savings {
        background: rgba(243, 156, 18, 0.2);
        border: 1px solid #f39c12;
      }

      .summary-item h3 {
        margin: 0 0 12px;
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .summary-item .big-number {
        font-size: 3rem;
        font-weight: bold;
        margin: 0 0 8px;
      }

      .summary-item.bad .big-number {
        color: #e74c3c;
      }
      .summary-item.good .big-number {
        color: #27ae60;
      }
      .summary-item.savings .big-number {
        color: #f39c12;
      }

      .summary-item p:last-child {
        margin: 0;
        font-size: 0.85rem;
        opacity: 0.7;
      }
    `,
  ],
})
export class RealProblemsComponent implements OnDestroy {
  protected readonly translationService = inject(TranslationService);
  protected readonly t = this.translationService.t;
  protected readonly cdr = inject(ChangeDetectorRef);

  // Mouse move tracking
  readonly mousePosition = signal<{ x: number; y: number } | null>(null);
  readonly mouseMoveCount = signal(0);
  readonly mouseSignalUpdates = signal(0);

  // Timer tracking
  readonly timerValue = signal(0);
  readonly timerTicks = signal(0);
  readonly timerCdRuns = signal(0);
  readonly timerRunning = signal(false);
  private timerInterval: number | null = null;

  // Scroll tracking
  readonly scrollEventCount = signal(0);
  readonly scrollPosition = signal(0);
  readonly scrollItems = Array.from({ length: 50 }, (_, i) => `Item ${i + 1} - Scroll content`);

  // Real-time updates tracking
  readonly realtimeMessages = signal<{ id: number; time: string; text: string; isNew: boolean }[]>(
    []
  );
  readonly realtimeMessageCount = signal(0);
  readonly realtimeBatchCount = signal(0);
  readonly realtimeRunning = signal(false);
  private realtimeInterval: number | null = null;
  private messageId = 0;

  onMouseMove(event: MouseEvent) {
    // Event wird gefeuert - mit Zone.js wäre das ein CD Trigger!
    this.mouseMoveCount.update((c) => c + 1);

    // Wir entscheiden EXPLIZIT, wann wir das Signal updaten
    // Hier: nur alle 10 Events oder bei signifikanter Änderung
    const currentPos = this.mousePosition();
    const newX = event.offsetX;
    const newY = event.offsetY;

    if (!currentPos || Math.abs(currentPos.x - newX) > 5 || Math.abs(currentPos.y - newY) > 5) {
      this.mousePosition.set({ x: newX, y: newY });
      this.mouseSignalUpdates.update((c) => c + 1);
    }
  }

  resetMouseStats() {
    this.mouseMoveCount.set(0);
    this.mouseSignalUpdates.set(0);
    this.mousePosition.set(null);
  }

  startTimer() {
    if (this.timerRunning()) return;
    this.timerRunning.set(true);

    this.timerInterval = window.setInterval(() => {
      // Jeder Tick WÄRE ein CD mit Zone.js!
      this.timerTicks.update((c) => c + 1);

      // Mit Zoneless: Wir updaten das Signal EXPLIZIT
      const newValue = (this.timerValue() + 100) % 10000;
      this.timerValue.set(newValue);
      this.timerCdRuns.update((c) => c + 1);
    }, 100);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerRunning.set(false);
  }

  onScroll(event: Event) {
    this.scrollEventCount.update((c) => c + 1);

    // Throttled update - nur gelegentlich das Signal updaten
    const target = event.target as HTMLElement;
    const newPos = Math.round(target.scrollTop);

    // Update nur bei signifikanter Änderung
    if (Math.abs(this.scrollPosition() - newPos) > 10) {
      this.scrollPosition.set(newPos);
    }
  }

  resetScrollStats() {
    this.scrollEventCount.set(0);
    this.scrollPosition.set(0);
  }

  startRealtimeUpdates() {
    if (this.realtimeRunning()) return;
    this.realtimeRunning.set(true);

    let batchedMessages: { id: number; time: string; text: string; isNew: boolean }[] = [];
    let batchCount = 0;

    this.realtimeInterval = window.setInterval(() => {
      // Nachricht "empfangen"
      this.realtimeMessageCount.update((c) => c + 1);

      batchedMessages.push({
        id: this.messageId++,
        time: new Date().toLocaleTimeString(),
        text: `Message #${this.messageId}`,
        isNew: true,
      });

      batchCount++;

      // Batch update: Nur alle 5 Nachrichten das UI updaten
      if (batchCount >= 5) {
        this.realtimeMessages.update((msgs) => {
          const updated = [...batchedMessages, ...msgs.map((m) => ({ ...m, isNew: false }))].slice(
            0,
            20
          );
          return updated;
        });
        this.realtimeBatchCount.update((c) => c + 1);
        batchedMessages = [];
        batchCount = 0;
      }
    }, 50);
  }

  stopRealtimeUpdates() {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
      this.realtimeInterval = null;
    }
    this.realtimeRunning.set(false);
  }

  getTotalPotentialCdRuns(): number {
    return (
      this.mouseMoveCount() +
      this.timerTicks() +
      this.scrollEventCount() +
      this.realtimeMessageCount()
    );
  }

  getTotalActualCdRuns(): number {
    return this.mouseSignalUpdates() + this.timerCdRuns() + this.realtimeBatchCount();
  }

  getSavingsPercentage(): number {
    const potential = this.getTotalPotentialCdRuns();
    const actual = this.getTotalActualCdRuns();
    if (potential === 0) return 0;
    return Math.round(((potential - actual) / potential) * 100);
  }

  ngOnDestroy() {
    this.stopTimer();
    this.stopRealtimeUpdates();
  }
}
