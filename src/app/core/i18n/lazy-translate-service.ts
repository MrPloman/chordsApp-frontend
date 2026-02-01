import { Injectable } from '@angular/core';
import { languageType } from '@app/types/index.types';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LazyTranslateService {
  constructor(private translate: TranslateService) {}

  initDefaultLanguage(language: languageType) {
    // Solo para el primer viewport
    requestIdleCallback(() => {
      this.translate.addLangs(['es', 'en']);
      this.translate.setFallbackLang(language);
    });
    this.translate.use(language); // o detecta navigator.language
  }
}
