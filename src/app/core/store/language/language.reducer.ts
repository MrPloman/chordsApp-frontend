import { createReducer, on } from '@ngrx/store';

import { setLocalStorage } from '@app/shared/helpers/local-storage.helper';
import { setLanguageAction } from './language.actions';
import { languageInitialState } from './language.state';
export const languageReducer = createReducer(
  languageInitialState,
  on(setLanguageAction, (state, props) => {
    const option = props.language;
    setLocalStorage('language', option ? option : 'en');
    return option;
  })
);
