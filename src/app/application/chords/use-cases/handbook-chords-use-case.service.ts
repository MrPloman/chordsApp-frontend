import { ChordsAiPort } from '@app/domain/chords/ports/chords.ports';

export class HandbookChordsUseCase {
  constructor(private readonly aiPort: ChordsAiPort) {}
  execute(chordName: string) {
    if (!chordName) throw new Error('No chordname provided');
    return this.aiPort.getHandbookChords(chordName);
  }
}
