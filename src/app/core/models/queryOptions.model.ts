import { Chord } from './chord.model';

export class queryOptions {
  chord: Chord;
  constructor(chord: Chord) {
    this.chord = chord;
  }
}
