import { Chord } from '@app/models/chord.model';

export interface ChordsState {
  currentChords: Chord[];
  chordSelected: number;
  alternativeChords: Chord[];
  alternativeChordSelected: number;
  handbookChords: Chord[];
  handbookChordsSelected: number;
  message: string;
  error: string;
  loading: boolean;
}

export const chordsInitialState: ChordsState = {
  currentChords: [],
  chordSelected: -1,
  alternativeChords: [],
  alternativeChordSelected: -1,
  handbookChords: [],
  handbookChordsSelected: -1,
  message: '',
  error: '',
  loading: false,
};
