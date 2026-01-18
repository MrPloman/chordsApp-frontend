import { Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { InputInstructionComponent } from '../input-instruction/input-instruction.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';

import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { AIService } from '@app/services/AIService.service';
import { areEveryChordsValid } from '@app/services/chordsService.service';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { selectLanguage } from '@app/store/selectors/language.selector';
import { selectLoading } from '@app/store/selectors/loading.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { TranslatePipe } from '@ngx-translate/core';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';

@Component({
  selector: 'app-chords-progression',
  imports: [
    InputInstructionComponent,
    SubmitButtonComponent,
    SubmitButtonComponent,
    ChordsGridComponent,
    ReactiveFormsModule,
    TranslatePipe,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './chords-progression.component.html',
  styleUrl: './chords-progression.component.scss',
})
export class ChordsProgressionComponent {
  private aiService = inject(AIService);
  private store = inject(Store);
  // public chords: Chord[] = [];
  public everyChordsValid = areEveryChordsValid;
  public minimumProgression = minimumChordsToMakeProgression;
  public progressionForm = new FormGroup({
    prompt: new FormControl('', [Validators.required]),
  });
  public loading: boolean = false;
  public message: string = '';

  private languageStoreSubscription: Subscription = new Subscription();
  public languageStore = this.store.select(selectLanguage);
  private language: 'es' | 'en' = 'en';

  protected chordSelected: number = 0;

  public chordsStore: Observable<IChordsGuesserState> = this.store.pipe(select(selectChordGuesserState));
  public loadingStore: Observable<{ loading: boolean }> = this.store.pipe(select(selectLoading));

  // private chordsStoreSubscription: Subscription = new Subscription();

  constructor() {
    this.languageStoreSubscription = this.languageStore.subscribe((state) => {
      if (state) this.language = state;
    });
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));
    // this.chordsStoreSubscription = this.chordsStore.subscribe((chordsState: IChordsGuesserState) => {
    //   this.chords = chordsState.currentChords ? chordsState.currentChords : [];
    //   this.chordSelected = chordsState.chordSelected ? chordsState.chordSelected : 0;
    // });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.chordsStoreSubscription.unsubscribe();
    this.languageStoreSubscription.unsubscribe();
  }
  public async askNewChordProgression() {
    if (!this.progressionForm.invalid && this.progressionForm.controls.prompt.value) {
      this.progressionForm.disable();

      this.store.dispatch(loadingStatus({ loading: true }));
      // this.aiService
      //   .makeChordsProgression(
      //     {
      //       chords: this.chords,
      //       prompt: this.progressionForm.controls.prompt.value,
      //     },
      //     this.language
      //   )
      //   .then((value: QueryResponse | undefined) => {
      //     this.store.dispatch(loadingStatus({ loading: false }));
      //     this.loading = false;
      //     if (!value) return;
      //     if (value.chords && value.chords.length > 0) {
      //       let parsedChords = getAllNoteChordName(value.chords);
      //       parsedChords = removeNonDesiredValuesFromNotesArray(parsedChords);

      //       this.store.dispatch(setCurrentChords({ currentChords: parsedChords }));
      //     }
      //     if (value.clarification) this.message = value.clarification;
      //     this.progressionForm.reset();
      //     this.progressionForm.controls.prompt.setErrors(null);
      //     this.progressionForm.enable();
      //   })
      //   .catch((error: any) => {
      //     this.store.dispatch(loadingStatus({ loading: false }));
      //     this.progressionForm.reset();
      //     this.progressionForm.controls.prompt.setErrors(null);
      //     this.loading = false;
      //     this.progressionForm.enable();
      //   });
    }
  }
}
