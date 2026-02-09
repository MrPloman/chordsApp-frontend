import { Chord } from '@app/domain/chords/models/chord.model';
import { ChordsAiPort } from '@app/domain/chords/ports/chords.ports';
import { throwError } from 'rxjs';

export class OtherOptionsChordsUseCase {
  constructor(private aiPort: ChordsAiPort) {}
  execute(chord: Chord) {
    if (!chord) throwError(() => new Error('No chord provided'));
    return this.aiPort.getAlternativeChords(chord);
  }
}
