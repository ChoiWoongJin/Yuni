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
  getSearchBoardContent(super_id, sub_order, page, page_cnt, board_content_search_word) {
    var search_page_info = {
      super_id: super_id,
      sub_order: sub_order,
      page: page,
      page_cnt: page_cnt,
      board_content_search_word: board_content_search_word
    }
    return this._http.post("/api/boardContent/search_contents", search_page_info)
      .map(result => {
        this.result = result.json().data;
        this.result.total = result.json().total;
        return this.result;
      });
  }
  deleteBoardContent(del_content) {
    return this._http.patch("/api/boardContent/content/isDeleted", del_content)
      .map(result => this.result = result.json().data);
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
    return this._http.post("/api/boardContent/", content_info)
        .map(result => this.result = result.json().data);
  }
  updateBoardContent(content_info) {
    return this._http.patch("/api/boardContent/content", content_info)
      .map(result => this.result = result.json().data);
  }
  updateBoardContentViewCount(obj) {
    obj.views = obj.views + 1;
    return this._http.patch("/api/boardContent/viewCount", obj)
      .map(result => this.result = result.json().data);
  }

  getGuestBook() {
    return this._http.get("/api/guestBook")
      .map(result => this.result = result.json().data);
  }
  deleteGuestBook(del_comment) {
    return this._http.patch("/api/guestBook", del_comment);
  }
  addGuestBook(gb_info) {
    return this._http.post("/api/guestBook", gb_info)
      .map(result => this.result = result.json().data);
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
      .map(result => this.result = result.json().data);
  }

  getStudyTopMenu() {
    return this._http.get("/api/studyTopMenu")
      .map(result => this.result = result.json().data);
  }
  addStudyTopMenu(topMenu_info) {
    return this._http.post("/api/studyTopMenu", topMenu_info)
      .map(result => this.result = result.json().data);
  }
  deleteStudyTopMenu(topMenu_info) {
    return this._http.patch("/api/studyTopMenu", topMenu_info);
  }
  getStudySubMenu() {
    return this._http.get("/api/studySubMenu")
      .map(result => this.result = result.json().data);
  }
  addStudySubMenu(subMenu_info) {
    return this._http.post("/api/studySubMenu", subMenu_info)
      .map(result => this.result = result.json().data);
  }
  deleteStudySubMenu(subMenu_info) {
    return this._http.patch("/api/studySubMenu", subMenu_info);
  }

  addAccessMainLog(access_info) {
    return this._http.post("/api/accessMainLog", access_info)
      .map(result => this.result = result.json().data);
  }
  addAccessLoginLog(access_info) {
    return this._http.post("/api/accessLoginLog", access_info)
      .map(result => this.result = result.json().data);
  }
  getAccessStudyLog() {
    return this._http.get("/api/accessStudyLog")
      .map(result => this.result = result.json().data);
  }
  addAccessStudyLog(access_info) {
    return this._http.post("/api/accessStudyLog", access_info)
      .map(result => this.result = result.json().data);
  }
}
