import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  maximRandomNumber,
  minimumChordsToMakeProgression,
} from '@app/config/global_variables/rules';
import { Chord, NotePosition } from '@app/models/chord.model';
import {
  generateId,
  isThisValidChord,
  makeNoteSound,
} from '@app/services/chordsService.service';
import {
  setCurrentChords,
  setChordSelected,
  removeChord,
  removeNoteFromChord,
  changeChordsOrder,
} from '@app/store/actions/chords.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { selectFunctionSelectedState } from '@app/store/selectors/function-selection.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { IFunctionSelectionState } from '@app/store/state/function-selection.state';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { maximChords } from '../../config/global_variables/rules';
import {
  selectLoading,
  selectLoadingState,
} from '@app/store/selectors/loading.selector';
import { LoadingState } from '@app/store/state/loading.state';

@Component({
  selector: 'app-chords-grid',
  imports: [CommonModule, CdkDrag, CdkDropList],
  templateUrl: './chords-grid.component.html',
  styleUrl: './chords-grid.component.scss',
})
export class ChordsGridComponent {
  public loading = false;
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  public maxChords = maximChords;
  public selection: string = '';
  public functionSelectedStore: Observable<any> = new Observable();

  private chordsStore: Observable<any> = new Observable();
  private loadingStore: Observable<any> = new Observable();

  private chordsStoreSubscription: Subscription = new Subscription();
  private loaderSubscription: Subscription = new Subscription();
  private subscriptionFunctionStore: Subscription = new Subscription();

  private store = inject(Store);

  constructor() {
    this.loadingStore = this.store.pipe(select(selectLoadingState));
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
    this.loaderSubscription = this.loadingStore.subscribe(({ loading }) => {
      this.loading = loading.loading;
    });
    this.subscriptionFunctionStore = this.functionSelectedStore.subscribe(
      (value: { functionSelected: IFunctionSelectionState }) => {
        if (!value.functionSelected.option) return;
        this.selection = value.functionSelected.option;
      }
    );
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));
    this.chordsStoreSubscription = this.chordsStore.subscribe(
      (chordsState: IChordsGuesserState) => {
        this.chords = chordsState.currentChords
          ? chordsState.currentChords
          : [];
        this.chordSelected = chordsState.chordSelected
          ? chordsState.chordSelected
          : 0;
      }
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordsStoreSubscription.unsubscribe();
    this.subscriptionFunctionStore.unsubscribe();
    this.loaderSubscription.unsubscribe();
  }

  public addNewChord() {
    if (this.loading) return;
    this.store.dispatch(
      setCurrentChords({
        currentChords: [
          ...this.chords,
          new Chord(
            [
              new NotePosition(1, 0, 'E', generateId()),
              new NotePosition(2, 0, 'B', generateId()),
              new NotePosition(3, 0, 'G', generateId()),
              new NotePosition(4, 0, 'D', generateId()),
              new NotePosition(5, 0, 'A', generateId()),
              new NotePosition(6, 0, 'E', generateId()),
            ],
            '',
            generateId()
          ),
        ],
      })
    );
    this.selectChord(this.chords.length - 1);
  }

  public selectChord(position: number) {
    if (this.loading) return;
    this.store.dispatch(setChordSelected({ chordSelected: position }));
  }
  public deleteChord(chordPosition: number) {
    if (this.loading) return;
    this.store.dispatch(removeChord({ chordToRemove: chordPosition }));
  }

  public removeNote(notePosition: number, chordPosition: number) {
    if (this.loading) return;
    this.store.dispatch(
      removeNoteFromChord({
        noteToRemove: notePosition,
        chordSelected: chordPosition,
      })
    );
  }
  public drop(event: CdkDragDrop<any[]>) {
    if (this.loading) return;
    this.store.dispatch(
      changeChordsOrder({
        originChordPosition: event.previousIndex,
        destinationChordPosition: event.currentIndex,
      })
    );
  }
  public makeChordSound(chord: Chord) {
    chord.notes.forEach((note: NotePosition) => {
      makeNoteSound(note);
    });
  }

  public trackById(index: number, item: any): number {
    return item._id;
  }
}
