import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { editNoteFromChord } from '@app/application/chords/store/chords.actions';
import { selectChordState } from '@app/application/chords/store/chords.selector';
import { ChordsState } from '@app/application/chords/store/chords.state';
import { dots } from '@app/core/constants/dots';
import { fretboard } from '@app/core/constants/fretboard';
import { SelectedModeService } from '@app/core/services/SelectedMode/selected-mode-service';
import { selectedModeType } from '@app/core/types/index.types';
import { Chord } from '@app/domain/chords/models/chord.model';
import { NotePosition } from '@app/domain/chords/models/note-position.model';
import { chordsHelper } from '@app/shared/helpers/chords.helper';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fretboard',
  standalone: true,
  imports: [CommonModule, LayoutModule],
  templateUrl: './fretboard.component.html',
  styleUrl: './fretboard.component.scss',
})
export class FretboardComponent {
  // Rules
  public currentFretboard = fretboard;
  public currentDots = [...dots];

  private selectedModeService = inject(SelectedModeService);
  private store = inject(Store);
  private chordsService = chordsHelper;

  public selectionMode: Signal<selectedModeType | undefined> = this.selectedModeService.selectedMode;
  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));

  private breakpointObserver = inject(BreakpointObserver);
  screenWidth785px: boolean = false;

  constructor() {}
  public makeitMobile(value: any) {
    return String(Number(value / 2));
  }
  ngOnInit(): void {
    const bPoint768px = '(max-width: 768px)';
    this.breakpointObserver.observe(bPoint768px).subscribe((x) => {
      this.screenWidth785px = x.breakpoints[bPoint768px];
    });
  }

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
            currentChordSelected: chordPosition,
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
    return chordState.currentChordSelected;
  }
  public getChords(chordState: ChordsState | null) {
    if (!chordState) return [];
    return chordState.currentChords;
  }
}
