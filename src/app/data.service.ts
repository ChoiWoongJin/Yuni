import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result:any;

  constructor(private _http: Http) { }

  getBoardContent(super_id, sub_order, page, page_cnt) {
    var pageInfo = {
      super_id: super_id,
      sub_order: sub_order,
      page: page,
      page_cnt: page_cnt
    }
    return this._http.post("/api/boardContent", pageInfo)
      .map(result => {
        this.result = result.json().data;
        this.result.total = result.json().total;
        return this.result;
      });
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
