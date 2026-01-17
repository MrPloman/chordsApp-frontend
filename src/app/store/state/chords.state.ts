import { Chord, NotePosition } from '@app/models/chord.model';

export interface IChordsGuesserState {
  lastNoteSelected: NotePosition | undefined;
  currentChords: Chord[];
  chordSelected: number | undefined;
  alternativeChords: Chord[] | undefined;
  alternativeChordSelected: number | undefined;
  handbookChords: Chord[] | undefined;
  handbookChordsSelected: undefined | number;
}

export const chordsInitialState: IChordsGuesserState = {
  lastNoteSelected: undefined,
  currentChords: [],
  chordSelected: undefined,
  alternativeChords: undefined,
  alternativeChordSelected: undefined,
  handbookChords: undefined,
  handbookChordsSelected: undefined,
};
