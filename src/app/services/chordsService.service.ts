import { NotePosition } from '../models/chord.model';
export const sortNotePosition = (
  notePosition: NotePosition[]
): NotePosition[] => {
  return notePosition.sort((a, b) => {
    return a.stringNumber - b.stringNumber;
  });
};
