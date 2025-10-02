import { createAction, props } from '@ngrx/store';

// Action to initiate login
export const loadingStatus = createAction(
  '[Loading Status] Set/Unset Loading',
  props<{ loading: boolean }>()
);
