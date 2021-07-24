import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitySingleComponent } from './university-single.component';

describe('UniversitySingleComponent', () => {
  let component: UniversitySingleComponent;
  let fixture: ComponentFixture<UniversitySingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversitySingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversitySingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
