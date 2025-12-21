import { Injectable, signal } from '@angular/core';

/**
 * =====================================================
 * CHANGE DETECTION TRACKER SERVICE
 * =====================================================
 *
 * Dieser Service zählt, wie oft Change Detection in
 * verschiedenen Komponenten ausgelöst wird.
 *
 * WARUM IST DAS WICHTIG?
 * - Mit Zone.js wird CD oft UNNÖTIG ausgelöst
 * - Zoneless löst CD NUR bei Signalen/Events aus
 * - Dieser Counter macht das Verhalten SICHTBAR
 */
@Injectable({
  providedIn: 'root',
})
export class ChangeDetectionTrackerService {
  // Counter für verschiedene Szenarien
  readonly zoneProblematicCount = signal(0);
  readonly zonelessOptimizedCount = signal(0);
  readonly totalRenders = signal(0);

  // Log-Einträge für detaillierte Ansicht
  readonly logs = signal<LogEntry[]>([]);

  incrementZoneProblematic(reason: string) {
    this.zoneProblematicCount.update((c) => c + 1);
    this.totalRenders.update((c) => c + 1);
    this.addLog('zone-problem', reason);
  }

  incrementZonelessOptimized(reason: string) {
    this.zonelessOptimizedCount.update((c) => c + 1);
    this.totalRenders.update((c) => c + 1);
    this.addLog('zoneless', reason);
  }

  private addLog(type: 'zone-problem' | 'zoneless', reason: string) {
    const entry: LogEntry = {
      timestamp: new Date(),
      type,
      reason,
    };
    this.logs.update((logs) => [entry, ...logs].slice(0, 50)); // Maximal 50 Einträge
  }

  reset() {
    this.zoneProblematicCount.set(0);
    this.zonelessOptimizedCount.set(0);
    this.totalRenders.set(0);
    this.logs.set([]);
  }
}

interface LogEntry {
  timestamp: Date;
  type: 'zone-problem' | 'zoneless';
  reason: string;
}
