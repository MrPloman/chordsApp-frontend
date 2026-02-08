import { languageType } from '@app/core/types/index.types';
import { Chord } from '@app/domain/chords/models/chord.model';
import { ChordsAiPort } from '@app/domain/chords/ports/chords.ports';
import { ChordsAnalyzerService } from '@app/domain/chords/services/chords-analyzer.service';

export class ProgressionChordsUseCase {
  constructor(
    private readonly chordsService: ChordsAnalyzerService,
    private readonly aiPort: ChordsAiPort
  ) {}
  execute(chords: Chord[], prompt: string, language: languageType) {
    if (!language) throw new Error('Language is required');
    if (!prompt) throw new Error('Prompt is required');
    if (!this.chordsService.checkMinimumChords(chords)) throw new Error('Minimum Chords not match');

    if (
      !this.chordsService.areEveryChordsValid(chords) ||
      this.chordsService.chordsNamesAreUnknown(chords) ||
      !this.chordsService.checkIfChordsAreGuessed(chords)
    )
      throw new Error('Chords must be guessed');
    return this.aiPort.getProgression(chords, prompt, language);
  }
}
