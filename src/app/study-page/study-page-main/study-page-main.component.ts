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
  cur_top_menu: string;
  cur_sub_menu: string;
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
    this._dataService.getBoardContent(super_id, sub_order, page, this.cur_page_cnt)
        .subscribe(res => this.board_content = res);
  }
  // -------------------------------------------------------------------------


  // +++++++++++++++++++++ List(Menu) 관련 함수 +++++++++++++++++++++
  listMenu() {
    this.list_button = !this.list_button;
  }
  // 주 메뉴 클릭 이벤트
  topMenu = (obj, index) => {
      this.is_home = false; // 홈 화면이 아님을 알림
      this.cur_page = 1; // 페이지 번호를 1로 초기화
      this.cur_top_menu = obj.title;
      this.cur_sub_menu = '';
      this.nav_menu_top[index].menu_top_btn = !this.nav_menu_top[index].menu_top_btn; // top메뉴 여닫기 관리
      this.board_content = new Array();
      this.getBoardContent(obj.id, "no", this.cur_page);



      // var superId = obj.id;
      // $commonGetContentBoardService.getContentBoard().then(data => {
      //     $scope.contentBoard = new Array();
      //     $scope.getBoardItem = new Array();
      //     var cnt = 0;
      //     for (var i = 0; i < data.board.length; i++) {
      //         if (data.board[i].superId == superId) {
      //             $scope.getBoardItem[cnt] = data.board[i];
      //             cnt++;
      //         }
      //     }
      //     cnt = 0;
      //     // 역순으로 정렬하여 최신글이 앞으로 오도록 한다
      //     $scope.getBoardItem.sort(function(a, b) {
      //         return b.index - a.index;
      //     });
      //
      //     // 게시판의 글 페이징 처리
      //     var boardItemNum = $scope.getBoardItem.length;
      //     $scope.totalPageNum = Math.ceil(boardItemNum/15);
      //     if ( boardItemNum <= $scope.itemPerPage) {
      //         for (var item in $scope.getBoardItem) {
      //             $scope.contentBoard[cnt] = $scope.getBoardItem[item];
      //             cnt++;
      //         }
      //     } else {
      //         for (var i = 0; i < $scope.itemPerPage; i++) {
      //             $scope.contentBoard[cnt] = $scope.getBoardItem[i];
      //             cnt++;
      //         }
      //     }
      //
      //     // 페이지 넘버링 처리
      //     $scope.curPageList = new Array();
      //     if ($scope.totalPageNum > $scope.maxShowPageNum) { // 전체 페이지 수가 maxShowPageNum의 개수보다 클 경우
      //         for (var i = 1; i <= $scope.maxShowPageNum; i++) {
      //             $scope.curPageList[i-1] = i;
      //         }
      //     } else {
      //         for (var i = 1; i <= $scope.totalPageNum; i++) { // 전체 페이지 수가 maxShowPageNum의 개수보다 작을 경우
      //             $scope.curPageList[i-1] = i;
      //         }
      //     }
      //     console.log('read board items success');
      // }, data => {
      //     console.log('error : ' + data);
      // });
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
