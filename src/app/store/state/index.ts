import { languageInitialState } from '../../core/store/language/language.state';
import { chordsInitialState, ChordsState } from './chords.state';

export interface AppState {
  chords: ChordsState;
  language: 'es' | 'en';
}

export const appState: AppState = {
  chords: chordsInitialState,
  language: languageInitialState,
};
