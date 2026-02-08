import { createAction, props } from '@ngrx/store';

// Action to initiate login
export const setLanguageAction = createAction(
  '[Set Language Action] Set Language Action',
  props<{ language: 'es' | 'en' }>()
);
