import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AIHttpInterceptor } from '@app/core/interceptors/AiHttpInterceptor.interceptor';
import { CHORDS_AI_PORT } from '@app/domain/chords/ports/chords.ports';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { ChordsEffects } from './application/chords/store/chords.effect';
import { chordsReducer } from './application/chords/store/chords.reducer';
import { languageReducer } from './core/store/language/language.reducer';
import { AIService } from './infrastructure/chords/chords-ai.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: CHORDS_AI_PORT, useClass: AIService },

    provideHttpClient(withInterceptors([AIHttpInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideStore({
      chords: chordsReducer,
      language: languageReducer,
    }),
    provideEffects([ChordsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
