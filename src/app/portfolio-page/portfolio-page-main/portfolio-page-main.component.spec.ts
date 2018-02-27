import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioPageMainComponent } from './portfolio-page-main.component';

describe('PortfolioPageMainComponent', () => {
  let component: PortfolioPageMainComponent;
  let fixture: ComponentFixture<PortfolioPageMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioPageMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
