import { maximRandomNumber } from '@app/config/global_variables/rules';
import { generateId } from '@app/services/chordsService.service';

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
    this._id = _id ? _id : generateId();
  }
}

export class Chord {
  public name?: string;
  public notes: NotePosition[];
  public alternativeChords: Chord[];

  public _id?: number;

  constructor(
    notes: NotePosition[],
    alternativeChords: Chord[],
    name?: string,
    _id?: number
  ) {
    this.name = name ? name : '';
    this.notes = notes;
    this._id = _id ? _id : generateId();
    this.alternativeChords = alternativeChords ? alternativeChords : [];
  }
}
