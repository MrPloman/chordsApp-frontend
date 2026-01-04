import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FretboardComponent } from './components/fretboard/fretboard.component';
import { FunctionSelectorComponent } from './components/function-selector/function-selector.component';
import { select, Store } from '@ngrx/store';
import { selectFunctionSelectedState } from './store/selectors/function-selection.selector';

import { IFunctionSelectionState } from './store/state/function-selection.state';
import { Observable, Subscription } from 'rxjs';
import { resetSelectionAction } from './store/actions/function-selection.actions';

import { selectLoadingState } from './store/selectors/loading.selector';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FretboardComponent,
    FunctionSelectorComponent,
    LanguageSelectorComponent,
    TranslatePipe,
    RouterOutlet,
  ],
  providers: [
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private store = inject(Store);
  private translate = inject(TranslateService);
  public router = inject(Router);

  public functionSelectedStore: Observable<any>;
  public loading = false;
  private loaderSubscription: Subscription = new Subscription();
  private loadingStore: Observable<any>;
  private subscriptionFunctionStore: Subscription = new Subscription();
  public selection: string | undefined = undefined;

  constructor() {
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('en');
    this.loadingStore = this.store.pipe(select(selectLoadingState));
    this.loaderSubscription = this.loadingStore.subscribe(({ loading }) => {
      this.loading = loading.loading;
    });
    this.functionSelectedStore = this.store.pipe(
      select(selectFunctionSelectedState)
    );
    this.subscriptionFunctionStore = this.functionSelectedStore.subscribe(
      (value: { functionSelected: IFunctionSelectionState }) => {
        this.selection = value.functionSelected.option;
      }
    );
  }

  onVolumeChange(event: any) {
    // Use the updated volume value as needed (e.g., set audio volume)
  }

  ngOnDestroy(): void {
    this.subscriptionFunctionStore.unsubscribe();
    this.loaderSubscription.unsubscribe();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  public resetFunctionSelection() {
    if (this.loading) return;
    this.store.dispatch(resetSelectionAction());
  }
}
