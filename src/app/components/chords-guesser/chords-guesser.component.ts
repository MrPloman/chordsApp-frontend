import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chord, NotePosition } from '@app/models/chord.model';

@Component({
  selector: 'app-chords-guesser',
  imports: [CommonModule],
  templateUrl: './chords-guesser.component.html',
  styleUrl: './chords-guesser.component.scss',
})
export class ChordsGuesserComponent {
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  public addNewChord() {
    this.chords.push(
      new Chord([
        new NotePosition(1, 0, 'E'),
        new NotePosition(2, 0, 'B'),
        new NotePosition(3, 0, 'G'),
        new NotePosition(4, 0, 'D'),
        new NotePosition(5, 0, 'A'),
        new NotePosition(6, 0, 'E'),
      ])
    );
    this.chordSelected = this.chords.length - 1;
  }
  public selectChord(position: number) {
    this.chordSelected = position;
  }

  public removeNote(notePosition: number, chordPosition: number) {
    this.chords = this.chords.map((chordFind: Chord, chordIndex: number) => {
      if (chordIndex === chordPosition) {
        chordFind.notes = chordFind.notes.filter(
          (note: NotePosition, noteIndex: number) => {
            console.log(noteIndex, notePosition);
            if (noteIndex !== notePosition) return note;
            else return;
          }
        );
      }
      return chordFind;
    });
  }
}
