import { Component, Input } from '@angular/core';
import { NgForm } from "@angular/forms";

// Import the DataService
import { DataService } from '../../data.service';

interface MenuTop {
  _id: string;
  id: string;
  title: string;
  order: number;
  menu_top_btn: boolean;
  isDeleted: boolean;
}
interface MenuSub {
  _id: string;
  super: string;
  title: string;
  order: number;
}
interface BoardContent {
  _id: string;
  super_id: string;
  sub_order: number;
  index: number;
  title: string;
  contents: string;
  author: string;
  nickname: string;
  date: string;
  views: number;
  isDeleted: boolean;
}

@Component({
  selector: 'app-study-page-main',
  templateUrl: './study-page-main.component.html',
  styleUrls: ['./study-page-main.component.css']
})
export class StudyPageMainComponent {

  list_button: boolean;

  nav_menu_top: MenuTop[];
  nav_menu_sub: MenuSub[];
  board_content: BoardContent[];

  // ++++++++++++++++++++ List(Menu), BoardContent 관련 속성 ++++++++++++++++++++++
  is_home: boolean;
  cur_page: number;
  cur_page_cnt = 20; // 한번에 20개의 자료를 보여주도록 함
  cur_page_list: Array<any>;
  max_show_page_num = 10;
  total_content_num: number;
  total_page_num: number;
  cur_top_menu: string;
  cur_sub_menu: string;
  cur_super_id: string;
  cur_sub_order: any;
  // ------------------------------------------------------------------------------

  constructor(private _dataService: DataService) {
    this.list_button = true;
    this.is_home = true;

    this.getStudyTopMenu();
    this.getStudySubMenu();
    // this.getBoardContent();
  }

  // +++++++++++++++++++++ DataBase에서 데이터를 읽는 함수 +++++++++++++++++++++
  getStudyTopMenu() {
    this._dataService.getStudyTopMenu()
        .subscribe(res => {
          for (var i=0; i < res.length; i++) {
            res[i].menu_top_btn = false;
          }
          this.nav_menu_top = res;
        });
  }
  getStudySubMenu() {
    this._dataService.getStudySubMenu()
        .subscribe(res => this.nav_menu_sub = res);
  }
  getBoardContent(super_id, sub_order, page) {
    return new Promise((resolve, reject) => {
      this._dataService.getBoardContent(super_id, sub_order, page, this.cur_page_cnt)
          .subscribe(res => {
            for (var i =0; i < res.length; i++) {
              this.board_content[i] = res[i];
            }
            this.total_content_num = res.total;
            console.log('[DB][succes] Get boardContent');
            console.log(this.board_content);
            resolve();
          });
    });
  }
  // -------------------------------------------------------------------------


