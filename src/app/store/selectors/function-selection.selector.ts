import { createSelector } from '@ngrx/store';

export const selectFunctionSelectedState = (state: { option: string }) => state;

export const selectFunctionSelected = createSelector(
  selectFunctionSelectedState,
  (functionSelectedState) => functionSelectedState
);
