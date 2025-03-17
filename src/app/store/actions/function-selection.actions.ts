import { createAction } from '@ngrx/store';

// Action to initiate login
export const guessChordAction = createAction(
  '[Function Selection] Guess Chord Action'
);

// Action to handle successful login
export const createProgressionAction = createAction(
  '[Function Selection] Create Chord Progression'
);

// Action to handle failed login
export const resetSelectionAction = createAction(
  '[Function Selection] Reset Function Selection'
);
