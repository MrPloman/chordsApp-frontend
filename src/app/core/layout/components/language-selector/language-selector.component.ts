import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { languageType } from '@app/shared/types/index.types';
import { setLanguageAction } from '@app/store/actions/language.actions';
import { selectLanguage } from '@app/store/selectors/language.selector';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  imports: [MatButtonToggleModule, CommonModule, TranslateModule],
  standalone: true,
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  private translate = inject(TranslateService);
  private store = inject(Store);
  public languageStore = this.store.select(selectLanguage);

  public selectLanguage(language: languageType) {
    this.translate.use(language);
    this.store.dispatch(setLanguageAction({ language }));
  }
}
