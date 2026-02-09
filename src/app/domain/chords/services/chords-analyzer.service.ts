import { minimumChordsToMakeProgression, minimumNotesToMakeChord } from '@app/core/constants/rules';
import { Chord } from '../models/chord.model';

export class ChordsAnalyzerService {
  public isThisValidChord(chord: Chord): boolean {
    if (!chord || !chord.notes) return false;
    if (chord.notes.length >= minimumNotesToMakeChord) {
      const notes: string[] = chord.notes.map((note) => note.name);
      const repeatedNotes: Record<string, number> = {};
      notes.forEach((note) => (repeatedNotes[note] = (repeatedNotes[note] || 0) + 1));
      if (Object.values(repeatedNotes).length >= minimumNotesToMakeChord) return true;
      else return false;
    } else return false;
  }

  public areEveryChordsValid(chords: Chord[]): boolean {
    if (!chords || chords.length < minimumNotesToMakeChord) return false;
    else {
      let valid = true;
      chords.forEach((chord: Chord) => {
        if (!this.isThisValidChord(chord)) valid = false;
      });
      return valid;
    }
  }

  public checkIfChordsAreGuessed(chords: Chord[]): boolean {
    if (!chords || chords.length === 0) return false;
    let allChecked = true;
    chords.forEach((chord: Chord) => {
      if (!chord.name) allChecked = false;
    });
    return allChecked;
  }

  public chordsNamesAreUnknown(chords: Chord[]): boolean {
    let unknownChord = false;
    chords.forEach((chord: Chord) => {
      if (chord.name === 'Unknown') unknownChord = true;
    });
    return unknownChord;
  }

  public checkDuplicateChordOptions(chords: Chord[], currentChord: Chord) {
    if (chords.length === 0 || !currentChord || !chords) return [];
    return chords.filter((chordFiltered: Chord) => {
      if (chordFiltered.notes === currentChord.notes) return;
      else return chordFiltered;
    });
  }
  public checkMinimumChords(chords: Chord[]): boolean {
    return chords.length >= minimumChordsToMakeProgression;
  }
}
