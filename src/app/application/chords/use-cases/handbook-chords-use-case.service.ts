import { Injectable } from '@angular/core';
import { AIService } from '@app/infrastructure/chords/chords-ai.service';

@Injectable({ providedIn: 'root' })
export class HandbookChordsUseCase {
  constructor(private aiService: AIService) {}
  execute(chordName: string) {
    if (!chordName) throw new Error('No chordname provided');
    return this.aiService.getHandbookChords(chordName);
  }
}
