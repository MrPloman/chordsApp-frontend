import { Injectable } from '@angular/core';
import { AIService } from '@app/services/AIService.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap, withLatestFrom } from 'rxjs';
import { getChordProgression, getChordProgressionError, getChordProgressionSuccess } from '../actions/chords.actions';
import { selectCurrentChords } from '../selectors/chords.selector';
import { selectLanguage } from '../selectors/language.selector';
import { AppState } from '../state';
@Injectable({
  providedIn: 'root',
})
export class ChordsEffects {
  constructor(
    private actions$: Actions,
    private aiService: AIService,
    private store: Store<AppState>
  ) {}
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

  // this.actions$.pipe(
  //   ofType(getChordProgression),
  //   mergeMap((action) =>
  //     this.aiService.makeChordsProgression().pipe(
  //       map((whatever: WHATEVER[]) => AllWHATEVERActions.WHATEVERActions.loadWHATEVERSuccess({ WHATEVER: WHATEVER })),
  //       catchError((err) =>
  //         of(
  //           AllWHATEVERActions.WHATEVERActions.loadWHATEVERError({
  //             payload: {
  //               name: err.name,
  //               status: err.status,
  //               error: err.error,
  //             },
  //           })
  //         )
  //       )
  //     )
  //   )
  // )
}
