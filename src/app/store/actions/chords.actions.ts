import { Chord, NotePosition } from '@app/models/chord.model';
import { createAction, props } from '@ngrx/store';

// Set Chords
export const setLastNoteSelected = createAction(
  '[Set Last Note Selected] Set Last Note Selected',
  props<{ note: NotePosition }>()
);
export const setCurrentChords = createAction(
  '[Set Current Chords] Set Current Chords',
  props<{ currentChords: Chord[] }>()
);
export const setChordSelected = createAction(
  '[Set Chord selected] Set Chord Selected',
  props<{ chordSelected: number }>()
);
export const addChordToCurrentChords = createAction(
  '[Add Current Chord] Add Current Chord',
  props<{ newChord: Chord }>()
);
export const removeChord = createAction('[Remove Chord] Remove Chord', props<{ chordToRemove: number }>());
export const removeNoteFromChord = createAction(
  '[Remove Note From Chord] Remove Note From Chord',
  props<{ noteToRemove: number; chordSelected: number }>()
);
export const editNoteFromChord = createAction(
  '[Edit Note From Chord] Edit Note From Chord',
  props<{ notePosition: NotePosition; chordSelected: number }>()
);
export const changeChordsOrder = createAction(
  '[Change Chords Order] Change Chords Order',
  props<{ originChordPosition: number; destinationChordPosition: number }>()
);
export const hideChord = createAction('[Hide Chord]', props<{ chordPosition: number }>());

// Guess Actions
export const guessCurrentChords = createAction('[Guess Current Chords] Guess Current Chords');
export const guessCurrentChordsSuccess = createAction(
  '[Guess Current Chords Success] Guess Current Chords',
  props<{ currentChords: Chord[]; message: string }>()
);
export const guessCurrentChordsError = createAction(
  '[Guess Current Chords Success] Guess Current Chords',
  props<{ currentChords: Chord[]; error: string }>()
);

// Progression Section
export const getChordProgression = createAction('[Make a chords progression]', props<{ prompt: string }>());
export const getChordProgressionSuccess = createAction(
  '[Make a chords progression Success]',
  props<{ currentChords: Chord[]; clarification: string; response: string }>()
);
export const getChordProgressionError = createAction(
  '[Make a chords progression Error]',
  props<{ currentChords: Chord[]; error: string }>()
);

// Alternative section
export const getAlternativeChordsOptions = createAction('[Get Alternative Chords for a Chord] Get Alternative Chords');
export const setAlternativeChordsOptionsSuccess = createAction(
  '[Set Alternative Chords for a Chord Success] Set Alternative Chords Success',
  props<{ alternativeChords: Chord[] }>()
);
export const setAlternativeChordsOptionsError = createAction(
  '[Set Alternative Chords for a Chord Error] Set Alternative Chords Error'
);
export const setAlternativeChordSelected = createAction(
  '[Set Alternative Chord Selected] Set Alternative Chord Selected',
  props<{ alternativeChordSelected: number }>()
);
export const exchangeChordOptionForCurrenChord = createAction(
  '[Exchange Current Chord for Option Chord] Exchange Chords',
  props<{ chordSelected: number; alternativeChordSelected: number }>()
);

// Handbook Section
export const getHandbookChords = createAction('[Get Handbook]', props<{ chordName: string }>());
export const getHandbookChordsSuccess = createAction(
  '[Get Handbook Chords Success]',
  props<{ handbookChords: Chord[] }>()
);
export const getHandbookChordsError = createAction('[Get Handbooks Error]', props<{ error: string }>());

export const setHandbookChordsSelected = createAction(
  '[Set Handbook Selected]',
  props<{ handbookChordsSelected: number }>()
);
export const addHandbookChordToCurrentChords = createAction('[Add New Handbook to Current Chords]');
