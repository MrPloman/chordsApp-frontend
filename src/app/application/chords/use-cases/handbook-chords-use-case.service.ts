import { ChordsAiPort } from '@app/domain/chords/ports/chords.ports';
import { throwError } from 'rxjs';

export class HandbookChordsUseCase {
  constructor(private readonly aiPort: ChordsAiPort) {}
  execute(chordName: string) {
    if (!chordName) throwError(() => new Error('No chordname provided'));
    return this.aiPort.getHandbookChords(chordName);
  }
}
