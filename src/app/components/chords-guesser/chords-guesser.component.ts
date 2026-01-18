import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { areEveryChordsValid } from '@app/services/chordsService.service';
import { SelectedModeService } from '@app/services/selectedModeService.service';
import { guessCurrentChords } from '@app/store/actions/chords.actions';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { selectLoading } from '@app/store/selectors/loading.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { LoadingState } from '@app/store/state/loading.state';
import { select, Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { minimumChordsToMakeProgression } from '../../config/global_variables/rules';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
@Component({
  selector: 'app-chords-guesser',
  standalone: true,
  imports: [SubmitButtonComponent, ChordsGridComponent, FormsModule, TranslatePipe, CommonModule],
  templateUrl: './chords-guesser.component.html',
  styleUrl: './chords-guesser.component.scss',
})
export class ChordsGuesserComponent {
  // public loading: boolean = false;
  // public chords: Chord[] = [];
  // public chordSelected: number = 0;
  // public message: string = '';
  private store = inject(Store);

  public validChords = areEveryChordsValid;
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  // private languageStoreSubscription: Subscription = new Subscription();
  // public languageStore = this.store.select(selectLanguage);
  // private language: 'es' | 'en' = 'en';

  // private aiService = inject(AIService);
  public chordsStore: Observable<IChordsGuesserState> = this.store.pipe(select(selectChordGuesserState));
  public loadingStore: Observable<LoadingState> = this.store.pipe(select(selectLoading));

  // private chordsStoreSubscription: Subscription = new Subscription();

  private selectedModeService = inject(SelectedModeService);

  constructor() {
    this.selectedModeService.setSelectedMode('guesser');

    // this.languageStoreSubscription = this.languageStore.subscribe((state) => {
    //   if (state) this.language = state;
    // });
    // this.chordsStoreSubscription = this.chordsStore.subscribe(
    //   (chordsState: IChordsGuesserState) => {
    //     this.chords = chordsState.currentChords
    //       ? chordsState.currentChords
    //       : [];
    //     this.chordSelected = chordsState.chordSelected
    //       ? chordsState.chordSelected
    //       : 0;
    //   }
    // );
  }

  public async guessMyChords() {
    this.store.dispatch(loadingStatus({ loading: true }));
    this.store.dispatch(guessCurrentChords());

    // if (this.validChords(this.chords) && this.chords.length >= minimumChordsToMakeProgression) {
    //   this.loading = true;
    // this.aiService
    //   .guessMyChords(
    //     {
    //       chords: this.chords,
    //     },
    //     this.language
    //   )
    //   .then((value: QueryResponse) => {
    //     const { chords, response } = value;
    //     if (chords && chords.length > 0) {
    //       this.store.dispatch(setCurrentChords({ currentChords: chords }));
    //     }
    //     if (response) this.message = response;
    //     this.store.dispatch(loadingStatus({ loading: false }));
    //     this.loading = false;
    //   })
    //   .catch((error: any) => {
    //     this.store.dispatch(loadingStatus({ loading: false }));
    //     this.loading = false;
    //   });
    // }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.chordsStoreSubscription.unsubscribe();
    // this.languageStoreSubscription.unsubscribe();
  }
}
