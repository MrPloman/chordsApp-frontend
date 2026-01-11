import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chord } from '@app/models/chord.model';
import { QueryResponse } from '@app/models/queryResponse.model';
import { AIService } from '@app/services/AIService.service';
import {
  checkAndGenerateID,
  checkDuplicateChords,
  getAllNoteChordName,
  removeNonDesiredValuesFromNotesArray,
} from '@app/services/chordsService.service';
import { SelectedModeService } from '@app/services/selectedModeService.service';
import { setCurrentChords, setHandbookChords, setHandbookChordsSelected } from '@app/store/actions/chords.actions';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { selectChordGuesser } from '@app/store/selectors/chords.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { select, Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { noteForms } from '../../config/global_variables/noteForms.options';
import { noteOptions } from '../../config/global_variables/notes.options';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import { InputSelectorComponent } from '../input-selector/input-selector.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
@Component({
  selector: 'app-chords-handbook',
  standalone: true,
  imports: [
    SubmitButtonComponent,
    ChordsGridComponent,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    InputSelectorComponent,
    SubmitButtonComponent,
    SubmitButtonComponent,
    ChordsGridComponent,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './chords-handbook.component.html',
  styleUrl: './chords-handbook.component.scss',
})
export class ChordsHandbookComponent {
  private store = inject(Store);

  public forms = noteForms;
  public notes = noteOptions;
  public loading: boolean = false;
  public currentChords: Chord[] = [];
  public handbookChords: Chord[] = [];
  public currentChordSelected: number = -1;
  public handbookChordSelected: number = -1;
  public chordRequestForm = new FormGroup({
    note: new FormControl('', [Validators.required]),
    form: new FormControl('', [Validators.required]),
  });
  private aiService = inject(AIService);
  private selectedModeService = inject(SelectedModeService);

  private chordsStore: Observable<any> = this.store.pipe(select(selectChordGuesser));
  private chordsStoreSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.selectedModeService.setSelectedMode('handbook');
    this.chordsStoreSubscription = this.chordsStore.subscribe((chordsState: IChordsGuesserState) => {
      this.currentChords = chordsState.currentChords ? chordsState.currentChords : [];
      this.currentChordSelected = chordsState.chordSelected !== undefined ? chordsState.chordSelected : -1;
      this.handbookChords = chordsState.handbookChords ? chordsState.handbookChords : [];
      this.handbookChordSelected =
        chordsState.handbookChordsSelected !== undefined ? chordsState.handbookChordsSelected : -1;
    });
  }
  public addNewChord() {
    if (this.handbookChordSelected < 0 || this.handbookChords.length < 0 || this.loading) return;
    this.store.dispatch(
      setCurrentChords({
        currentChords: [...this.currentChords, this.handbookChords[this.handbookChordSelected]],
      })
    );
  }

  public getAllFormsChord() {
    if (this.loading) return;

    const chordName = `${this.chordRequestForm.controls.note.value}${this.chordRequestForm.controls.form.value}`;
    if (chordName) {
      this.chordRequestForm.disable();
      this.loading = true;
      this.store.dispatch(loadingStatus({ loading: true }));
      this.aiService.getFullHandbookChord({ chordName }).then((value: QueryResponse) => {
        if (value.chords) {
          let parsedChords = getAllNoteChordName(value.chords);
          parsedChords = checkDuplicateChords(parsedChords);
          parsedChords = checkAndGenerateID(parsedChords);
          parsedChords = removeNonDesiredValuesFromNotesArray(parsedChords);
          this.store.dispatch(setHandbookChords({ chords: parsedChords }));
        }

        this.store.dispatch(loadingStatus({ loading: false }));

        this.loading = false;
        this.chordRequestForm.enable();
      });
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.store.dispatch(setHandbookChords({ chords: [] }));
    this.store.dispatch(setHandbookChordsSelected({ handbookChordsSelected: -1 }));
    this.handbookChords = [];
    this.handbookChordSelected = -1;
    this.chordsStoreSubscription.unsubscribe();
  }
}
