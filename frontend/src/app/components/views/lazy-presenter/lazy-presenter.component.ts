import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lazy-presenter',
  template: `<ng-content></ng-content><div #anchor></div>`,
})
export class LazyPresenterComponent implements OnDestroy, AfterViewInit {
  @Input() options = {};
  @Output() scrolled = new EventEmitter();

  @ViewChild('anchor') anchor!: ElementRef;

  private observer!: IntersectionObserver;

  constructor(private host: ElementRef) { }

  ngAfterViewInit(): void {
    const options = {
      root: this.isHostScrollable() ? this.host.nativeElement : null,
      ...this.options
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.scrolled.emit();
      }
    }, options);

    this.observer.observe(this.anchor.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  get element() {
    return this.host.nativeElement;
  }

  private isHostScrollable(): boolean {
    const style = window.getComputedStyle(this.element);

    return style.getPropertyValue('overflow') === 'auto' ||
      style.getPropertyValue('overflow-y') === 'scroll';
  }

}
