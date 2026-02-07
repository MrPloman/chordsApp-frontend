import { ChordsState } from '@app/application/chords/store/chords.state';
import { maximRandomNumber } from '@app/core/constants/rules';
import { chromaticScale, tuning } from '@app/core/constants/tuning';
import { Chord } from '@app/domain/chords/models/chord.model';
import { NotePosition } from '@app/domain/chords/models/note-position.model';

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

function addAlternativeChordsInsideChordStructure(chords: Chord[]) {
  return chords.map((chord: Chord) => {
    return {
      name: chord.name,
      notes: chord.notes,
      _id: chord._id,
      alternativeChords: [],
    };
  });
}

function removeDuplicateChords(chords: Chord[]): Chord[] {
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
export const chordsHelper = {
  noteName,
  sortNotePosition,
  removeNoteFromChordArray,
  makeNoteSound,
  getAllNoteChordName,
  generateId,
  checkAndGenerateID,
  removeNonDesiredValuesFromNotesArray,
  isChordState,
  isNotePosition,
  addAlternativeChordsInsideChordStructure,
  removeDuplicateChords,
};
