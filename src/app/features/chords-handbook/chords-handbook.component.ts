import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  addHandbookChordToCurrentChords,
  getHandbookChords,
  setHandbookChordsSelected,
} from '@app/application/chords/store/chords.actions';
import { selectChordState } from '@app/application/chords/store/chords.selector';
import { ChordsState } from '@app/application/chords/store/chords.state';
import { noteForms } from '@app/core/constants/noteForms.options';
import { noteOptions } from '@app/core/constants/notes.options';
import { SelectedModeService } from '@app/core/services/SelectedMode/selected-mode-service';
import { ChordsGridComponent } from '@app/shared/ui/chords-grid/chords-grid.component';
import { InputSelectorComponent } from '@app/shared/ui/input-selector/input-selector.component';
import { SubmitButtonComponent } from '@app/shared/ui/submit-button/submit-button.component';

import { select, Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

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
    ReactiveFormsModule,
    TranslatePipe,
    CommonModule,
  ],
  templateUrl: './chords-handbook.component.html',
  styleUrl: './chords-handbook.component.scss',
})
export class ChordsHandbookComponent {
  public forms = noteForms;
  public notes = noteOptions;

  public chordRequestForm = new FormGroup({
    note: new FormControl('', [Validators.required]),
    form: new FormControl('', [Validators.required]),
  });
  private store = inject(Store);

  private selectedModeService = inject(SelectedModeService);

  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));
  private chordStoreSubscription!: Subscription;
  constructor() {
    this.chordStoreSubscription = this.chordsStore.subscribe((chordState: ChordsState) => {
      if (!chordState.loading) this.chordRequestForm.enable();
      else this.chordRequestForm.disable();
    });
  }

  ngOnInit(): void {
    this.selectedModeService.setSelectedMode('handbook');
  }
  ngOnDestroy(): void {
    this.store.dispatch(setHandbookChordsSelected({ handbookChordsSelected: -1 }));

    this.chordStoreSubscription.unsubscribe();
  }
  public addNewChord(loading: boolean, handbookChordSelected: number) {
    if (loading || handbookChordSelected < 0) return;
    this.store.dispatch(addHandbookChordToCurrentChords());
  }

  public getAllFormsChord(loading: boolean) {
    if (this.chordRequestForm.invalid || loading) return;
    const chordName = `${this.chordRequestForm.controls.note.value}${this.chordRequestForm.controls.form.value}`;
    this.store.dispatch(getHandbookChords({ chordName }));
  }

  public disableRequestButton(loading: boolean): boolean {
    if (loading || this.chordRequestForm.invalid) return true;
    else return false;
  }

  public disableAddButton(loading: boolean, handbookChordSelected: number): boolean {
    if (loading || handbookChordSelected < 0) return true;
    else return false;
  }
}
