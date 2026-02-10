import { Injectable, signal } from '@angular/core';
import { selectedModeType } from '@app/core/types/index.types';
import { clearLocalStorage, setLocalStorage } from '@app/shared/helpers/local-storage.helper';

@Injectable({ providedIn: 'root' })
export class SelectedModeService {
  private _selectedModeData = signal<selectedModeType | undefined>(undefined);
  public selectedMode = this._selectedModeData.asReadonly();

  public setSelectedMode(mode: selectedModeType | undefined) {
    if (!mode) {
      clearLocalStorage('selectedMode');
      this._selectedModeData.set(undefined);
      return;
    }
    setLocalStorage('selectedMode', mode);
    this._selectedModeData.set(mode);
  }

  constructor() {}
}
