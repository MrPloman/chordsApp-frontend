import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFunctionSelectedState } from '@app/store/selectors/function-selection.selector';
import { selectOptionAction } from '@app/store/actions/function-selection.actions';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-function-selector',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],

  templateUrl: './function-selector.component.html',
  styleUrl: './function-selector.component.scss',
})
export class FunctionSelectorComponent {
  private store = inject(Store);
  private functionSelectedStoreSubscription: Subscription = new Subscription();

  public functionSelectedStore = this.store.select(selectFunctionSelectedState);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.functionSelectedStoreSubscription =
      this.functionSelectedStore.subscribe((state) => {});
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.functionSelectedStoreSubscription.unsubscribe();
  }

  public selectOption(option: 'progression' | 'guesser') {
    this.store.dispatch(selectOptionAction({ option }));
  }
}
