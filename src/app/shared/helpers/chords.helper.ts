import { maximRandomNumber, minimumNotesToMakeChord } from '@app/core/constants/rules';
import { chromaticScale, tuning } from '@app/core/constants/tuning';
import { Chord, NotePosition } from '@app/core/models/chord.model';
import { ChordsState } from '@app/store/state/chords.state';

export function noteName(stringNumber: number, fret: number): string {
  const openNote = tuning[6 - stringNumber]; // convert to index
  const startIndex = chromaticScale.indexOf(openNote);
  const noteIndex = (startIndex + fret) % 12;
  return chromaticScale[noteIndex];
}
export function sortNotePosition(notePosition: NotePosition[]): NotePosition[] {
  return notePosition.sort((a, b) => {
    return a.stringNumber - b.stringNumber;
  });
}

export function removeNoteFromChordArray(notePosition: NotePosition[], stringToRemove: number) {
  return notePosition.filter((note) => note.stringNumber !== stringToRemove + 1);
}

export function makeNoteSound(note: NotePosition) {
  let fretNote = note.name;
  if (note.name.includes('#')) fretNote = note.name.replace('#', 'sh');

  const noteAudio = new Audio(
    `/audios/${note.stringNumber.toString()}/${note.stringNumber.toString()}_${note.position}_${fretNote}.mp3`
  );
  noteAudio.load();
  noteAudio.play();
}

// function to check if all the notes inside a chord are valid to be considered as a chord
export function isThisValidChord(chord: Chord): boolean {
  if (!chord || !chord.notes || chord.notes.length < minimumNotesToMakeChord) return false;
  if (chord.notes.length >= minimumNotesToMakeChord) {
    const notes: string[] = chord.notes.map((note) => note.name);
    const repeatedNotes: Record<string, number> = {};
    notes.forEach((note) => (repeatedNotes[note] = (repeatedNotes[note] || 0) + 1));
    if (Object.values(repeatedNotes).length >= minimumNotesToMakeChord) return true;
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

export function checkIfChordsAreGuessed(chords: Chord[]): boolean {
  if (!chords || chords.length < 2) return false;
  let allChecked = true;
  chords.forEach((chord: Chord) => {
    if (!chord.name) allChecked = false;
  });
  return allChecked;
}

export function checkDuplicateChords(chords: Chord[]): Chord[] {
  if (!chords || chords.length === 0) return [];
  const newChordsArray = new Set();
  return chords.filter((chord: Chord) => {
    const keyValue = chord['notes'];
    if (newChordsArray.has(keyValue)) {
      return false; // Duplicate
    } else {
      newChordsArray.add(keyValue);
      return true; // Unique
    }
  });
}

export function checkDuplicateChordOptions(chords: Chord[], currentChord: Chord) {
  if (chords.length === 0 || !currentChord || !chords) return [];
  return chords.filter((chordFiltered: Chord) => {
    if (chordFiltered.notes === currentChord.notes) return;
    else return chordFiltered;
  });
}

export function getAllNoteChordName(chords: Chord[]): Chord[] {
  if (!chords || chords.length === 0) return [];
  const parsedChords = chords.map((chord: Chord) => {
    let newNotes = chord.notes.map((note: NotePosition) => {
      return {
        ...note,
        name: noteName(note.stringNumber, note.position),
      };
    });
    return {
      notes: newNotes,
      name: chord.name,
      _id: chord._id,
      alternativeChords: [],
    };
  });
  if (!parsedChords) return [];
  else return parsedChords;
}
export function generateId(): number {
  return Number(Math.floor(Math.random() * maximRandomNumber));
}

export function checkAndGenerateID(chords: Chord[]): Chord[] {
  if (!chords) return [];
  return chords.map((chord: Chord) => {
    let _chord = chord._id ? chord : { ...chord, _id: generateId() };
    let _notes = _chord.notes.map((note: NotePosition) => {
      return note._id ? note : { ...note, _id: generateId() };
    });
    return { ..._chord, notes: _notes };
  });
}

export function removeNonDesiredValuesFromNotesArray(chords: Chord[]) {
  return chords.map((chord: Chord) => {
    return {
      ...chord,
      notes: chord.notes.filter(
        (note: NotePosition) =>
          note.hasOwnProperty('name') && note.hasOwnProperty('position') && note.hasOwnProperty('stringNumber')
      ),
    };
  });
}

export function chordsNamesAreUnknown(chords: Chord[]) {
  let unknownChord = false;
  chords.forEach((chord: Chord) => {
    if (chord.name === 'Unknown') unknownChord = true;
  });
  return unknownChord;
}

function isChordState(value: unknown): value is ChordsState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v['currentChords']) &&
    typeof v['currentChordSelected'] === 'number' &&
    Array.isArray(v['alternativeChords']) &&
    typeof v['alternativeChordSelected'] === 'number' &&
    Array.isArray(v['handbookChords']) &&
    typeof v['handbookChordsSelected'] === 'number' &&
    typeof v['message'] === 'string' &&
    typeof v['loading'] === 'boolean'
  );
}
function isNotePosition(value: unknown): value is NotePosition {
  return (
    typeof value === 'object' && value !== null && 'string' in value // ajusta a tu modelo real
  );
}
export const chordsHelper = {
  noteName,
  sortNotePosition,
  removeNoteFromChordArray,
  makeNoteSound,
  isThisValidChord,
  areEveryChordsValid,
  checkIfChordsAreGuessed,
  checkDuplicateChords,
  checkDuplicateChordOptions,
  getAllNoteChordName,
  generateId,
  checkAndGenerateID,
  removeNonDesiredValuesFromNotesArray,
  isChordState,
  isNotePosition,
  chordsNamesAreUnknown,
};
