import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'theory',
    loadComponent: () => import('./pages/theory/theory.component').then((m) => m.TheoryComponent),
  },
  {
    path: 'tree',
    loadComponent: () =>
      import('./pages/tree-demo/tree-demo.component').then((m) => m.TreeDemoComponent),
  },
  {
    path: 'problems',
    loadComponent: () =>
      import('./pages/real-problems/real-problems.component').then((m) => m.RealProblemsComponent),
  },
  {
    path: 'comparison',
    loadComponent: () =>
      import('./pages/comparison/comparison.component').then((m) => m.ComparisonComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
