import { minimumNotesToMakeChord } from '@app/config/global_variables/rules';
import { Chord, NotePosition } from '../models/chord.model';
export const sortNotePosition = (
  notePosition: NotePosition[]
): NotePosition[] => {
  return notePosition.sort((a, b) => {
    return a.stringNumber - b.stringNumber;
  });
};

export const removeNoteFromChordArray = (
  notePosition: NotePosition[],
  stringToRemove: number
) => {
  return notePosition.filter(
    (note) => note.stringNumber !== stringToRemove + 1
  );
};

export function makeNoteSound(note: NotePosition) {
  let fretNote = note.name;
  if (note.name.includes('#')) fretNote = note.name.replace('#', 'sh');

  const noteAudio = new Audio(
    `./assets/audios/${note.stringNumber.toString()}/${note.stringNumber.toString()}_${
      note.position
    }_${fretNote}.mp3`
  );
  noteAudio.load();
  noteAudio.play();
}

// function to check if all the notes inside a chord are valid to be considered as a chord
export function isThisValidChord(chord: Chord): boolean {
  if (!chord || !chord.notes || chord.notes.length < minimumNotesToMakeChord)
    return false;
  if (chord.notes.length >= minimumNotesToMakeChord) {
    const notes: string[] = chord.notes.map((note) => note.name);
    const repeatedNotes: Record<string, number> = {};
    notes.forEach(
      (note) => (repeatedNotes[note] = (repeatedNotes[note] || 0) + 1)
    );
    if (Object.values(repeatedNotes).length >= minimumNotesToMakeChord)
      return true;
    else return false;
  } else return false;
}
export function areEveryChordsValid(chords: Chord[]): boolean {
  if (!chords || chords.length < minimumNotesToMakeChord) return false;
  else {
    let valid = true;
    chords.forEach((chord: Chord) => {
      if (!isThisValidChord(chord)) valid = false;
    });
    return valid;
  }
}
