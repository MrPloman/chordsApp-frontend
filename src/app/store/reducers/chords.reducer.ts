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
    let repeatedNote: NotePosition | undefined = undefined;

    // Iteration inside all the chords finding which is the chord to modify its notes
    let notesModified = state.currentChords[state.chordSelected].notes.map(
      (notePosition: NotePosition) => {
        // checking every string if they are supposed to be modified
        if (notePosition.stringNumber === props.notePosition.stringNumber) {
          // setting this variable because means the string has a note position inside the chord array, otherwise the chord array would not have any object with that stringnumber
          noteNotFound = false;
          // If the string has the same position previously we have to set the variable repeatedNote with that value
          if (notePosition.position === props.notePosition.position) {
            repeatedNote = props.notePosition;
          } else {
            notePosition = props.notePosition;
          }
        }

        // it is required to create new NotePosition EVERYTIME, in order to avoid mutability of elements in NGRX
        return new NotePosition(
          notePosition.stringNumber,
          notePosition.position,
          notePosition.name
        );
      }
    );

    // unselect note already selected, time to remove the repeatedNote from inside the array.
    if (repeatedNote !== undefined) {
      notesModified = notesModified.filter((note) => {
        if (
          note.position === repeatedNote?.position &&
          note.stringNumber === repeatedNote?.stringNumber &&
          note.name === repeatedNote?.name
        ) {
          return;
        } else return note;
      });
    }

    // If we did not find the note to modify we have sort it because the new one was added at the end of the array.
    if (noteNotFound) {
      notesModified = sortNotePosition([...notesModified, props.notePosition]);
    }
    // time to infer these notes inside the notes value of the desired chord.
    let chordsLeft = state.currentChords.map((chord: Chord, index) => {
      if (index === props.chordSelected) {
        return new Chord(notesModified, chord.name);
      }
      return chord;
    });

    // remove chord if there are no notes inside of it
    if (notesModified.length === 0) {
      chordsLeft = chordsLeft.filter(
        (chord, index) => index !== props.chordSelected
      );
    }

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
