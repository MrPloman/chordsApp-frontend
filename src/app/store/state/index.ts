import { chordsInitialState } from './chords.state';
import { loadingInitialState } from './loading.state';
import { languageInitialState } from './language.state';

export const appState = {
  chords: chordsInitialState,
  loading: loadingInitialState,
  language: 'en',
};
