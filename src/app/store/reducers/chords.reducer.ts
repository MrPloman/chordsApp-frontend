import { Chord, NotePosition } from '@app/models/chord.model';
import { createReducer, on } from '@ngrx/store';
import { checkAndGenerateID, sortNotePosition } from '../../services/chordsService.service';
import {
  addChordToCurrentChords,
  addHandbookChordToCurrentChords,
  changeChordsOrder,
  editNoteFromChord,
  exchangeChordOptionForCurrenChord,
  getHandbookChords,
  getHandbookChordsError,
  getHandbookChordsSuccess,
  guessCurrentChords,
  guessCurrentChordsError,
  guessCurrentChordsSuccess,
  hideChord,
  removeChord,
  removeNoteFromChord,
  setAlternativeChordSelected,
  setAlternativeChordsOptionsSuccess,
  setChordSelected,
  setCurrentChords,
  setHandbookChordsSelected,
} from '../actions/chords.actions';
import { chordsInitialState, ChordsState } from '../state/chords.state';

function removeChordHelper(state: ChordsState, chordToRemove: number): ChordsState {
  if (!state.currentChords) return { ...state };
  const chords = state.currentChords.filter((chord: Chord, index: number) => index !== chordToRemove);
  return {
    ...state,
    chordSelected: 0,
    currentChords: chords,
  };
}

