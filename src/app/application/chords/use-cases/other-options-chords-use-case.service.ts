import { Chord } from '@app/domain/chords/models/chord.model';
import { ChordsAiPort } from '@app/domain/chords/ports/chords.ports';

export class OtherOptionsChordsUseCase {
  constructor(private aiPort: ChordsAiPort) {}
  execute(chord: Chord) {
    if (!chord) throw new Error('No chord provided');
    return this.aiPort.getAlternativeChords(chord);
  }
}
