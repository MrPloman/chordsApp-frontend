import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { setLanguageAction } from '@app/store/actions/language.actions';
import { selectLanguage } from '@app/store/selectors/language.selector';
import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  imports: [MatButtonToggleModule, TranslatePipe],
  standalone: true,
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  private translate = inject(TranslateService);
  private store = inject(Store);
  private languageStoreSubscription: Subscription = new Subscription();
  public languageStore = this.store.select(selectLanguage);

  public selectLanguage(language: 'es' | 'en') {
    console.log(language);
    this.translate.use(language);
    this.store.dispatch(setLanguageAction({ language }));
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
}