export const chordsReducer = createReducer(
  chordsInitialState,
  // Guesser and Progression section
  on(setCurrentChords, (state, props) => {
    const _chordsParsed = checkAndGenerateID(props.currentChords);
    return {
      ...state,
      currentChords: _chordsParsed,
    };
  }),
  on(guessCurrentChords, (state, props) => {
    return { ...state, loading: true };
  }),
  on(guessCurrentChordsSuccess, (state, props) => {
    const _currentChords = checkAndGenerateID(props.currentChords);
    return { ...state, currentChords: _currentChords, message: props.message, error: '', loading: false };
  }),
  on(guessCurrentChordsError, (state, props) => {
    return { ...state, currentChords: state.currentChords, message: '', error: props.error, loading: false };
  }),
  on(setChordSelected, (state, props) => {
    if (props.chordSelected === state.chordSelected) return { ...state };
    return {
      ...state,
      chordSelected: props.chordSelected,
    };
  }),
  on(addChordToCurrentChords, (state, props) => {
    const chords = checkAndGenerateID([...state.currentChords, props.newChord]);
    return { ...state, currentChords: chords, chordSelected: chords.length - 1 };
  }),
  on(removeChord, (state, props) => {
    return removeChordHelper(state, props.chordToRemove);
  }),
  on(removeNoteFromChord, (state, props) => {
    if (!state.currentChords) return state;
    const newChords = state.currentChords.map((chordElement: Chord, chordIndex: number) => {
      if (chordIndex !== props.chordSelected) {
        return chordElement;
      }
      const notes: NotePosition[] = sortNotePosition(
        chordElement.notes.filter((note: NotePosition, index: number) => {
          if (props.noteToRemove !== index) return note;
          else return;
        })
      );

      return {
        ...chordElement,
        name: chordElement.name,
        notes,
        _id: chordElement._id,
      };
    });
    if (newChords[props.chordSelected].notes.length === 0) {
      return removeChordHelper({ ...state, currentChords: newChords }, props.chordSelected);
    }

    return { ...state, currentChords: newChords };
  }),
  on(editNoteFromChord, (state, props) => {
    if (!state.currentChords || state.chordSelected === undefined || !state.currentChords[state.chordSelected])
      return { ...state };

    // Setting variable add a note in a missing string
    let noteNotFound = true;
    let repeatedNote: NotePosition | undefined = undefined;

    // Iteration inside all the chords finding which is the chord to modify its notes
    let notesModified = state.currentChords[state.chordSelected].notes.map((notePosition: NotePosition) => {
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
      return new NotePosition(notePosition.stringNumber, notePosition.position, notePosition.name, notePosition._id);
    });

    // unselect note already selected, time to remove the repeatedNote from inside the array.
    if (repeatedNote !== undefined) {
      notesModified = notesModified.filter((note) => {
        if (
          repeatedNote &&
          note.position === repeatedNote.position &&
          note.stringNumber === repeatedNote.stringNumber &&
          note.name === repeatedNote.name
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
        return new Chord(notesModified, [], chord.name, chord._id);
      }
      return chord;
    });

    // remove chord if there are no notes inside of it
    if (notesModified.length === 0) {
      chordsLeft = chordsLeft.filter((chord, index) => index !== props.chordSelected);
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
    const chordToMove = copyOfCurrentChords.splice(props.originChordPosition, 1)[0];
    copyOfCurrentChords.splice(props.destinationChordPosition, 0, chordToMove);

    return {
      ...state,
      chordSelected: props.destinationChordPosition,
      currentChords: copyOfCurrentChords,
    };
  }),

  // Options section
  on(setAlternativeChordsOptionsSuccess, (state, props) => {
    let _alternativeChords = checkAndGenerateID(props.alternativeChords);
    _alternativeChords = _alternativeChords.map((chord: Chord) => {
      if (chord.notes.length === 0) return chord;
      else {
        return { ...chord, notes: sortNotePosition(chord.notes) };
      }
    });
    const _selectedChord = state.chordSelected;
    let _currentChords = state.currentChords ? state.currentChords : [];
    _currentChords = _currentChords.map((_chord: Chord, index: number) => {
      if (index === _selectedChord) {
        return {
          ..._chord,
          alternativeChords: _alternativeChords,
        };
      } else return _chord;
    });
    return {
      ...state,
      currentChords: _currentChords,
      alternativeChords: _alternativeChords,
      alternativeChordSelected: 0,
    };
  }),
  on(setAlternativeChordSelected, (state, props) => {
    return {
      ...state,
      alternativeChordSelected: props.alternativeChordSelected,
    };
  }),
  on(exchangeChordOptionForCurrenChord, (state, props) => {
    let newCurrentChords = state.currentChords ? state.currentChords : [];
    let newAlternativeChords = state.alternativeChords ? state.alternativeChords : [];

    const currentChordSelected = props.chordSelected;
    const alternativeChordSelected = props.alternativeChordSelected;

    const currentChord = newCurrentChords[currentChordSelected];
    const alternativeChord = newAlternativeChords[alternativeChordSelected];

    newCurrentChords = newCurrentChords.map((chord: Chord, position: number) => {
      if (position === currentChordSelected) return alternativeChord;
      else return chord;
    });
    newAlternativeChords = newAlternativeChords.map((chord: Chord, position: number) => {
      if (position === alternativeChordSelected) return currentChord;
      else return chord;
    });
    newCurrentChords = newCurrentChords.map((chord: Chord, index: number) => {
      if (index === currentChordSelected) {
        const _chord = { ...chord, alternativeChords: newAlternativeChords };
        return _chord;
      }
      return chord;
    });

    return {
      ...state,
      alternativeChords: newAlternativeChords,
      currentChords: newCurrentChords,
    };
  }),

  // Handbook section
  on(getHandbookChords, (state, props) => {
    return {
      ...state,
    };
  }),
  on(getHandbookChordsSuccess, (state, props) => {
    return {
      ...state,
      handbookChords: props.handbookChords,
      handbookChordsSelected: props.handbookChords.length > 0 ? 0 : -1,
    };
  }),
  on(getHandbookChordsError, (state, props) => {
    return {
      ...state,
      handbookChords: [],
      handbookChordsSelected: -1,
      error: props.error,
    };
  }),
  on(setHandbookChordsSelected, (state, props) => {
    return {
      ...state,
      handbookChordsSelected: props.handbookChordsSelected,
    };
  }),
  on(addHandbookChordToCurrentChords, (state, props) => {
    if (state.handbookChords.length === 0 || state.handbookChordsSelected < 0) return { ...state };

    return {
      ...state,
      currentChords: [...state.currentChords, state.handbookChords[state.handbookChordsSelected]],
    };
  }),
  on(hideChord, (state, { chordPosition }) => {
    const _chords = state.currentChords?.map((_chord, index) => {
      if (index === chordPosition) return { ..._chord, visible: false };
      else return _chord;
    });
    return {
      ...state,
      currentChords: _chords,
    };
  })
);
