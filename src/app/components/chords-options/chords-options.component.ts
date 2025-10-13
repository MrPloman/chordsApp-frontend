import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { Chord } from '@app/models/chord.model';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import {
  areEveryChordsValid,
  checkAndGenerateID,
  checkDuplicateChordOptions,
  checkDuplicateChords,
  getAllNoteChordName,
} from '@app/services/chordsService.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AIService } from '@app/services/AIService.service';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { QueryResponse } from '@app/models/queryResponse.model';
import {
  exchangeChordOptionForCurrenChord,
  setAlternativeChordsOptions,
  setCurrentChords,
} from '@app/store/actions/chords.actions';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { selectLoadingState } from '@app/store/selectors/loading.selector';

@Component({
  selector: 'app-chords-options',
  imports: [
    CommonModule,
    SubmitButtonComponent,
    ChordsGridComponent,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './chords-options.component.html',
  styleUrl: './chords-options.component.scss',
})
export class ChordsOptionsComponent {
  public loading: boolean = true;
  public chords: Chord[] = [];
  public alternativeChords: Chord[] = [];
  public chordSelected: number = 0;
  public alternativeChordSelected: number = 0;

  public message: string = '';

  public validChords = areEveryChordsValid;
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  private aiService = inject(AIService);
  private store = inject(Store);

  private chordsStore: Observable<any> = new Observable();
  private chordsStoreSubscription: Subscription = new Subscription();

  private loadingStore: Observable<any> = new Observable();
  private loaderSubscription: Subscription = new Subscription();

  constructor() {
    this.loadingStore = this.store.pipe(select(selectLoadingState));
    this.loaderSubscription = this.loadingStore.subscribe(({ loading }) => {
      this.loading = loading.loading;
    });
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));

    this.chordsStoreSubscription = this.chordsStore.subscribe(
      (chordsState: IChordsGuesserState) => {
        this.chords = chordsState.currentChords
          ? chordsState.currentChords
          : [];
        this.chordSelected = chordsState.chordSelected
          ? chordsState.chordSelected
          : 0;
        this.alternativeChords = chordsState.alternativeChords
          ? chordsState.alternativeChords
          : [];
        this.alternativeChordSelected = chordsState.alternativeChordSelected
          ? chordsState.alternativeChordSelected
          : 0;
      }
    );
  }

  ngOnInit(): void {
    if (this.chordSelected !== undefined && this.chords.length > 0) {
      this.setOtherChordOption();
    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  public setOtherChordOption() {
    this.loading = true;
    this.store.dispatch(loadingStatus({ loading: true }));
    this.aiService
      .getOtherChordOptions({
        chord: this.chords[this.chordSelected],
      })
      .then((value: QueryResponse) => {
        const { chords } = value;
        if (chords && chords.length > 0) {
          let parsedChords = getAllNoteChordName(chords);
          parsedChords = checkDuplicateChords(parsedChords);
          parsedChords = checkDuplicateChordOptions(
            parsedChords,
            this.chords[this.chordSelected]
          );
          parsedChords = checkAndGenerateID(parsedChords);
          this.store.dispatch(
            setAlternativeChordsOptions({
              alternativeChords: parsedChords,
              chordSelected: this.chordSelected,
            })
          );
          this.alternativeChords = parsedChords;
        }
        this.store.dispatch(loadingStatus({ loading: false }));
        this.loading = false;
      })
      .catch((error: any) => {
        this.store.dispatch(loadingStatus({ loading: false }));
        this.loading = false;
      });
  }

  public exchangeChords() {
    if (this.chordSelected < 0 || this.alternativeChordSelected < 0) return;
    this.store.dispatch(
      exchangeChordOptionForCurrenChord({
        chordSelected: this.chordSelected,
        alternativeChordSelected: this.alternativeChordSelected,
      })
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordsStoreSubscription.unsubscribe();
    this.loaderSubscription.unsubscribe();
  }
}
