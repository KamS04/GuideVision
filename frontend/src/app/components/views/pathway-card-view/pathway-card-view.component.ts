import { Component, Input } from '@angular/core';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-pathway-card-view',
  templateUrl: './pathway-card-view.component.html',
})
export class PathwayCardViewComponent {
  @Input() category: Category;

  constructor() { }
}
