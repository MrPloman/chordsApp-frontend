import { Injectable } from '@angular/core';
import { languageType } from '@app/core/types/index.types';
import { Chord } from '@app/domain/chords/models/chord.model';
import { ChordsService } from '@app/domain/chords/services/chords.service';
import { AIService } from '@app/infrastructure/chords/chords-ai.service';

@Injectable({ providedIn: 'root' })
export class ProgressionChordsUseCase {
  constructor(
    private chordsService: ChordsService,
    private aiService: AIService
  ) {}
  execute(chords: Chord[], prompt: string, language: languageType) {
    if (!language) throw new Error('Language is required');
    if (!prompt) throw new Error('Prompt is required');
    if (
      !this.chordsService.areEveryChordsValid(chords) ||
      this.chordsService.chordsNamesAreUnknown(chords) ||
      !this.chordsService.checkIfChordsAreGuessed(chords)
    )
      throw new Error('Needs more note positions in the chord');
    return this.aiService.getProgression(chords, prompt, language);
  }
}
