import { createSelector } from '@ngrx/store';
import { ChordsState } from '../state/chords.state';

import { AppState } from '../state/index';

export const selectChordState = (appState: AppState): ChordsState => appState.chords;
export const selectCurrentChords = createSelector(selectChordState, (state) => state.currentChords);
export const selectHandbookChords = createSelector(selectChordState, (state) => state.handbookChords);
export const selectAlternativeChords = createSelector(selectChordState, (state) => state.alternativeChords);
export const selectLoading = createSelector(selectChordState, (state) => state.loading);
