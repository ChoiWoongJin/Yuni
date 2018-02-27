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
// Routing Module import
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { IntroPageMainComponent } from './intro-page/intro-page-main/intro-page-main.component';
import { StudyPageMainComponent } from './study-page/study-page-main/study-page-main.component';
import { DesignPageMainComponent } from './design-page/design-page-main/design-page;
import { PortfolioPageMainComponent } from './portfolio-page/portfolio-page-main/portfolio-page-main.component'-main.component';
// Feature Module import

@NgModule({
  declarations: [
    AppComponent,
    IntroPageMainComponent,
    StudyPageMainComponent,
    DesignP,
    PortfolioPageMainComponentageMainComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,              // <-Add HttpModule
    BrowserAnimationsModule,
    MatTableModule,
    AppRoutingModule
  ],
  providers: [DataService], // <-Add DataService
  bootstrap: [AppComponent]
})
export class AppModule { }
