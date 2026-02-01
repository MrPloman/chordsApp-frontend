import { Component, inject, model, OnInit, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FretboardComponent } from '@app/components/fretboard/fretboard.component';
import { FunctionSelectorComponent } from '@app/components/function-selector/function-selector.component';
import { LanguageSelectorComponent } from '@app/components/language-selector/language-selector.component';
import { selectedModeType } from '@app/types/index.types';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectedModeService } from '../../services/SelectedMode/selected-mode-service';

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
