import { createSelector } from '@ngrx/store';
import { IFunctionSelectionState } from '../state/function-selection.state';

export const selectFunctionSelectedState = (state: { option: string }) => state;

export const selectFunctionSelected = createSelector(
  selectFunctionSelectedState,
  (functionSelectedState) => functionSelectedState
);
