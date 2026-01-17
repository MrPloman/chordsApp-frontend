import { chordsInitialState } from './chords.state';
import { languageInitialState } from './language.state';
import { loadingInitialState } from './loading.state';

export const appState = {
  chords: chordsInitialState,
  loading: loadingInitialState,
  language: languageInitialState,
};
