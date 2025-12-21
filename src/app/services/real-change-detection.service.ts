import { Injectable, NgZone, signal, inject } from '@angular/core';

/**
 * =====================================================
 * ECHTER CHANGE DETECTION VERGLEICHS-SERVICE
 * =====================================================
 *
 * Dieser Service nutzt NgZone um ECHTE Zone.js Change Detection
 * auszulösen und zu messen. Das ist KEINE Simulation!
 *
 * KONZEPT:
 * - Die App läuft im Zoneless-Modus (provideZonelessChangeDetection)
 * - Aber Zone.js ist geladen und NgZone ist verfügbar
 * - NgZone.run() führt Code INNERHALB der Zone aus → CD wird getriggert
 * - NgZone.runOutsideAngular() führt Code AUSSERHALB aus → kein CD
 *
 * So können wir BEIDE Verhaltensweisen in einer App zeigen!
 */
@Injectable({
  providedIn: 'root',
})
export class RealChangeDetectionService {
  private ngZone = inject(NgZone);

  // Echte Zähler für CD-Zyklen
  readonly zoneCdCount = signal(0);
  readonly zonelessCdCount = signal(0);

  // Für Performance-Messung
  readonly zoneExecutionTime = signal(0);
  readonly zonelessExecutionTime = signal(0);

  // Event-Zähler (wie oft wurde das Event gefeuert)
  readonly eventCount = signal(0);

  // Status
  readonly isZoneActive = signal(false);

  // Log der Operationen
  readonly operationLog = signal<
    {
      timestamp: number;
      type: 'zone' | 'zoneless';
      operation: string;
      cdTriggered: boolean;
    }[]
  >([]);

  /**
   * Führt eine Operation MIT Zone.js aus
   * → Triggert echte Change Detection!
   */
  runWithZone<T>(operation: () => T, operationName: string = 'Operation'): T {
    const start = performance.now();
    let result: T;

    this.isZoneActive.set(true);

    // NgZone.run() führt den Code innerhalb der Angular Zone aus
    // Das bedeutet: Nach dem Callback wird CD getriggert!
    this.ngZone.run(() => {
      result = operation();
      this.zoneCdCount.update((c) => c + 1);
    });

    const end = performance.now();
    this.zoneExecutionTime.update((t) => t + (end - start));

    this.addLog('zone', operationName, true);
    this.isZoneActive.set(false);

    return result!;
  }

  /**
   * Führt eine Operation OHNE Zone.js aus (Zoneless-Modus)
   * → Nur explizite Signal-Updates triggern CD
   */
  runZoneless<T>(operation: () => T, operationName: string = 'Operation'): T {
    const start = performance.now();
    let result: T;

    // runOutsideAngular() führt Code außerhalb der Zone aus
    // CD wird NUR getriggert wenn Signals sich ändern!
    this.ngZone.runOutsideAngular(() => {
      result = operation();
    });

    // Nur dieses Signal-Update triggert CD
    this.zonelessCdCount.update((c) => c + 1);

    const end = performance.now();
    this.zonelessExecutionTime.update((t) => t + (end - start));

    this.addLog('zoneless', operationName, false);

    return result!;
  }

  /**
   * Simuliert einen Timer-Callback
   * Mit Zone.js: setInterval triggert CD bei JEDEM Tick
   * Zoneless: Nur wenn wir ein Signal updaten
   */
  startZoneTimer(durationMs: number, intervalMs: number = 100): Promise<void> {
    return new Promise((resolve) => {
      let elapsed = 0;

      // Timer INNERHALB der Zone - jeder Tick triggert CD!
      this.ngZone.run(() => {
        const intervalId = setInterval(() => {
          elapsed += intervalMs;
          this.zoneCdCount.update((c) => c + 1);
          this.eventCount.update((c) => c + 1);
          this.addLog('zone', `Timer tick ${elapsed}ms`, true);

          if (elapsed >= durationMs) {
            clearInterval(intervalId);
            resolve();
          }
        }, intervalMs);
      });
    });
  }

