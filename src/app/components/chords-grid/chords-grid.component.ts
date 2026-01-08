import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, Signal } from '@angular/core';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { Chord, NotePosition } from '@app/models/chord.model';
import { generateId, makeNoteSound } from '@app/services/chordsService.service';
import {
  setCurrentChords,
  setChordSelected,
  removeChord,
  removeNoteFromChord,
  changeChordsOrder,
  setAlternativeChordSelected,
  setAlternativeChordsOptions,
  setHandbookChordsSelected,
} from '@app/store/actions/chords.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { maximChords } from '../../config/global_variables/rules';
import { selectLoadingState } from '@app/store/selectors/loading.selector';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AIService } from '@app/services/AIService.service';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { selectedModeType } from '@app/types/index.types';
import { SelectedModeService } from '@app/services/selectedModeService.service';

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
  @Input() chordOptionsDisplay: boolean = false;
  @Input() handbookDisplay: boolean = false;

  public chords: Chord[] = [];
  public alternativeChords: Chord[] = [];
  public handbookChords: Chord[] = [];

  public chordSelected: number = 0;
  public alternativeChordSelected: number = -1;
  public handbookChordSelected: number = -1;

  public loading = false;

  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  public maxChords = maximChords;

  public selectedMode = signal<selectedModeType | undefined>(undefined);

  private chordsStore: Observable<any> = new Observable();
  private loadingStore: Observable<any> = new Observable();

  private chordsStoreSubscription: Subscription = new Subscription();
  private loaderSubscription: Subscription = new Subscription();
  private subscriptionFunctionStore: Subscription = new Subscription();

  private store = inject(Store);
  private aiService = inject(AIService);
  private selectedModeService = inject(SelectedModeService);

  constructor() {
    // store loader
    this.loadingStore = this.store.pipe(select(selectLoadingState));
    this.loaderSubscription = this.loadingStore.subscribe(({ loading }) => {
      this.loading = loading.loading;
    });

    // // function store
    // this.functionSelectedStore = this.store.pipe(
    //   select(selectFunctionSelectedState)
    // );
    // this.subscriptionFunctionStore = this.functionSelectedStore.subscribe(
    //   (value: { functionSelected: IFunctionSelectionState }) => {
    //     if (!value.functionSelected.option) return;
    //     this.selection = value.functionSelected.option;
    //   }
    // );

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
        if (this.chordOptionsDisplay) {
          this.alternativeChords = chordsState.alternativeChords
            ? chordsState.alternativeChords
            : [];
          this.alternativeChordSelected = chordsState.alternativeChordSelected
            ? chordsState.alternativeChordSelected
            : 0;
        }
        if (this.handbookDisplay) {
          this.handbookChords = chordsState.handbookChords
            ? chordsState.handbookChords
            : [];
          this.handbookChordSelected =
            chordsState.handbookChordsSelected !== undefined
              ? chordsState.handbookChordsSelected
              : 0;
        }
      }
    );
  }
  ngOnInit(): void {
    this.getNewAlternativeChords();
    this.selectedMode.set(this.selectedModeService.selectedMode());
    console.log(this.selectedMode());
  }
  ngOnDestroy(): void {
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
            [],
            '',
            generateId()
          ),
        ],
      })
    );
    this.store.dispatch(
      setChordSelected({ chordSelected: this.chords.length - 1 })
    );
  }

  public selectChord(position: number) {
    if (
      this.loading ||
      (this.chordSelected === position && this.chords.length > 0)
    )
      return;
    this.chordSelected = position;
    this.store.dispatch(setChordSelected({ chordSelected: position }));
    if (!this.chordOptionsDisplay) return;
    this.getNewAlternativeChords();
  }

  private setAlternativeChords() {
    this.store.dispatch(loadingStatus({ loading: true }));
    this.store.dispatch(
      setAlternativeChordsOptions({
        alternativeChords: this.chords[this.chordSelected].alternativeChords,
        chordSelected: this.chordSelected,
      })
    );
    this.store.dispatch(loadingStatus({ loading: false }));
  }

  private getNewAlternativeChords() {
    if (
      this.chords &&
      this.chords.length > 0 &&
      this.chordSelected !== undefined &&
      this.chords[this.chordSelected].alternativeChords &&
      this.chords[this.chordSelected].alternativeChords.length > 0
    ) {
      this.setAlternativeChords();
      return;
    }
    this.alternativeChords = [];
    this.alternativeChordSelected = -1;
    this.store.dispatch(
      setAlternativeChordsOptions({
        alternativeChords: [],
        chordSelected: this.chordSelected,
      })
    );
    this.store.dispatch(
      setAlternativeChordSelected({
        alternativeChordSelected: this.alternativeChordSelected,
      })
    );
  }

  public selectAlternativeChord(position: number) {
    if (this.loading) return;

    this.alternativeChordSelected = position;
    this.store.dispatch(
      setAlternativeChordSelected({ alternativeChordSelected: position })
    );
  }

  public selecthandbookChord(position: number) {
    if (this.loading) return;
    this.store.dispatch(
      setHandbookChordsSelected({ handbookChordsSelected: position })
    );
    this.handbookChordSelected = position;
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
