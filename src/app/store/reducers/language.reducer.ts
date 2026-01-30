import { createReducer, on } from '@ngrx/store';

import { setLocalStorage } from '@app/helpers/local-storage.helper';
import { setLanguageAction } from '../actions/language.actions';
import { languageInitialState } from '../state/language.state';
export const languageReducer = createReducer(
  languageInitialState,
  on(setLanguageAction, (state, props) => {
    const option = props.language;
    setLocalStorage('language', option ? option : 'en');
    return option;
  })
);
