import { Injectable } from '@angular/core';
import { languageType } from '@app/core/types/index.types';
import { Chord } from '@app/domain/chords/models/chord.model';
import { ChordsService } from '@app/domain/chords/services/chords.service';
import { AIService } from '@app/infrastructure/chords/chords-ai.service';

@Injectable({ providedIn: 'root' })
export class GuessChordsUseCase {
  constructor(
    private chordsService: ChordsService,
    private aiService: AIService
  ) {}
  execute(chords: Chord[], language: languageType) {
    if (!language) throw new Error('Language is required');
    if (!this.chordsService.areEveryChordsValid(chords)) throw new Error('Needs more note positions in the chord');
    return this.aiService.guessChords(chords, language);
  }
}
