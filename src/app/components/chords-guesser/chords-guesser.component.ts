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
import { makeNoteSound } from '@app/services/chordsService.service';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { InputInstructionComponent } from '../input-instruction/input-instruction.component';

@Component({
  selector: 'app-chords-guesser',
  imports: [CommonModule, CdkDropList, CdkDrag],
  templateUrl: './chords-guesser.component.html',
  styleUrl: './chords-guesser.component.scss',
})
export class ChordsGuesserComponent {
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

  public addNewChord() {
    this.store.dispatch(
      setCurrentChords({
        currentChords: [
          ...this.chords,
          new Chord([
            new NotePosition(1, 0, 'E'),
            new NotePosition(2, 0, 'B'),
            new NotePosition(3, 0, 'G'),
            new NotePosition(4, 0, 'D'),
            new NotePosition(5, 0, 'A'),
            new NotePosition(6, 0, 'E'),
          ]),
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
}
