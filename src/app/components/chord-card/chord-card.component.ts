import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, Signal, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { Chord, NotePosition } from '@app/models/chord.model';
import { generateId, makeNoteSound } from '@app/services/chordsService.service';
import { selectedModeType } from '@app/types/index.types';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chord-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './chord-card.component.html',
  styleUrl: './chord-card.component.scss',
})
export class ChordCardComponent {
  private store = inject(Store);

  // new chord system
  @Input({ required: false }) newChordUI: boolean = false;
  @Output() emitNewChord = new EventEmitter<Chord>();

  // regular chord system
  @Input({ required: false }) selectedMode: Signal<selectedModeType | undefined> = signal('guesser');
  @Input({ required: false }) currentChordsLength: number = 0;
  @Input({ required: false }) chord!: Chord;
  @Input({ required: false }) chordPosition: number = 0;
  @Input({ required: false }) isSelected: boolean = false;

  @Output() emitChordSelected = new EventEmitter<number>();
  @Output() emitDeleteChord = new EventEmitter<number>();
  @Output() emitRemoveNote = new EventEmitter<{ notePosition: number; chordPosition: number }>();

  // global system
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;

  constructor() {}

  public addNewChord() {
    const _chord = new Chord(
      [
        new NotePosition(1, 0, 'E', generateId()),
        new NotePosition(2, 0, 'B', generateId()),
        new NotePosition(3, 0, 'G', generateId()),
        new NotePosition(4, 0, 'D', generateId()),
        new NotePosition(5, 0, 'A', generateId()),
        new NotePosition(6, 0, 'E', generateId()),
      ],
      [],
      '',
      generateId()
    );
    this.emitNewChord.emit(_chord);
  }

  public deleteChord() {
    this.emitDeleteChord.emit(this.chordPosition);
  }

  public removeNote(notePosition: number) {
    this.emitRemoveNote.emit({ notePosition: notePosition, chordPosition: this.chordPosition });
  }

  public makeChordSound() {
    if (!this.chord || this.chord.notes.length <= 0) return;
    this.chord.notes.forEach((note: NotePosition) => {
      makeNoteSound(note);
    });
  }

  public trackById(index: number, item: any): number | undefined {
    return item && item._id ? item._id : undefined;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
