import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignPageMainComponent } from './design-page-main.component';

describe('DesignPageMainComponent', () => {
  let component: DesignPageMainComponent;
  let fixture: ComponentFixture<DesignPageMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignPageMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
