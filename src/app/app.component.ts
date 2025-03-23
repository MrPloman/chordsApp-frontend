import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { FretboardComponent } from './components/fretboard/fretboard.component';
import { FunctionSelectorComponent } from './components/function-selector/function-selector.component';
import { select, State, Store } from '@ngrx/store';
import {
  selectFunctionSelected,
  selectFunctionSelectedState,
} from './store/selectors/function-selection.selector';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { IFunctionSelectionState } from './store/state/function-selection.state';
import { Observable, Subscription } from 'rxjs';
import { ChordsGuesserComponent } from './components/chords-guesser/chords-guesser.component';
import { ChordsProgressionComponent } from './components/chords-progression/chords-progression.component';
import {
  resetSelectionAction,
  selectOptionAction,
} from './store/actions/function-selection.actions';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatSliderModule,
    FormsModule,
    FretboardComponent,
    FunctionSelectorComponent,
    ChordsGuesserComponent,
    ChordsProgressionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private store = inject(Store);
  public functionSelectedStore: Observable<any>;
  private subscriptionStore: Subscription = new Subscription();
  public selection: string | undefined = undefined;
  constructor() {
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
    this.subscriptionStore = this.functionSelectedStore.subscribe(
      (value: { functionSelected: IFunctionSelectionState }) => {
        this.selection = value.functionSelected.option;
      }
    );
  }

  onVolumeChange(event: any) {
    // Use the updated volume value as needed (e.g., set audio volume)
  }

  ngOnDestroy(): void {
    this.subscriptionStore.unsubscribe();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  public resetFunctionSelection() {
    this.store.dispatch(resetSelectionAction());
  }
}
