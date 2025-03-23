import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { fretboard } from '@app/config/global_variables/fretboard';
import { dots } from '@app/config/global_variables/dots';
import { Observable } from 'rxjs';
import { selectFunctionSelectedState } from '@app/store/selectors/function-selection.selector';
import { select, Store } from '@ngrx/store';

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

  private functionSelectedStore: Observable<any>;

  constructor() {
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
  }

  public selectNote(note: any) {
    this.functionSelectedStore.subscribe(({ functionSelected }) => {
      console.log(functionSelected);
    });
    this.makeItSound(note);
  }

  public makeItSound(note: any) {
    let fretNote = note.note;
    if (note.note.includes('#')) fretNote = note.note.replace('#', 'sh');

    const noteAudio = new Audio(
      `./assets/audios/${note.string}/${note.string}_${note.position}_${fretNote}.mp3`
    );
    noteAudio.load();
    noteAudio.play();
  }
}
