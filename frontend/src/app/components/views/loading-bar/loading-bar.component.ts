import { Component, Input } from '@angular/core';

const template = `<div *ngIf="isLoading" class="d-block my-1 bg-success p-3">
    <div class="spinner-border align-middle text-primary" role="status"></div>
    <span class="ml-3 align-middle">Loading...</span>
</div>`

@Component({
  selector: 'app-loading-bar',
  template,
})
export class LoadingBarComponent {
  @Input() isLoading: boolean = false;

  constructor() { }

}
