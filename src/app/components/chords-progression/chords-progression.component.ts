import { Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { InputInstructionComponent } from '../input-instruction/input-instruction.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';

import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { checkIfChordsAreGuessed } from '@app/services/chordsService.service';
import { getChordProgression, resetMessages } from '@app/store/actions/chords.actions';
import { selectChordState } from '@app/store/selectors/chords.selector';
import { ChordsState } from '@app/store/state/chords.state';
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
  private store = inject(Store);
  public progressionForm = new FormGroup({
    prompt: new FormControl('', [Validators.required]),
  });
  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));
  private chordStoreSubscription!: Subscription;

  constructor() {
    this.chordStoreSubscription = this.chordsStore.subscribe((chordState: ChordsState) => {
      if (!chordState.loading) {
        this.progressionForm.enable();
        this.progressionForm.reset();
        this.progressionForm.controls.prompt.setErrors(null);
      } else this.progressionForm.disable();
    });
  }

  public enableSubmitButton(chordsState: ChordsState | null): boolean {
    if (
      !chordsState ||
      chordsState.loading ||
      !chordsState.currentChords ||
      chordsState.currentChords.length < minimumChordsToMakeProgression ||
      !checkIfChordsAreGuessed(chordsState.currentChords) ||
      !this.progressionForm.valid
    )
      return false;
    else return true;
  }
  public askNewChordProgression() {
    if (this.progressionForm.invalid || !this.progressionForm.controls.prompt.value) return;
    this.store.dispatch(getChordProgression({ prompt: this.progressionForm.controls.prompt.value }));
  }
  ngOnDestroy(): void {
    this.chordStoreSubscription.unsubscribe();
    this.store.dispatch(resetMessages());
  }
}
