import { Chord, NotePosition } from '@app/shared/models/chord.model';
import { createReducer, on } from '@ngrx/store';

import { setLocalStorage } from '@app/helpers/local-storage.helper';
import * as chordsHelper from '../../helpers/chords.helper';
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
  resetMessages,
  setAlternativeChordSelected,
  setAlternativeChordsOptionsError,
  setAlternativeChordsOptionsSuccess,
  setChordSelected,
  setCurrentChordSelectedAndCheckAlternativeChords,
  setHandbookChordsSelected,
  setWholeChordsState,
} from '../actions/chords.actions';
import { chordsInitialState, ChordsState } from '../state/chords.state';

// Helpers
function removeChordHelper(state: ChordsState, chordToRemove: number): ChordsState {
  if (!state.currentChords) return { ...state };
  const chords = state.currentChords.filter((chord: Chord, index: number) => index !== chordToRemove);
  setLocalStorage('chords', {
    ...state,
    currentChordSelected: chords.length - 1,
    currentChords: chords,
  });
  return {
    ...state,
    currentChordSelected: chords.length - 1,
    currentChords: chords,
  };
}

function cleaningChordsArray(chords: Chord[]) {
  let _currentChords = chordsHelper.getAllNoteChordName(chords);
  _currentChords = chordsHelper.checkDuplicateChords(_currentChords);
  _currentChords = chordsHelper.checkAndGenerateID(_currentChords);
  _currentChords = chordsHelper.removeNonDesiredValuesFromNotesArray(_currentChords);
  return _currentChords;
}

