import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

// Import the DataService
import { DataService } from '../../data.service';
// Import Access ip-address-info catcher
import { IpAddressInfo } from "../../ip-address-info/ip-address-info";

interface TopMenu {
  _id: string;
  id: string;
  title: string;
  order: number;
  menu_top_btn: boolean;
  isDeleted: boolean;
}
interface SubMenu {
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
export class StudyPageMainComponent implements OnInit {

  // ++++++++++++++++++++ List(Menu), BoardContent 관련 속성 ++++++++++++++++++++++
  list_button: boolean;
  is_write: boolean;
  is_view: boolean;
  is_modify:boolean;

  nav_top_menu: TopMenu[]; // top 메뉴 정보
  nav_sub_menu: SubMenu[]; // sub 메뉴 정보
  board_content: BoardContent[]; // 게시판 컨텐츠 정보

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

  board_content_menu_input: SubMenu;
  board_content_title_input: string; // 글 작성시 입력된 제목
  board_content_content_input: string; // 글 작성시 입력된 내용

  board_content_view: BoardContent; // 자료의 상세내용을 화면에 보여주는 정보

  nav_top_menu_title_input: string; // top 메뉴 추가 타이틀 input 정보
  // ------------------------------------------------------------------------------

  constructor(private _dataService: DataService, private _get_ip: IpAddressInfo) {
    this.board_content_title_input = '';
    this.board_content_content_input = '';

    this.list_button = true;
    this.is_home = true;
    this.is_write = false;
    this.is_view = false;
    this.is_modify = false;

    this.getStudyTopMenu();
    this.getStudySubMenu();
  }

