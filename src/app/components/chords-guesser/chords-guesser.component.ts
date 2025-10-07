import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Chord, NotePosition } from '@app/models/chord.model';
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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { QueryResponse } from '@app/models/queryResponse.model';
import { setCurrentChords } from '@app/store/actions/chords.actions';
import {
  selectLoading,
  selectLoadingState,
} from '@app/store/selectors/loading.selector';
import { LoadingState } from '@app/store/state/loading.state';
import { loadingStatus } from '@app/store/actions/loading.actions';
@Component({
  selector: 'app-chords-guesser',
  imports: [
    CommonModule,
    SubmitButtonComponent,
    ChordsGridComponent,
    FormsModule,
  ],
  templateUrl: './chords-guesser.component.html',
  styleUrl: './chords-guesser.component.scss',
})
export class ChordsGuesserComponent {
  public loading: boolean = false;
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  private store = inject(Store);
  private aiService = inject(AIService);
  public validChords = areEveryChordsValid;
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  private chordsStore: Observable<any> = new Observable();
  private loadingStore: Observable<any> = new Observable();
  private chordsStoreSubscription: Subscription = new Subscription();
  private loadingStoreSubscription: Subscription = new Subscription();
  public message: string = '';
  constructor() {
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));
    this.loadingStore = this.store.pipe(select(selectLoadingState));

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
        .guessMyChords({
          chords: this.chords,
        })
        .then((value: QueryResponse) => {
          const { chords, response } = value;
          if (chords && chords.length > 0)
            this.store.dispatch(setCurrentChords({ currentChords: chords }));
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
    this.loadingStoreSubscription.unsubscribe();
  }
}
