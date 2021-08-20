import { Component } from '@angular/core';

@Component({
  selector: 'app-display-error-route',
  template: "<app-display-four-o-four [showError]='true'></app-display-four-o-four>",
})
export class DisplayErrorRouteComponent {
  constructor() { }
}
