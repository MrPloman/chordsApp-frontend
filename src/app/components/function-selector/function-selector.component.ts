import { Component, inject } from '@angular/core';
import { provideStore, Store, StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';
import { selectFunctionSelected } from '@app/store/selectors/function-selection.selector';
import { selectOptionAction } from '@app/store/actions/function-selection.actions';

@Component({
  selector: 'app-function-selector',
  imports: [],

  templateUrl: './function-selector.component.html',
  styleUrl: './function-selector.component.scss',
})
export class FunctionSelectorComponent {
  private store = inject(Store);
  public functionSelectedStore = this.store.select(selectFunctionSelected);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.functionSelectedStore.subscribe((state) => {
      console.log(state);
    });
  }

  public selectOption(option: 'progression' | 'guesser') {
    this.store.dispatch(selectOptionAction({ option }));
  }
}
