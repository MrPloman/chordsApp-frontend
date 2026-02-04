import { Chord } from '../models/chord.model';

export interface ChordsAiPort {
  guessChords(chords: Chord[]): Promise<Chord[]>;
  getAlternativeChords(chord: Chord): Promise<Chord[]>;
  getHandbookChords(chordName: string): Promise<Chord[]>;
  getProgression(chords: Chord[], prompt: string): Promise<Chord[]>;
}
