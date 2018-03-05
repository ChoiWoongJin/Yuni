import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result:any;

  constructor(private _http: Http) { }

  getContentBoard() {
    return this._http.get("/api/content_board")
      .map(result => this.result = result.json().data);
  }

  getGuestBook() {
    return this._http.get("/api/guestBook")
      .map(result => this.result = result.json().data);
  }

  deleteGuestBook(delComment) {
    return this._http.patch("/api/guestBook", delComment);
  }

  getNav_menu() {
    return this._http.get("/api/nav_menu")
      .map(result => this.result = result.json().data);
  }

  getUserInfo() {
    return this._http.get("/api/userInfo")
      .map(result => this.result = result.json().data);
  }

  addUserInfo(caInfo) {
    var addData = {
      id: caInfo.id,
      pwd: caInfo.pwd,
      nickname: caInfo.nickname,
      email: caInfo.email,
      type: 'guest'
    }
    return this._http.post("/api/userInfo", addData)
  }
}
