import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { functionSelectedReducer } from './store/reducers/function-selection.reducer';
import { chordsReducer } from './store/reducers/chords.reducer';
import { provideHttpClient } from '@angular/common/http';
import { loadingReducer } from './store/reducers/loading.reducer';
import { provideAnimations } from '@angular/platform-browser/animations'; // Add this line
import { languageReducer } from './store/reducers/language.reducer';
import { IconService } from './services/iconService.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideStore({
      functionSelected: functionSelectedReducer,
      chords: chordsReducer,
      loading: loadingReducer,
      language: languageReducer,
    }),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimations(), // Add this function
  ],
};
