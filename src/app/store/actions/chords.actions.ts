import { Chord, NotePosition } from '@app/models/chord.model';
import { createAction, props } from '@ngrx/store';
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
export const setAlternativeChordsOptions = createAction(
  '[Set Alternative Chords for a Chord] Set Alternative Chords',
  props<{ alternativeChords: Chord[] }>()
);
export const setAlternativeChordSelected = createAction(
  '[Set Alternative Chord Selected] Set Alternative Chord Selected',
  props<{ alternativeChordSelected: number }>()
);
export const exchangeChordOptionForCurrenChord = createAction(
  '[Exchange Current Chord for Option Chord] Exchange Chords',
  props<{ chordSelected: number; alternativeChordSelected: number }>()
);
export const setHandbookChords = createAction('[Set Handbook]', props<{ chords: Chord[] }>());
export const setHandbookChordsSelected = createAction(
  '[Set Handbook Selected]',
  props<{ handbookChordsSelected: number }>()
);
export const addHandbookChordToCurrentChords = createAction('[Add New Handbook to Current Chords]');
export const hideChord = createAction('[Hide Chord]', props<{ chordPosition: number }>());