  // +++++++++++++++++++++ List(Menu) 관련 함수 +++++++++++++++++++++
  listMenu() {
    this.list_button = !this.list_button;
  }
  // 주 메뉴 클릭 이벤트
  async topMenu(obj, index) {
      this.nav_menu_top[index].menu_top_btn = !this.nav_menu_top[index].menu_top_btn; // top메뉴 여닫기 관리
      if (this.nav_menu_top[index].menu_top_btn) {
        this.is_home = false; // 홈 화면이 아님을 알림
        this.cur_page = 1; // 페이지 번호를 1로 초기화
        this.cur_top_menu = obj.title;
        this.cur_sub_menu = '';
        this.cur_super_id = obj.id;
        this.cur_sub_order = "no";
        this.board_content = new Array();
        await this.getBoardContent(obj.id, this.cur_sub_order, this.cur_page);

        // 페이지 넘버링 처리
        this.cur_page_list = new Array();
        this.total_page_num =  Math.ceil(this.total_content_num / this.cur_page_cnt);
        if (this.total_page_num > this.max_show_page_num) { // 전체 페이지 수가 maxShowPageNum의 개수보다 클 경우
            for (var i = 1; i <= this.max_show_page_num; i++) {
                this.cur_page_list[i-1] = i;
            }
        } else {
            for (var i = 1; i <= this.total_page_num; i++) { // 전체 페이지 수가 maxShowPageNum의 개수보다 작을 경우
                this.cur_page_list[i-1] = i;
            }
        }
        console.log('[System] Reading board items success');
      }
  }
  // 서브 메뉴 클릭 이벤트
  async subMenu(obj) {
    this.is_home = false; // 홈 화면이 아님을 알림
    this.cur_page = 1; // 페이지 번호를 1로 초기화
    this.cur_sub_menu = obj.title;
    this.cur_super_id = obj.super;
    this.cur_sub_order = obj.order;
    this.board_content = new Array();
    await this.getBoardContent(obj.super, this.cur_sub_order, this.cur_page);

    // 페이지 넘버링 처리
    this.cur_page_list = new Array();
    this.total_page_num =  Math.ceil(this.total_content_num / this.cur_page_cnt);
    if (this.total_page_num > this.max_show_page_num) { // 전체 페이지 수가 maxShowPageNum의 개수보다 클 경우
        for (var i = 1; i <= this.max_show_page_num; i++) {
            this.cur_page_list[i-1] = i;
        }
    } else {
        for (var i = 1; i <= this.total_page_num; i++) { // 전체 페이지 수가 maxShowPageNum의 개수보다 작을 경우
            this.cur_page_list[i-1] = i;
        }
    }
    console.log('[System] Reading board items success');
  }
  // 페이지 이동 이벤트
  async boardContentPageMove(obj) {
      this.total_page_num =  Math.ceil(this.total_content_num / this.cur_page_cnt);
      if (obj == 'first') {
          this.cur_page = 1;
      } else if (obj == 'back') {
          if (this.cur_page > 1) {
              this.cur_page = this.cur_page - 1;
          }
      } else if (obj == 'next') {
          if (this.cur_page < this.total_page_num) {
              this.cur_page = this.cur_page + 1;
          }
      } else if (obj == 'last') {
          this.cur_page = this.total_page_num;
      } else {
          this.cur_page = obj;
      }

      // view에 뿌릴 게시판 item의 목록을 수정
      this.board_content = new Array();
      await this.getBoardContent(this.cur_super_id, this.cur_sub_order, this.cur_page);

      // 페이지 넘버링 처리
      this.cur_page_list = new Array();
      var cnt = 0;
      var half_max_show_page_num = Math.ceil(this.max_show_page_num/2);
      if (this.cur_page > half_max_show_page_num) {
          for (var i = 0; i < this.max_show_page_num/2; i++) {
              this.cur_page_list[cnt] = this.cur_page - half_max_show_page_num + i;
              cnt++;
          }
          if (this.total_page_num >= this.cur_page + half_max_show_page_num - 1) {
              for (var i = 0; i <= half_max_show_page_num - 1; i++) {
                  this.cur_page_list[cnt] = this.cur_page + i;
                  cnt++;
              }
          } else {
              for (var i = 0; i <= (this.total_page_num - this.cur_page); i++) {
                  this.cur_page_list[cnt] = this.cur_page + i ;
                  cnt++;
              }
          }
      } else {
          for (var i = 0; i < this.cur_page ; i++) {
              this.cur_page_list[cnt] = cnt + 1;
              cnt++;
          }
          if (this.total_page_num >= this.cur_page + half_max_show_page_num - 1) {
              var curPagingNum = cnt;
              if (this.max_show_page_num > this.total_page_num) {
                  curPagingNum = curPagingNum + (this.max_show_page_num - this.total_page_num);
              }
              for (var i = 0; i < this.max_show_page_num - curPagingNum; i++) {
                  this.cur_page_list[cnt] = cnt + 1;
                  cnt++;
              }
          } else {
              for (var i = 0; i < (this.total_page_num - this.cur_page); i++) {
                  this.cur_page_list[cnt] = cnt + 1;
                  cnt++;
              }
          }
      }

      console.log('[System] Moving board page succenss');
  }
  // ---------------------------------------------------------

  searchGoogle(q) {
    console.log(q);
    var url = "http://www.google.co.kr/search?ie=utf-8&oe=utf-8&hl=ko&q=" + q;
    window.open(url, "_blank");
  }
  getSessionIsLogin() {
    return sessionStorage.is_login;
  }
}
