import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { fretboard } from '@app/config/global_variables/fretboard';
import { dots } from '@app/config/global_variables/dots';
import { Observable, Subscription } from 'rxjs';
import { selectFunctionSelectedState } from '@app/store/selectors/function-selection.selector';
import { select, Store } from '@ngrx/store';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { Chord, NotePosition } from '@app/models/chord.model';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import {
  editNoteFromChord,
  setCurrentChords,
} from '@app/store/actions/chords.actions';
import { generateId, makeNoteSound } from '@app/services/chordsService.service';
import { maximRandomNumber } from '@app/config/global_variables/rules';
import { selectLoadingState } from '@app/store/selectors/loading.selector';

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
  private chordsStore: Observable<any> = new Observable();
  private chordsStoreSubscription: Subscription = new Subscription();
  private chordsSelectedChord: Chord = new Chord([], '', generateId());
  private selectionMode: boolean | string = false;
  private chordPosition: number = 0;
  private loaderSubscription: Subscription = new Subscription();
  private loadingStore: Observable<any>;
  public loading: boolean = false;
  private chords: Chord[] = [];

  constructor() {
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
    this.loadingStore = this.store.pipe(select(selectLoadingState));
    this.loaderSubscription = this.loadingStore.subscribe(({ loading }) => {
      this.loading = loading.loading;
    });
    this.functionSelectedStoreSubscription =
      this.functionSelectedStore.subscribe(({ functionSelected }) => {
        if (!functionSelected || !functionSelected.option)
          this.selectionMode = false;
        else this.selectionMode = functionSelected.option;
      });
    this.chordsStoreSubscription = this.chordsStore.subscribe(
      (chordGuesserState: IChordsGuesserState) => {
        if (
          !chordGuesserState ||
          !chordGuesserState.currentChords ||
          chordGuesserState.chordSelected === undefined
        ) {
          return;
        }
        this.chordPosition = chordGuesserState.chordSelected;
        this.chordsSelectedChord =
          chordGuesserState.currentChords[chordGuesserState.chordSelected];
        this.chords = chordGuesserState.currentChords;
      }
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.functionSelectedStoreSubscription.unsubscribe();
    this.chordsStoreSubscription.unsubscribe();
  }

  public selectNote(note: NotePosition) {
    if (this.loading) return;
    this.makeItSound(note);
    if (!this.selectionMode) return;
    else {
      switch (this.selectionMode) {
        case 'guesser':
          // If chord was already defined you cannot change the notes
          if (this.chords[this.chordPosition].name) return;
          const _id = generateId();

          this.store.dispatch(
            editNoteFromChord({
              notePosition: { ...note, _id },
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
    if (!this.selectionMode || !note || !this.chordsSelectedChord) {
      return false;
    } else {
      return this.chordsSelectedChord.notes.find(
        (notePosition: NotePosition) => {
          if (
            notePosition.stringNumber === note.stringNumber &&
            notePosition.position === note.position
          ) {
            return true;
          } else return false;
        }
      );
    }
  };

  public makeItSound(note: NotePosition) {
    makeNoteSound(note);
  }
}
