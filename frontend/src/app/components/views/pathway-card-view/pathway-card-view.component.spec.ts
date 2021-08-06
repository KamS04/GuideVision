import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayCardViewComponent } from './pathway-card-view.component';

describe('PathwayCardViewComponent', () => {
  let component: PathwayCardViewComponent;
  let fixture: ComponentFixture<PathwayCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathwayCardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