  // +++++++++++++++++++++ DataBase에서 데이터를 읽는 함수 +++++++++++++++++++++
  getStudyTopMenu() {
    this._dataService.getStudyTopMenu()
        .subscribe(res => {
          for (var i=0; i < res.length; i++) {
            res[i].menu_top_btn = false;
          }
          this.nav_top_menu = res;
        });
  }
  getStudySubMenu() {
    this._dataService.getStudySubMenu().subscribe(res => this.nav_sub_menu = res);
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
            resolve();
          });
    });
  }
  getBoardContentMaxIndex(super_id, sub_order) {
    return new Promise((resolve, reject) => {
      this._dataService.getBoardContentMaxIndex(super_id, sub_order)
          .subscribe(res => {
            resolve(res);
          });
    });
  }
  getAccessStudyLog() {
    this._dataService.getAccessStudyLog()
        .subscribe(res => {
          // 1. 동일한 날짜 접속 개수
          var test_one = new Array();
          var date_info_ex : string = "";
          var cnt : number = -1;
          for (var i=0; i < res.length; i++) {
            var date_info = res[i].access_time.split(" ")[0];
            if (date_info != date_info_ex) {
              date_info_ex = date_info;
              cnt ++;
            }
            if (test_one[cnt] == null) {
              test_one[cnt] = new Array(2);
              test_one[cnt][0] = date_info;
              test_one[cnt][1] = 1;
            } else {
              test_one[cnt][1] ++;
            }
          }
          // console.log(test_one);
          var sum_test_one = 0;
          for (var i=0; i < test_one.length; i++) {
            sum_test_one += test_one[i][1];
          }
          console.log("[중복미제거] 총 방문자 수 : ", sum_test_one);

          // 2. 동일한 날짜, 같은 ip 중복 제거 접속 개수
          var test_two = new Array();
          var ip_info = new Array<string>();
          var date_info_ex2 : string = "";
          var cnt2 : number = -1;
          var ip_cnt : number = 0;
          for (var i=0; i < res.length; i++) {
            var date_info = res[i].access_time.split(" ")[0];

            // 날짜 변경 확인
            if (date_info != date_info_ex2) {
              date_info_ex2 = date_info;
              cnt2 ++;
              ip_info = new Array<string>();
              ip_cnt = 0;
            }

            // 중복 ip 확인
            var check_ip_info : boolean = false;
            for (var j=0; j < ip_info.length; j++) {
              if (ip_info[j] == res[i].ip) {
                check_ip_info = true;
                break;
              }
            }
            if (check_ip_info) {
              continue;
            } else {
              ip_info[ip_cnt++] = res[i].ip;
            }

            // 인원수 count
            if (test_two[cnt2] == null) {
              test_two[cnt2] = new Array(2);
              test_two[cnt2][0] = date_info;
              test_two[cnt2][1] = 1;
            } else {
              test_two[cnt2][1] ++;
            }
          }
          // console.log(test_two);
          var sum_test_two = 0;
          for (var i=0; i < test_two.length; i++) {
            sum_test_two += test_two[i][1];
          }
          console.log("[중복제거] 총 방문자 수 : ", sum_test_two);
        });
  }
  // -------------------------------------------------------------------------
  // +++++++++++++++++++++ DataBase에 데이터를 쓰는 함수 +++++++++++++++++++++++
  addStudyTopMenu(topMenu_info) {
    this._dataService.addStudyTopMenu(topMenu_info).subscribe();
  }
  addStudySubMenu(subMenu_info) {
    this._dataService.addStudySubMenu(subMenu_info).subscribe();
  }
  addBoardContent(content_info) {
    this._dataService.addBoardContent(content_info).subscribe();
  }
  addAccessStudyLog(access_info) {
    this._dataService.addAccessStudyLog(access_info).subscribe();
  }
  // -------------------------------------------------------------------------
  // +++++++++++++++++++++ DataBase의 데이터를 바꾸는 함수 +++++++++++++++++++++++
  deleteStudyTopMenu(topMenu_info) {
    this._dataService.deleteStudyTopMenu(topMenu_info).subscribe();
  }
  deleteStudySubMenu(subMenu_info) {
    this._dataService.deleteStudySubMenu(subMenu_info).subscribe();
  }
  updateBoardContent(modified_content_info) {
    this._dataService.updateBoardContent(modified_content_info).subscribe();
  }
  updateBoardContentViewCount(obj) {
    this._dataService.updateBoardContentViewCount(obj).subscribe();
  }
  deleteBoardContent(content_info) {
    this._dataService.deleteBoardContent(content_info)
      .subscribe(res => {
        this.boardContentViewCancelBtn();
        console.log('[DB][succes] Delete boardContent');
      });
  }
  // ---------------------------------------------------------------------------


  // +++++++++++++++++++++++ 글쓰기 관련 함수 +++++++++++++++++++++++
  boardContentWriteBtn() {
    this.is_home = false; // 홈 화면이 아님을 알림
    this.is_modify = false; // 글 수정이 아님을 알림
    this.is_write = true; // 글쓰기 화면임을 알림
  }
  async boardContentWriteCancelBtn() {
    this.is_write = false; // 글쓰기 화면이 아님을 알림
    await this.getBoardContent(this.cur_super_id, this.cur_sub_order, this.cur_page);
  }
  async boardContentWrite() { // 글 작성
    if (this.board_content_menu_input == null) {
      alert("글을 작성할 게시판을 선택해 주세요.");
    } else if (this.board_content_title_input == "" || this.board_content_title_input == null) {
      alert("글의 제목을 작성해 주세요.");
    } else if (this.board_content_content_input == "" || this.board_content_content_input == null) {
      alert("글의 내용을 작성해 주세요.");
    } else {
      var max_index = await this.getBoardContentMaxIndex(this.board_content_menu_input.super, this.board_content_menu_input.order);
      var inputModel = {
          "super_id": this.board_content_menu_input.super,
          "sub_order": this.board_content_menu_input.order,
          "index": (Number(max_index)+1),
          "title": this.board_content_title_input,
          "contents": this.board_content_content_input,
          "author": sessionStorage.user_id,
          "nickname": sessionStorage.user_nickname,
          "date": this.getTimeStamp(),
          "views": 0,
          "isDeleted": false
      };

      this.addBoardContent(inputModel);
      this.subMenu(this.board_content_menu_input);
    }
  }
  boardContentModifyBtn() { // 글 수정
    if (this.board_content_menu_input == null) {
      alert("글을 작성할 게시판을 선택해 주세요.");
    } else if (this.board_content_title_input == "" || this.board_content_title_input == null) {
      alert("글의 제목을 작성해 주세요.");
    } else if (this.board_content_content_input == "" || this.board_content_content_input == null) {
      alert("글의 내용을 작성해 주세요.");
    } else {
      var inputModel = {
          "_id": this.board_content_view._id,
          "super_id": this.board_content_menu_input.super,
          "sub_order": this.board_content_menu_input.order,
          "title": this.board_content_title_input,
          "contents": this.board_content_content_input,
          "date": this.getTimeStamp(),
          "views": 0
      };
      console.log(inputModel);

      this.updateBoardContent(inputModel);
      this.subMenu(this.board_content_menu_input);
    }
  }
  // ---------------------------------------------------------------
  // +++++++++++++++++++++++ 글 읽기 관련 함수 +++++++++++++++++++++++
  async boardContentViewCancelBtn() {
    this.is_view = false;
    this.is_modify = false; // 글 수정이 아님을 알림
    await this.getBoardContent(this.cur_super_id, this.cur_sub_order, this.cur_page);
  }
  boardContentViewRewriteBtn() {
    this.is_view = false;
    this.is_home = false; // 홈 화면이 아님을 알림
    this.is_modify = false; // 글 수정이 아님을 알림
    this.is_write = true; // 글쓰기 화면임을 알림
    for (var i=0; i < this.nav_sub_menu.length; i++) {
      if (this.nav_sub_menu[i].super == this.board_content_view.super_id && this.nav_sub_menu[i].order == this.board_content_view.sub_order) {
        this.board_content_menu_input = this.nav_sub_menu[i];
        break;
      }
    }
    this.board_content_title_input = this.board_content_view.title;
    this.board_content_content_input = this.board_content_view.contents;
  }
  boardContentViewModifyBtn() {
    this.is_view = false;
    this.is_home = false; // 홈 화면이 아님을 알림
    this.is_modify = true; // 글 수정임을 알림
    this.is_write = true; // 글쓰기 화면임을 알림
    for (var i=0; i < this.nav_sub_menu.length; i++) {
      if (this.nav_sub_menu[i].super == this.board_content_view.super_id && this.nav_sub_menu[i].order == this.board_content_view.sub_order) {
        this.board_content_menu_input = this.nav_sub_menu[i];
        break;
      }
    }
    this.board_content_title_input = this.board_content_view.title;
    this.board_content_content_input = this.board_content_view.contents;
  }
  boardContentViewDeleteBtn() {
    this.deleteBoardContent(this.board_content_view);
  }
  boardContentView(obj) {
    this.is_home = false; // 홈 화면이 아님을 알림
    this.is_view = true;
    this.is_modify = false; // 글 수정이 아님을 알림
    this.is_write = false; // 글쓰기 화면이 아님을 알림
    this.board_content_view = obj;
    console.log("글 내용 객체 : ", obj);
    this.updateBoardContentViewCount(obj);
  }
  // ----------------------------------------------------------------
  // +++++++++++++++++++++ List(Menu) 관련 함수 +++++++++++++++++++++
  listMenu() {
    this.list_button = !this.list_button;
  }
  // 주 메뉴 클릭 이벤트
  async topMenu(obj, index) {
    this.nav_top_menu[index].menu_top_btn = !this.nav_top_menu[index].menu_top_btn; // top메뉴 여닫기 관리
    /*
    if (this.nav_top_menu[index].menu_top_btn) {
      this.is_home = false; // 홈 화면이 아님을 알림
      this.is_view = false;
      this.is_write = false; // 글쓰기 화면이 아님을 알림
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
    */
  }
  // 서브 메뉴 클릭 이벤트
  async subMenu(obj) {
    this.is_home = false; // 홈 화면이 아님을 알림
    this.is_view = false;
    this.is_write = false; // 글쓰기 화면이 아님을 알림
    this.is_modify = false; // 글 수정이 아님을 알림
    this.cur_page = 1; // 페이지 번호를 1로 초기화
    this.board_content_menu_input = obj;
    this.cur_sub_menu = obj.title;
    this.cur_super_id = obj.super;
    this.cur_sub_order = obj.order;
    this.board_content = new Array();
    await this.getBoardContent(obj.super, obj.order, this.cur_page);

    for (var i = 0; i < this.nav_top_menu.length; i++) {
      if (this.nav_top_menu[i].id == obj.super) {
        this.cur_top_menu = this.nav_top_menu[i].title;
        break;
      }
    }

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
    console.log("게시판 내용 : ", this.board_content);

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
  getNavSubMenu(menu_top_id) {
    var nav_sub_menu = new Array();
    var cnt = 0;
    for (var i = 0; i < this.nav_sub_menu.length; i++) {
      if (this.nav_sub_menu[i].super == menu_top_id) {
        nav_sub_menu[cnt++] = this.nav_sub_menu[i];
      }
    }
    return nav_sub_menu;
  }
  // 주 메뉴 추가
  topMenuAdd() {
    if (this.nav_top_menu_title_input != null && this.nav_top_menu_title_input != '') {

        var menuOrder = 0;
        for (var i=0; i < this.nav_top_menu.length; i++) {
          if (this.nav_top_menu[i].order > menuOrder) {
            menuOrder = this.nav_top_menu[i].order;
          }
        }
        menuOrder += 1;

        var inputModel = {
            "id" : String(menuOrder),
            "title" : this.nav_top_menu_title_input,
            "order" : menuOrder,
            "isDeleted" : false
        };

        this.addStudyTopMenu(inputModel);
        this.getStudyTopMenu(); // top 메뉴를 재호출
        (<HTMLInputElement>document.getElementById('nav_top_menu_add')).value = "";
    } else {
        console.log("주 메뉴의 제목이 입력되지 않았습니다.");
    }
  }
  // 주 메뉴 삭제
  topMenuDelete(obj) {
    if (this.cur_super_id == obj.id) {
      this.is_home = true; // 홈 화면이 나오도록 함
      this.is_view = false;
      this.is_write = false; // 글쓰기 화면이 아님을 알림
    }
    this.deleteStudyTopMenu(obj);
    this.getStudyTopMenu(); // top 메뉴를 재호출
  }
  // 서브 메뉴 추가
  subMenuAdd(obj, index) {
    var sub_menu_id = 'nav_sub_menu_add_' + String(index);
    var title = (<HTMLInputElement>document.getElementById(sub_menu_id)).value;
    if (title != null && title != '') {

        var menuOrder = 0;
        for (var i=0; i < this.nav_sub_menu.length; i++) {
          if (this.nav_sub_menu[i].super == obj.id && this.nav_sub_menu[i].order > menuOrder) {
            menuOrder = this.nav_sub_menu[i].order;
          }
        }
        menuOrder += 1;

        var inputModel = {
            "super" : obj.id,
            "title" : title,
            "order" : menuOrder,
            "isDeleted" : false
        };

        this.addStudySubMenu(inputModel);
        this.getStudySubMenu(); // sub 메뉴를 재호출
        (<HTMLInputElement>document.getElementById(sub_menu_id)).value = "";
    } else {
        console.log("서브 메뉴의 제목이 입력되지 않았습니다.");
    }
  }
  // 서브 메뉴 삭제
  subMenuDelete(obj) {
    if (this.cur_super_id == obj.super && this.cur_sub_order == obj.order) {
      this.is_home = true; // 홈 화면이 나오도록 함
      this.is_view = false;
      this.is_write = false; // 글쓰기 화면이 아님을 알림
    }
    this.deleteStudySubMenu(obj);
    this.getStudySubMenu(); // sub 메뉴를 재호출
  }
  searchContent(input) {
    if (input == null || input == "") {
    // input값이 입력될 경우에만 검색 실행할 것인지?
    // 입력 값 없으면 메시지 처리? 아니면 무반응?
    } else {
      console.log("[System] 검색단어 : ", input);
    // take powerful serach function !!

    // [요건] input 파라미터를 단순한 단어가 아닌, &, "", -, +와같은 문자열의 조합으로 받아 검색 기능을 갈=ㅇ화
    //        마치 구글, 네이버 검색창 처럼

    // 1. input 값을 이용해서 db에 데이터를 요청하는 로직
    //    1.1 단순 단어가 입력된 경우
    //    this.getBoardContent(super_id, sub_order, page)를 발전시켜서
    //    this.getBoardContent(super_id, sub_order, page, input)과 같이 검색단어를 이용해서 데이터를 요청
    //    ???? mongodb 검색기능이 있는지 확인 필요!
    //         검색은 가능하나 한글에 대해 full-text 검색은 지원 안하는듯?
    //    ???? 페이징해서 데이터를 받아 올 것인지, 받아온 데이터를 가지고 페이징 처리 할 것인지
    //    ???? ???? mongodb에서 검색결과를 페이징해서 가져오는 방법을 최대한 강구!

    //    1.2 복합 단어가 입력된 경우

    // 2. db에서 받아온 데이터를 화면에서 볼 수 있도록 조합
    //    this.board_content 에 받은 데이터를 mapping
    }

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

  // ++++++++++++++++++++++++++ 공통 함수 ++++++++++++++++++++++++++
  // 현재시간 구하는 함수
  getTimeStamp() {
    var d = new Date();
    var s =
        this.leadingZeros(d.getFullYear(), 4) + '-' +
        this.leadingZeros(d.getMonth() + 1, 2) + '-' +
        this.leadingZeros(d.getDate(), 2) + ' ' +

        this.leadingZeros(d.getHours(), 2) + ':' +
        this.leadingZeros(d.getMinutes(), 2) + ':' +
        this.leadingZeros(d.getSeconds(), 2); // 초단위는 제외하였음
    return s;
  }
  leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
  }
  // --------------------------------------------------------------

  ngOnInit() {
    this.getAccessStudyLog();
    this._get_ip.getIpAddress().subscribe(data => {
      var access_info = {
        "access_time": this.getTimeStamp(),
        "access_type": "study",
        "ip": data.ip,
        "country_code": data.country_code,
        "country_name": data.country_name,
        "city": data.city,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "metro_code": data.metro_code,
        "region_code": data.region_code,
        "region_name": data.region_name,
        "time_zone": data.time_zone,
        "zip_code": data.zip_code,
        "user_id": "",
        "user_nickname": ""
      }
      if (sessionStorage.is_login) {
        access_info.user_id = sessionStorage.user_id;
        access_info.user_nickname = sessionStorage.user_nickname;
      }
      console.log("[Study] 접속자 정보 : ", access_info);
      this.addAccessStudyLog(access_info);
    });
  }
}
