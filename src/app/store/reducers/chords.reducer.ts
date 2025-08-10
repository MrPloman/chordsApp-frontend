import { Action, createReducer, on, props } from '@ngrx/store';
import {
  changeChordsOrder,
  editNoteFromChord,
  removeChord,
  removeNoteFromChord,
  setChordSelected,
  setCurrentChords,
} from '../actions/chords.actions';
import { chordsInitialState } from '../state/chords.state';
import { Chord, NotePosition } from '@app/models/chord.model';
import {
  sortNotePosition,
  removeNoteFromChordArray,
} from '../../services/chordsService.service';

export const chordsReducer = createReducer(
  chordsInitialState,
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
    if (!state.currentChords) return { ...state };
    const chords = state.currentChords.filter(
      (chord: Chord, index: number) => index !== props.chordToRemove && chord
    );
    return {
      ...state,
      chordSelected: 0,
      currentChords: chords,
    };
  }),
  on(removeNoteFromChord, (state, props) => {
    if (!state.currentChords) return state;
    const newChords = state.currentChords.map(
      (chordElement: Chord, chordIndex: number) => {
        if (chordIndex !== props.chordSelected) {
          return chordElement;
        }
        const notes: NotePosition[] = sortNotePosition(
          chordElement.notes.filter((note: NotePosition, index: number) => {
            if (props.noteToRemove !== index) return note;
            else return;
          })
        );
        return { name: chordElement.name, notes };
      }
    );

    return { ...state, currentChords: newChords };
  }),
  on(editNoteFromChord, (state, props) => {
    if (!state.currentChords || state.chordSelected === undefined)
      return { ...state };

    // Setting variable add a note in a missing string
    let noteNotFound = true;

    // Iteration inside all the chords finding which is the chord to modify its notes
    let notesModified = state.currentChords[state.chordSelected].notes.filter(
      (notePosition: NotePosition) => {
        console.log(notePosition, props.notePosition);

        // checking every string if they are supposed to be modified
        if (notePosition.stringNumber === props.notePosition.stringNumber) {
          notePosition = props.notePosition;
          noteNotFound = false;
        }

        if (
          notePosition.stringNumber === props.notePosition.stringNumber &&
          notePosition.position !== props.notePosition.position
        ) {
          // it is required to create new NotePosition EVERYTIME, in order to avoid mutability of elements in NGRX
          //
          return new NotePosition(
            notePosition.stringNumber,
            notePosition.position,
            notePosition.name
          );
        } else return;
      }
    );

    // If we did not find the note to modify we have to add the new one nad sort it
    if (noteNotFound) {
      notesModified = sortNotePosition([...notesModified, props.notePosition]);
    } else {
      // if (sameNotePositionInTheSameString) {
      //   notesModified = removeNoteFromChordArray(
      //     notesModified,
      //     props.notePosition.stringNumber - 1
      //   );
      // }
      // if (
      //   state.lastNoteSelected &&
      //   state.lastNoteSelected === props.notePosition
      // ) {
      //   notesModified = removeNoteFromChordArray(
      //     notesModified,
      //     props.notePosition.stringNumber - 1
      //   );
      //   notesModified = sortNotePosition([...notesModified]);
      // }
    }

    // time to infer these notes inside the notes value of the desired chord.
    const chordsLeft = state.currentChords.map((chord: Chord, index) => {
      if (index === props.chordSelected) {
        return new Chord(notesModified, chord.name);
      }
      return chord;
    });
    // Unselection mode, remove the note selected twice from the chord array structure
    // if (
    //   state.lastNoteSelected &&
    //   state.lastNoteSelected === props.notePosition
    // ) {
    //   const chordsModifiedWithUnselectedNote = chordsLeft.map()
    //   return {
    //     ...state,
    //     chordSelected: props.chordSelected,
    //     currentChords: [],
    //     lastNoteSelected: undefined,
    //   };
    // } else {
    return {
      ...state,
      chordSelected: props.chordSelected,
      currentChords: [...chordsLeft],
      lastNoteSelected: props.notePosition,
    };
  }),
  on(changeChordsOrder, (state, props) => {
    if (!state.currentChords) return { ...state };
    let copyOfCurrentChords = Object.assign([], state.currentChords);
    const chordToMove = copyOfCurrentChords.splice(
      props.originChordPosition,
      1
    )[0];
    copyOfCurrentChords.splice(props.destinationChordPosition, 0, chordToMove);

    return {
      ...state,
      chordSelected: props.destinationChordPosition,
      currentChords: copyOfCurrentChords,
    };
  })
);
