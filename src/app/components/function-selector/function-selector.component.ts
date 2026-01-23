import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { chordsHelper } from '@app/helpers/chords.helper';
import { selectedModeType } from '@app/types/index.types';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { minimumChordsToMakeProgression } from '../../config/global_variables/rules';
import { SelectedModeService } from '../../services/selectedModeService.service';
import { selectChordState } from '../../store/selectors/chords.selector';
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
