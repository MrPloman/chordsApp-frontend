import { Chord } from '@app/shared/models/chord.model';

export interface ChordsState {
  currentChords: Chord[];
  currentChordSelected: number;
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
  currentChordSelected: -1,
  alternativeChords: [],
  alternativeChordSelected: -1,
  handbookChords: [],
  handbookChordsSelected: -1,
  message: '',
  error: '',
  loading: false,
};
