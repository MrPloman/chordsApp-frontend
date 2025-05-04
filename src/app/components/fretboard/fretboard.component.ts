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

  constructor() {
    this.chordsGuesserStore = this.store.pipe(select(selectChordGuesserState));
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
    this.functionSelectedStoreSubscription =
      this.functionSelectedStore.subscribe(({ functionSelected }) => {
        console.log(functionSelected);
        if (!functionSelected || !functionSelected.option)
          this.selectionMode = false;
        else this.selectionMode = functionSelected.option;
      });
    this.chordsGuesserStoreSubscription = this.chordsGuesserStore.subscribe(
      (chordGuesserState: IChordsGuesserState) => {
        console.log(chordGuesserState);
        if (
          !chordGuesserState ||
          !chordGuesserState.currentChords ||
          chordGuesserState.chordSelected === undefined
        ) {
          return;
        }
        this.chordsGuesserSelectedChord =
          chordGuesserState.currentChords[chordGuesserState.chordSelected];
        console.log(this.chordsGuesserSelectedChord);
      }
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.functionSelectedStoreSubscription.unsubscribe();
    this.chordsGuesserStoreSubscription.unsubscribe();
  }

  public selectNote(note: any) {
    this.makeItSound(note);
  }

  public isThisNoteSelected = (note: NotePosition) => {
    if (!this.selectionMode || !note || !this.chordsGuesserSelectedChord) {
      return false;
    } else {
      if (this.selectionMode === 'guesser') {
        if (this.chordsGuesserSelectedChord.notes.length === 0) return false;
        else {
          const inside = this.chordsGuesserSelectedChord.notes.forEach(
            (notePosition: NotePosition) => {
              if (
                notePosition.stringNumber === note.stringNumber &&
                notePosition.position === note.position
              ) {
                return true;
              } else return false;
            }
          );
          return inside;
        }
      } else return false;
    }
  };

  public makeItSound(note: NotePosition) {
    let fretNote = note.name;
    if (note.name.includes('#')) fretNote = note.name.replace('#', 'sh');

    const noteAudio = new Audio(
      `./assets/audios/${note.stringNumber.toString()}/${note.stringNumber.toString()}_${
        note.position
      }_${fretNote}.mp3`
    );
    noteAudio.load();
    noteAudio.play();
  }
}
