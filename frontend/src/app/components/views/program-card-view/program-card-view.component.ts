import { Component, Input } from '@angular/core';
import { MiniProgram } from 'src/app/models/program';

@Component({
  selector: 'app-program-card-view',
  templateUrl: './program-card-view.component.html',
})
export class ProgramCardViewComponent {
  @Input() program: MiniProgram;

  constructor() { }
}
