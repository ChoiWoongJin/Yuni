import { Component, OnInit } from '@angular/core';

// Angular Router Module import
import { Router } from "@angular/router";

@Component({
  selector: 'app-intro-page-main',
  templateUrl: './intro-page-main.component.html',
  styleUrls: ['./intro-page-main.component.css']
})
export class IntroPageMainComponent implements OnInit {
  study = 'study';
  design = 'design';

  constructor(private _router: Router) { }

  ngOnInit() {
  }
  routing(path){
   this._router.navigate([{ outlets: { intro: [path]}}]); // path에 해당하는 컴포넌트를 이름이 intro인 router-outlet에 뿌린다
}
}
