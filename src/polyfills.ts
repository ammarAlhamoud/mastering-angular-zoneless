/**
 * =====================================================
 * ZONE.JS POLYFILL - FÜR LERNZWECKE
 * =====================================================
 *
 * WICHTIG: Diese App verwendet primär ZONELESS Change Detection!
 *
 * Zone.js wird hier nur geladen, damit wir:
 * 1. NgZone.run() verwenden können für echte Zone.js-Demos
 * 2. Den echten Unterschied zwischen Zone.js und Zoneless zeigen können
 * 3. Messbare Performance-Unterschiede demonstrieren können
 *
 * Die App bleibt im Zoneless-Modus (provideZonelessChangeDetection),
 * aber wir können gezielt Zone.js-Verhalten auslösen!
 */

import 'zone.js';
