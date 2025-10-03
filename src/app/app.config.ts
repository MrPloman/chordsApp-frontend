import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { functionSelectedReducer } from './store/reducers/function-selection.reducer';
import { chordsReducer } from './store/reducers/chords.reducer';
import { appState } from './store/state';
import { provideHttpClient } from '@angular/common/http';
import { loadingReducer } from './store/reducers/loading.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      functionSelected: functionSelectedReducer,
      chords: chordsReducer,
      loading: loadingReducer,
    }),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
