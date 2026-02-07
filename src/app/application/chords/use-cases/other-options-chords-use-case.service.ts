import { Injectable } from '@angular/core';
import { Chord } from '@app/domain/chords/models/chord.model';
import { AIService } from '@app/infrastructure/chords/chords-ai.service';

@Injectable({ providedIn: 'root' })
export class OtherOptionsChordsUseCase {
  constructor(private aiService: AIService) {}
  execute(chord: Chord) {
    if (!chord) throw new Error('No chord provided');
    return this.aiService.getAlternativeChords(chord);
  }
}
