import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFourOFourComponent } from './display-four-o-four.component';

describe('DisplayFourOFourComponent', () => {
  let component: DisplayFourOFourComponent;
  let fixture: ComponentFixture<DisplayFourOFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayFourOFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayFourOFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
