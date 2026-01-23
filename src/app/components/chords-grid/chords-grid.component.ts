import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { chordsHelper } from '@app/helpers/chords.helper';
import { Chord, NotePosition } from '@app/models/chord.model';
import { SelectedModeService } from '@app/services/selectedModeService.service';
import {
  addChordToCurrentChords,
  changeChordsOrder,
  hideChord,
  removeChord,
  removeNoteFromChord,
  setAlternativeChordSelected,
  setChordSelected,
  setCurrentChordSelectedAndCheckAlternativeChords,
  setHandbookChordsSelected,
} from '@app/store/actions/chords.actions';
import { selectChordState } from '@app/store/selectors/chords.selector';
import { ChordsState } from '@app/store/state/chords.state';
import { selectedModeType } from '@app/types/index.types';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { maximChords } from '../../config/global_variables/rules';
import { ChordCardComponent } from '../chord-card/chord-card.component';

@Component({
  selector: 'app-chords-grid',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ChordCardComponent,
  ],
  templateUrl: './chords-grid.component.html',
  styleUrl: './chords-grid.component.scss',
})
export class ChordsGridComponent {
  // services
  private chordsService = chordsHelper;

  private store = inject(Store);
  private selectedModeService = inject(SelectedModeService);

  // Rules
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  public maxChords = maximChords;

  // Status
  public selectedMode: Signal<selectedModeType | undefined> = this.selectedModeService.selectedMode;

  // Observavbles for NGRX Store
  public chordsStore: Observable<ChordsState> = this.store.pipe(select(selectChordState));

  ngOnInit(): void {
    // if (this.selectedMode() === 'options') this.getNewAlternativeChords();
  }

  public addNewChord(chord: Chord) {
    this.store.dispatch(
      addChordToCurrentChords({
        newChord: chord,
      })
    );
  }

  public selectChord(position: number) {
    this.store.dispatch(setChordSelected({ chordSelected: position }));
    if (!this.selectedMode() || this.selectedMode() !== 'options') return;
    this.store.dispatch(setCurrentChordSelectedAndCheckAlternativeChords({ chordSelected: position }));
  }

  private setAlternativeChords(currentChordSelected: number) {
    this.store.dispatch(setChordSelected({ chordSelected: currentChordSelected }));
  }

  public selectAlternativeChord(position: number) {
    this.store.dispatch(setAlternativeChordSelected({ alternativeChordSelected: position }));
  }

  public selectHandbookChord(position: number) {
    this.store.dispatch(setHandbookChordsSelected({ handbookChordsSelected: position }));
  }

  public deleteChord(chordPosition: number) {
    this.hideChord(chordPosition);
    setTimeout(() => {
      this.store.dispatch(removeChord({ chordToRemove: chordPosition }));
    }, 300);
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
    this.store.dispatch(
      changeChordsOrder({
        originChordPosition: event.previousIndex,
        destinationChordPosition: event.currentIndex,
      })
    );
  }
  public makeChordSound(chord: Chord) {
    chord.notes.forEach((note: NotePosition) => {
      this.chordsService.makeNoteSound(note);
    });
  }

  public hideChord(_chordPosition: number) {
    this.store.dispatch(hideChord({ chordPosition: _chordPosition }));
  }

  public trackById(index: number, item: any): number | undefined {
    return item && item._id ? item._id : undefined;
  }
}
