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
  props<{ chordSelected: Chord }>()
);
