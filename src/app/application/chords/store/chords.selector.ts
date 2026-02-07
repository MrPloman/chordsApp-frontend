import { minimumChordsToMakeProgression } from '@app/core/constants/rules';
import { ChordsService } from '@app/domain/chords/services/chords.service';
import { AppState } from '@app/store';
import { createSelector } from '@ngrx/store';
import { ChordsState } from './chords.state';

const chordsService = new ChordsService();

export const selectChordState = (appState: AppState): ChordsState => appState.chords;
export const selectCurrentChords = createSelector(selectChordState, (state) => state.currentChords);
export const selectHandbookChords = createSelector(selectChordState, (state) => state.handbookChords);
export const selectAlternativeChords = createSelector(selectChordState, (state) => state.alternativeChords);
export const selectLoading = createSelector(selectChordState, (state) => state.loading);
export const selectAlternativeChordsParams = createSelector(selectChordState, (state) => {
  (state.currentChords, state.currentChordSelected);
});
export const selectHasAlternativeChordsForSelected = createSelector(
  selectChordState,
  (state) =>
    state.currentChordSelected > -1 &&
    state.currentChords.length > 0 &&
    state.currentChords[state.currentChordSelected]?.alternativeChords?.length > 0
);

export const selectMinimumChordsStatus = createSelector(
  selectChordState,
  (state) => state.currentChords.length >= minimumChordsToMakeProgression
);

export const selectAllowedForProgression = createSelector(
  selectChordState,
  (state) =>
    state.currentChords.length >= minimumChordsToMakeProgression &&
    !chordsService.chordsNamesAreUnknown(state.currentChords) &&
    chordsService.checkIfChordsAreGuessed(state.currentChords)
);
export const selectChordsAreGuessed = createSelector(
  selectChordState,
  (state) =>
    !chordsService.chordsNamesAreUnknown(state.currentChords) &&
    chordsService.checkIfChordsAreGuessed(state.currentChords)
);
