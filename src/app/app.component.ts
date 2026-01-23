import { Component, inject, model, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FretboardComponent } from './components/fretboard/fretboard.component';
import { FunctionSelectorComponent } from './components/function-selector/function-selector.component';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { IconService } from './services/iconService.service';
import { LazyTranslateService } from './services/LazyTranslateService/lazy-translate-service';
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
  private translate = inject(TranslateService);
  private iconService = inject(IconService);
  private lazyTranslate = inject(LazyTranslateService);
  public router = inject(Router);

  public selectedMode: Signal<selectedModeType | undefined> = model(undefined);
  public loading = false;
  private loaderSubscription: Subscription = new Subscription();
  private subscriptionFunctionStore: Subscription = new Subscription();

  constructor() {}

  onVolumeChange(event: any) {
    // Use the updated volume value as needed (e.g., set audio volume)
  }

  ngOnDestroy(): void {
    this.subscriptionFunctionStore.unsubscribe();
    this.loaderSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    requestIdleCallback(() => {
      this.lazyTranslate.initDefaultLanguage();
    });
  }
}
