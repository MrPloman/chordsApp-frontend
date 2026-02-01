import { Chord } from '@app/shared/models/chord.model';

export interface ChordsFeatureState {
  workspace: ChordsWorkspaceState;
  handbook: HandbookState;
}
export interface ChordsWorkspaceState {
  currentChords: Chord[];
  currentChordSelected: number;
  alternativeChords: Chord[];
  alternativeChordSelected: number;
}
export interface HandbookState {
  handbookChords: Chord[];
  handbookChordsSelected: number;
}

export const ChordsFeatureInitialState: ChordsFeatureState = {
  workspace: {
    currentChords: [],
    currentChordSelected: -1,
    alternativeChords: [],
    alternativeChordSelected: -1,
  },
  handbook: {
    handbookChords: [],
    handbookChordsSelected: -1,
  },
};
