import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Import the Http Module and our Data Service
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';

// BrowserAnimationsModule import 구문 추가
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// MatTableModule import 구문 추가
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms'; // html 파일에서 ngModel을 사용하기 위해 사용
import { CommonModule } from '@angular/common'; // ngSwitch를 사용하기 위한 것
// 한글의 양방향 바인딩을 매끄럽게 하기 위해 COMPOSITION_BUFFER_MODE를 변경
// COMPOSITION_BUFFER_MODE import
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
// Routing Module import
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { IntroPageMainComponent } from './intro-page/intro-page-main/intro-page-main.component';
import { StudyPageMainComponent } from './study-page/study-page-main/study-page-main.component';
import { DesignPageMainComponent } from './design-page/design-page-main/design-page-main.component';
import { PortfolioPageMainComponent } from './portfolio-page/portfolio-page-main/portfolio-page-main.component';
// Feature Module import
import { FileSelectDirective } from 'ng2-file-upload';

// using jQuery
import * as $ from 'jquery';

@NgModule({
  declarations: [
    AppComponent,
    IntroPageMainComponent,
    StudyPageMainComponent,
    DesignPageMainComponent,
    PortfolioPageMainComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,              // <-Add HttpModule
    BrowserAnimationsModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [
    DataService, // <-Add DataService
    {
      provide: COMPOSITION_BUFFER_MODE,
      useValue: false
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
