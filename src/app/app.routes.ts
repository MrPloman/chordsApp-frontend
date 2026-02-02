import { Routes } from '@angular/router';
import { ChordsGuard } from './core/guards/chordsGuard.guard';

export const routes: Routes = [
  {
    path: 'guesser',
    loadComponent: () => import('./chords-guesser/chords-guesser.component').then((c) => c.ChordsGuesserComponent),
  },
  {
    path: 'progression',
    canActivate: [ChordsGuard],
    loadComponent: () =>
      import('./chords-progression/chords-progression.component').then((c) => c.ChordsProgressionComponent),
  },
  {
    path: 'options',
    canActivate: [ChordsGuard],
    loadComponent: () => import('./chords-options/chords-options.component').then((c) => c.ChordsOptionsComponent),
  },
  {
    path: 'handbook',
    loadComponent: () => import('./chords-handbook/chords-handbook.component').then((c) => c.ChordsHandbookComponent),
  },
];
