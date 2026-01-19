import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { exchangeChordOptionForCurrenChord, getAlternativeChordsOptions } from '@app/store/actions/chords.actions';
import { selectChordState } from '@app/store/selectors/chords.selector';
import { ChordsState } from '@app/store/state/chords.state';
import { select, Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';

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
  private store = inject(Store);
  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));

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
      (chordState?.chordSelected ?? -1) < 0
    )
      return false;
    else {
      return true;
    }
  }
}