  /**
   * Zoneless Timer - nur ein CD am Ende
   */
  startZonelessTimer(durationMs: number, intervalMs: number = 100): Promise<void> {
    return new Promise((resolve) => {
      let elapsed = 0;
      let tickCount = 0;

      // Timer AUSSERHALB der Zone - kein CD pro Tick!
      this.ngZone.runOutsideAngular(() => {
        const intervalId = setInterval(() => {
          elapsed += intervalMs;
          tickCount++;

          if (elapsed >= durationMs) {
            clearInterval(intervalId);

            // Nur EIN Signal-Update am Ende!
            this.eventCount.update((c) => c + tickCount);
            this.zonelessCdCount.update((c) => c + 1);
            this.addLog('zoneless', `Timer complete (${tickCount} ticks, 1 CD)`, false);

            resolve();
          }
        }, intervalMs);
      });
    });
  }

  /**
   * Mouse Move Demo - Zone.js Style
   * Jede Mausbewegung triggert CD
   */
  trackMouseWithZone(
    element: HTMLElement,
    durationMs: number = 3000
  ): Promise<{ moves: number; cdCycles: number }> {
    return new Promise((resolve) => {
      let moveCount = 0;
      let cdCount = 0;

      const handler = (event: MouseEvent) => {
        this.ngZone.run(() => {
          moveCount++;
          cdCount++;
          this.zoneCdCount.update((c) => c + 1);
        });
      };

      element.addEventListener('mousemove', handler);

      setTimeout(() => {
        element.removeEventListener('mousemove', handler);
        this.addLog('zone', `Mouse tracking: ${moveCount} moves, ${cdCount} CDs`, true);
        resolve({ moves: moveCount, cdCycles: cdCount });
      }, durationMs);
    });
  }

  /**
   * Mouse Move Demo - Zoneless Style
   * Mausbewegungen werden gesammelt, nur ein CD am Ende
   */
  trackMouseZoneless(
    element: HTMLElement,
    durationMs: number = 3000
  ): Promise<{ moves: number; cdCycles: number }> {
    return new Promise((resolve) => {
      let moveCount = 0;

      const handler = (event: MouseEvent) => {
        this.ngZone.runOutsideAngular(() => {
          moveCount++;
        });
      };

      element.addEventListener('mousemove', handler);

      setTimeout(() => {
        element.removeEventListener('mousemove', handler);
        // Nur EIN Signal-Update!
        this.eventCount.update((c) => c + moveCount);
        this.zonelessCdCount.update((c) => c + 1);
        this.addLog('zoneless', `Mouse tracking: ${moveCount} moves, 1 CD`, false);
        resolve({ moves: moveCount, cdCycles: 1 });
      }, durationMs);
    });
  }

  /**
   * HTTP-ähnliche Operation (simuliert mit Promise/setTimeout)
   */
  async simulateHttpWithZone(): Promise<void> {
    return new Promise((resolve) => {
      this.ngZone.run(() => {
        // Simulate HTTP request
        setTimeout(() => {
          this.zoneCdCount.update((c) => c + 1);
          this.addLog('zone', 'HTTP response received', true);
          resolve();
        }, 500);
      });
    });
  }

  async simulateHttpZoneless(): Promise<void> {
    return new Promise((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          // Nur explizites Signal-Update
          this.zonelessCdCount.update((c) => c + 1);
          this.addLog('zoneless', 'HTTP response received', false);
          resolve();
        }, 500);
      });
    });
  }

  private addLog(type: 'zone' | 'zoneless', operation: string, cdTriggered: boolean) {
    this.operationLog.update((log) => [
      ...log.slice(-50), // Behalte nur die letzten 50 Einträge
      {
        timestamp: Date.now(),
        type,
        operation,
        cdTriggered,
      },
    ]);
  }

  reset() {
    this.zoneCdCount.set(0);
    this.zonelessCdCount.set(0);
    this.zoneExecutionTime.set(0);
    this.zonelessExecutionTime.set(0);
    this.eventCount.set(0);
    this.operationLog.set([]);
  }
}
