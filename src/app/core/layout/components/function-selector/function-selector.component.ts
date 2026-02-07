import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { selectChordState } from '@app/application/chords/store/chords.selector';
import { minimumChordsToMakeProgression } from '@app/core/constants/rules';
import { selectedModeType } from '@app/core/types/index.types';
import { chordsHelper } from '@app/shared/helpers/chords.helper';
import { SelectedModeService } from '@app/shared/services/SelectedMode/selected-mode-service';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-function-selector',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, TranslatePipe, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './function-selector.component.html',
  styleUrl: './function-selector.component.scss',
})
export class FunctionSelectorComponent {
  private store = inject(Store);
  private selectedModeService = inject(SelectedModeService);
  private chordsService = chordsHelper;

  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  public validChords = this.chordsService.areEveryChordsValid;
  public chordsAreGuessed = this.chordsService.checkIfChordsAreGuessed;
  public chordsStore = this.store.select(selectChordState);

  public selectOption(option: selectedModeType) {
    this.selectedModeService.setSelectedMode(option);
  }
}
