import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'de';

interface Translations {
  [key: string]: {
    en: string;
    de: string;
  };
}

/**
 * =====================================================
 * 🌍 TRANSLATION SERVICE
 * =====================================================
 *
 * Einfacher i18n Service für Deutsch/Englisch
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  readonly currentLanguage = signal<Language>('en');

  private readonly translations: Translations = {
    // Navigation
    'nav.home': { en: 'Home', de: 'Startseite' },
    'nav.theory': { en: 'Theory', de: 'Theorie' },
    'nav.tree': { en: 'Component Tree', de: 'Komponenten-Baum' },
    'nav.realProblems': { en: 'Real Problems', de: 'Echte Probleme' },
    'nav.comparison': { en: 'Comparison', de: 'Vergleich' },

    // Header
    'header.title': { en: '🚀 Mastering Angular Zoneless', de: '🚀 Angular Zoneless Meistern' },
    'header.subtitle': {
      en: 'Understand the difference between Zone.js and Zoneless Change Detection',
      de: 'Verstehe den Unterschied zwischen Zone.js und Zoneless Change Detection',
    },
    'header.badge': { en: 'This app runs WITHOUT Zone.js!', de: 'Diese App läuft OHNE Zone.js!' },

    // Theory
    'theory.title': {
      en: '📚 What is Zone.js and why Zoneless?',
      de: '📚 Was ist Zone.js und warum Zoneless?',
    },
    'theory.whatZoneDoes': { en: 'What Zone.js does:', de: 'Was Zone.js macht:' },
    'theory.zoneProblem': { en: 'The Problems with Zone.js', de: 'Die Probleme mit Zone.js' },
    'theory.zonelessSolution': { en: 'The Zoneless Solution', de: 'Die Zoneless Lösung' },
    'theory.codeComparison': { en: 'Code Comparison', de: 'Code-Vergleich' },
    'theory.monkeyPatching': { en: 'Monkey Patching', de: 'Monkey Patching' },
    'theory.monkeyPatchingDesc': {
      en: 'Zone.js overwrites ("patches") Browser APIs:',
      de: 'Zone.js überschreibt ("patched") Browser APIs:',
    },
    'theory.zoneTracking': { en: 'Zone Tracking', de: 'Zone Tracking' },
    'theory.zoneTrackingDesc': {
      en: 'Every async operation runs in a "Zone"',
      de: 'Jede async Operation wird in einer "Zone" ausgeführt',
    },
    'theory.cdTrigger': { en: 'Change Detection Trigger', de: 'Change Detection Trigger' },
    'theory.cdTriggerDesc': {
      en: 'After EVERY async operation → CD for the ENTIRE app!',
      de: 'Nach JEDER async Operation → CD für die GESAMTE App!',
    },

    // Tree Demo
    'tree.title': { en: '🌳 Component Tree Demo', de: '🌳 Komponenten-Baum Demo' },
    'tree.explanation': {
      en: 'See how Change Detection flows through the component tree',
      de: 'Beobachte wie Change Detection durch den Komponenten-Baum fließt',
    },
    'tree.legend': { en: 'Legend', de: 'Legende' },
    'tree.idle': { en: 'Idle', de: 'Ruhezustand' },
    'tree.checking': { en: 'Checking', de: 'Prüfend' },
    'tree.updated': { en: 'Updated', de: 'Aktualisiert' },
    'tree.skipped': { en: 'Skipped (OnPush)', de: 'Übersprungen (OnPush)' },
    'tree.triggerFromChild': {
      en: 'Trigger update from this component',
      de: 'Update von dieser Komponente auslösen',
    },
    'tree.cdCount': { en: 'CD runs', de: 'CD Durchläufe' },

    // Real Problems
    'problems.title': { en: '🔥 Real World Problems', de: '🔥 Echte Probleme' },
    'problems.subtitle': {
      en: 'These are REAL change detection triggers - not simulations!',
      de: 'Das sind ECHTE Change Detection Trigger - keine Simulationen!',
    },
    'problems.mouseMoveTitle': { en: '🖱️ Mouse Movement', de: '🖱️ Mausbewegung' },
    'problems.mouseMoveDesc': {
      en: 'Every mouse move event triggers CD with Zone.js!',
      de: 'Jede Mausbewegung triggert CD mit Zone.js!',
    },
    'problems.timerTitle': { en: '⏱️ Timer/Interval', de: '⏱️ Timer/Interval' },
    'problems.timerDesc': {
      en: 'setInterval triggers CD every tick!',
      de: 'setInterval triggert CD bei jedem Tick!',
    },
    'problems.httpTitle': { en: '🌐 HTTP Requests', de: '🌐 HTTP Anfragen' },
    'problems.httpDesc': {
      en: 'Every HTTP response triggers CD!',
      de: 'Jede HTTP Antwort triggert CD!',
    },
    'problems.scrollTitle': { en: '📜 Scroll Events', de: '📜 Scroll Events' },
    'problems.scrollDesc': {
      en: 'Scrolling triggers hundreds of CD cycles!',
      de: 'Scrollen triggert hunderte CD Zyklen!',
    },

    // Solutions
    'solutions.title': { en: '✅ Zoneless Solutions', de: '✅ Zoneless Lösungen' },
    'solutions.signals': {
      en: 'Use Signals for reactive state',
      de: 'Nutze Signals für reaktiven State',
    },
    'solutions.onpush': { en: 'Use OnPush strategy', de: 'Nutze OnPush Strategie' },
    'solutions.markForCheck': {
      en: 'Call markForCheck() explicitly',
      de: 'Rufe markForCheck() explizit auf',
    },

    // Comparison
    'comparison.title': { en: '📊 Side-by-Side Comparison', de: '📊 Direkter Vergleich' },
    'comparison.withZone': { en: 'With Zone.js (simulated)', de: 'Mit Zone.js (simuliert)' },
    'comparison.zoneless': { en: 'Zoneless (current app)', de: 'Zoneless (aktuelle App)' },

    // Buttons
    'btn.start': { en: 'Start', de: 'Starten' },
    'btn.stop': { en: 'Stop', de: 'Stoppen' },
    'btn.reset': { en: 'Reset', de: 'Zurücksetzen' },
    'btn.trigger': { en: 'Trigger', de: 'Auslösen' },
    'btn.increment': { en: 'Increment', de: 'Erhöhen' },

    // Stats
    'stats.cdCycles': { en: 'CD Cycles', de: 'CD Zyklen' },
    'stats.unnecessary': { en: 'Unnecessary', de: 'Unnötig' },
    'stats.efficient': { en: 'Efficient', de: 'Effizient' },
    'stats.total': { en: 'Total', de: 'Gesamt' },

    // Footer
    'footer.moreInfo': { en: 'More info:', de: 'Mehr Infos:' },
    'footer.version': {
      en: 'Angular v21 | Zoneless Change Detection',
      de: 'Angular v21 | Zoneless Change Detection',
    },
  };

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage()];
  }

  // Reaktive Version für Templates
  t = (key: string) => {
    // Durch Aufruf von currentLanguage() wird die Reaktivität sichergestellt
    const lang = this.currentLanguage();
    const translation = this.translations[key];
    if (!translation) return key;
    return translation[lang];
  };

  toggleLanguage() {
    this.currentLanguage.update((lang) => (lang === 'en' ? 'de' : 'en'));
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
  }
}
