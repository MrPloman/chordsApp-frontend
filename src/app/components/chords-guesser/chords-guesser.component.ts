import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Chord, NotePosition } from '@app/models/chord.model';
import {
  changeChordsOrder,
  removeChord,
  removeNoteFromChord,
  setChordSelected,
  setCurrentChords,
} from '@app/store/actions/chords.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import { AIService } from '@app/services/AIService.service';
import { areEveryChordsValid } from '@app/services/chordsService.service';
import { minimumChordsToMakeProgression } from '../../config/global_variables/rules';
@Component({
  selector: 'app-chords-guesser',
  imports: [CommonModule, SubmitButtonComponent, ChordsGridComponent],
  templateUrl: './chords-guesser.component.html',
  styleUrl: './chords-guesser.component.scss',
})
export class ChordsGuesserComponent {
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  private store = inject(Store);
  private aiService = inject(AIService);
  public validChords = areEveryChordsValid;
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  private chordsStore: Observable<any> = new Observable();
  private chordsStoreSubscription: Subscription = new Subscription();
  constructor() {
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));
    this.chordsStoreSubscription = this.chordsStore.subscribe(
      (chordsState: IChordsGuesserState) => {
        this.chords = chordsState.currentChords
          ? chordsState.currentChords
          : [];
        this.chordSelected = chordsState.chordSelected
          ? chordsState.chordSelected
          : 0;
      }
    );
  }

  public guessMyChords() {
    this.aiService.guessMyChords({ chords: this.chords });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordsStoreSubscription.unsubscribe();
  }
}
