import { Component, inject, Input } from '@angular/core';
import { ComponentNode, TreeVisualizationService } from '../../services/tree-visualization.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [],
  template: `
    <div
      class="tree-node"
      [class]="
        'level-' +
        node.level +
        ' status-' +
        node.status +
        ' strategy-' +
        node.strategy.toLowerCase()
      "
    >
      <div class="node-content">
        <div class="node-header">
          <span class="node-name">{{ node.name }}</span>
          <span class="node-strategy" [class]="node.strategy.toLowerCase()">
            {{ node.strategy }}
          </span>
        </div>

        <div class="node-stats">
          <span class="cd-count">
            <span class="count-icon">🔄</span>
            <span class="count-value">{{ node.cdCount }}</span>
          </span>
          <span class="status-indicator" [class]="node.status">
            @switch (node.status) { @case ('idle') { 💤 } @case ('checking') { 🔍 } @case
            ('updated') { ✅ } @case ('skipped') { ⏭️ } }
          </span>
        </div>

        <div class="node-actions">
          <button
            class="trigger-btn zone"
            (click)="triggerZoneCD()"
            [disabled]="treeService.isAnimating()"
            title="{{
              translationService.currentLanguage() === 'en'
                ? 'Simulate Zone.js CD'
                : 'Simuliere Zone.js CD'
            }}"
          >
            🚨 Zone.js
          </button>
          <button
            class="trigger-btn zoneless"
            (click)="triggerZonelessCD()"
            [disabled]="treeService.isAnimating()"
            title="{{
              translationService.currentLanguage() === 'en'
                ? 'Trigger Zoneless CD'
                : 'Löse Zoneless CD aus'
            }}"
          >
            ⚡ Zoneless
          </button>
        </div>
      </div>

      @if (node.children.length > 0) {
      <div class="children">
        @for (child of node.children; track child.id) {
        <app-tree-node [node]="child" />
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .tree-node {
        position: relative;
        margin: 8px 0;
      }

      .tree-node::before {
        content: '';
        position: absolute;
        left: -20px;
        top: 0;
        bottom: 50%;
        width: 20px;
        border-left: 2px solid rgba(255, 255, 255, 0.2);
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      }

      .tree-node.level-0::before {
        display: none;
      }

      .node-content {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 12px 16px;
        transition: all 0.3s ease;
      }

      /* Status animations */
      .status-idle .node-content {
        border-color: rgba(255, 255, 255, 0.1);
      }

      .status-checking .node-content {
        border-color: #f39c12;
        box-shadow: 0 0 20px rgba(243, 156, 18, 0.5);
        animation: pulse-checking 0.5s infinite;
      }

      .status-updated .node-content {
        border-color: #27ae60;
        box-shadow: 0 0 20px rgba(39, 174, 96, 0.5);
      }

      .status-skipped .node-content {
        border-color: #95a5a6;
        opacity: 0.6;
      }

      @keyframes pulse-checking {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
      }

      .node-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .node-name {
        font-weight: 600;
        color: white;
        font-size: 0.9rem;
      }

      .node-strategy {
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;
      }

      .node-strategy.default {
        background: rgba(231, 76, 60, 0.3);
        color: #e74c3c;
      }

      .node-strategy.onpush {
        background: rgba(39, 174, 96, 0.3);
        color: #27ae60;
      }

      .node-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .cd-count {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
      }

      .count-value {
        font-weight: 700;
        color: #3498db;
      }

      .status-indicator {
        font-size: 1rem;
      }

      .node-actions {
        display: flex;
        gap: 6px;
      }

      .trigger-btn {
        flex: 1;
        padding: 6px 8px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.7rem;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .trigger-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .trigger-btn.zone {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
      }

      .trigger-btn.zoneless {
        background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
        color: white;
      }

      .trigger-btn:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      .children {
        margin-left: 40px;
        padding-left: 20px;
        border-left: 2px dashed rgba(255, 255, 255, 0.1);
      }
    `,
  ],
})
export class TreeNodeComponent {
  @Input({ required: true }) node!: ComponentNode;

  protected readonly treeService = inject(TreeVisualizationService);
  protected readonly translationService = inject(TranslationService);

  triggerZoneCD() {
    this.treeService.simulateZoneJsCD(this.node.id);
  }

  triggerZonelessCD() {
    this.treeService.simulateZonelessCD(this.node.id);
  }
}
