import { createReducer, on, props } from '@ngrx/store';

import { languageInitialState } from '../state/language.state';
import { setLanguageAction } from '../actions/language.actions';

export const languageReducer = createReducer(
  languageInitialState,
  on(setLanguageAction, (state, props) => {
    const option = props.language;
    return option;
  })
);
