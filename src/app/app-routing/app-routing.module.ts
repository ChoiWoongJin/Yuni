import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Router Module import
import { Routes, RouterModule } from "@angular/router";

// Routing 처리를 할 각각의 Component import
import { IntroPageMainComponent } from "../intro-page/intro-page-main/intro-page-main.component";
import { StudyPageMainComponent } from "../study-page/study-page-main/study-page-main.component";
import { DesignPageMainComponent } from "../design-page/design-page-main/design-page-main.component";


// Router 생성( path 표시할 때 Root path에 대한 '/'는 제외 )
const routers: Routes = [
  { path : '', outlet : 'intro', component : IntroPageMainComponent },
  { path : 'study', outlet : 'intro', component : StudyPageMainComponent},
  { path : 'design', outlet : 'intro', component : DesignPageMainComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routers)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
