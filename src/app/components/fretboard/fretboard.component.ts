import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { dots } from '@app/config/global_variables/dots';
import { fretboard } from '@app/config/global_variables/fretboard';
import { Chord, NotePosition } from '@app/models/chord.model';
import { generateId, makeNoteSound } from '@app/services/chordsService.service';
import { SelectedModeService } from '@app/services/selectedModeService.service';
import { editNoteFromChord } from '@app/store/actions/chords.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { selectLoadingState } from '@app/store/selectors/loading.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { selectedModeType } from '@app/types/index.types';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-fretboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fretboard.component.html',
  styleUrl: './fretboard.component.scss',
})
export class FretboardComponent {
  public currentFretboard = fretboard;
  public currentDots = dots;
  public loading: boolean = false;

  private currentChord: Chord = new Chord([], [], '', generateId());
  private selectedModeService = inject(SelectedModeService);

  private selectionMode: Signal<selectedModeType | undefined> = this.selectedModeService.selectedMode;
  private chordPosition: number = 0;
  private chords: Chord[] = [];

  private store = inject(Store);

  private chordsStoreSubscription: Subscription = new Subscription();
  private loaderSubscription: Subscription = new Subscription();

  private chordsStore: Observable<any> = new Observable();
  private loadingStore: Observable<any> = new Observable();

  constructor() {
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));

    this.loadingStore = this.store.pipe(select(selectLoadingState));
    this.loaderSubscription = this.loadingStore.subscribe(({ loading }) => {
      this.loading = loading.loading;
    });

    this.chordsStoreSubscription = this.chordsStore.subscribe((chordGuesserState: IChordsGuesserState) => {
      if (!chordGuesserState || !chordGuesserState.currentChords || chordGuesserState.chordSelected === undefined) {
        return;
      }
      this.chordPosition = chordGuesserState.chordSelected;
      this.currentChord = chordGuesserState.currentChords[chordGuesserState.chordSelected];
      this.chords = chordGuesserState.currentChords;
    });
  }
  ngOnDestroy(): void {
    this.chordsStoreSubscription.unsubscribe();
    this.loaderSubscription.unsubscribe();
  }

  public selectNote(note: NotePosition) {
    if (this.loading) return;
    this.makeItSound(note);
    if (this.chords.length === 0) return;
    switch (this.selectionMode()) {
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

  public isThisNoteSelected = (note: NotePosition) => {
    if (!note || !this.currentChord) {
      return false;
    } else {
      return this.currentChord.notes.find((notePosition: NotePosition) => {
        if (notePosition.stringNumber === note.stringNumber && notePosition.position === note.position) {
          return true;
        } else return false;
      });
    }
  };

  public makeItSound(note: NotePosition) {
    makeNoteSound(note);
  }
}
