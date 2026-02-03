import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { minimumChordsToMakeProgression } from '@app/core/constants/rules';
import { selectedModeType } from '@app/core/types/index.types';
import { Chord } from '@app/domain/chords/models/chord.model';
import { NotePosition } from '@app/domain/chords/models/note-position.model';
import { FadeAndSlideDirective } from '@app/shared/directives/fade-and-slide/fade-and-slide.directive';
import { chordsHelper } from '@app/shared/helpers/chords.helper';

@Component({
  selector: 'app-chord-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, FadeAndSlideDirective],
  templateUrl: './chord-card.component.html',
  styleUrl: './chord-card.component.scss',
})
export class ChordCardComponent {
  // global system
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;

  private chordsService = chordsHelper;
  // button new chord system
  @Input({ required: false }) newChordUI: boolean = false;
  @Output() emitNewChord = new EventEmitter<Chord>();

  // regular chord system
  @Input({ required: false }) selectedMode: Signal<selectedModeType | undefined> = signal('guesser');
  @Input({ required: false }) currentChordsLength: number = 0;
  @Input({ required: false }) chord!: Chord;
  @Input({ required: false }) chordPosition: number = 0;
  @Input({ required: false }) isSelected: boolean = false;
  @Input({ required: false }) visible: boolean = false;

  @Output() emitChordSelected = new EventEmitter<number>();
  @Output() emitDeleteChord = new EventEmitter<number>();
  @Output() emitRemoveNote = new EventEmitter<{ notePosition: number; chordPosition: number }>();

  constructor() {}

  public addNewChord() {
    const _chord = new Chord(
      [
        new NotePosition(1, 0, 'E', this.chordsService.generateId()),
        new NotePosition(2, 0, 'B', this.chordsService.generateId()),
        new NotePosition(3, 0, 'G', this.chordsService.generateId()),
        new NotePosition(4, 0, 'D', this.chordsService.generateId()),
        new NotePosition(5, 0, 'A', this.chordsService.generateId()),
        new NotePosition(6, 0, 'E', this.chordsService.generateId()),
      ],
      [],
      '',
      this.chordsService.generateId(),
      false
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
      this.chordsService.makeNoteSound(note);
    });
  }

  public trackById(index: number, item: any): number | undefined {
    return item && item._id ? item._id : undefined;
  }
}
