import { createAction, props } from '@ngrx/store';

// Action to initiate login
export const selectOptionAction = createAction(
  '[Function Selection] Select Function Action',
  props<{ option: 'guesser' | 'progression' | 'options' }>()
);

// Action to handle failed login
export const resetSelectionAction = createAction(
  '[Function Selection] Reset Function Selection'
);
