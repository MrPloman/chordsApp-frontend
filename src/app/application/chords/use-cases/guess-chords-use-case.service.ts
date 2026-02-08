import { languageType } from '@app/core/types/index.types';
import { Chord } from '@app/domain/chords/models/chord.model';
import { ChordsAiPort } from '@app/domain/chords/ports/chords.ports';
import { ChordsAnalyzerService } from '@app/domain/chords/services/chords-analyzer.service';

export class GuessChordsUseCase {
  constructor(
    private readonly chordsService: ChordsAnalyzerService,
    private readonly aiPort: ChordsAiPort
  ) {}
  execute(chords: Chord[], language: languageType) {
    if (!language) throw new Error('Language is required');
    if (!this.chordsService.areEveryChordsValid(chords)) throw new Error('Needs more note positions in the chord');
    if (!this.chordsService.checkMinimumChords(chords)) throw new Error('Minimum Chords not match');
    return this.aiPort.guessChords(chords, language);
  }
}
