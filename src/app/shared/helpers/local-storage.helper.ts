import { ChordsState } from '@app/store/state/chords.state';
import { languageType, selectedModeType, storeTypes } from '@app/types/index.types';

export function getLocalStorage(key: storeTypes) {
  const storedData = localStorage.getItem(key);
  const dataObject = storedData ? JSON.parse(storedData) : {};
  return dataObject;
}
export function setLocalStorage(key: storeTypes, dataToStore: ChordsState | languageType | selectedModeType) {
  const dataStringify = JSON.stringify(dataToStore);
  localStorage.setItem(key, dataStringify);
}
export function clearLocalStorage() {}
