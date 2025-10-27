import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { TranslatePipe } from '@ngx-translate/core';
import { InputSelectorComponent } from '../input-selector/input-selector.component';
import { noteForms } from '../../config/global_variables/noteForms.options';
import { noteOptions } from '../../config/global_variables/notes.options';
@Component({
  selector: 'app-chords-handbook',
  imports: [
    CommonModule,
    SubmitButtonComponent,
    ChordsGridComponent,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    InputSelectorComponent,
    SubmitButtonComponent,
    CommonModule,
    SubmitButtonComponent,
    ChordsGridComponent,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './chords-handbook.component.html',
  styleUrl: './chords-handbook.component.scss',
})
export class ChordsHandbookComponent {
  public forms = noteForms;
  public notes = noteOptions;
  public loading: boolean = false;
  public currentChords: Chord[] = [];
  public handbookChords: Chord[] = [];
  public currentChordSelected: number = 0;
  public handbookChordSelected: number = 0;
  public chordRequestForm = new FormGroup({
    note: new FormControl('', [Validators.required]),
    form: new FormControl('', [Validators.required]),
  });
  private aiService = inject(AIService);

  public addNewChord() {}

  public getAllFormsChord() {
    if (this.loading) return;

    const chordName = `${this.chordRequestForm.controls.note.value}${this.chordRequestForm.controls.form.value}`;
    if (chordName) {
      this.loading = true;
      this.aiService
        .getFullHandbookChord({ chordName })
        .then((value: QueryResponse) => {
          this.handbookChords = value.chords;
          this.loading = false;
        });
    }
  }
}
