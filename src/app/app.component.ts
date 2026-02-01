import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { LazyTranslateService } from './core/i18n/lazy-translate-service';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { chordsHelper } from './helpers/chords.helper';
import { languageHelper } from './helpers/language.helper';
import { getLocalStorage } from './helpers/local-storage.helper';
import { IconService } from './services/IconService/icon-service';
import { SelectedModeService } from './services/SelectedMode/selected-mode-service';
import { setWholeChordsState } from './store/actions/chords.actions';
import { setLanguageAction } from './store/actions/language.actions';
import { languageType } from './types/index.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
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
  template: `<app-main-layout></app-main-layout> `,
})
export class AppComponent {
  private store = inject(Store);
  public iconService = inject(IconService);
  private lazyTranslate = inject(LazyTranslateService);
  private selectedModeService = inject(SelectedModeService);
  private language: languageType = 'en';

  constructor() {
    const _language = getLocalStorage('language');
    const _chordStore = getLocalStorage('chords');
    const _selectedMode = getLocalStorage('selectedMode');
    this.selectedModeService.setSelectedMode(_selectedMode);
    if (languageHelper.languageIsEmptyObject(_language)) {
      this.language = 'en';
      this.store.dispatch(setLanguageAction({ language: 'en' }));
    } else {
      this.language = _language;
      this.store.dispatch(setLanguageAction({ language: _language }));
    }
    if (chordsHelper.isChordState(_chordStore))
      this.store.dispatch(setWholeChordsState({ chords: { ..._chordStore } }));
  }

  ngAfterViewInit() {
    requestIdleCallback(() => {
      this.lazyTranslate.initDefaultLanguage(this.language);
    });
  }
}
