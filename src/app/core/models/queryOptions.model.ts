import { Chord } from '../../domain/chords/models/chord.model';

export class queryOptions {
  chord: Chord;
  constructor(chord: Chord) {
    this.chord = chord;
  }
}
