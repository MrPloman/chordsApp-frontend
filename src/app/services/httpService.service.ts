import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { QueryResponse } from '@app/models/queryResponse.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HTTPService {
  public headers: HttpHeaders = new HttpHeaders();
  constructor(private httpClient: HttpClient) {}
  public post(endpoint: string, body: any) {
    this.httpClient
      .post<QueryResponse>(endpoint, body, {
        headers: this.headers,
        observe: 'response',
      })
      .subscribe((response: HttpResponse<any>) => {
        console.log(response);
      });
  }
}
