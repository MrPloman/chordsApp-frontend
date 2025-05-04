import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { fretboard } from '@app/config/global_variables/fretboard';
import { dots } from '@app/config/global_variables/dots';
import { Observable, Subscription } from 'rxjs';
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
  private functionSelectedStoreSubscription: Subscription = new Subscription();

  private functionSelectedStore: Observable<any>;

  constructor() {
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
    this.functionSelectedStoreSubscription =
      this.functionSelectedStore.subscribe(({ functionSelected }) => {
        console.log(functionSelected);
      });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.functionSelectedStoreSubscription.unsubscribe();
  }

  public selectNote(note: any) {
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
