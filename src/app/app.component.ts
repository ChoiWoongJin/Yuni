import { Component } from '@angular/core';

// Import the DataService
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  lg_button: boolean;
  ca_button: boolean;
  gb_button: boolean;
  ca_id_check: string;
  ca_nickname_check: string;
  ca_email_check: string;
  is_login: string;
  user_id: string;
  user_nickname: string;
  user_email: string;

  // ++++++++++++ 회원가입 Argument +++++++++++++
  ca_id: string;
  // -------------------------------------------


  // Define properties to hold our user data From Database
  nav_menu: Array<any>;
  userInfo: Array<any>;


  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {
    // Access the Data Service's getNav_menu() method we defined
    // this._dataService.getNav_menu()
    //     .subscribe(res => this.nav_menu = res[0].sub);

    // 처음 시작시 로그인 메뉴 비활성화
    // 로그인 버튼
    this.lg_button = false;
    // 회원가입 버튼
    this.ca_button = false;
    // 방명록 버튼
    this.gb_button = false;
    // 아이디 중복검사
    this.ca_id_check = "nocheck";
    // 닉네임 중복검사
    this.ca_nickname_check = "nocheck";
    // 이메일 중복검사
    this.ca_email_check = "nocheck";
    // 유저 정보 초기화
    this.is_login = "false";
    this.user_id = '';
    this.user_nickname = '';
    this.user_email = '';

    // ++++++++++++ 회원가입 Argument +++++++++++++
    this.ca_id = 'true  ';
    // -------------------------------------------

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
  getContent_board() {
    this._dataService.getContent_board()
        .subscribe(res => this.nav_menu = res);
    console.log(this.nav_menu);
  }

  getNav_menuSub() {
    this._dataService.getNav_menu()
        .subscribe(res => this.nav_menu = res[0].sub);
    console.log(this.nav_menu);
  }
  getNav_menuTop() {
    this._dataService.getNav_menu()
        .subscribe(res => this.nav_menu = res[0].top);
    console.log(this.nav_menu);
  }
  // -------------------------------------------------------------------------

  // +++++++++++++++++++++ Login/out 관련 함수 +++++++++++++++++++++
  lg_menu() {
    this.lg_button = !this.lg_button;
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
              sessionStorage.setItem("user_type", this.userInfo[infoNum].type);
              sessionStorage.setItem("user_email", this.userInfo[infoNum].email);
              sessionStorage.setItem("is_login", "true");
              break;
            }
          }
      }
      if (sessionStorage.is_login == "true") {
        this.user_id = sessionStorage.user_id;
        this.user_nickname = sessionStorage.user_nickname;
        this.is_login = "true";
        if (sessionStorage.user_type == "master") {
            this.is_login = "master";
        }
        this.lg_button = false;
        console.log('[success] Login');
        alert(this.user_id + "님, 접속을 환영합니다!");
        this.login_submit_clear();
      } else {
        this.is_login = "";
        this.user_id = "";
        sessionStorage.clear();
        alert("로그인에 실패하였습니다.");
        console.log('[error] Login Fail');
      }
    }
  }
  login_submit_clear() {
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
  }
  // --------------------------------------------------------------

  // +++++++++++++++++++++ 회원가입 관련 함수 +++++++++++++++++++++
  ca_menu() {
    this.ca_button = !this.ca_button;
    if (this.lg_button) {
        this.lg_button = !this.lg_button;
    }
    if (this.gb_button) {
        this.gb_button = !this.gb_button;
    }
  }
  // --------------------------------------------------------------
}
