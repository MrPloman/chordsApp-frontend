import { ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AIHttpInterceptor } from '@app/interceptors/AiHttpInterceptor.interceptor';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateModule } from '@ngx-translate/core';
import { routes } from './app.routes';
import { chordsReducer } from './store/reducers/chords.reducer';
import { languageReducer } from './store/reducers/language.reducer';
import { loadingReducer } from './store/reducers/loading.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslateModule.forRoot()),

    provideHttpClient(withInterceptors([AIHttpInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideStore({
      chords: chordsReducer,
      loading: loadingReducer,
      language: languageReducer,
    }),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
