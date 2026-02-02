import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryResponse } from '@app/core/models/queryResponse.model';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HTTPService {
  public headers: HttpHeaders = new HttpHeaders();
  constructor(private httpClient: HttpClient) {}
  public async post(endpoint: string, body: any): Promise<HttpResponse<QueryResponse>> {
    const postObservable: Observable<HttpResponse<QueryResponse>> = await this.httpClient.post<QueryResponse>(
      endpoint,
      body,
      {
        headers: this.headers,
        observe: 'response',
      }
    );
    return await firstValueFrom(postObservable);
  }
}
