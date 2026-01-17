import { chordsInitialState, IChordsGuesserState } from './chords.state';
import { languageInitialState } from './language.state';
import { loadingInitialState } from './loading.state';

export interface AppState {
  chords: IChordsGuesserState;
  loading: boolean;
  language: 'es' | 'en';
}

export const appState: AppState = {
  chords: chordsInitialState,
  loading: loadingInitialState,
  language: languageInitialState,
};
