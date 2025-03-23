export class NotePosition {
  stringNumber: number;
  position: number;
  name: string;
  constructor(stringNumber: number, position: number, name: string) {
    this.name = name;
    this.position = position;
    this.stringNumber = stringNumber;
  }
}

export class Chord {
  public name?: string;
  public notes: NotePosition[];

  constructor(notes: NotePosition[], name?: string) {
    this.name = name ? name : '';
    this.notes = notes;
  }
}
