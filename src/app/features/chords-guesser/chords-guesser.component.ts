import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChordsState } from '@app/application/chords/store/chords.state';
import { ChordsGridComponent } from '@app/shared/ui/chords-grid/chords-grid.component';
import { SubmitButtonComponent } from '@app/shared/ui/submit-button/submit-button.component';

import { guessCurrentChords } from '@app/application/chords/store/chords.actions';
import { selectChordState, selectMinimumChordsStatus } from '@app/application/chords/store/chords.selector';
import { SelectedModeService } from '@app/core/services/SelectedMode/selected-mode-service';
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
  private selectedModeService = inject(SelectedModeService);

  public minimumChordsStatus: Observable<boolean> = this.store.pipe(select(selectMinimumChordsStatus));
  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));
  constructor() {
    this.selectedModeService.setSelectedMode('guesser');
  }

  public guessMyChords() {
    this.store.dispatch(guessCurrentChords());
  }
}
