import { createSelector } from '@ngrx/store';

export const selectLanguageState = (state: { language: 'es' | 'en' }) =>
  state.language;

export const selectLanguage = createSelector(
  selectLanguageState,
  (languageState) => languageState
);
