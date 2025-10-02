import { maximRandomNumber } from '@app/config/global_variables/rules';

export class NotePosition {
  stringNumber: number;
  position: number;
  name: string;
  _id?: number;
  constructor(
    stringNumber: number,
    position: number,
    name: string,
    _id?: number
  ) {
    this.name = name;
    this.position = position;
    this.stringNumber = stringNumber;
    this._id = _id ? _id : Math.floor(Math.random() * maximRandomNumber);
  }
}

export class Chord {
  public name?: string;
  public notes: NotePosition[];
  public _id?: number;

  constructor(notes: NotePosition[], name?: string, _id?: number) {
    this.name = name ? name : '';
    this.notes = notes;
    this._id = _id ? _id : Math.floor(Math.random() * maximRandomNumber);
  }
}
