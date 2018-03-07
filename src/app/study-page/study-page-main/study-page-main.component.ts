import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../../data.service';

interface MenuTop {
  _id: string;
  id: string;
  title: string;
  order: number;
  isDeleted: boolean;
}
interface MenuSub {
  _id: string;
  super: string;
  title: string;
  order: number;
}

@Component({
  selector: 'app-study-page-main',
  templateUrl: './study-page-main.component.html',
  styleUrls: ['./study-page-main.component.css']
})
export class StudyPageMainComponent {

  list_button: boolean;

  is_login: string;
  user_id: string;
  user_nickname: string;
  user_email: string;

  nav_menu_top: MenuTop[];
  nav_menu_sub: MenuSub[];

  constructor(private _dataService: DataService) {
    this.list_button = true;

    this.getStudyTopMenu();
    this.getStudySubMenu();

    // session 유지되고 있을 때의 상태에 대한 처리
    if (sessionStorage.is_login == "true") {
        console.log('[system] 로그인이 유지되고 있습니다');
        this.is_login = "true";
        this.user_id = sessionStorage.user_id;
        this.user_nickname = sessionStorage.user_nickname;
        this.user_email = sessionStorage.user_nickname;
        if (sessionStorage.user_type == "master") {
            this.is_login = "master";
        }
    }
  }

  // +++++++++++++++++++++ DataBase에서 데이터를 읽는 함수 +++++++++++++++++++++
  getStudyTopMenu() {
    this._dataService.getStudyTopMenu()
        .subscribe(res => this.nav_menu_top = res);
  }
  getStudySubMenu() {
    this._dataService.getStudySubMenu()
        .subscribe(res => this.nav_menu_sub = res);
  }
  // -------------------------------------------------------------------------


  // +++++++++++++++++++++ List 관련 함수 +++++++++++++++++++++
  listMenu() {
    this.list_button = !this.list_button;
  }
  // ---------------------------------------------------------

  searchGoogle(q) {
    console.log(q);
    var url = "http://www.google.co.kr/search?ie=utf-8&oe=utf-8&hl=ko&q=" + q;
    window.open(url, "_blank");
  }
}
