import { languageType } from '@app/core/types/index.types';
import { Chord } from '../models/chord.model';
export interface AiResponse {
  chords: Chord[];
  clarification: string;
  response?: string;
}
export interface ChordsAiPort {
  guessChords(chords: Chord[], language: languageType): Promise<AiResponse>;
  getAlternativeChords(chord: Chord): Promise<AiResponse>;
  getHandbookChords(chordName: string): Promise<AiResponse>;
  getProgression(chords: Chord[], prompt: string, language: languageType): Promise<AiResponse>;
}
