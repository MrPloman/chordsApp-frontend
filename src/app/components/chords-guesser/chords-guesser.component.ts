
import { Component, inject } from '@angular/core';
import { Chord } from '@app/models/chord.model';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';

import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import { AIService } from '@app/services/AIService.service';
import { areEveryChordsValid } from '@app/services/chordsService.service';
import { minimumChordsToMakeProgression } from '../../config/global_variables/rules';
import { FormsModule } from '@angular/forms';
import { QueryResponse } from '@app/models/queryResponse.model';
import { setCurrentChords } from '@app/store/actions/chords.actions';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { selectLanguage } from '@app/store/selectors/language.selector';
@Component({
  selector: 'app-chords-guesser',
  imports: [
    SubmitButtonComponent,
    ChordsGridComponent,
    FormsModule,
    TranslatePipe
],
  templateUrl: './chords-guesser.component.html',
  styleUrl: './chords-guesser.component.scss',
})
export class ChordsGuesserComponent {
  public loading: boolean = false;
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  public message: string = '';
  private store = inject(Store);

  public validChords = areEveryChordsValid;
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  private languageStoreSubscription: Subscription = new Subscription();
  public languageStore = this.store.select(selectLanguage);
  private language: 'es' | 'en' = 'en';

  private aiService = inject(AIService);
  private chordsStore: Observable<any> = this.store.pipe(
    select(selectChordGuesserState)
  );
  private chordsStoreSubscription: Subscription = new Subscription();

  constructor() {
    this.languageStoreSubscription = this.languageStore.subscribe((state) => {
      if (state) this.language = state;
    });
    this.chordsStoreSubscription = this.chordsStore.subscribe(
      (chordsState: IChordsGuesserState) => {
        this.chords = chordsState.currentChords
          ? chordsState.currentChords
          : [];
        this.chordSelected = chordsState.chordSelected
          ? chordsState.chordSelected
          : 0;
      }
    );
  }

  public async guessMyChords() {
    if (
      this.validChords(this.chords) &&
      this.chords.length >= minimumChordsToMakeProgression
    ) {
      this.loading = true;
      this.store.dispatch(loadingStatus({ loading: true }));
      this.aiService
        .guessMyChords(
          {
            chords: this.chords,
          },
          this.language
        )
        .then((value: QueryResponse) => {
          const { chords, response } = value;
          if (chords && chords.length > 0) {
            this.store.dispatch(setCurrentChords({ currentChords: chords }));
          }
          if (response) this.message = response;
          this.store.dispatch(loadingStatus({ loading: false }));
          this.loading = false;
        })
        .catch((error: any) => {
          this.store.dispatch(loadingStatus({ loading: false }));
          this.loading = false;
        });
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordsStoreSubscription.unsubscribe();
    this.languageStoreSubscription.unsubscribe();
  }
}
