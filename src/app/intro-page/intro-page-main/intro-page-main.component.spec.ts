import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroPageMainComponent } from './intro-page-main.component';

describe('IntroPageMainComponent', () => {
  let component: IntroPageMainComponent;
  let fixture: ComponentFixture<IntroPageMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroPageMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
