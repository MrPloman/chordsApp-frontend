import { inject, Injectable } from '@angular/core';
import { AIService } from '@app/services/AIService.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, from, map, of, switchMap, withLatestFrom } from 'rxjs';
import {
  getChordProgression,
  getChordProgressionError,
  getChordProgressionSuccess,
  guessCurrentChords,
  guessCurrentChordsError,
  guessCurrentChordsSuccess,
} from '../actions/chords.actions';
import { selectCurrentChords } from '../selectors/chords.selector';
import { selectLanguage } from '../selectors/language.selector';
import { AppState } from '../state';
@Injectable({
  providedIn: 'root',
})
export class ChordsEffects {
  private actions$ = inject(Actions);
  private store = inject<Store<AppState>>(Store);
  private aiService = inject(AIService);
  public getChordsGuessing = createEffect(() =>
    this.actions$.pipe(
      ofType(guessCurrentChords),
      withLatestFrom(this.store.select(selectCurrentChords), this.store.select(selectLanguage)),
      switchMap(([_, currentChords, language]) =>
        from(this.aiService.guessMyChords({ chords: currentChords }, language)).pipe(
          concatMap((response) => [guessCurrentChordsSuccess({ currentChords: response.chords, message: '' })]),
          catchError((error) => of(guessCurrentChordsError({ currentChords: currentChords, error: error })))
        )
      )
    )
  );
  public getChordsProgression = createEffect(() =>
    this.actions$.pipe(
      ofType(getChordProgression),
      withLatestFrom(this.store.select(selectCurrentChords), this.store.select(selectLanguage)),
      switchMap(([props, currentChords, language]) =>
        from(this.aiService.makeChordsProgression({ prompt: props.prompt, chords: currentChords }, language)).pipe(
          map((response) =>
            getChordProgressionSuccess({
              currentChords: response?.chords ?? [],
              clarification: response?.clarification ?? '',
              response: response?.response ?? '',
            })
          ),
          catchError((error) => of(getChordProgressionError({ currentChords: currentChords, error })))
        )
      )
    )
  );
}
