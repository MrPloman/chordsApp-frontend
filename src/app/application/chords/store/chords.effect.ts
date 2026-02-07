import { inject, Injectable } from '@angular/core';
import { chordsNamesAreUnknown } from '@app/shared/helpers/chords.helper';
import { AIService } from '@app/shared/services/AIService/ai-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, expand, from, map, of, switchMap, takeLast, withLatestFrom } from 'rxjs';
import { selectLanguage } from '../../../core/store/language/language.selector';
import { AppState } from '../../../store';
import {
  getAlternativeChordsOptions,
  getChordProgression,
  getChordProgressionError,
  getChordProgressionSuccess,
  getHandbookChords,
  getHandbookChordsError,
  getHandbookChordsSuccess,
  guessCurrentChords,
  guessCurrentChordsError,
  guessCurrentChordsSuccess,
  setAlternativeChordsOptionsError,
  setAlternativeChordsOptionsSuccess,
} from './chords.actions';
import { selectChordState, selectCurrentChords } from './chords.selector';

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
          expand((response) => {
            if (chordsNamesAreUnknown(response.chords)) {
              return this.aiService.guessMyChords({ chords: response.chords }, language);
            }
            return EMPTY;
          }),
          takeLast(1),
          map((response) => {
            return guessCurrentChordsSuccess({ currentChords: response.chords, message: '' });
          }),
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

  public getOtherChordOptions = createEffect(() =>
    this.actions$.pipe(
      ofType(getAlternativeChordsOptions),
      withLatestFrom(this.store.select(selectChordState)),
      switchMap(([_, state]) => {
        return from(
          this.aiService.getOtherChordOptions({
            chord: state.currentChords[state.currentChordSelected],
          })
        ).pipe(
          map((response) =>
            setAlternativeChordsOptionsSuccess({
              alternativeChords: response?.chords ?? [],
            })
          ),
          catchError((error) => of(setAlternativeChordsOptionsError({ error })))
        );
      })
    )
  );

  public getHandbookChords = createEffect(() =>
    this.actions$.pipe(
      ofType(getHandbookChords),
      switchMap(({ chordName }) =>
        from(this.aiService.getFullHandbookChord({ chordName: chordName })).pipe(
          map((response) =>
            getHandbookChordsSuccess({
              handbookChords: response.chords,
            })
          ),
          catchError((error) => of(getHandbookChordsError({ error })))
        )
      )
    )
  );
}
