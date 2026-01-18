import { Chord, NotePosition } from '@app/models/chord.model';

export interface ChordsState {
  lastNoteSelected: NotePosition | undefined;
  currentChords: Chord[];
  chordSelected: number | undefined;
  alternativeChords: Chord[] | undefined;
  alternativeChordSelected: number | undefined;
  handbookChords: Chord[];
  handbookChordsSelected: number;
  message: string;
  error: string;
  loading: boolean;
}

export const chordsInitialState: ChordsState = {
  lastNoteSelected: undefined,
  currentChords: [],
  chordSelected: undefined,
  alternativeChords: undefined,
  alternativeChordSelected: undefined,
  handbookChords: [],
  handbookChordsSelected: -1,
  message: '',
  error: '',
  loading: false,
};
