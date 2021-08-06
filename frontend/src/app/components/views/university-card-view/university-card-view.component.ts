import { Component, Input, OnInit } from '@angular/core';
import { University } from 'src/app/models/university';

@Component({
  selector: 'app-university-card-view',
  templateUrl: './university-card-view.component.html',
})
export class UniversityCardViewComponent {
  @Input() university: University;

  constructor() { }
}
