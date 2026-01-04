import { Routes } from '@angular/router';
import { ChordsGuard } from './guards/chordsGuard.guard';

export const routes: Routes = [
  {
    path: 'guesser',
    loadComponent: () =>
      import('./components/chords-guesser/chords-guesser.component').then(
        (c) => c.ChordsGuesserComponent
      ),
  },
  {
    path: 'progression',
    canActivate: [ChordsGuard],
    loadComponent: () =>
      import(
        './components/chords-progression/chords-progression.component'
      ).then((c) => c.ChordsProgressionComponent),
  },
  {
    path: 'options',
    canActivate: [ChordsGuard],
    loadComponent: () =>
      import('./components/chords-options/chords-options.component').then(
        (c) => c.ChordsOptionsComponent
      ),
  },
  {
    path: 'handbook',
    loadComponent: () =>
      import('./components/chords-handbook/chords-handbook.component').then(
        (c) => c.ChordsHandbookComponent
      ),
  },
];
