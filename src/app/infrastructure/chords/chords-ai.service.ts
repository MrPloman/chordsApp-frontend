import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chord } from '@app/domain/chords/models/chord.model';
import { AiResponse, ChordsAiPort } from '@app/domain/chords/ports/chords.ports';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AIService implements ChordsAiPort {
  constructor(private http: HttpClient) {}

  public async guessChords(chords: Chord[], language: 'es' | 'en') {
    const response = await this.http.post<AiResponse>(`${environment.API}/guesser`, {
      chords: chords,
      language: language,
    });
    return firstValueFrom(response);
  }
  public async getProgression(chords: Chord[], prompt: string, language: 'es' | 'en') {
    const response = await this.http.post<AiResponse>(`${environment.API}/progression`, {
      prompt,
      chords,
      language,
    });
    return firstValueFrom(response);
  }

  public async getAlternativeChords(chord: Chord) {
    const response = await this.http.post<AiResponse>(`${environment.API}/options`, { chord });
    return firstValueFrom(response);
  }
  public async getHandbookChords(chordName: string) {
    const response = await this.http.post<AiResponse>(`${environment.API}/forms`, { chordName });
    return firstValueFrom(response);
  }
}
