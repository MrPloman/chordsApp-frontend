import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Chord } from '@app/models/chord.model';
import { areEveryChordsValid, checkIfChordsAreGuessed } from '@app/services/chordsService.service';
import { selectedModeType } from '@app/types/index.types';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { minimumChordsToMakeProgression } from '../../config/global_variables/rules';
import { SelectedModeService } from '../../services/selectedModeService.service';
import { selectChordState } from '../../store/selectors/chords.selector';
@Component({
  selector: 'app-function-selector',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, TranslatePipe, RouterLink],
  standalone: true,
  templateUrl: './function-selector.component.html',
  styleUrl: './function-selector.component.scss',
})
export class FunctionSelectorComponent {
  private store = inject(Store);
  // private functionSelectedStoreSubscription: Subscription = new Subscription();
  private chordGuesserSubscription: Subscription = new Subscription();
  private selectedModeService = inject(SelectedModeService);

  public chords: Chord[] = [];
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  public validChords = areEveryChordsValid;
  public chordsAreGuessed = checkIfChordsAreGuessed;
  // public functionSelectedStore = this.store.select(selectFunctionSelectedState);
  public chordsGuesserStore = this.store.select(selectChordState);

  ngOnInit(): void {
    this.chordGuesserSubscription = this.chordsGuesserStore.subscribe((state) => {
      if (state && state.currentChords) this.chords = state.currentChords;
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordGuesserSubscription.unsubscribe();
    this.chords = [];
  }

  public selectOption(option: selectedModeType) {
    this.selectedModeService.setSelectedMode(option);
  }
}
