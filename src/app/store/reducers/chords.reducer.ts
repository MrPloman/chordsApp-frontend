import { Chord, NotePosition } from '@app/models/chord.model';
import { createReducer, on } from '@ngrx/store';
import {
  checkAndGenerateID,
  checkDuplicateChords,
  checkIfChordsAreGuessed,
  getAllNoteChordName,
  removeNonDesiredValuesFromNotesArray,
  sortNotePosition,
} from '../../services/chordsService.service';
import {
  addChordToCurrentChords,
  addHandbookChordToCurrentChords,
  changeChordsOrder,
  editNoteFromChord,
  exchangeChordOptionForCurrenChord,
  getAlternativeChordsOptions,
  getChordProgression,
  getChordProgressionError,
  getChordProgressionSuccess,
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
  setAlternativeChordsOptionsError,
  setAlternativeChordsOptionsSuccess,
  setChordSelected,
  setCurrentChords,
  setCurrentChordSelectedAndCheckAlternativeChords,
  setHandbookChordsSelected,
} from '../actions/chords.actions';
import { chordsInitialState, ChordsState } from '../state/chords.state';

// Helpers
function removeChordHelper(state: ChordsState, chordToRemove: number): ChordsState {
  if (!state.currentChords) return { ...state };
  const chords = state.currentChords.filter((chord: Chord, index: number) => index !== chordToRemove);
  return {
    ...state,
    chordSelected: 0,
    currentChords: chords,
  };
}

function cleaningChordsArray(chords: Chord[]) {
  let _currentChords = getAllNoteChordName(chords);
  _currentChords = checkDuplicateChords(_currentChords);
  _currentChords = checkAndGenerateID(_currentChords);
  _currentChords = removeNonDesiredValuesFromNotesArray(_currentChords);
  return _currentChords;
}

export const chordsReducer = createReducer(
  chordsInitialState,

  // Selection section
  on(setCurrentChords, (state, props) => {
    const _chordsParsed = checkAndGenerateID(props.currentChords);
    return {
      ...state,
      currentChords: _chordsParsed,
    };
  }),
  on(setChordSelected, (state, props) => {
    if (props.chordSelected === state.chordSelected) return { ...state };
    return {
      ...state,
      chordSelected: props.chordSelected,
    };
  }),
  on(addChordToCurrentChords, (state, props) => {
    const _chordSelected = state.chordSelected < 0 ? 0 : state.chordSelected;
    const chords = checkAndGenerateID([...state.currentChords, props.newChord]);
    return { ...state, currentChords: chords, chordSelected: _chordSelected };
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

  // Guesser section
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

  // Progression Section
  on(getChordProgression, (state, props) => {
    if (!checkIfChordsAreGuessed(state.currentChords)) return { ...state, error: 'Chords not guessed yet' };
    return { ...state, loading: true };
  }),
  on(getChordProgressionSuccess, (state, props) => {
    const _currentChords = cleaningChordsArray(props.currentChords);
    return {
      ...state,
      loading: false,
      currentChords: [..._currentChords],
      message: props.clarification ? props.clarification : props.response,
      error: '',
    };
  }),
  on(getChordProgressionError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),

  // Options section
  on(getAlternativeChordsOptions, (state, props) => {
    // if (
    //   state.chordSelected > -1 &&
    //   state.currentChords.length > 0 &&
    //   state.currentChords[state.chordSelected].alternativeChords.length > 0
    // ) {
    //   return {
    //     ...state,
    //     alternativeChords: [...state.currentChords[state.chordSelected].alternativeChords],
    //     alternativeChordSelected: 0,
    //     loading: false,
    //   };
    // } else {
    return { ...state, alternativeChords: [], alternativeChordSelected: -1, loading: true };
  }),
  on(setAlternativeChordsOptionsSuccess, (state, props) => {
    const _alternativeChords = cleaningChordsArray(props.alternativeChords);
    const _currentChords = state.currentChords.map((_chord: Chord, index: number) => {
      if (index === state.chordSelected) {
        return {
          ..._chord,
          alternativeChords: _alternativeChords,
        };
      } else return _chord;
    });
    return {
      ...state,
      alternativeChords: _alternativeChords,
      alternativeChordSelected: 0,
      currentChords: _currentChords,
      loading: false,
      error: '',
    };
  }),
  on(setAlternativeChordsOptionsError, (state, props) => {
    return { ...state, loading: false, error: props.error };
  }),
  on(setAlternativeChordSelected, (state, props) => {
    return {
      ...state,
      alternativeChordSelected: props.alternativeChordSelected,
    };
  }),
  on(exchangeChordOptionForCurrenChord, (state, props) => {
    if (
      state.currentChords.length < 0 ||
      state.alternativeChords.length < 0 ||
      state.chordSelected < 0 ||
      state.alternativeChordSelected < 0
    )
      return { ...state };
    let newCurrentChords = state.currentChords;
    let newAlternativeChords = state.alternativeChords;

    const currentChord = state.currentChords[state.chordSelected];
    const alternativeChord = state.alternativeChords[state.alternativeChordSelected];

    newCurrentChords = newCurrentChords.map((chord: Chord, position: number) => {
      if (position === state.chordSelected) return alternativeChord;
      else return chord;
    });
    newAlternativeChords = newAlternativeChords.map((chord: Chord, position: number) => {
      if (position === state.alternativeChordSelected) return currentChord;
      else return chord;
    });
    newCurrentChords = newCurrentChords.map((chord: Chord, index: number) => {
      if (index === state.chordSelected) {
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

  on(setCurrentChordSelectedAndCheckAlternativeChords, (state, props) => {
    const _alternativeChords = [...state.currentChords[props.chordSelected].alternativeChords];
    if (_alternativeChords.length > 0)
      return {
        ...state,
        alternativeChords: _alternativeChords,
        alternativeChordSelected: 0,
        chordSelected: props.chordSelected,
      };
    else return { ...state, alternativeChords: [], alternativeChordSelected: -1, chordSelected: props.chordSelected };
  }),

  // Handbook section
  on(getHandbookChords, (state, props) => {
    return {
      ...state,
      handbookChords: [],
      handbookChordsSelected: -1,
      loading: true,
    };
  }),
  on(getHandbookChordsSuccess, (state, props) => {
    const _handbookChords = cleaningChordsArray(props.handbookChords);

    return {
      ...state,
      loading: false,
      handbookChords: _handbookChords,
      handbookChordsSelected: _handbookChords.length > 0 ? 0 : -1,
    };
  }),
  on(getHandbookChordsError, (state, props) => {
    return {
      ...state,
      loading: false,
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
    const _chordSelected = state.chordSelected < 0 ? 0 : state.chordSelected;

    return {
      ...state,
      currentChords: [...state.currentChords, state.handbookChords[state.handbookChordsSelected]],
      chordSelected: _chordSelected,
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
