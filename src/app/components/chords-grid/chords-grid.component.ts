import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { Chord, NotePosition } from '@app/models/chord.model';
import { makeNoteSound } from '@app/services/chordsService.service';
import { SelectedModeService } from '@app/services/selectedModeService.service';
import {
  addChordToCurrentChords,
  changeChordsOrder,
  hideChord,
  removeChord,
  removeNoteFromChord,
  setAlternativeChordSelected,
  setChordSelected,
  setHandbookChordsSelected,
} from '@app/store/actions/chords.actions';
import { loadingStatus } from '@app/store/actions/loading.actions';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { selectLoadingState } from '@app/store/selectors/loading.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
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
  private store = inject(Store);
  private selectedModeService = inject(SelectedModeService);

  // // chords container variables
  // public chords: Chord[] = [];
  // public alternativeChords: Chord[] = [];
  // public handbookChords: Chord[] = [];

  // // chord selected variables
  // public chordSelected: number = 0;
  // public alternativeChordSelected: number = 0;
  // public handbookChordSelected: number = 0;

  // Rules
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;
  public maxChords = maximChords;

  // Status
  public selectedMode: Signal<selectedModeType | undefined> = this.selectedModeService.selectedMode;
  public loading = false;

  // Observavbles for NGRX Store
  public chordsStore: Observable<IChordsGuesserState>;
  public loadingStore: Observable<{ loading: boolean }> = new Observable();

  //Subscription to Stores
  // private chordsStoreSubscription: Subscription = new Subscription();
  // private loaderSubscription: Subscription = new Subscription();
  // private subscriptionFunctionStore: Subscription = new Subscription();

  constructor() {
    // Global Loading Store Subscription
    this.loadingStore = this.store.pipe(select(selectLoadingState));

    // Chords Store Subscription
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));
    // this.chordsStoreSubscription = this.chordsStore.subscribe((chordsState: IChordsGuesserState) => {
    //   this.chords = chordsState.currentChords ? chordsState.currentChords : [];
    //   this.chordSelected = chordsState.chordSelected ? chordsState.chordSelected : 0;
    //   if (this.selectedMode() === 'options') {
    //     this.alternativeChords = chordsState.alternativeChords ? chordsState.alternativeChords : [];
    //     this.alternativeChordSelected = chordsState.alternativeChordSelected ? chordsState.alternativeChordSelected : 0;
    //   }
    //   if (this.selectedMode() === 'handbook') {
    //     this.handbookChords = chordsState.handbookChords ? chordsState.handbookChords : [];
    //     this.handbookChordSelected =
    //       chordsState.handbookChordsSelected !== undefined ? chordsState.handbookChordsSelected : 0;
    //   }
    // });
  }
  ngOnInit(): void {
    if (this.selectedMode() === 'options') this.getNewAlternativeChords();
  }
  ngOnDestroy(): void {
    // this.chordsStoreSubscription.unsubscribe();
    // this.subscriptionFunctionStore.unsubscribe();
    // this.loaderSubscription.unsubscribe();
  }

  public addNewChord(chord: Chord) {
    if (this.loading) return;
    this.store.dispatch(
      addChordToCurrentChords({
        newChord: chord,
      })
    );
  }

  public selectChord(position: number) {
    if (this.loading) return;
    this.store.dispatch(setChordSelected({ chordSelected: position }));
    if (!this.selectedMode() || this.selectedMode() !== 'options') return;
    this.getNewAlternativeChords();
  }

  private setAlternativeChords(currentChordSelected: number) {
    this.store.dispatch(loadingStatus({ loading: true }));
    this.store.dispatch(setChordSelected({ chordSelected: currentChordSelected }));
    // this.store.dispatch(
    //   setAlternativeChordsOptions({
    //     alternativeChords: this.chords[this.chordSelected].alternativeChords,
    //     chordSelected: this.chordSelected,
    //     alternativeChordSelected: this.alternativeChordSelected,
    //   })
    // );
    this.store.dispatch(loadingStatus({ loading: false }));
  }

  private getNewAlternativeChords() {
    // if (
    //   this.chords &&
    //   this.chords.length > 0 &&
    //   this.chordSelected !== undefined &&
    //   this.chords[this.chordSelected].alternativeChords &&
    //   this.chords[this.chordSelected].alternativeChords.length > 0
    // ) {
    //   this.setAlternativeChords();
    //   return;
    // }
    // this.alternativeChords = [];
    // this.alternativeChordSelected = 0;
    // this.store.dispatch(
    //   setAlternativeChordsOptions({
    //     alternativeChords: [],
    //     chordSelected: this.chordSelected,
    //     alternativeChordSelected: this.alternativeChordSelected,
    //   })
    // );
    // this.store.dispatch(
    //   setAlternativeChordSelected({
    //     alternativeChordSelected: this.alternativeChordSelected,
    //   })
    // );
  }

  public selectAlternativeChord(position: number) {
    if (this.loading) return;

    // this.alternativeChordSelected = position;
    this.store.dispatch(setAlternativeChordSelected({ alternativeChordSelected: position }));
  }

  public selecthandbookChord(position: number) {
    if (this.loading) return;
    this.store.dispatch(setHandbookChordsSelected({ handbookChordsSelected: position }));
    // this.handbookChordSelected = position;
  }

  public deleteChord(chordPosition: number) {
    if (this.loading) return;
    this.hideChord(chordPosition);
    setTimeout(() => {
      this.store.dispatch(removeChord({ chordToRemove: chordPosition }));
    }, 300);
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

  public hideChord(_chordPosition: number) {
    this.store.dispatch(hideChord({ chordPosition: _chordPosition }));
  }

  public trackById(index: number, item: any): number | undefined {
    return item && item._id ? item._id : undefined;
  }
}
