import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramCardViewComponent } from './program-card-view.component';

describe('ProgramCardViewComponent', () => {
  let component: ProgramCardViewComponent;
  let fixture: ComponentFixture<ProgramCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramCardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
