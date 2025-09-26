import { Chord } from './chord.model';

export class QueryResponse {
  chords: Chord[];
  message: string;
  constructor(chords: Chord[], message: string) {
    this.chords = chords;
    this.message = message;
  }
}
