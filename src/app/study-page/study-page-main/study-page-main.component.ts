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
  addAccessTotalLog(access_info) {
    this._dataService.addAccessTotalLog(access_info).subscribe();
  }
  // -------------------------------------------------------------------------
  // +++++++++++++++++++++ DataBase의 데이터를 바꾸는 함수 +++++++++++++++++++++++
  deleteStudyTopMenu(topMenu_info) {
    this._dataService.deleteStudyTopMenu(topMenu_info).subscribe();
  }
  deleteStudySubMenu(subMenu_info) {
    this._dataService.deleteStudySubMenu(subMenu_info).subscribe();
  }
  updateBoardContentViewCount(_id) {
    this._dataService.updateBoardContentViewCount(_id).subscribe();
  }
  // ---------------------------------------------------------------------------


  // +++++++++++++++++++++++ 글쓰기 관련 함수 +++++++++++++++++++++++
  boardContentWriteBtn() {
    this.is_home = false; // 홈 화면이 아님을 알림
    this.is_write = true; // 글쓰기 화면임을 알림
  }
  async boardContentWriteCancelBtn() {
    this.is_write = false; // 글쓰기 화면이 아님을 알림
    await this.getBoardContent(this.cur_super_id, this.cur_sub_order, this.cur_page);
  }
  async boardContentWrite() {
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
  // ---------------------------------------------------------------
  // +++++++++++++++++++++++ 글 읽기 관련 함수 +++++++++++++++++++++++
  async boardContentViewCancelBtn() {
    this.is_view = false;
    await this.getBoardContent(this.cur_super_id, this.cur_sub_order, this.cur_page);
  }
  boardContentView(obj) {
    this.is_home = false; // 홈 화면이 아님을 알림
    this.is_view = true;
    this.is_write = false; // 글쓰기 화면이 아님을 알림
    this.board_content_view = obj;
    this.updateBoardContentViewCount(obj._id);
  }
  // ----------------------------------------------------------------
  // +++++++++++++++++++++ List(Menu) 관련 함수 +++++++++++++++++++++
  listMenu() {
    this.list_button = !this.list_button;
  }
  // 주 메뉴 클릭 이벤트
  async topMenu(obj, index) {
    this.nav_top_menu[index].menu_top_btn = !this.nav_top_menu[index].menu_top_btn; // top메뉴 여닫기 관리
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
  }
  // 서브 메뉴 클릭 이벤트
  async subMenu(obj) {
    this.is_home = false; // 홈 화면이 아님을 알림
    this.is_view = false;
    this.is_write = false; // 글쓰기 화면이 아님을 알림
    this.cur_page = 1; // 페이지 번호를 1로 초기화
    this.board_content_menu_input = obj;
    this.cur_sub_menu = obj.title;
    this.cur_super_id = obj.super;
    this.cur_sub_order = obj.order;
    this.board_content = new Array();
    await this.getBoardContent(obj.super, obj.order, this.cur_page);

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
    this._get_ip.getIpAddress().subscribe(data => {
      var access_info = {
        "access_time": this.getTimeStamp(),
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
        "zip_code": data.zip_code
      }
      console.log("접속자 정보 : ", access_info);
      this.addAccessTotalLog(access_info);
    });
  }
}
