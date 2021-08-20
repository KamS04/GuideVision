import { Component, Input } from '@angular/core';
import { Pathway } from 'src/app/models/pathway';

@Component({
  selector: 'app-pathway-card-view',
  templateUrl: './pathway-card-view.component.html',
})
export class PathwayCardViewComponent {
  @Input() pathway: Pathway;

  constructor() { }
}
