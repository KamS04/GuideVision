import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-four-o-four',
  templateUrl: './display-four-o-four.component.html',
  styleUrls: ['./display-four-o-four.component.css']
})
export class DisplayFourOFourComponent {
  @Input() showError: boolean = false;
  @Input() message: string = 'Page Not Found';
  @Input() statusCode: number = 404;
}
