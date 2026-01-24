import { Component, inject, model, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { FretboardComponent } from './components/fretboard/fretboard.component';
import { FunctionSelectorComponent } from './components/function-selector/function-selector.component';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { chordsHelper } from './helpers/chords.helper';
import { languageHelper } from './helpers/language.helper';
import { getLocalStorage } from './helpers/local-storage.helper';
import { IconService } from './services/IconService/icon-service';
import { LazyTranslateService } from './services/LazyTranslateService/lazy-translate-service';
import { setWholeChordsState } from './store/actions/chords.actions';
import { setLanguageAction } from './store/actions/language.actions';
import { selectedModeType } from './types/index.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FretboardComponent, FunctionSelectorComponent, LanguageSelectorComponent, TranslatePipe, RouterOutlet],
  providers: [
    LazyTranslateService,
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
  public iconService = inject(IconService);
  private lazyTranslate = inject(LazyTranslateService);
  public router = inject(Router);

  public selectedMode: Signal<selectedModeType | undefined> = model(undefined);

  constructor() {
    const _language = getLocalStorage('language');
    const _chordStore = getLocalStorage('chords');
    if (languageHelper.languageIsEmptyObject(_language)) this.store.dispatch(setLanguageAction({ language: 'en' }));
    else this.store.dispatch(setLanguageAction({ language: _language }));
    if (chordsHelper.isChordState(_chordStore)) this.store.dispatch(setWholeChordsState({ chordsState: _chordStore }));
  }

  ngAfterViewInit() {
    requestIdleCallback(() => {
      this.lazyTranslate.initDefaultLanguage();
    });
  }
}
