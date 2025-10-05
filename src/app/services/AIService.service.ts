import { Injectable } from '@angular/core';
import { HTTPService } from './httpService.service';
import { Chord, NotePosition } from '@app/models/chord.model';
import { queryPrompt } from '@app/models/queryPrompt.model';
import { environment } from '../../environments/environment';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { QueryResponse } from '@app/models/queryResponse.model';

@Injectable({ providedIn: 'root' })
export class AIService {
  private _httpService: HTTPService;

  constructor(httpService: HTTPService) {
    this._httpService = httpService;
  }
  public async guessMyChords(_body: queryPrompt) {
    const { body, status, statusText } = await this._httpService.post(
      `${environment.API}/guesser`,
      _body
    );
    if (status === 200 && body)
      return new QueryResponse(body.chords, body.clarification);
    else return new QueryResponse([], statusText);
  }
  public async makeChordsProgression(_body: queryPrompt) {
    if (!_body.prompt) return;
    const { body, status, statusText } = await this._httpService.post(
      `${environment.API}/progression`,
      _body
    );
    if (status === 200 && body) {
      let chords = body.chords;
      return new QueryResponse(chords, body.clarification);
    } else return new QueryResponse([], statusText);
  }
}
