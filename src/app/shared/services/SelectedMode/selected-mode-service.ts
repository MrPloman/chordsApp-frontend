import { Injectable, signal } from '@angular/core';
import { setLocalStorage } from '@app/shared/helpers/local-storage.helper';
import { selectedModeType } from '@app/shared/types/index.types';

@Injectable({ providedIn: 'root' })
export class SelectedModeService {
  private _selectedModeData = signal<selectedModeType | undefined>(undefined);
  public selectedMode = this._selectedModeData.asReadonly();

  public setSelectedMode(mode: selectedModeType | undefined) {
    if (!mode) return;
    setLocalStorage('selectedMode', mode);
    this._selectedModeData.set(mode);
  }

  constructor() {}
}