export const chordsReducer = createReducer(
  chordsInitialState,

  // Set Whole Chords State from Local Storage
  on(setWholeChordsState, (state, props) => {
    return {
      ...props.chords,
    };
  }),

  // Selection section
  on(setChordSelected, (state, props) => {
    if (props.currentChordSelected === state.currentChordSelected) return { ...state };
    setLocalStorage('chords', {
      ...state,
      currentChordSelected: props.currentChordSelected,
    });
    return {
      ...state,
      currentChordSelected: props.currentChordSelected,
    };
  }),
  on(addChordToCurrentChords, (state, props) => {
    const chords = chordsHelper.checkAndGenerateID([...state.currentChords, props.newChord]);
    const _currentChordSelected = chords.length - 1;
    setLocalStorage('chords', { ...state, currentChords: chords, currentChordSelected: _currentChordSelected });
    return { ...state, currentChords: chords, currentChordSelected: _currentChordSelected };
  }),
  on(removeChord, (state, props) => {
    const _state = removeChordHelper(state, props.chordToRemove);
    return { ..._state };
  }),
  on(removeNoteFromChord, (state, props) => {
    if (!state.currentChords) return state;
    const newChords = state.currentChords.map((chordElement: Chord, chordIndex: number) => {
      if (chordIndex !== props.currentChordSelected) {
        return chordElement;
      }
      const notes: NotePosition[] = chordsHelper.sortNotePosition(
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
    if (newChords[props.currentChordSelected].notes.length === 0) {
      return removeChordHelper({ ...state, currentChords: newChords }, props.currentChordSelected);
    }
    setLocalStorage('chords', { ...state, currentChords: newChords });
    return { ...state, currentChords: newChords };
  }),
  on(editNoteFromChord, (state, props) => {
    if (
      !state.currentChords ||
      state.currentChordSelected === undefined ||
      !state.currentChords[state.currentChordSelected]
    )
      return { ...state };

    // Setting variable add a note in a missing string
    let noteNotFound = true;
    let repeatedNote: NotePosition | undefined = undefined;

    // Iteration inside all the chords finding which is the chord to modify its notes
    let notesModified = state.currentChords[state.currentChordSelected].notes.map((notePosition: NotePosition) => {
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
      notesModified = chordsHelper.sortNotePosition([...notesModified, props.notePosition]);
    }
    // time to infer these notes inside the notes value of the desired chord.
    let chordsLeft = state.currentChords.map((chord: Chord, index) => {
      if (index === props.currentChordSelected) {
        return new Chord(notesModified, [], chord.name, chord._id);
      }
      return chord;
    });

    // remove chord if there are no notes inside of it
    if (notesModified.length === 0) {
      chordsLeft = chordsLeft.filter((chord, index) => index !== props.currentChordSelected);
    }

    setLocalStorage('chords', {
      ...state,
      currentChordSelected: props.currentChordSelected,
      currentChords: [...chordsLeft],
    });

    return {
      ...state,
      currentChordSelected: props.currentChordSelected,
      currentChords: [...chordsLeft],
    };
  }),
  on(changeChordsOrder, (state, props) => {
    if (!state.currentChords) return { ...state };
    let copyOfCurrentChords = Object.assign([], state.currentChords);
    const chordToMove = copyOfCurrentChords.splice(props.originChordPosition, 1)[0];
    copyOfCurrentChords.splice(props.destinationChordPosition, 0, chordToMove);

    setLocalStorage('chords', {
      ...state,
      currentChordSelected: props.destinationChordPosition,
      currentChords: copyOfCurrentChords,
    });

    return {
      ...state,
      currentChordSelected: props.destinationChordPosition,
      currentChords: copyOfCurrentChords,
    };
  }),

  // Guesser section
  on(guessCurrentChords, (state, props) => {
    setLocalStorage('chords', { ...state, loading: false });
    return { ...state, loading: true };
  }),
  on(guessCurrentChordsSuccess, (state, props) => {
    const _currentChords = chordsHelper.checkAndGenerateID(props.currentChords);
    setLocalStorage('chords', {
      ...state,
      currentChords: _currentChords,
      message: props.message,
      error: '',
      loading: false,
    });
    return { ...state, currentChords: _currentChords, message: props.message, error: '', loading: false };
  }),
  on(guessCurrentChordsError, (state, props) => {
    setLocalStorage('chords', {
      ...state,
      currentChords: state.currentChords,
      message: '',
      error: props.error,
      loading: false,
    });
    return { ...state, currentChords: state.currentChords, message: '', error: props.error, loading: false };
  }),

  // Progression Section
  on(getChordProgression, (state, props) => {
    if (!chordsHelper.checkIfChordsAreGuessed(state.currentChords))
      return { ...state, error: 'Chords not guessed yet' };
    setLocalStorage('chords', {
      ...state,
      loading: false,
    });
    return { ...state, loading: true };
  }),
  on(getChordProgressionSuccess, (state, props) => {
    const _currentChords = cleaningChordsArray(props.currentChords);
    setLocalStorage('chords', {
      ...state,
      loading: false,
      currentChords: [..._currentChords],
      message: props.clarification ? props.clarification : props.response,
      error: '',
    });
    return {
      ...state,
      loading: false,
      currentChords: [..._currentChords],
      message: props.clarification ? props.clarification : props.response,
      error: '',
    };
  }),
  on(getChordProgressionError, (state, props) => {
    setLocalStorage('chords', {
      ...state,
      loading: false,
      error: props.error,
    });
    return { ...state, loading: false, error: props.error };
  }),

  // Options section
  on(getAlternativeChordsOptions, (state, props) => {
    setLocalStorage('chords', {
      ...state,
      alternativeChords: [],
      alternativeChordSelected: -1,
      loading: false,
    });
    return { ...state, alternativeChords: [], alternativeChordSelected: -1, loading: true };
  }),
  on(setAlternativeChordsOptionsSuccess, (state, props) => {
    const _alternativeChords = cleaningChordsArray(props.alternativeChords);
    const _currentChords = state.currentChords.map((_chord: Chord, index: number) => {
      if (index === state.currentChordSelected) {
        return {
          ..._chord,
          alternativeChords: _alternativeChords,
        };
      } else return _chord;
    });
    setLocalStorage('chords', {
      ...state,
      alternativeChords: _alternativeChords,
      alternativeChordSelected: 0,
      currentChords: _currentChords,
      loading: false,
      error: '',
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
    setLocalStorage('chords', {
      ...state,
      loading: false,
      error: props.error,
    });
    return { ...state, loading: false, error: props.error };
  }),
  on(setAlternativeChordSelected, (state, props) => {
    setLocalStorage('chords', {
      ...state,
      alternativeChordSelected: props.alternativeChordSelected,
    });
    return {
      ...state,
      alternativeChordSelected: props.alternativeChordSelected,
    };
  }),
  on(exchangeChordOptionForCurrenChord, (state, props) => {
    if (
      state.currentChords.length < 0 ||
      state.alternativeChords.length < 0 ||
      state.currentChordSelected < 0 ||
      state.alternativeChordSelected < 0
    )
      return { ...state };
    let newCurrentChords = state.currentChords;
    let newAlternativeChords = state.alternativeChords;

    const currentChord = state.currentChords[state.currentChordSelected];
    const alternativeChord = state.alternativeChords[state.alternativeChordSelected];

    newCurrentChords = newCurrentChords.map((chord: Chord, position: number) => {
      if (position === state.currentChordSelected) return alternativeChord;
      else return chord;
    });
    newAlternativeChords = newAlternativeChords.map((chord: Chord, position: number) => {
      if (position === state.alternativeChordSelected) return currentChord;
      else return chord;
    });
    newCurrentChords = newCurrentChords.map((chord: Chord, index: number) => {
      if (index === state.currentChordSelected) {
        const _chord = { ...chord, alternativeChords: newAlternativeChords };
        return _chord;
      }
      return chord;
    });
    setLocalStorage('chords', {
      ...state,
      alternativeChords: newAlternativeChords,
      currentChords: newCurrentChords,
    });
    return {
      ...state,
      alternativeChords: newAlternativeChords,
      currentChords: newCurrentChords,
    };
  }),

  on(setCurrentChordSelectedAndCheckAlternativeChords, (state, props) => {
    const _alternativeChords = [...state.currentChords[props.currentChordSelected].alternativeChords];
    let _state = state;
    if (_alternativeChords.length > 0)
      _state = {
        ...state,
        alternativeChords: _alternativeChords,
        alternativeChordSelected: 0,
        currentChordSelected: props.currentChordSelected,
      };
    else
      _state = {
        ...state,
        alternativeChords: [],
        alternativeChordSelected: -1,
        currentChordSelected: props.currentChordSelected,
      };
    setLocalStorage('chords', { ..._state });
    return { ..._state };
  }),

  // Handbook section
  on(getHandbookChords, (state, props) => {
    setLocalStorage('chords', { ...state, handbookChords: [], handbookChordsSelected: -1, loading: false });
    return {
      ...state,
      handbookChords: [],
      handbookChordsSelected: -1,
      loading: true,
    };
  }),
  on(getHandbookChordsSuccess, (state, props) => {
    const _handbookChords = cleaningChordsArray(props.handbookChords);

    setLocalStorage('chords', {
      ...state,
      loading: false,
      handbookChords: _handbookChords,
      handbookChordsSelected: _handbookChords.length > 0 ? 0 : -1,
    });

    return {
      ...state,
      loading: false,
      handbookChords: _handbookChords,
      handbookChordsSelected: _handbookChords.length > 0 ? 0 : -1,
    };
  }),
  on(getHandbookChordsError, (state, props) => {
    setLocalStorage('chords', {
      ...state,
      loading: false,
      handbookChords: [],
      handbookChordsSelected: -1,
      error: props.error,
    });

    return {
      ...state,
      loading: false,
      handbookChords: [],
      handbookChordsSelected: -1,
      error: props.error,
    };
  }),
  on(setHandbookChordsSelected, (state, props) => {
    setLocalStorage('chords', {
      ...state,
      handbookChordsSelected: props.handbookChordsSelected,
    });
    return {
      ...state,
      handbookChordsSelected: props.handbookChordsSelected,
    };
  }),
  on(addHandbookChordToCurrentChords, (state, props) => {
    if (state.handbookChords.length === 0 || state.handbookChordsSelected < 0) return { ...state };
    const _currentChordSelected = state.currentChordSelected < 0 ? 0 : state.currentChordSelected;
    setLocalStorage('chords', {
      ...state,
      currentChords: [...state.currentChords, state.handbookChords[state.handbookChordsSelected]],
      currentChordSelected: _currentChordSelected,
    });
    return {
      ...state,
      currentChords: [...state.currentChords, state.handbookChords[state.handbookChordsSelected]],
      currentChordSelected: _currentChordSelected,
    };
  }),
  on(hideChord, (state, { chordPosition }) => {
    const _chords = state.currentChords?.map((_chord, index) => {
      if (index === chordPosition) return { ..._chord, visible: false };
      else return _chord;
    });
    setLocalStorage('chords', {
      ...state,
      currentChords: _chords,
    });
    return {
      ...state,
      currentChords: _chords,
    };
  }),

  // Reset Section

  on(resetMessages, (state) => {
    setLocalStorage('chords', {
      ...state,
      error: '',
      message: '',
    });
    return { ...state, error: '', message: '' };
  })
);
