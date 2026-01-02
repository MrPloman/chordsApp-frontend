import { Chord, NotePosition } from '@app/models/chord.model';

export interface IChordsGuesserState {
  lastNoteSelected: NotePosition | undefined;
  currentChords: Chord[] | undefined;
  chordSelected: number | undefined;
  alternativeChords: Chord[] | undefined;
  alternativeChordSelected: number | undefined;
  handbookChords: Chord[] | undefined;
  handbookChordsSelected: undefined | number;
}

export const chordsInitialState: IChordsGuesserState = {
  lastNoteSelected: undefined,
  currentChords: undefined,
  chordSelected: undefined,
  alternativeChords: undefined,
  alternativeChordSelected: undefined,
  handbookChords: undefined,
  handbookChordsSelected: undefined,
};
