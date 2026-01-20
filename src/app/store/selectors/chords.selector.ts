import { createSelector } from '@ngrx/store';
import { ChordsState } from '../state/chords.state';

import { AppState } from '../state/index';

export const selectChordState = (appState: AppState): ChordsState => appState.chords;
export const selectCurrentChords = createSelector(selectChordState, (state) => state.currentChords);
export const selectHandbookChords = createSelector(selectChordState, (state) => state.handbookChords);
export const selectAlternativeChords = createSelector(selectChordState, (state) => state.alternativeChords);
export const selectLoading = createSelector(selectChordState, (state) => state.loading);
export const selectAlternativeChordsParams = createSelector(selectChordState, (state) => {
  (state.currentChords, state.chordSelected);
});
export const selectHasAlternativeChordsForSelected = createSelector(
  selectChordState,
  (state) =>
    state.chordSelected > -1 &&
    state.currentChords.length > 0 &&
    state.currentChords[state.chordSelected]?.alternativeChords?.length > 0
);
