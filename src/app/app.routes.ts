import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'guesser',
    loadComponent: () =>
      import('./components/chords-guesser/chords-guesser.component').then(
        (c) => c.ChordsGuesserComponent
      ),
  },
];
