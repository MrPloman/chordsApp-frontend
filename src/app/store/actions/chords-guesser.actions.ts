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
export const removeChord = createAction(
  '[Remove Chord] Remove Chord',
  props<{ chordToRemove: number }>()
);
export const removeNoteFromChord = createAction(
  '[Remove Note From Chord] Remove Note From Chord',
  props<{ noteToRemove: number; chordSelected: number }>()
);
export const editNoteFromChord = createAction(
  '[Edit Note From Chord] Edit Note From Chord',
  props<{ notePosition: NotePosition; chordSelected: number }>()
);
