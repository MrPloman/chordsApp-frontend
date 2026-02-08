import { Routes } from '@angular/router';
import { ChordsOptionsGuard } from './core/guards/chordsOptionsGuard.guard';
import { ChordsProgressionGuard } from './core/guards/chordsProgressionGuard.guard';

export const routes: Routes = [
  {
    path: 'guesser',
    loadComponent: () =>
      import('./features/chords-guesser/chords-guesser.component').then((c) => c.ChordsGuesserComponent),
  },
  {
    path: 'progression',
    canActivate: [ChordsProgressionGuard],
    loadComponent: () =>
      import('./features/chords-progression/chords-progression.component').then((c) => c.ChordsProgressionComponent),
  },
  {
    path: 'options',
    canActivate: [ChordsOptionsGuard],
    loadComponent: () =>
      import('./features/chords-options/chords-options.component').then((c) => c.ChordsOptionsComponent),
  },
  {
    path: 'handbook',
    loadComponent: () =>
      import('./features/chords-handbook/chords-handbook.component').then((c) => c.ChordsHandbookComponent),
  },
];
