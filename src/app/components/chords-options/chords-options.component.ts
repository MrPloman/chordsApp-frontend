import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { Chord } from '@app/models/chord.model';
import { QueryResponse } from '@app/models/queryResponse.model';
import { AIService } from '@app/services/AIService.service';
import {
  areEveryChordsValid,
  checkAndGenerateID,
  checkDuplicateChordOptions,
  checkDuplicateChords,
  getAllNoteChordName,
  removeNonDesiredValuesFromNotesArray,
} from '@app/services/chordsService.service';
import { exchangeChordOptionForCurrenChord, setAlternativeChordsOptions } from '@app/store/actions/chords.actions';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { selectLoadingState } from '@app/store/selectors/loading.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { select, Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';

@Component({
  selector: 'app-chords-options',
  standalone: true,
  imports: [SubmitButtonComponent, ChordsGridComponent, FormsModule, MatProgressSpinnerModule, TranslatePipe],
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

  private chordsStore: Observable<any> = this.store.pipe(select(selectChordGuesserState));
  private chordsStoreSubscription: Subscription = new Subscription();

  private loadingStore: Observable<any> = this.store.pipe(select(selectLoadingState));
  private loaderSubscription: Subscription = new Subscription();

  constructor() {
    this.loaderSubscription = this.loadingStore.subscribe(({ loading }) => {
      this.loading = loading.loading;
    });

    this.chordsStoreSubscription = this.chordsStore.subscribe((chordsState: IChordsGuesserState) => {
      this.chords = chordsState.currentChords ? chordsState.currentChords : [];
      this.chordSelected = chordsState.chordSelected ? chordsState.chordSelected : 0;
      this.alternativeChords = chordsState.alternativeChords ? chordsState.alternativeChords : [];
      this.alternativeChordSelected = chordsState.alternativeChordSelected ? chordsState.alternativeChordSelected : 0;
    });
  }

  ngOnInit(): void {
    if (this.chordSelected !== undefined && this.chords.length > 0) {
      // this.setOtherChordOption();
    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  public setOtherChordOption() {
    // if (this.chords[this.chordSelected].alternativeChords.length > 0) return;
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
          parsedChords = checkDuplicateChordOptions(parsedChords, this.chords[this.chordSelected]);
          parsedChords = checkAndGenerateID(parsedChords);
          parsedChords = removeNonDesiredValuesFromNotesArray(parsedChords);

          this.store.dispatch(
            setAlternativeChordsOptions({
              alternativeChords: parsedChords,
              // chordSelected: this.chordSelected,
              // alternativeChordSelected: this.alternativeChordSelected,
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

  public getOtherOptions() {
    if (this.loading) return;
    this.setOtherChordOption();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordsStoreSubscription.unsubscribe();
    this.loaderSubscription.unsubscribe();
  }
}
