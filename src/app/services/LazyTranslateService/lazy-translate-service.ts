import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LazyTranslateService {
  constructor(private translate: TranslateService) {}

  initDefaultLanguage() {
    // Solo para el primer viewport
    requestIdleCallback(() => {
      this.translate.addLangs(['es', 'en']);
      this.translate.setFallbackLang('en');
    });
    this.translate.use('en'); // o detecta navigator.language
  }
}
