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
  addGuestBook(addData) {
    return this._http.post("/api/guestBook", addData)
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

  getStudyTopMenu() {
    return this._http.get("/api/studyTopMenu")
      .map(result => this.result = result.json().data);
  }
  getStudySubMenu() {
    return this._http.get("/api/studySubMenu")
      .map(result => this.result = result.json().data);
  }
}
