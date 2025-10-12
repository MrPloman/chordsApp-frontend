import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { Chord, NotePosition } from '@app/models/chord.model';
import { generateId, makeNoteSound } from '@app/services/chordsService.service';
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
import { selectLoadingState } from '@app/store/selectors/loading.selector';
import { trigger, transition, style, animate } from '@angular/animations';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chords-grid',
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './chords-grid.component.html',
  styleUrl: './chords-grid.component.scss',
  animations: [
    trigger('fadeAndSlide', [
      // Define a transition for when the element is added to the DOM (:enter)
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '500ms ease-in',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      // Optional: Define a transition for when the element is removed from the DOM (:leave)
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'translateY(20px)' })
        ),
      ]),
    ]),
  ],
})
export class ChordsGridComponent {
  @Input() currentChordsDisplayMode: boolean = true;
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

    // if is a normal display get the chords from the state
    this.chordsStoreSubscription = this.chordsStore.subscribe(
      (chordsState: IChordsGuesserState) => {
        this.chords = chordsState.currentChords
          ? chordsState.currentChords
          : [];
        this.chordSelected = chordsState.chordSelected
          ? chordsState.chordSelected
          : 0;

        // this.chordSelected = chordsState.chordSelected
        //    chordsState.chordSelected
        //   : 0;
        // if (!chordsState.currentChords) this.chords = [];
        // else {
        //   if (
        //     chordsState.currentChords &&
        //     chordsState.currentChords[this.chordSelected] &&
        //     chordsState.currentChords[this.chordSelected].alternativeChords &&
        //   ) {

        //   }

        // }

        // if (!this.currentChordsDisplayMode && this.chords.length > 0 && this.chords[this.chordSelected].alternativeChords !== undefined) {
        //   this.chords = this.chords[this.chordSelected].alternativeChords

        // }
      }
    );
  }
  ngOnInit(): void {
    if (!this.currentChordsDisplayMode) {
      this.chordSelected = 0;
      this.chords = [];
    }

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordsStoreSubscription.unsubscribe();
    this.subscriptionFunctionStore.unsubscribe();
    this.loaderSubscription.unsubscribe();
  }

  public addNewChord() {
    if (this.loading || !this.currentChordsDisplayMode) return;
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
    if (this.loading || !this.currentChordsDisplayMode) return;
    this.store.dispatch(setChordSelected({ chordSelected: position }));
  }
  public deleteChord(chordPosition: number) {
    if (this.loading || !this.currentChordsDisplayMode) return;
    this.store.dispatch(removeChord({ chordToRemove: chordPosition }));
  }

  public removeNote(notePosition: number, chordPosition: number) {
    if (this.loading || !this.currentChordsDisplayMode) return;
    this.store.dispatch(
      removeNoteFromChord({
        noteToRemove: notePosition,
        chordSelected: chordPosition,
      })
    );
  }
  public drop(event: CdkDragDrop<any[]>) {
    if (this.loading || !this.currentChordsDisplayMode) return;
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
