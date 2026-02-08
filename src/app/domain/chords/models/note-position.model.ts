import { chordsHelper } from '@app/shared/helpers/chords.helper';

export class NotePosition {
  stringNumber: number;
  position: number;
  name: string;
  _id?: number;
  constructor(stringNumber: number, position: number, name: string, _id?: number) {
    this.name = name;
    this.position = position;
    this.stringNumber = stringNumber;
    this._id = _id ? _id : chordsHelper.generateId();
  }
}
