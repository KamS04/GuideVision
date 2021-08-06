import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCardViewComponent } from './course-card-view.component';

describe('CourseCardViewComponent', () => {
  let component: CourseCardViewComponent;
  let fixture: ComponentFixture<CourseCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseCardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
