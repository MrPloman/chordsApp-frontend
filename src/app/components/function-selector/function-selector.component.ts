import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFunctionSelectedState } from '@app/store/selectors/function-selection.selector';
import { selectOptionAction } from '@app/store/actions/function-selection.actions';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { selectChordGuesserState } from '../../store/selectors/chords.selector';
import { Chord } from '@app/models/chord.model';

@Component({
  selector: 'app-function-selector',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],

  templateUrl: './function-selector.component.html',
  styleUrl: './function-selector.component.scss',
})
export class FunctionSelectorComponent {
  private store = inject(Store);
  private functionSelectedStoreSubscription: Subscription = new Subscription();
  private chordGuesserSubscription: Subscription = new Subscription();

  public functionSelectedStore = this.store.select(selectFunctionSelectedState);
  public chordsGuesserStore = this.store.select(selectChordGuesserState);
  public chords: Chord[] = [];

  ngOnInit(): void {
    this.chordGuesserSubscription = this.chordsGuesserStore.subscribe(
      (state) => {
        if (state && state.currentChords) this.chords = state.currentChords;
      }
    );
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.functionSelectedStoreSubscription =
      this.functionSelectedStore.subscribe((state) => {});
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chordGuesserSubscription.unsubscribe();
    this.functionSelectedStoreSubscription.unsubscribe();
  }

  public selectOption(option: 'progression' | 'guesser') {
    this.store.dispatch(selectOptionAction({ option }));
  }
}
