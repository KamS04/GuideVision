import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyPresenterComponent } from './lazy-presenter.component';

describe('InfiniteScrollerComponent', () => {
  let component: LazyPresenterComponent;
  let fixture: ComponentFixture<LazyPresenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LazyPresenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyPresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
