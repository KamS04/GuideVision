import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallSearchComponent } from './overall-search.component';

describe('OverallSearchComponent', () => {
  let component: OverallSearchComponent;
  let fixture: ComponentFixture<OverallSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
