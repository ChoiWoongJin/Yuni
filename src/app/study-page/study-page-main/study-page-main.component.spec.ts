import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyPageMainComponent } from './study-page-main.component';

describe('StudyPageMainComponent', () => {
  let component: StudyPageMainComponent;
  let fixture: ComponentFixture<StudyPageMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyPageMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
