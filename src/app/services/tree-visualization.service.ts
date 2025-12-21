import { Injectable, signal } from '@angular/core';

export interface ComponentNode {
  id: string;
  name: string;
  level: number;
  cdCount: number;
  status: 'idle' | 'checking' | 'updated' | 'skipped';
  strategy: 'Default' | 'OnPush';
  children: ComponentNode[];
}

/**
 * Service zur Verfolgung des CD-Flusses im Komponenten-Baum
 */
@Injectable({
  providedIn: 'root',
})
export class TreeVisualizationService {
  readonly tree = signal<ComponentNode>(this.createInitialTree());
  readonly cdHistory = signal<{ node: string; timestamp: number; reason: string }[]>([]);
  readonly isAnimating = signal(false);

  private createInitialTree(): ComponentNode {
    return {
      id: 'app',
      name: 'AppComponent',
      level: 0,
      cdCount: 0,
      status: 'idle',
      strategy: 'Default',
      children: [
        {
          id: 'header',
          name: 'HeaderComponent',
          level: 1,
          cdCount: 0,
          status: 'idle',
          strategy: 'OnPush',
          children: [],
        },
        {
          id: 'sidebar',
          name: 'SidebarComponent',
          level: 1,
          cdCount: 0,
          status: 'idle',
          strategy: 'Default',
          children: [
            {
              id: 'nav',
              name: 'NavComponent',
              level: 2,
              cdCount: 0,
              status: 'idle',
              strategy: 'Default',
              children: [],
            },
          ],
        },
        {
          id: 'main',
          name: 'MainComponent',
          level: 1,
          cdCount: 0,
          status: 'idle',
          strategy: 'Default',
          children: [
            {
              id: 'list',
              name: 'ListComponent',
              level: 2,
              cdCount: 0,
              status: 'idle',
              strategy: 'Default',
              children: [
                {
                  id: 'item1',
                  name: 'ItemComponent',
                  level: 3,
                  cdCount: 0,
                  status: 'idle',
                  strategy: 'Default',
                  children: [],
                },
                {
                  id: 'item2',
                  name: 'ItemComponent',
                  level: 3,
                  cdCount: 0,
                  status: 'idle',
                  strategy: 'OnPush',
                  children: [],
                },
                {
                  id: 'item3',
                  name: 'ItemComponent',
                  level: 3,
                  cdCount: 0,
                  status: 'idle',
                  strategy: 'Default',
                  children: [],
                },
              ],
            },
            {
              id: 'detail',
              name: 'DetailComponent',
              level: 2,
              cdCount: 0,
              status: 'idle',
              strategy: 'OnPush',
              children: [
                {
                  id: 'form',
                  name: 'FormComponent',
                  level: 3,
                  cdCount: 0,
                  status: 'idle',
                  strategy: 'Default',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 'footer',
          name: 'FooterComponent',
          level: 1,
          cdCount: 0,
          status: 'idle',
          strategy: 'Default',
          children: [],
        },
      ],
    };
  }

  /**
   * =====================================================
   * ZONE.JS CD-VERHALTEN (KORREKTES MODELL)
   * =====================================================
   *
   * Zone.js triggert CD von der Root-Komponente aus.
   * Der CD-Fluss geht TOP-DOWN durch den Baum:
   *
   * 1. Default-Komponente: IMMER geprüft, Children auch
   * 2. OnPush-Komponente OHNE Trigger: ÜBERSPRUNGEN + alle Children!
   * 3. OnPush-Komponente MIT Trigger: Geprüft, dann Children nach deren Strategie
   *
   * WICHTIG: OnPush "schützt" den gesamten Subtree!
   */
  async simulateZoneJsCD(triggeredFrom: string) {
    if (this.isAnimating()) return;
    this.isAnimating.set(true);

    // Starte von der Root und gehe TOP-DOWN durch
    await this.processNodeZoneJs(this.tree(), triggeredFrom, false);

    await this.delay(500);
    this.resetAllStatus();
    this.isAnimating.set(false);
  }

  /**
   * Rekursive CD-Prüfung mit korrektem OnPush-Verhalten
   * @param parentSkipped - Wenn true, wird dieser Subtree komplett übersprungen
   */
  private async processNodeZoneJs(
    node: ComponentNode,
    triggeredFrom: string,
    parentSkipped: boolean
  ): Promise<void> {
    await this.delay(100);

    // Wurde der Parent übersprungen? Dann sind wir auch übersprungen!
    if (parentSkipped) {
      this.updateNodeStatus(node.id, 'skipped');
      this.addToHistory(node.name, '⏭️ Parent (OnPush) wurde übersprungen');

      // Alle Children werden auch übersprungen
      for (const child of node.children) {
        await this.processNodeZoneJs(child, triggeredFrom, true);
      }
      return;
    }

    // Prüfe ob diese Komponente übersprungen werden soll
    const isTriggeredComponent = node.id === triggeredFrom;
    const shouldSkip = node.strategy === 'OnPush' && !isTriggeredComponent;

    if (shouldSkip) {
      // OnPush ohne Input-Änderung → ÜBERSPRUNGEN
      this.updateNodeStatus(node.id, 'skipped');
      this.addToHistory(node.name, '⏭️ OnPush - kein Input geändert');

      // WICHTIG: Alle Children werden AUCH übersprungen!
      for (const child of node.children) {
        await this.processNodeZoneJs(child, triggeredFrom, true); // parentSkipped = true!
      }
    } else {
      // Diese Komponente wird geprüft
      this.updateNodeStatus(node.id, 'checking');
      await this.delay(150);
      this.incrementCdCount(node.id);
      this.updateNodeStatus(node.id, 'updated');

      if (isTriggeredComponent) {
        this.addToHistory(node.name, '🎯 Event ausgelöst - CD getriggert');
      } else {
        this.addToHistory(node.name, '✅ Default - wird geprüft');
      }

      // Children werden AUCH geprüft (aber nach deren eigener Strategie)
      for (const child of node.children) {
        await this.processNodeZoneJs(child, triggeredFrom, false);
      }
    }
  }

  /**
   * =====================================================
   * ZONELESS CD-VERHALTEN (KORREKTES MODELL)
   * =====================================================
   *
   * Mit Zoneless + Signals wird CD NUR für:
   * 1. Die Komponente die das Signal ändert
   * 2. Komponenten die dieses Signal lesen (Dependencies)
   *
   * Es gibt KEINEN Top-Down Durchlauf!
   * Nur betroffene Views werden aktualisiert.
   */
  async simulateZonelessCD(triggeredFrom: string) {
    if (this.isAnimating()) return;
    this.isAnimating.set(true);

    // Markiere alle als übersprungen erstmal
    const allNodes = this.flattenTree(this.tree());
    for (const node of allNodes) {
      this.updateNodeStatus(node.id, 'skipped');
    }

    await this.delay(200);

    // Nur die auslösende Komponente und ihre direkten Abhängigkeiten
    const targetNode = this.findNode(this.tree(), triggeredFrom);

    if (targetNode) {
      // Nur diese eine Komponente wird aktualisiert!
      this.updateNodeStatus(targetNode.id, 'checking');
      await this.delay(150);
      this.incrementCdCount(targetNode.id);
      this.updateNodeStatus(targetNode.id, 'updated');
      this.addToHistory(targetNode.name, '⚡ Signal.update() - gezieltes Update');
    }

    await this.delay(500);
    this.resetAllStatus();
    this.isAnimating.set(false);
  }

  private findNode(node: ComponentNode, nodeId: string): ComponentNode | null {
    if (node.id === nodeId) return node;
    for (const child of node.children) {
      const found = this.findNode(child, nodeId);
      if (found) return found;
    }
    return null;
  }

  private getAffectedNodes(nodeId: string): ComponentNode[] {
    const result: ComponentNode[] = [];
    const findNode = (node: ComponentNode): ComponentNode | null => {
      if (node.id === nodeId) return node;
      for (const child of node.children) {
        const found = findNode(child);
        if (found) return found;
      }
      return null;
    };

    const targetNode = findNode(this.tree());
    if (targetNode) {
      // Füge den Knoten und alle Eltern hinzu (Pfad nach oben)
      result.push(targetNode);

      // Füge alle Kinder hinzu
      const addChildren = (node: ComponentNode) => {
        for (const child of node.children) {
          result.push(child);
          addChildren(child);
        }
      };
      addChildren(targetNode);
    }

    return result;
  }

  private flattenTree(node: ComponentNode): ComponentNode[] {
    const result: ComponentNode[] = [node];
    for (const child of node.children) {
      result.push(...this.flattenTree(child));
    }
    return result;
  }

  private updateNodeStatus(nodeId: string, status: ComponentNode['status']) {
    this.tree.update((tree) =>
      this.updateNodeInTree(tree, nodeId, (node) => ({ ...node, status }))
    );
  }

  private incrementCdCount(nodeId: string) {
    this.tree.update((tree) =>
      this.updateNodeInTree(tree, nodeId, (node) => ({ ...node, cdCount: node.cdCount + 1 }))
    );
  }

  private updateNodeInTree(
    node: ComponentNode,
    targetId: string,
    updater: (node: ComponentNode) => ComponentNode
  ): ComponentNode {
    if (node.id === targetId) {
      return updater(node);
    }
    return {
      ...node,
      children: node.children.map((child) => this.updateNodeInTree(child, targetId, updater)),
    };
  }

  private addToHistory(nodeName: string, reason: string) {
    this.cdHistory.update((history) =>
      [{ node: nodeName, timestamp: Date.now(), reason }, ...history].slice(0, 30)
    );
  }

  private resetAllStatus() {
    const resetNode = (node: ComponentNode): ComponentNode => ({
      ...node,
      status: 'idle',
      children: node.children.map(resetNode),
    });
    this.tree.update((tree) => resetNode(tree));
  }

  reset() {
    this.tree.set(this.createInitialTree());
    this.cdHistory.set([]);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
