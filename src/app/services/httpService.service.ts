import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HTTPService {
  public headers: HttpHeaders = new HttpHeaders();
  constructor(private httpClient: HttpClient) {}
  public post(endpoint: string, body: any) {
    this.httpClient
      .post(endpoint, body, { headers: this.headers })
      .subscribe((buffer) => {
        console.log('The image is ' + buffer + ' bytes large');
      });
  }
}
