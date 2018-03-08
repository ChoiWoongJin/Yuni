import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

// Import the DataService
import { DataService } from './data.service';

interface GBComment {
  _id: string;
  nickname: string;
  comment: string;
  date: string;
  order: number;
  canDelete: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  lg_button: boolean;
  ca_button: boolean;
  gb_button: boolean;

  is_login: string;
  user_id: string;
  user_nickname: string;
  user_email: string;

  // ++++++++++++ 회원가입 Argument +++++++++++++
  ca_id: string;
  ca = {
    id: '',
    id_check: "nocheck",
    pwd: '',
    pwdCheck: '',
    nickname: '',
    nickname_check: "nocheck",
    email: '',
    email_check: "nochkeck"
  }
  // -------------------------------------------

  // ++++++++++++ 방명록 Argument +++++++++++++
  gbComments: GBComment[];
  gb_input: string;
  // -------------------------------------------

  // ++++++++++++  Define properties to hold our user data From Database ++++++++++++
  nav_menu: Array<any>;
  userInfo: Array<any>;
  // -------------------------------------------------------------------------------


  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {
    // Access the Data Service's getNav_menu() method we defined
    // this._dataService.getNav_menu()
    //     .subscribe(res => this.nav_menu = res[0].sub);

    this.getGuestBook();

    // 처음 시작시 로그인 메뉴 비활성화
    // 로그인 버튼
    this.lg_button = false;
    // 회원가입 버튼
    this.ca_button = false;
    // 방명록 버튼
    this.gb_button = false;
    // 유저 정보 초기화
    this.is_login = "false";
    this.user_id = '';
    this.user_nickname = '';
    this.user_email = '';

    // ++++++++++++ 회원가입 Argument +++++++++++++
    this.ca_id = '';
    // -------------------------------------------

    // session 유지되고 있을 때의 상태에 대한 처리
    if (sessionStorage.is_login == "true" || sessionStorage.is_login == "master") {
        console.log('[system] 로그인이 유지되고 있습니다');
        this.is_login = sessionStorage.is_login;
        this.user_id = sessionStorage.user_id;
        this.user_nickname = sessionStorage.user_nickname;
        this.user_email = sessionStorage.user_email;
    }
  }

  // +++++++++++++++++++++ DataBase에서 데이터를 읽는 함수 +++++++++++++++++++++
  getUserInfo() {
    return new Promise((resolve, reject) => {
      this._dataService.getUserInfo()
        .subscribe(res => {
          this.userInfo = res;
          console.log('[DB][succes] Get userInfo');
          resolve();
        });
      });
  }
  getContentBoard() {
    this._dataService.getContentBoard()
        .subscribe(res => this.nav_menu = res);
    console.log(this.nav_menu);
  }
  getGuestBook() {
    this._dataService.getGuestBook()
        .subscribe(res => {
          this.gbComments = new Array();
          var cntItem = 0;
          for (var num=0; num < res.length; num++) {
            if (res[num].nickname == sessionStorage.user_nickname) {
              res[num].canDelete = true;
            } else {
              res[num].canDelete = false;
            }
            this.gbComments[cntItem++] = res[num];
          }
        });
  }
  // -------------------------------------------------------------------------
  // +++++++++++++++++++++ DataBase에 데이터를 쓰는 함수 +++++++++++++++++++++++
  addUserInfo() {
    this._dataService.addUserInfo(this.ca)
        .subscribe();
  }
  addGuestBook(addData) {
    this._dataService.addGuestBook(addData)
        .subscribe();
  }
  // -------------------------------------------------------------------------
  // +++++++++++++++++++++ DataBase의 데이터를 바꾸는 함수 +++++++++++++++++++++++
  deleteGuestBook(index) {
    this._dataService.deleteGuestBook(this.gbComments[index])
        .subscribe();
  }
  // ---------------------------------------------------------------------------

  // +++++++++++++++++++++ Login/out 관련 함수 +++++++++++++++++++++
  lgMenu() {
    this.lg_button = !this.lg_button;
    this.inputValueClear();
    if (this.ca_button) {
        this.ca_button = !this.ca_button;
    }
    if (this.gb_button) {
        this.gb_button = !this.gb_button;
    }
  }
  async login(lg_input_id: string, lg_input_pwd: string) {
    if (lg_input_id == "") {
      alert("ID를 입력해주세요.");
    } else if (lg_input_pwd == "") {
      alert("Password를 입력해주세요.");
    } else {
      // DB에 필요한 데이터는 최초 1번만 읽어들이고 이후 변경이 있을 때에만 DB관련 변수의 값을 변경한다
      if (this.userInfo == null) {
        await this.getUserInfo();
      }

      for (var infoNum = 0; infoNum < this.userInfo.length; infoNum++) {
          if (lg_input_id == this.userInfo[infoNum].id) {
            if (lg_input_pwd == this.userInfo[infoNum].pwd) {
              // 세션이 유지되는 동안 user의 타입(*권한)을 설정
              sessionStorage.setItem("user_id", this.userInfo[infoNum].id);
              sessionStorage.setItem("user_nickname", this.userInfo[infoNum].nickname);
              sessionStorage.setItem("user_email", this.userInfo[infoNum].email);
              sessionStorage.setItem("is_login", "true");
              if (this.userInfo[infoNum].type == "master") {
                sessionStorage.is_login = "master";
              }
              break;
            }
          }
      }
      if (sessionStorage.is_login == "true" || sessionStorage.is_login == "master") {
        this.user_id = sessionStorage.user_id;
        this.user_nickname = sessionStorage.user_nickname;
        this.is_login = sessionStorage.is_login;
        this.lg_button = false;
        console.log('[success] Login');
        alert(this.user_id + "님, 접속을 환영합니다!");
        this.loginInputClear();
        this.getGuestBook(); // 방명록 초기화
      } else {
        this.is_login = "";
        this.user_id = "";
        sessionStorage.clear();
        alert("로그인에 실패하였습니다.");
        console.log('[error] Login Fail');
      }
    }
  }
  loginInputClear() {
      (<HTMLInputElement>document.getElementById('lg_input_id')).value = "";
      (<HTMLInputElement>document.getElementById('lg_input_pwd')).value = "";
  }
  logout() {
    this.is_login = "false";
    this.user_id = "";
    this.user_nickname = "";
    this.user_email = "";
    if (this.gb_button) {
        this.gb_button = !this.gb_button;
    }
    sessionStorage.clear();
    this.getGuestBook(); // 방명록 초기화
  }
  // --------------------------------------------------------------

