import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityCardViewComponent } from './university-card-view.component';

describe('UniversityCardViewComponent', () => {
  let component: UniversityCardViewComponent;
  let fixture: ComponentFixture<UniversityCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversityCardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversityCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
