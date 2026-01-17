import { createSelector } from '@ngrx/store';
import { IChordsGuesserState } from '../state/chords.state';

import { AppState } from '../state/index';

export const selectChordGuesserState = (appState: AppState): IChordsGuesserState => appState.chords;
export const selectCurrentChords = createSelector(selectChordGuesserState, (state) => state.currentChords);
