import { languageType } from '@app/core/types/index.types';
import { Chord } from '@app/domain/chords/models/chord.model';
import { ChordsAiPort } from '@app/domain/chords/ports/chords.ports';
import { ChordsAnalyzerService } from '@app/domain/chords/services/chords-analyzer.service';
import { throwError } from 'rxjs';

export class GuessChordsUseCase {
  constructor(
    private readonly chordsService: ChordsAnalyzerService,
    private readonly aiPort: ChordsAiPort
  ) {}
  execute(chords: Chord[], language: languageType) {
    if (!language) return throwError(() => new Error('Language is required'));
    if (!this.chordsService.areEveryChordsValid(chords))
      return throwError(() => new Error('Needs more note positions in the chord'));
    if (!this.chordsService.checkMinimumChords(chords)) throwError(() => new Error('Minimum Chords not match'));
    return this.aiPort.guessChords(chords, language);
  }
}
