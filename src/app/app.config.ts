import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AIHttpInterceptor } from 'interceptors/AiHttpInterceptor.interceptor';
import { routes } from './app.routes';
import { ChordsEffects } from './store/effects/chords.effect';
import { chordsReducer } from './store/reducers/chords.reducer';
import { languageReducer } from './store/reducers/language.reducer';
import { loadingReducer } from './store/reducers/loading.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AIHttpInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideStore({
      chords: chordsReducer,
      loading: loadingReducer,
      language: languageReducer,
    }),

    provideEffects([ChordsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