  // +++++++++++++++++++++ 방명록 관련 함수 +++++++++++++++++++++++
  gbMenu() {
    this.gb_button = !this.gb_button;
    this.inputValueClear();
    if (this.lg_button) {
        this.lg_button = !this.lg_button;
    }
    if (this.ca_button) {
        this.ca_button = !this.ca_button;
    }
  }
  gbDelete(index) {
    this.deleteGuestBook(index);
    this.getGuestBook();
  }
  gbInput(value) {
    var nextOrder = 0;
    for (var i=0; i < this.gbComments.length; i++) {
      if (this.gbComments[i].order > nextOrder) {
        nextOrder = this.gbComments[i].order;
      }
    }
    nextOrder++;
    var addData = {
      id: sessionStorage.user_id,
      nickname: sessionStorage.user_nickname,
      comment: value,
      date: this.getTimeStamp(),
      order: nextOrder,
      isDeleted: false
    }
    this.addGuestBook(addData);
    this.getGuestBook();
    this.gb_input = '';
  }
  // -------------------------------------------------------------

  // +++++++++++++++++++++ 회원가입 관련 함수 +++++++++++++++++++++
  caMenu() {
    this.ca_button = !this.ca_button;
    this.inputValueClear();
    if (this.lg_button) {
        this.lg_button = !this.lg_button;
    }
    if (this.gb_button) {
        this.gb_button = !this.gb_button;
    }
  }
  createAccount(pwdValid) {
    if (this.ca.id_check != 'true') {
      alert("아이디 중복검사를 해주세요.");
    } else if (this.ca.nickname_check != 'true') {
      alert("닉네임 중복검사를 해주세요.");
    } else if (this.ca.email_check != 'true') {
      alert("이메일 중복검사를 해주세요.");
    } else if (!pwdValid) {
      alert("비밀번호를 다시 확인 해주세요.");
    } else {
      this.addUserInfo();
      alert(this.ca.id+"("+this.ca.nickname+") 님!\n가입을 환영합니다.");
      this.initCa();
      this.ca_button = false;
    }
  }
  // 회원가입 Input값 체크
  async inputCheck(inputType, inputValue, checkValue) {
    // DB에 필요한 데이터는 최초 1번만 읽어들이고 이후 변경이 있을 때에만 DB관련 변수의 값을 변경한다
    console.log(this.ca[inputValue]);
    console.log(this.ca[checkValue]);
    this.ca[checkValue] = "nocheck";
    if (this.userInfo == null) {
      await this.getUserInfo();
    }
    for (var infoNum = 0; infoNum < this.userInfo.length; infoNum++) {
      if (this.ca[inputValue] == this.userInfo[infoNum][inputType]) {
        this.ca[checkValue] = "false"; // 동일한 아이디가 존재하는 경우
        console.log("[error] Exist ID");
      }
    }

    if (this.ca[checkValue] != "false") {
      this.ca[checkValue] = "true"; // 동일한 아이디가 존재하지 않는 경우
      console.log("[succes] This ID can use");
    }
  }
  // 회원가입 input값 변경 시 check 상태 초기화
  initInputCheck(checkValue) {
    console.log("[system] 입력값이 변경되었습니다.")
    this.ca[checkValue] = "nocheck";
  }
  // --------------------------------------------------------------

  // ++++++++++++++++++++++++++ 공통 함수 ++++++++++++++++++++++++++
  // 현재시간 구하는 함수
  getTimeStamp() {
    var d = new Date();
    var s =
        this.leadingZeros(d.getFullYear(), 4) + '-' +
        this.leadingZeros(d.getMonth() + 1, 2) + '-' +
        this.leadingZeros(d.getDate(), 2) + ' ' +

        this.leadingZeros(d.getHours(), 2) + ':' +
        this.leadingZeros(d.getMinutes(), 2);/* + ':' +
        leadingZeros(d.getSeconds(), 2)*/ // 초단위는 제외하였음
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
  inputValueClear() {
    this.gb_input = '';
    this.initCa();
  }
  initCa() {
    this.ca = {
      id: '',
      id_check: "nocheck",
      pwd: '',
      pwdCheck: '',
      nickname: '',
      nickname_check: "nocheck",
      email: '',
      email_check: "nochkeck"
    }
  }
  // --------------------------------------------------------------
}
