import { Component, inject, model, OnInit, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LanguageSelectorComponent } from '@app/core/layout/components/language-selector/language-selector.component';
import { SelectedModeService } from '@app/services/SelectedMode/selected-mode-service';
import { selectedModeType } from '@app/types/index.types';
import { TranslatePipe } from '@ngx-translate/core';
import { FretboardComponent } from './components/fretboard/fretboard.component';
import { FunctionSelectorComponent } from './components/function-selector/function-selector.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [FretboardComponent, FunctionSelectorComponent, LanguageSelectorComponent, TranslatePipe, RouterOutlet],
})
export class MainLayoutComponent implements OnInit {
  public router = inject(Router);
  public selectedMode: Signal<selectedModeType | undefined> = model(undefined);
  private selectedModeService = inject(SelectedModeService);

  constructor() {}

  ngOnInit(): void {
    this.selectedMode = this.selectedModeService.selectedMode;
  }
}
