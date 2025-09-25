import { Injectable } from '@angular/core';
import { HTTPService } from './httpService.service';
import { Chord } from '@app/models/chord.model';
import { queryPrompt } from '@app/models/queryPrompt.model';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private _httpService: HTTPService;
  constructor(httpService: HTTPService) {
    this._httpService = httpService;
  }
  private guessMyChords(endpoint: string, body: queryPrompt) {
    return this._httpService.post(endpoint, body);
  }
  private makeChordProgression(endpoint: string, body: queryPrompt) {
    if (!body.prompt) return;
    return this._httpService.post(endpoint, body);
  }
}
