import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';

import { IpFormat } from "./ip-format";

@Injectable()
export class IpAddressInfo {

  constructor(private http: HttpClient) { }

  getIpAddress(): Observable<IpFormat> {
    return this.http
      .get<IpFormat>("https://freegeoip.net/json/?callback")
      .map(response => response || {})
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error("observable error: ", error);
    return Observable.throw(error);
  }
}
