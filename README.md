# Mastering Angular Zoneless

An interactive **Angular 21 / TypeScript** learning project with English and German content, exploring signals and component trees.

**Status:** educational prototype. The comparison screen illustrates update strategies; it is **not a controlled Zone.js-versus-zoneless performance benchmark**.

## Run

Use Node.js 24 LTS and npm:

```sh
git clone https://github.com/ammarAlhamoud/mastering-angular-zoneless.git
cd mastering-angular-zoneless
npm ci
npm start
```

Open [localhost:4200](http://localhost:4200).

```sh
npm run build
npm test -- --watch=false
```

These are configured commands, not a claim that the suite passes. The existing app test still expects the generated "Hello, zoneless-demo" heading and needs updating for the routed application.

## Explore

| Route | Focus |
| --- | --- |
| `/` | Introduction |
| `/theory` | Change-detection concepts |
| `/tree` | Component-tree visualization |
| `/problems` | Timer, mouse and scrolling examples |
| `/comparison` | Illustrated strategies and operation counters |

Routes lazy-load standalone pages. A translation service supplies English/German content.

## Implementation and measurement limits

[app.config.ts](src/app/app.config.ts) configures `provideZonelessChangeDetection()`, while [polyfills.ts](src/polyfills.ts) still imports `zone.js`.

Both comparison panels run inside the same application. [comparison.component.ts](src/app/pages/comparison/comparison.component.ts) increments counters explicitly and batches some mouse updates. Its "HTTP" examples use timers. Counters and the displayed savings percentage are not independently measured Angular change-detection cycles, network measurements or performance improvements.

Loading Zone.js or calling `NgZone.run()` does not turn a panel into a separately bootstrapped zone-based application. A defensible comparison needs equivalent workloads in separately configured applications and independent measurements.

## Technical reference

Angular notifications include updates to signals read by templates, bound event listeners and `ChangeDetectorRef.markForCheck()` (also used by `AsyncPipe`). Signals are not the only notification mechanism.

See the [official Angular zoneless guide](https://angular.dev/guide/zoneless). Bundle-size and performance claims need measurements tied to a named build and workload.

## Before presenting this as a benchmark

1. Correct remaining "REAL Zone.js" and cycle-count claims in the UI and teaching content.
2. Separate illustrative counters from profiling.
3. Add equivalent zone-based and zoneless builds if a benchmark remains the goal.
4. Update routed application tests and add build/test CI.
5. Record browser, hardware, workload and raw results.

No project-wide license file is included.
