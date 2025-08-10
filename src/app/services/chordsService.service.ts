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
