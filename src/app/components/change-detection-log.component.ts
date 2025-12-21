import { Component, inject } from '@angular/core';
import { ChangeDetectionTrackerService } from '../services/change-detection-tracker.service';
import { DatePipe } from '@angular/common';

/**
 * =====================================================
 * 📊 CHANGE DETECTION LOG KOMPONENTE
 * =====================================================
 *
 * Zeigt einen Live-Log aller Change Detection Events
 * um das Verhalten sichtbar zu machen.
 */
@Component({
  selector: 'app-change-detection-log',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="log-panel">
      <div class="log-header">
        <h3>📋 Change Detection Log</h3>
        <button (click)="tracker.reset()" class="reset-btn">🗑️ Reset</button>
      </div>

      <div class="stats">
        <div class="stat problem">
          <span class="stat-value">{{ tracker.zoneProblematicCount() }}</span>
          <span class="stat-label">Zone.js (simuliert)</span>
        </div>
        <div class="stat solution">
          <span class="stat-value">{{ tracker.zonelessOptimizedCount() }}</span>
          <span class="stat-label">Zoneless (Signals)</span>
        </div>
        <div class="stat total">
          <span class="stat-value">{{ tracker.totalRenders() }}</span>
          <span class="stat-label">Total</span>
        </div>
      </div>

      <div class="log-entries">
        @for (log of tracker.logs(); track log.timestamp) {
        <div class="log-entry" [class]="log.type">
          <span class="log-time">{{ log.timestamp | date : 'HH:mm:ss.SSS' }}</span>
          <span class="log-type">{{ log.type === 'zone-problem' ? '🚨' : '✅' }}</span>
          <span class="log-reason">{{ log.reason }}</span>
        </div>
        } @empty {
        <div class="log-empty">Noch keine Events. Klicke auf die Buttons oben!</div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .log-panel {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 20px;
        color: white;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        border: 2px solid #3498db;
      }

      .log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .log-header h3 {
        margin: 0;
      }

      .reset-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .reset-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 20px;
      }

      .stat {
        text-align: center;
        padding: 16px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.2);
      }

      .stat.problem {
        border-left: 4px solid #e74c3c;
      }

      .stat.solution {
        border-left: 4px solid #27ae60;
      }

      .stat.total {
        border-left: 4px solid #3498db;
      }

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: bold;
      }

      .stat.problem .stat-value {
        color: #e74c3c;
      }
      .stat.solution .stat-value {
        color: #27ae60;
      }
      .stat.total .stat-value {
        color: #3498db;
      }

      .stat-label {
        font-size: 0.8rem;
        opacity: 0.7;
      }

      .log-entries {
        max-height: 300px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 12px;
      }

      .log-entry {
        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: 12px;
        padding: 8px 12px;
        margin-bottom: 4px;
        border-radius: 6px;
        font-size: 0.85rem;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .log-entry.zone-problem {
        background: rgba(231, 76, 60, 0.2);
        border-left: 3px solid #e74c3c;
      }

      .log-entry.zoneless {
        background: rgba(39, 174, 96, 0.2);
        border-left: 3px solid #27ae60;
      }

      .log-time {
        font-family: 'Consolas', monospace;
        opacity: 0.7;
      }

      .log-empty {
        text-align: center;
        padding: 40px;
        opacity: 0.5;
      }
    `,
  ],
})
export class ChangeDetectionLogComponent {
  protected readonly tracker = inject(ChangeDetectionTrackerService);
}
