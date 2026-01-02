import { Component, inject } from '@angular/core';
import { InputInstructionComponent } from '../input-instruction/input-instruction.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { Chord } from '@app/models/chord.model';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  areEveryChordsValid,
  getAllNoteChordName,
} from '@app/services/chordsService.service';
import { setCurrentChords } from '@app/store/actions/chords.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { AIService } from '@app/services/AIService.service';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { QueryResponse } from '@app/models/queryResponse.model';
import { TranslatePipe } from '@ngx-translate/core';
import { selectLanguage } from '@app/store/selectors/language.selector';

@Component({
  selector: 'app-chords-progression',
  imports: [
    InputInstructionComponent,
    SubmitButtonComponent,
    SubmitButtonComponent,
    ChordsGridComponent,
    ReactiveFormsModule,
    TranslatePipe
],

  templateUrl: './chords-progression.component.html',
  styleUrl: './chords-progression.component.scss',
})
export class ChordsProgressionComponent {
  private aiService = inject(AIService);
  private store = inject(Store);
  public chords: Chord[] = [];
  public progressionForm = new FormGroup({
    prompt: new FormControl('', [Validators.required]),
  });
  public loading: boolean = false;
  public message: string = '';

  private languageStoreSubscription: Subscription = new Subscription();
  public languageStore = this.store.select(selectLanguage);
  private language: 'es' | 'en' = 'en';

  protected chordSelected: number = 0;

  private chordsStore: Observable<any> = new Observable();
  private chordsStoreSubscription: Subscription = new Subscription();

  constructor() {
    this.languageStoreSubscription = this.languageStore.subscribe((state) => {
      if (state) this.language = state;
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
      }
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordsStoreSubscription.unsubscribe();
  }
  public async askNewChordProgression() {
    if (
      !this.progressionForm.invalid &&
      areEveryChordsValid(this.chords) &&
      this.chords.length >= minimumChordsToMakeProgression &&
      this.progressionForm.controls.prompt.value
    ) {
      this.loading = true;
      this.store.dispatch(loadingStatus({ loading: true }));
      this.aiService
        .makeChordsProgression(
          {
            chords: this.chords,
            prompt: this.progressionForm.controls.prompt.value,
          },
          this.language
        )
        .then((value: QueryResponse | undefined) => {
          this.store.dispatch(loadingStatus({ loading: false }));
          this.loading = false;
          if (!value) return;
          if (value.chords && value.chords.length > 0) {
            let parsedChords = getAllNoteChordName(value.chords);
            this.store.dispatch(
              setCurrentChords({ currentChords: parsedChords })
            );
          }
          if (value.clarification) this.message = value.clarification;
          this.progressionForm.reset();
          this.progressionForm.controls.prompt.setErrors(null);
        })
        .catch((error: any) => {
          this.store.dispatch(loadingStatus({ loading: false }));
          this.progressionForm.reset();
          this.progressionForm.controls.prompt.setErrors(null);

          this.loading = false;
        });
    }
  }
}
