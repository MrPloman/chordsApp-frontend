import { createSelector } from '@ngrx/store';
import { IChordsGuesserState } from '../state/chords.state';

export const selectChordGuesserState = (state: {
  chords: IChordsGuesserState;
}) => state.chords;

export const selectChordGuesser = createSelector(
  selectChordGuesserState,
  (chordsState) => chordsState
);
