import { chordsInitialState, ChordsState } from './chords.state';
import { languageInitialState } from './language.state';

export interface AppState {
  chords: ChordsState;
  language: 'es' | 'en';
}

export const appState: AppState = {
  chords: chordsInitialState,
  language: languageInitialState,
};
