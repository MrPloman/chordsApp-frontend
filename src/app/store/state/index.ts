import { chordsInitialState } from './chords.state';
import { functionSelectionInitialState } from './function-selection.state';
import { loadingInitialState } from './loading.state';
import { languageInitialState } from './language.state';

export const appState = {
  chords: chordsInitialState,
  functionSelected: functionSelectionInitialState,
  loading: loadingInitialState,
  language: 'en',
};
