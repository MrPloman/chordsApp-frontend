import { createSelector } from '@ngrx/store';

export const selectLoadingState = (state: { loading: boolean }) => state;

export const selectLoading = createSelector(
  selectLoadingState,
  (selectLoadingState) => selectLoadingState
);
