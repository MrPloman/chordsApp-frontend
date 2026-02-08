import { Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChordsState } from '@app/application/chords/store/chords.state';
import { ChordsGridComponent } from '@app/shared/ui/chords-grid/chords-grid.component';
import { InputInstructionComponent } from '@app/shared/ui/input-instruction/input-instruction.component';
import { SubmitButtonComponent } from '@app/shared/ui/submit-button/submit-button.component';

import { getChordProgression, resetMessages } from '@app/application/chords/store/chords.actions';
import { selectAllowedForProgression, selectChordState } from '@app/application/chords/store/chords.selector';
import { TranslatePipe } from '@ngx-translate/core';

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
  public allowedForProgression: Observable<boolean> = this.store.pipe(select(selectAllowedForProgression));

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

  public askNewChordProgression() {
    if (this.progressionForm.invalid || !this.progressionForm.controls.prompt.value) return;
    this.store.dispatch(getChordProgression({ prompt: this.progressionForm.controls.prompt.value }));
  }
  ngOnDestroy(): void {
    this.chordStoreSubscription.unsubscribe();
    this.store.dispatch(resetMessages());
  }
}
