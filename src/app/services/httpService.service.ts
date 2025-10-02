import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { QueryResponse } from '@app/models/queryResponse.model';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HTTPService {
  public headers: HttpHeaders = new HttpHeaders();
  public postIt = {};
  constructor(private httpClient: HttpClient) {}
  public async post(
    endpoint: string,
    body: any
  ): Promise<HttpResponse<QueryResponse>> {
    const postObservable: Observable<HttpResponse<QueryResponse>> =
      await this.httpClient.post<QueryResponse>(endpoint, body, {
        headers: this.headers,
        observe: 'response',
      });
    return await firstValueFrom(postObservable);

    // .subscribe((response: HttpResponse<any>) => {
    //   const { status } = response;
    //   if (status === 200 && response.body) this.postIt = response.body;
    //   else {
    //     throw new Error(response.statusText);
    //   }
    // });
  }
}
