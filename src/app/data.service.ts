import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result:any;

  constructor(private _http: Http) { }

  getBoardContent(super_id, sub_order, page, page_cnt) {
    var page_info = {
      super_id: super_id,
      sub_order: sub_order,
      page: page,
      page_cnt: page_cnt
    }
    return this._http.post("/api/boardContent/contents", page_info)
      .map(result => {
        this.result = result.json().data;
        this.result.total = result.json().total;
        return this.result;
      });
  }
  getBoardContentMaxIndex(super_id, sub_order) {
    var contentBoardInfo = {
      super_id: super_id,
      sub_order: sub_order
    }
    return this._http.post("/api/boardContent/maxIndex", contentBoardInfo)
      .map(result => this.result = result.json().data);
  }
  addBoardContent(content_info) {
    return this._http.post("/api/boardContent/", content_info);
  }
  updateBoardContentViewCount(_id) {
    var data = { _id: _id};
    return this._http.patch("/api/boardContent/viewCount", data);
  }

  getGuestBook() {
    return this._http.get("/api/guestBook")
      .map(result => this.result = result.json().data);
  }
  deleteGuestBook(del_comment) {
    return this._http.patch("/api/guestBook", del_comment);
  }
  addGuestBook(gb_info) {
    return this._http.post("/api/guestBook", gb_info);
  }

  getUserInfo() {
    return this._http.get("/api/userInfo")
      .map(result => this.result = result.json().data);
  }
  addUserInfo(ca_info) {
    var add_data = {
      id: ca_info.id,
      pwd: ca_info.pwd,
      nickname: ca_info.nickname,
      email: ca_info.email,
      type: 'guest'
    }
    return this._http.post("/api/userInfo", add_data)
  }

  getStudyTopMenu() {
    return this._http.get("/api/studyTopMenu")
      .map(result => this.result = result.json().data);
  }
  addStudyTopMenu(topMenu_info) {
    return this._http.post("/api/studyTopMenu", topMenu_info);
  }
  deleteStudyTopMenu(topMenu_info) {
    return this._http.patch("/api/studyTopMenu", topMenu_info);
  }
  getStudySubMenu() {
    return this._http.get("/api/studySubMenu")
      .map(result => this.result = result.json().data);
  }
  addStudySubMenu(subMenu_info) {
    return this._http.post("/api/studySubMenu", subMenu_info);
  }
  deleteStudySubMenu(subMenu_info) {
    return this._http.patch("/api/studySubMenu", subMenu_info);
  }

  addAccessTotalLog(access_info) {
    return this._http.post("/api/accessTotalLog", access_info);
  }
}
