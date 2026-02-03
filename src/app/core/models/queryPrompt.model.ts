import { Chord } from '../../domain/chords/models/chord.model';

export class queryPrompt {
  chords: Chord[];
  prompt?: string;
  language?: string;

  constructor(chords: Chord[], prompt?: string, language?: string) {
    this.chords = chords;
    this.prompt = prompt ? prompt : undefined;
    this.language = language ? language : 'en';
  }
}
