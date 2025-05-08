import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { fretboard } from '@app/config/global_variables/fretboard';
import { dots } from '@app/config/global_variables/dots';
import { Observable, Subscription } from 'rxjs';
import { selectFunctionSelectedState } from '@app/store/selectors/function-selection.selector';
import { select, Store } from '@ngrx/store';
import { selectChordGuesserState } from '@app/store/selectors/chords-guesser.selector';
import { Chord, NotePosition } from '@app/models/chord.model';
import { IChordsGuesserState } from '@app/store/state/chords-guesser.state';
import {
  editNoteFromChord,
  setCurrentChords,
} from '@app/store/actions/chords-guesser.actions';
import { makeNoteSound } from '@app/services/chordsService.service';

@Component({
  selector: 'app-fretboard',
  imports: [CommonModule],
  templateUrl: './fretboard.component.html',
  styleUrl: './fretboard.component.scss',
})
export class FretboardComponent {
  public currentFretboard = fretboard;
  public currentDots = dots;
  private store = inject(Store);
  private functionSelectedStoreSubscription: Subscription = new Subscription();
  private functionSelectedStore: Observable<any>;
  private chordsGuesserStore: Observable<any> = new Observable();
  private chordsGuesserStoreSubscription: Subscription = new Subscription();
  private chordsGuesserSelectedChord: Chord = new Chord([], '');
  private selectionMode: boolean | string = false;
  private chordPosition: number = 0;

  constructor() {
    this.chordsGuesserStore = this.store.pipe(select(selectChordGuesserState));
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
    this.functionSelectedStoreSubscription =
      this.functionSelectedStore.subscribe(({ functionSelected }) => {
        if (!functionSelected || !functionSelected.option)
          this.selectionMode = false;
        else this.selectionMode = functionSelected.option;
      });
    this.chordsGuesserStoreSubscription = this.chordsGuesserStore.subscribe(
      (chordGuesserState: IChordsGuesserState) => {
        if (
          !chordGuesserState ||
          !chordGuesserState.currentChords ||
          chordGuesserState.chordSelected === undefined
        ) {
          return;
        }
        this.chordPosition = chordGuesserState.chordSelected;
        this.chordsGuesserSelectedChord =
          chordGuesserState.currentChords[chordGuesserState.chordSelected];
      }
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.functionSelectedStoreSubscription.unsubscribe();
    this.chordsGuesserStoreSubscription.unsubscribe();
  }

  public selectNote(note: NotePosition) {
    this.makeItSound(note);
    if (!this.selectionMode) return;
    else {
      switch (this.selectionMode) {
        case 'guesser':
          this.store.dispatch(
            editNoteFromChord({
              notePosition: note,
              chordSelected: this.chordPosition,
            })
          );
          break;

        default:
          break;
      }
    }
  }

  public isThisNoteSelected = (note: NotePosition) => {
    if (!this.selectionMode || !note || !this.chordsGuesserSelectedChord) {
      return false;
    } else {
      switch (this.selectionMode) {
        case 'guesser':
          return this.chordsGuesserSelectedChord.notes.find(
            (notePosition: NotePosition) => {
              if (
                notePosition.stringNumber === note.stringNumber &&
                notePosition.position === note.position
              ) {
                return true;
              } else return false;
            }
          );
          break;

        default:
          return false;
          break;
      }
    }
  };

  public makeItSound(note: NotePosition) {
    makeNoteSound(note);
  }
}
