import { Component, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { TreeVisualizationService } from '../../services/tree-visualization.service';
import { TreeNodeComponent } from '../../shared/tree-node/tree-node.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  imports: [TreeNodeComponent, DatePipe],
  template: `
    <div class="tree-demo-page">
      <header class="page-header">
        <h1>🌳 {{ t('tree.title') }}</h1>
        <p>{{ t('tree.explanation') }}</p>
      </header>

      <div class="content-grid">
        <section class="tree-section">
          <div class="section-header">
            <h2>
              {{
                translationService.currentLanguage() === 'en'
                  ? 'Component Tree'
                  : 'Komponenten-Baum'
              }}
            </h2>
            <button class="reset-btn" (click)="treeService.reset()">
              🔄 {{ translationService.currentLanguage() === 'en' ? 'Reset' : 'Zurücksetzen' }}
            </button>
          </div>

          <div class="legend">
            <h3>{{ t('tree.legend') }}</h3>
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-icon idle">💤</span>
                <span>{{ t('tree.idle') }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-icon checking">🔍</span>
                <span>{{ t('tree.checking') }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-icon updated">✅</span>
                <span>{{ t('tree.updated') }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-icon skipped">⏭️</span>
                <span>{{ t('tree.skipped') }}</span>
              </div>
            </div>
            <div class="legend-strategies">
              <div class="strategy-item default">
                <span class="strategy-badge">Default</span>
                <span>{{
                  translationService.currentLanguage() === 'en' ? 'Always checked' : 'Immer geprüft'
                }}</span>
              </div>
              <div class="strategy-item onpush">
                <span class="strategy-badge">OnPush</span>
                <span>{{
                  translationService.currentLanguage() === 'en'
                    ? 'Only when inputs change'
                    : 'Nur bei Input-Änderungen'
                }}</span>
              </div>
            </div>
          </div>

          <div class="tree-container">
            <app-tree-node [node]="treeService.tree()" />
          </div>

          <div class="instructions">
            <h3>
              {{
                translationService.currentLanguage() === 'en' ? '🎮 Try it!' : '🎮 Probier es aus!'
              }}
            </h3>
            <ul>
              <li>
                <strong>🚨 Zone.js:</strong>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'Triggers CD for ALL components (except OnPush without input changes)'
                    : 'Löst CD für ALLE Komponenten aus (außer OnPush ohne Input-Änderungen)'
                }}
              </li>
              <li>
                <strong>⚡ Zoneless:</strong>
                {{
                  translationService.currentLanguage() === 'en'
                    ? 'Triggers CD ONLY for affected component and its children'
                    : 'Löst CD NUR für betroffene Komponente und deren Kinder aus'
                }}
              </li>
            </ul>
          </div>
        </section>

        <section class="history-section">
          <h2>
            📋 {{ translationService.currentLanguage() === 'en' ? 'CD History' : 'CD Verlauf' }}
          </h2>

          <div class="stats">
            <div class="stat">
              <span class="stat-value">{{ getTotalCdCount() }}</span>
              <span class="stat-label">{{
                translationService.currentLanguage() === 'en'
                  ? 'Total CD runs'
                  : 'Gesamt CD Durchläufe'
              }}</span>
            </div>
          </div>

          <div class="history-list">
            @for (entry of treeService.cdHistory(); track entry.timestamp) {
            <div
              class="history-entry"
              [class.zone]="entry.reason.includes('Zone')"
              [class.zoneless]="entry.reason.includes('Signal')"
            >
              <span class="entry-time">{{ entry.timestamp | date : 'HH:mm:ss.SSS' }}</span>
              <span class="entry-node">{{ entry.node }}</span>
              <span class="entry-reason">{{ entry.reason }}</span>
            </div>
            } @empty {
            <div class="history-empty">
              {{
                translationService.currentLanguage() === 'en'
                  ? 'Click on a button in the tree to see CD flow!'
                  : 'Klicke auf einen Button im Baum um den CD Fluss zu sehen!'
              }}
            </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .tree-demo-page {
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
        color: #3498db;
        margin: 0 0 12px;
      }

      .page-header p {
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 24px;
      }

      @media (max-width: 1000px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      .tree-section,
      .history-section {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 24px;
      }

      .tree-section {
        border: 2px solid #3498db;
      }

      .history-section {
        border: 2px solid #9b59b6;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .section-header h2 {
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

      .legend {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
      }

      .legend h3 {
        margin: 0 0 12px;
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .legend-items {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 12px;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
      }

      .legend-icon {
        width: 24px;
        text-align: center;
      }

      .legend-strategies {
        display: flex;
        gap: 24px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .strategy-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
      }

      .strategy-badge {
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.7rem;
      }

      .strategy-item.default .strategy-badge {
        background: rgba(231, 76, 60, 0.3);
        color: #e74c3c;
      }

      .strategy-item.onpush .strategy-badge {
        background: rgba(39, 174, 96, 0.3);
        color: #27ae60;
      }

      .tree-container {
        overflow-x: auto;
        padding: 20px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        margin-bottom: 24px;
      }

      .instructions {
        background: rgba(52, 152, 219, 0.1);
        border-left: 4px solid #3498db;
        padding: 16px;
        border-radius: 0 8px 8px 0;
      }

      .instructions h3 {
        margin: 0 0 12px;
        color: #3498db;
      }

      .instructions ul {
        margin: 0;
        padding-left: 20px;
      }

      .instructions li {
        margin: 8px 0;
        line-height: 1.6;
      }

      .history-section h2 {
        margin: 0 0 16px;
      }

      .stats {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
      }

      .stat {
        flex: 1;
        text-align: center;
        background: rgba(0, 0, 0, 0.2);
        padding: 16px;
        border-radius: 8px;
      }

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: #9b59b6;
      }

      .stat-label {
        font-size: 0.8rem;
        opacity: 0.7;
      }

      .history-list {
        max-height: 400px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 12px;
      }

      .history-entry {
        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: 12px;
        padding: 8px 12px;
        margin-bottom: 4px;
        border-radius: 6px;
        font-size: 0.8rem;
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

      .history-entry.zone {
        background: rgba(231, 76, 60, 0.2);
        border-left: 3px solid #e74c3c;
      }

      .history-entry.zoneless {
        background: rgba(39, 174, 96, 0.2);
        border-left: 3px solid #27ae60;
      }

      .entry-time {
        font-family: 'Consolas', monospace;
        opacity: 0.6;
      }

      .entry-node {
        font-weight: 600;
        color: #3498db;
      }

      .entry-reason {
        opacity: 0.8;
      }

      .history-empty {
        text-align: center;
        padding: 40px;
        opacity: 0.5;
      }
    `,
  ],
})
export class TreeDemoComponent {
  protected readonly translationService = inject(TranslationService);
  protected readonly treeService = inject(TreeVisualizationService);
  protected readonly t = this.translationService.t;

  getTotalCdCount(): number {
    const countNodes = (node: any): number => {
      let total = node.cdCount;
      for (const child of node.children) {
        total += countNodes(child);
      }
      return total;
    };
    return countNodes(this.treeService.tree());
  }
}
