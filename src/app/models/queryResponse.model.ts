import { Chord } from './chord.model';

export class QueryResponse {
  chords: Chord[];
  clarification: string;
  constructor(chords: Chord[], clarification: string) {
    this.chords = chords;
    this.clarification = clarification;
  }
}
