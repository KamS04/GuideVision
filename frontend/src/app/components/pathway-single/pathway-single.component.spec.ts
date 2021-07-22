import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwaySingleComponent } from './pathway-single.component';

describe('PathwaySingleComponent', () => {
  let component: PathwaySingleComponent;
  let fixture: ComponentFixture<PathwaySingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathwaySingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwaySingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
