import { Inject, inject, Injectable } from '@angular/core';
import { CHORDS_AI_PORT, ChordsAiPort } from '@app/domain/chords/ports/chords.ports';
import { ChordsAnalyzerService } from '@app/domain/chords/services/chords-analyzer.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap, withLatestFrom } from 'rxjs';
import { AppState } from '../../../core/store';
import { selectLanguage } from '../../../core/store/language/language.selector';
import { GuessChordsUseCase } from '../use-cases/guess-chords-use-case.service';
import { HandbookChordsUseCase } from '../use-cases/handbook-chords-use-case.service';
import { OtherOptionsChordsUseCase } from '../use-cases/other-options-chords-use-case.service';
import { ProgressionChordsUseCase } from '../use-cases/progression-chords-use-case.service';
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
  constructor(@Inject(CHORDS_AI_PORT) private aiPort: ChordsAiPort) {}
  private analyzer = new ChordsAnalyzerService();

  private actions$ = inject(Actions);
  private store = inject<Store<AppState>>(Store);

  public getChordsGuessing = createEffect(() =>
    this.actions$.pipe(
      ofType(guessCurrentChords),
      withLatestFrom(this.store.select(selectCurrentChords), this.store.select(selectLanguage)),
      switchMap(([_, currentChords, language]) => {
        const guesserUseCase = new GuessChordsUseCase(this.analyzer, this.aiPort);
        return from(guesserUseCase.execute(currentChords, language)).pipe(
          map((response) => {
            return guessCurrentChordsSuccess({ currentChords: response.chords, message: '' });
          }),
          catchError((error) => of(guessCurrentChordsError({ currentChords: currentChords, error: error })))
        );
      })
    )
  );
  public getChordsProgression = createEffect(() =>
    this.actions$.pipe(
      ofType(getChordProgression),
      withLatestFrom(this.store.select(selectCurrentChords), this.store.select(selectLanguage)),
      switchMap(([props, currentChords, language]) => {
        const progressionChordsUseCase = new ProgressionChordsUseCase(this.analyzer, this.aiPort);
        return from(progressionChordsUseCase.execute(currentChords, props.prompt, language)).pipe(
          map((response) =>
            getChordProgressionSuccess({
              currentChords: response?.chords ?? [],
              clarification: response?.clarification ?? '',
              response: response?.response ?? '',
            })
          ),
          catchError((error) => of(getChordProgressionError({ currentChords: currentChords, error })))
        );
      })
    )
  );

  public getOtherChordOptions = createEffect(() =>
    this.actions$.pipe(
      ofType(getAlternativeChordsOptions),
      withLatestFrom(this.store.select(selectChordState)),
      switchMap(([_, state]) => {
        const otherChordsOptionsUseCase = new OtherOptionsChordsUseCase(this.aiPort);
        return from(otherChordsOptionsUseCase.execute(state.currentChords[state.currentChordSelected])).pipe(
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
      switchMap(({ chordName }) => {
        const handbookChordsUseCase = new HandbookChordsUseCase(this.aiPort);
        return from(handbookChordsUseCase.execute(chordName)).pipe(
          map((response) =>
            getHandbookChordsSuccess({
              handbookChords: response.chords,
            })
          ),
          catchError((error) => of(getHandbookChordsError({ error })))
        );
      })
    )
  );
}
