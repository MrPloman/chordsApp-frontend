import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { FretboardComponent } from './components/fretboard/fretboard.component';
import { FunctionSelectorComponent } from './components/function-selector/function-selector.component';
import { select, State, Store } from '@ngrx/store';
import { selectFunctionSelectedState } from './store/selectors/function-selection.selector';
import { CommonModule } from '@angular/common';
import { IFunctionSelectionState } from './store/state/function-selection.state';
import { Observable, Subscription } from 'rxjs';
import { ChordsGuesserComponent } from './components/chords-guesser/chords-guesser.component';
import { ChordsProgressionComponent } from './components/chords-progression/chords-progression.component';
import { resetSelectionAction } from './store/actions/function-selection.actions';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { selectLoadingState } from './store/selectors/loading.selector';
import { ChordsOptionsComponent } from './components/chords-options/chords-options.component';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import {
  TranslateService,
  TranslatePipe,
  TranslateDirective,
} from '@ngx-translate/core';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { ChordsHandbookComponent } from './components/chords-handbook/chords-handbook.component';
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
    ChordsOptionsComponent,
    ChordsHandbookComponent,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    TranslatePipe,
    MatButtonToggleModule,
    LanguageSelectorComponent,
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
