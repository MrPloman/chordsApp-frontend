import { Chord } from '../../domain/chords/models/chord.model';

export class QueryResponse {
  chords: Chord[];
  clarification: string;
  response?: string;
  constructor(chords: Chord[], clarification: string, response?: string) {
    this.chords = chords;
    this.clarification = clarification;
    this.response = response;
  }
}
