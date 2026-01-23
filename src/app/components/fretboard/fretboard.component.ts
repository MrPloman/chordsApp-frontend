import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { dots } from '@app/config/global_variables/dots';
import { fretboard } from '@app/config/global_variables/fretboard';
import { chordsHelper } from '@app/helpers/chords.helper';
import { Chord, NotePosition } from '@app/models/chord.model';
import { SelectedModeService } from '@app/services/SelectedMode/selected-mode-service';
import { editNoteFromChord } from '@app/store/actions/chords.actions';
import { selectChordState } from '@app/store/selectors/chords.selector';
import { ChordsState } from '@app/store/state/chords.state';
import { selectedModeType } from '@app/types/index.types';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fretboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fretboard.component.html',
  styleUrl: './fretboard.component.scss',
})
export class FretboardComponent {
  // Rules
  public currentFretboard = fretboard;
  public currentDots = dots;

  private selectedModeService = inject(SelectedModeService);
  private store = inject(Store);
  private chordsService = chordsHelper;

  private selectionMode: Signal<selectedModeType | undefined> = this.selectedModeService.selectedMode;
  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));

  constructor() {}

  public selectNote(note: NotePosition, chords: Chord[], chordPosition: number) {
    this.makeItSound(note);
    if (chords.length === 0) return;
    switch (this.selectionMode()) {
      case 'guesser':
        // If chord was already defined you cannot change the notes
        if (chords[chordPosition].name) return;
        const _id = this.chordsService.generateId();
        this.store.dispatch(
          editNoteFromChord({
            notePosition: { ...note, _id },
            chordSelected: chordPosition,
          })
        );
        break;
      default:
        break;
    }
  }

  public makeItSound(note: NotePosition) {
    this.chordsService.makeNoteSound(note);
  }
  public isThisNoteSelected = (note: NotePosition, chords: Chord[], chordPosition: number) => {
    if (!note || chordPosition < 0 || chords.length === 0 || !chords[chordPosition] || !chords[chordPosition].notes)
      return false;
    else {
      return chords[chordPosition].notes.find((notePosition: NotePosition) => {
        if (notePosition.stringNumber === note.stringNumber && notePosition.position === note.position) {
          return true;
        } else return false;
      });
    }
  };

  public getChordSelected(chordState: ChordsState | null): number {
    if (!chordState) return -1;
    return chordState.chordSelected;
  }
  public getChords(chordState: ChordsState | null) {
    if (!chordState) return [];
    return chordState.currentChords;
  }
}
