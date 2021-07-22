import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdCarouselPauseComponent } from './ngbd-carousel-pause.component';

describe('NgbdCarouselPauseComponent', () => {
  let component: NgbdCarouselPauseComponent;
  let fixture: ComponentFixture<NgbdCarouselPauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgbdCarouselPauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdCarouselPauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
