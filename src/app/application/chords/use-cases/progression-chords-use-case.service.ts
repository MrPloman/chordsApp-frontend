import { languageType } from '@app/core/types/index.types';
import { Chord } from '@app/domain/chords/models/chord.model';
import { ChordsAiPort } from '@app/domain/chords/ports/chords.ports';
import { ChordsAnalyzerService } from '@app/domain/chords/services/chords-analyzer.service';
import { throwError } from 'rxjs';

export class ProgressionChordsUseCase {
  constructor(
    private readonly chordsService: ChordsAnalyzerService,
    private readonly aiPort: ChordsAiPort
  ) {}
  execute(chords: Chord[], prompt: string, language: languageType) {
    if (!language) throwError(() => new Error('Language is required'));
    if (!prompt) throwError(() => new Error('Prompt is required'));
    if (!this.chordsService.checkMinimumChords(chords)) throwError(() => new Error('Minimum Chords not match'));

    if (
      !this.chordsService.areEveryChordsValid(chords) ||
      this.chordsService.chordsNamesAreUnknown(chords) ||
      !this.chordsService.checkIfChordsAreGuessed(chords)
    )
      throwError(() => new Error('Chords must be guessed'));
    return this.aiPort.getProgression(chords, prompt, language);
  }
}
