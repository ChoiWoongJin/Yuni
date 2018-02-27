import { Component } from '@angular/core';

// Import the DataService
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Define a nav_menu property to hold our user data
  nav_menu: Array<any>;

  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {
    // Access the Data Service's getNav_menu() method we defined
    // this._dataService.getNav_menu()
    //     .subscribe(res => this.nav_menu = res[0].sub);
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
}
