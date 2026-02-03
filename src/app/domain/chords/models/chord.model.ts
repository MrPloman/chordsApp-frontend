import { chordsHelper } from '@app/shared/helpers/chords.helper';
import { NotePosition } from './note-position.model';

export class Chord {
  public name?: string;
  public notes: NotePosition[];
  public alternativeChords: Chord[];
  public _id?: number;
  public visible?: boolean;

  constructor(notes: NotePosition[], alternativeChords: Chord[], name?: string, _id?: number, visible?: boolean) {
    this.name = name ? name : '';
    this.notes = notes;
    this._id = _id ? _id : chordsHelper.generateId();
    this.alternativeChords = alternativeChords ? alternativeChords : [];
    this.visible = visible ? visible : true;
  }
}
