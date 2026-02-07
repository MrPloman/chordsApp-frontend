import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { minimumChordsToMakeProgression } from '@app/core/constants/rules';

import { ChordsState } from '@app/application/chords/store/chords.state';
import { chordsHelper } from '@app/shared/helpers/chords.helper';
import { SelectedModeService } from '@app/shared/services/SelectedMode/selected-mode-service';
import { ChordsGridComponent } from '@app/shared/ui/chords-grid/chords-grid.component';
import { SubmitButtonComponent } from '@app/shared/ui/submit-button/submit-button.component';

import { guessCurrentChords } from '@app/application/chords/store/chords.actions';
import { selectChordState } from '@app/application/chords/store/chords.selector';
import { select, Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
@Component({
  selector: 'app-chords-guesser',
  standalone: true,
  imports: [SubmitButtonComponent, ChordsGridComponent, FormsModule, TranslatePipe, CommonModule],
  templateUrl: './chords-guesser.component.html',
  styleUrl: './chords-guesser.component.scss',
})
export class ChordsGuesserComponent {
  private store = inject(Store);
  private chordsService = chordsHelper;

  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;

  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));

  private selectedModeService = inject(SelectedModeService);

  constructor() {
    this.selectedModeService.setSelectedMode('guesser');
  }

  public guessMyChords() {
    this.store.dispatch(guessCurrentChords());
  }

  public enableSubmitButton(chordsState: ChordsState | null): boolean {
    return true;
    // if (
    //   !chordsState ||
    //   !chordsState.currentChords ||
    //   chordsState?.currentChords.length < minimumChordsToMakeProgression ||
    //   !this.chordsService.areEveryChordsValid(chordsState?.currentChords)
    // )
    //   return false;
    // else return true;
  }
}
