import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Chord, NotePosition } from '@app/models/chord.model';
import {
  isThisValidChord,
  makeNoteSound,
} from '@app/services/chordsService.service';
import {
  setCurrentChords,
  setChordSelected,
  removeChord,
  removeNoteFromChord,
  changeChordsOrder,
} from '@app/store/actions/chords.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { selectFunctionSelectedState } from '@app/store/selectors/function-selection.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { IFunctionSelectionState } from '@app/store/state/function-selection.state';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chords-grid',
  imports: [CommonModule, CdkDrag, CdkDropList],
  templateUrl: './chords-grid.component.html',
  styleUrl: './chords-grid.component.scss',
})
export class ChordsGridComponent {
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  private store = inject(Store);
  private chordsStore: Observable<any> = new Observable();
  private chordsStoreSubscription: Subscription = new Subscription();
  public functionSelectedStore: Observable<any>;
  private subscriptionFunctionStore: Subscription = new Subscription();
  public selection: string = '';
  constructor() {
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
    this.subscriptionFunctionStore = this.functionSelectedStore.subscribe(
      (value: { functionSelected: IFunctionSelectionState }) => {
        if (!value.functionSelected.option) return;
        this.selection = value.functionSelected.option;
      }
    );
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

    this.subscriptionFunctionStore.unsubscribe();
  }

  public addNewChord() {
    this.store.dispatch(
      setCurrentChords({
        currentChords: [
          ...this.chords,
          new Chord(
            [
              new NotePosition(1, 0, 'E'),
              new NotePosition(2, 0, 'B'),
              new NotePosition(3, 0, 'G'),
              new NotePosition(4, 0, 'D'),
              new NotePosition(5, 0, 'A'),
              new NotePosition(6, 0, 'E'),
            ],
            ''
          ),
        ],
      })
    );
    this.selectChord(this.chords.length - 1);
  }

  public selectChord(position: number) {
    this.store.dispatch(setChordSelected({ chordSelected: position }));
  }
  public deleteChord(chordPosition: number) {
    this.store.dispatch(removeChord({ chordToRemove: chordPosition }));
  }

  public removeNote(notePosition: number, chordPosition: number) {
    this.store.dispatch(
      removeNoteFromChord({
        noteToRemove: notePosition,
        chordSelected: chordPosition,
      })
    );
  }
  public drop(event: CdkDragDrop<any[]>) {
    console.log(event.previousIndex, event.currentIndex);
    this.store.dispatch(
      changeChordsOrder({
        originChordPosition: event.previousIndex,
        destinationChordPosition: event.currentIndex,
      })
    );
  }
  public makeChordSound(chord: Chord) {
    chord.notes.forEach((note: NotePosition) => {
      makeNoteSound(note);
    });
  }

  public trackById(index: number, item: any): number {
    return item.id;
  }
}
