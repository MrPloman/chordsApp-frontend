import { chordsInitialState, ChordsState } from '../../application/chords/store/chords.state';
import { languageInitialState } from './language/language.state';

export interface AppState {
  chords: ChordsState;
  language: 'es' | 'en';
}

export const appState: AppState = {
  chords: chordsInitialState,
  language: languageInitialState,
};
