import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayErrorRouteComponent } from './display-error-route.component';

describe('DisplayErrorRouteComponent', () => {
  let component: DisplayErrorRouteComponent;
  let fixture: ComponentFixture<DisplayErrorRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayErrorRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayErrorRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
