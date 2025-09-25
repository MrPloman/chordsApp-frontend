import { Chord } from './chord.model';

export class queryPrompt {
  chords: Chord[];
  prompt?: string;
  constructor(chords: Chord[], prompt?: string) {
    this.chords = chords;
    this.prompt = prompt ? prompt : undefined;
  }
}
