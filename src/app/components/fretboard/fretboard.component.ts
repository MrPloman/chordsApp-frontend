import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { fretboard } from '@app/config/global_variables/fretboard';
import { dots } from '@app/config/global_variables/dots';

@Component({
  selector: 'app-fretboard',
  imports: [CommonModule],
  templateUrl: './fretboard.component.html',
  styleUrl: './fretboard.component.scss',
})
export class FretboardComponent {
  public currentFretboard = fretboard;
  public currentDots = dots;
  public makeItSound(note: any) {
    let fretNote = note.note;
    if (note.note.includes('#')) fretNote = note.note.replace('#', 'sh');

    const noteAudio = new Audio(
      `./assets/audios/${note.string}/${note.string}_${note.position}_${fretNote}.mp3`
    );
    noteAudio.load();
    noteAudio.play();
  }
  public topDotChecker(note: any) {
    return false;
  }

  public bottomDotChecker(note: any) {
    return false;
  }
}
