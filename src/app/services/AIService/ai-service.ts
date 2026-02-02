import { Injectable } from '@angular/core';
import { Chord } from '@app/core/models/chord.model';
import { queryOptions } from '@app/core/models/queryOptions.model';
import { queryPrompt } from '@app/core/models/queryPrompt.model';
import { QueryResponse } from '@app/core/models/queryResponse.model';
import { environment } from 'environments/environment';
import { HTTPService } from '../HttpService/httpservice';

@Injectable({
  providedIn: 'root',
})
export class AIService {
  private _httpService: HTTPService;

  constructor(httpService: HTTPService) {
    this._httpService = httpService;
  }

  public async guessMyChords(_body: queryPrompt, language: 'es' | 'en') {
    const { body, status, statusText } = await this._httpService.post(`${environment.API}/guesser`, {
      ..._body,
      language: language,
    });
    if (status === 200 && body) {
      const { chords, clarification, response } = body;
      return new QueryResponse(chords, clarification, response);
    } else return new QueryResponse([], statusText);
  }
  public async makeChordsProgression(_body: queryPrompt, language: 'es' | 'en') {
    if (!_body.prompt) return;
    let chords = _body.chords.map((chord: Chord) => {
      return {
        name: chord.name,
        notes: chord.notes,
        _id: chord._id,
        alternativeChords: [],
      };
    });
    const { body, status, statusText } = await this._httpService.post(`${environment.API}/progression`, {
      prompt: _body.prompt,
      chords,
      language: language,
    });
    if (status === 200 && body && body.chords) {
      const { chords, clarification, response } = body;
      return new QueryResponse(chords, clarification, response);
    } else return new QueryResponse([], statusText);
  }

  public async getOtherChordOptions(_body: queryOptions) {
    const { body, status, statusText } = await this._httpService.post(`${environment.API}/options`, _body);
    if (status === 200 && body) {
      const { chords, clarification, response } = body;
      return new QueryResponse(chords, clarification, response);
    } else return new QueryResponse([], statusText);
  }
  public async getFullHandbookChord(_body: { chordName: string }) {
    const { body, status, statusText } = await this._httpService.post(`${environment.API}/forms`, _body);
    if (status === 200 && body) {
      const { chords } = body;
      return new QueryResponse(chords, '');
    } else return new QueryResponse([], statusText);
  }
}
