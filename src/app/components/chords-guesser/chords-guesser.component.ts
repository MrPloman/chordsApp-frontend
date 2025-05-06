import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Chord, NotePosition } from '@app/models/chord.model';
import {
  removeChord,
  removeNoteFromChord,
  setChordSelected,
  setCurrentChords,
} from '@app/store/actions/chords-guesser.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords-guesser.selector';
import { IChordsGuesserState } from '@app/store/state/chords-guesser.state';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-chords-guesser',
  imports: [CommonModule],
  templateUrl: './chords-guesser.component.html',
  styleUrl: './chords-guesser.component.scss',
})
export class ChordsGuesserComponent {
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  private store = inject(Store);
  private chordsGuesserStore: Observable<any> = new Observable();
  private chordsGuesserStoreSubscription: Subscription = new Subscription();
  constructor() {
    this.chordsGuesserStore = this.store.pipe(select(selectChordGuesserState));
    this.chordsGuesserStoreSubscription = this.chordsGuesserStore.subscribe(
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
    this.chordsGuesserStoreSubscription.unsubscribe();
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
}
