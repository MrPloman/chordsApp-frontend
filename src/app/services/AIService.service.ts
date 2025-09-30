import { Injectable } from '@angular/core';
import { HTTPService } from './httpService.service';
import { Chord } from '@app/models/chord.model';
import { queryPrompt } from '@app/models/queryPrompt.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AIService {
  private _httpService: HTTPService;

  constructor(httpService: HTTPService) {
    this._httpService = httpService;
  }
  public guessMyChords(body: queryPrompt) {
    return this._httpService.post(`${environment.API}/guesser`, body);
  }
  public makeChordsProgression(body: queryPrompt) {
    if (!body.prompt) return;
    return this._httpService.post(`${environment.API}/progression`, body);
  }
}
