import { createSelector } from '@ngrx/store';
import { IChordsGuesserState } from '../state/chords-guesser.state';

export const selectChordGuesserState = (state: {
  chordsGuesser: IChordsGuesserState;
}) => state.chordsGuesser;

export const selectChordGuesser = createSelector(
  selectChordGuesserState,
  (chordsGuesserState) => chordsGuesserState
);
