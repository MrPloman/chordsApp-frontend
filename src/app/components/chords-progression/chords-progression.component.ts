import { Component, inject } from '@angular/core';
import { InputInstructionComponent } from '../input-instruction/input-instruction.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { Chord, NotePosition } from '@app/models/chord.model';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { makeNoteSound } from '@app/services/chordsService.service';
import {
  changeChordsOrder,
  removeChord,
  setChordSelected,
} from '@app/store/actions/chords.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';

@Component({
  selector: 'app-chords-progression',
  imports: [
    InputInstructionComponent,
    SubmitButtonComponent,
    CommonModule,
    SubmitButtonComponent,
    ChordsGridComponent,
  ],

  templateUrl: './chords-progression.component.html',
  styleUrl: './chords-progression.component.scss',
})
export class ChordsProgressionComponent {
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  private store = inject(Store);
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
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordsStoreSubscription.unsubscribe();
  }
}
