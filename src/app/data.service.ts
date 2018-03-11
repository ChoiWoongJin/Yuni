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
  addGuestBook(gbInfo) {
    return this._http.post("/api/guestBook", gbInfo);
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
  addStudyTopMenu(topMenuInfo) {
    return this._http.post("/api/studyTopMenu", topMenuInfo);
  }
  deleteStudyTopMenu(topMenuInfo) {
    return this._http.patch("/api/studyTopMenu", topMenuInfo);
  }
  getStudySubMenu() {
    return this._http.get("/api/studySubMenu")
      .map(result => this.result = result.json().data);
  }
  addStudySubMenu(subMenuInfo) {
    return this._http.post("/api/studySubMenu", subMenuInfo);
  }
  deleteStudySubMenu(subMenuInfo) {
    return this._http.patch("/api/studySubMenu", subMenuInfo);
  }
}
