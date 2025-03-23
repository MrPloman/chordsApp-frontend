import { Chord, NotePosition } from '@app/models/chord.model';

export interface IChordsGuesserState {
  lastNoteSelected: NotePosition | undefined;
  currentChords: Chord[] | undefined;
  chordSelected: Chord | undefined;
}

export const chordsGuesserState: IChordsGuesserState = {
  lastNoteSelected: undefined,
  currentChords: undefined,
  chordSelected: undefined,
};
