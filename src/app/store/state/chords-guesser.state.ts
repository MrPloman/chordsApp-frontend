import { Chord, NotePosition } from '@app/models/chord.model';

export interface IChordsGuesserState {
  lastNoteSelected: NotePosition | undefined;
  currentChords: Chord[] | undefined;
  chordSelected: number | undefined;
}

export const chordsGuesserInitialState: IChordsGuesserState = {
  lastNoteSelected: undefined,
  currentChords: undefined,
  chordSelected: undefined,
};
