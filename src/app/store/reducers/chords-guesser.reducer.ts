import { Action, createReducer, on, props } from '@ngrx/store';
import {
  removeChord,
  removeNoteFromChord,
  setChordSelected,
  setCurrentChords,
} from '../actions/chords-guesser.actions';
import { chordsGuesserInitialState } from '../state/chords-guesser.state';
import { Chord, NotePosition } from '@app/models/chord.model';

export const chordsGuesserReducer = createReducer(
  chordsGuesserInitialState,
  on(setCurrentChords, (state, props) => {
    return {
      ...state,
      currentChords: props.currentChords,
    };
  }),
  on(setChordSelected, (state, props) => {
    return {
      ...state,
      chordSelected: props.chordSelected,
    };
  }),
  on(removeChord, (state, props) => {
    const chords = state.currentChords?.filter(
      (chord: Chord, index: number) => index !== props.chordToRemove && chord
    );
    return {
      ...state,
      currentChords: chords,
    };
  }),
  on(removeNoteFromChord, (state, props) => {
    if (!state.currentChords) return state;
    const newChords = state.currentChords.map(
      (chordElement: Chord, chordIndex: number) => {
        if (chordIndex !== props.chordPosition) {
          return chordElement;
        }
        const notes = chordElement.notes.filter(
          (note: NotePosition, index: number) => {
            if (props.noteToRemove !== index) return note;
            else return;
          }
        );
        return { name: chordElement.name, notes };
      }
    );

    return { ...state, currentChords: newChords };
  })
);
