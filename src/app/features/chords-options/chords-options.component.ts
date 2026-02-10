import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  exchangeChordOptionForCurrenChord,
  getAlternativeChordsOptions,
} from '@app/application/chords/store/chords.actions';
import { selectChordState } from '@app/application/chords/store/chords.selector';
import { ChordsState } from '@app/application/chords/store/chords.state';
import { SelectedModeService } from '@app/core/services/SelectedMode/selected-mode-service';
import { ChordsGridComponent } from '@app/shared/ui/chords-grid/chords-grid.component';
import { SubmitButtonComponent } from '@app/shared/ui/submit-button/submit-button.component';

import { select, Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chords-options',
  standalone: true,
  imports: [
    SubmitButtonComponent,
    ChordsGridComponent,
    FormsModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    CommonModule,
  ],
  templateUrl: './chords-options.component.html',
  styleUrl: './chords-options.component.scss',
})
export class ChordsOptionsComponent {
  private router = inject(Router);
  private store = inject(Store);
  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));
  private selectedModeService = inject(SelectedModeService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (!this.selectedModeService.selectedMode()) this.router.navigate(['/']);
  }

  public exchangeChords() {
    this.store.dispatch(exchangeChordOptionForCurrenChord());
  }

  public getOtherOptions() {
    this.store.dispatch(getAlternativeChordsOptions());
  }
  public checkExchangeChordIsAvailable(chordState: ChordsState | null): boolean {
    if (
      !chordState ||
      (chordState?.loading ?? false) ||
      (chordState?.alternativeChordSelected ?? -1) < 0 ||
      (chordState?.currentChordSelected ?? -1) < 0
    )
      return false;
    else {
      return true;
    }
  }
}
